import { TrendsService } from '@/lib/services/trends.service'
import { StakingHistory, Validator } from '@/types/schema'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { storage } from './storage'
// Cache refresh intervals (in ms)
// const VALIDATOR_REFRESH_INTERVAL = 15 * 60 * 1000 // 15 minutes
const VALIDATOR_REFRESH_INTERVAL = 1 * 60 * 1000 // 15 minutes
const HISTORY_REFRESH_INTERVAL = 60 * 60 * 1000 // 1 hour
const NETWORK_INFO_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

// In-memory cache for API responses
const apiCache = {
  networkInfo: null as any,
  validators: null as any,
  stakingHistory: null as any,
  lastUpdated: {
    networkInfo: 0,
    validators: 0,
    stakingHistory: 0,
  },
}

// Connection to Solana mainnet
const connection = new Connection(clusterApiUrl('mainnet-beta'), {
  commitment: 'confirmed',
  // Add request throttling to avoid rate limits
  httpHeaders: {
    'Content-Type': 'application/json',
  },
})

// Rate limiting tracker
const rateLimiter = {
  lastRequestTime: 0,
  minRequestInterval: 500, // ms between requests
  backoffMultiplier: 2,
  currentBackoff: 1,
  maxBackoff: 8,
  isRateLimited: false,
  rateLimitedUntil: 0,

  // Check if we need to wait before making another request
  async throttle() {
    // If we're in rate limited mode, check if we can exit it
    if (this.isRateLimited) {
      if (Date.now() < this.rateLimitedUntil) {
        throw new Error('API is currently rate limited')
      } else {
        console.log('Exiting rate limited state')
        this.isRateLimited = false
        this.currentBackoff = 1
      }
    }

    const now = Date.now()
    const elapsed = now - this.lastRequestTime

    if (elapsed < this.minRequestInterval * this.currentBackoff) {
      const waitTime = this.minRequestInterval * this.currentBackoff - elapsed
      console.log(`Throttling API request, waiting ${waitTime}ms...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    this.lastRequestTime = Date.now()
    return true
  },

  // Handle a rate limit error
  handleRateLimit() {
    console.log(
      `Hit rate limit, backing off for ${30 * this.currentBackoff} seconds`
    )
    this.isRateLimited = true
    this.rateLimitedUntil = Date.now() + 30 * 1000 * this.currentBackoff
    this.currentBackoff = Math.min(
      this.currentBackoff * this.backoffMultiplier,
      this.maxBackoff
    )
  },

  // Signal a successful request
  success() {
    // If we've made successful requests, gradually reduce backoff
    if (this.currentBackoff > 1 && Math.random() < 0.2) {
      this.currentBackoff = Math.max(
        1,
        this.currentBackoff / this.backoffMultiplier
      )
    }
  },
}

// Get network info
export async function getNetworkInfo() {
  try {
    // Check if we have cached network info that's still fresh
    const now = Date.now()
    if (
      apiCache.networkInfo &&
      now - apiCache.lastUpdated.networkInfo < NETWORK_INFO_REFRESH_INTERVAL
    ) {
      console.log('Using cached network info')
      return apiCache.networkInfo
    }

    // Check if we're rate limited
    try {
      await rateLimiter.throttle()
    } catch (error) {
      console.log('Rate limited, returning cached data if available')
      // Return cached data if available or fallback to sample data
      if (apiCache.networkInfo) {
        return apiCache.networkInfo
      }
      // console.log('Using sample network info due to rate limiting')
      // return sampleNetworkInfo
    }

    // Make the API requests with individual try/catch to handle rate limits
    let currentSlot, currentEpoch, epochInfo, supplyInfo

    try {
      // Get slot
      currentSlot = await connection.getSlot()
      rateLimiter.success()

      // Throttle between requests
      await rateLimiter.throttle()

      // Get epoch info
      epochInfo = await connection.getEpochInfo()
      currentEpoch = epochInfo.epoch
      rateLimiter.success()

      // Throttle between requests
      await rateLimiter.throttle()

      // Get supply info
      supplyInfo = await connection.getSupply()
      rateLimiter.success()
    } catch (error: any) {
      // Handle rate limit errors
      if (
        error.message?.includes('429') ||
        error.message?.includes('Too many requests')
      ) {
        rateLimiter.handleRateLimit()
        // Return cached data if available or fallback to sample data
        if (apiCache.networkInfo) {
          return apiCache.networkInfo
        }
        console.log('Using sample network info due to API error')
        // return sampleNetworkInfo
      }
      throw error
    }

    const epochProgress = epochInfo.slotIndex / epochInfo.slotsInEpoch
    const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex
    const avgSlotTime = 0.4 // Solana averages ~0.4 seconds per slot
    const secondsToNextEpoch = slotsRemaining * avgSlotTime

    // Calculate time to next epoch
    const daysToNextEpoch = Math.floor(secondsToNextEpoch / 86400)
    const hoursToNextEpoch = Math.floor((secondsToNextEpoch % 86400) / 3600)
    const minutesToNextEpoch = Math.floor((secondsToNextEpoch % 3600) / 60)

    const totalSupply = supplyInfo.value.total / LAMPORTS_PER_SOL
    const circulatingSupply = supplyInfo.value.circulating / LAMPORTS_PER_SOL
    const nonCirculating = supplyInfo.value.nonCirculating / LAMPORTS_PER_SOL

    // Create the network info object
    const networkInfo = {
      currentSlot,
      currentEpoch,
      epochProgress,
      timeToNextEpoch: {
        days: daysToNextEpoch,
        hours: hoursToNextEpoch,
        minutes: minutesToNextEpoch,
        seconds: secondsToNextEpoch,
      },
      totalSupply,
      circulatingSupply,
      nonCirculating,
    }

    // Update the cache
    apiCache.networkInfo = networkInfo
    apiCache.lastUpdated.networkInfo = now

    return networkInfo
  } catch (error) {
    console.error('Error fetching Solana network info:', error)

    // Return cached data if available or fallback to sample data
    if (apiCache.networkInfo) {
      return apiCache.networkInfo
    }

    console.log('Using sample network info as fallback')
    // return sampleNetworkInfo
  }
}

// Get validators
export async function getValidators() {
  try {
    // Check if we have cached validator data that's still fresh
    const now = Date.now()
    if (
      apiCache.validators &&
      now - apiCache.lastUpdated.validators < VALIDATOR_REFRESH_INTERVAL
    ) {
      console.log('Using cached validators')
      return apiCache.validators
    }

    // Check if we have recent validator data in DB
    const cachedValidators = await storage.getValidators()

    if (cachedValidators.length > 0) {
      const mostRecent = cachedValidators.reduce((newest, current) => {
        return newest.lastUpdated > current.lastUpdated ? newest : current
      })

      const age = Date.now() - mostRecent.lastUpdated.getTime()

      if (age < VALIDATOR_REFRESH_INTERVAL) {
        // Store in memory cache too
        apiCache.validators = cachedValidators
        apiCache.lastUpdated.validators = now
        return cachedValidators
      }
    }

    // Check if we're rate limited before making API calls
    try {
      await rateLimiter.throttle()
    } catch (error) {
      console.log('Rate limited, returning cached validators if available')
      if (apiCache.validators) {
        return apiCache.validators
      }
      if (cachedValidators.length > 0) {
        return cachedValidators
      }
      throw error
    }

    // Fetch new data from Solana network with rate limiting
    let voteAccounts, epochInfo

    try {
      // Get vote accounts
      voteAccounts = await connection.getVoteAccounts()
      rateLimiter.success()

      // Throttle between requests
      await rateLimiter.throttle()

      // Get epoch info
      epochInfo = await connection.getEpochInfo()
      rateLimiter.success()
    } catch (error: any) {
      // Handle rate limit errors
      if (
        error.message?.includes('429') ||
        error.message?.includes('Too many requests')
      ) {
        rateLimiter.handleRateLimit()
        // Return cached data if available
        if (apiCache.validators) {
          return apiCache.validators
        }
        if (cachedValidators.length > 0) {
          return cachedValidators
        }
      }
      throw error
    }

    // Process validators
    const allValidators = [...voteAccounts.current, ...voteAccounts.delinquent]

    // Calculate APY (simplified estimation)
    const avgApy = 7.3 // Base APY estimate

    // Calculate uptime for each validator (simplified)
    const validators: Omit<Validator, 'id'>[] = allValidators.map(
      (validator) => {
        const apy = avgApy * (1 - validator.commission / 100)
        // Note: The skipRate property might be missing in some old releases, handle it safely
        const skipRate =
          (validator as any)?.skipRate !== undefined
            ? (validator as any)?.skipRate
            : 0
        const uptime = 100 - skipRate * 100

        return {
          pubkey: validator.nodePubkey,
          votePubkey: validator.votePubkey,
          name: `Validator ${validator.nodePubkey.slice(0, 6)}`,
          commission: validator.commission.toString(), // Convert to string for DB
          activatedStake: (
            validator.activatedStake / LAMPORTS_PER_SOL
          ).toString(),
          delinquent: !!(validator as any).delinquent, // Ensure boolean
          apy: apy.toString(),
          skipRate: skipRate.toString(),
          uptime: uptime.toString(),
          lastUpdated: new Date(),
        }
      }
    )

    // Save to DB cache
    try {
      await storage.saveValidators(validators)
    } catch (error) {
      console.error('Error saving validators to database:', error)
      // Continue even if DB save fails
    }

    // Update in-memory cache
    const dbValidators = await storage.getValidators()
    apiCache.validators = dbValidators
    apiCache.lastUpdated.validators = now

    // Try to update staking history, but don't block if it fails
    updateStakingHistory(validators).catch((err) => {
      console.error('Error updating staking history:', err)
    })

    return dbValidators
  } catch (error) {
    console.error('Error fetching Solana validators:', error)

    // Return cached data if available instead of failing
    if (apiCache.validators) {
      return apiCache.validators
    }

    // Try DB cache as last resort
    const cachedValidators = await storage.getValidators()
    if (cachedValidators.length > 0) {
      return cachedValidators
    }

    // As a last resort, return sample data
    console.log('Using sample validators as fallback')
    // return sampleValidators
  }
}

// Update staking history
async function updateStakingHistory(validators: Omit<Validator, 'id'>[]) {
  try {
    // Check if we're rate limited before making API calls
    try {
      await rateLimiter.throttle()
    } catch (error) {
      console.log('Rate limited, skipping staking history update')
      return
    }

    const latestHistory = await storage.getLatestStakingHistory()
    const now = new Date()

    // Check if we need to update history
    if (
      latestHistory &&
      now.getTime() - latestHistory.date.getTime() < HISTORY_REFRESH_INTERVAL
    ) {
      return
    }

    // Calculate metrics
    const totalStaked = validators.reduce(
      (sum, val) => sum + Number(val.activatedStake),
      0
    )
    const activeValidators = validators.filter((v) => !v.delinquent).length
    const avgApy =
      validators.reduce((sum, val) => sum + Number(val.apy || 0), 0) /
      validators.length

    try {
      // Get total supply to calculate stake ratio with rate limiting
      const supplyInfo = await connection.getSupply()
      rateLimiter.success()

      const totalSupply = supplyInfo.value.total / LAMPORTS_PER_SOL
      const stakeRatio = (totalStaked / totalSupply) * 100

      // Save new history entry
      const historyEntry = {
        date: now,
        totalStaked: totalStaked.toString(),
        activeValidators, // Keep as number for DB
        avgApy: avgApy.toString(),
        stakeRatio: stakeRatio.toString(),
      }
      await TrendsService.insertTrend(historyEntry)

      const getAllTrendsReq = await TrendsService.getAllTrends()
      if (getAllTrendsReq.success) {
        const data = (getAllTrendsReq.data?.data || []) as StakingHistory[]
        for (const trend of data) {
          await storage.saveStakingHistory({
            ...trend,
            date: new Date(trend.date),
          })
        }
      }

      await storage.saveStakingHistory(historyEntry)

      // Update in-memory cache
      const history = await storage.getStakingHistory()
      apiCache.stakingHistory = history
      apiCache.lastUpdated.stakingHistory = now.getTime()
    } catch (error: any) {
      // Handle rate limit errors
      if (
        error.message?.includes('429') ||
        error.message?.includes('Too many requests')
      ) {
        rateLimiter.handleRateLimit()
      }
      throw error
    }
  } catch (error) {
    console.error('Error updating staking history:', error)
  }
}

// Get staking history
export async function getStakingHistory() {
  try {
    // Check if we have cached history that's still fresh
    const now = Date.now()
    if (
      apiCache.stakingHistory &&
      now - apiCache.lastUpdated.stakingHistory < HISTORY_REFRESH_INTERVAL
    ) {
      console.log('Using cached staking history')
      return apiCache.stakingHistory
    }

    // Get from database
    let history = await storage.getStakingHistory()
    if (!history.length) {
      const getAllTrendsReq = await TrendsService.getAllTrends()
      if (getAllTrendsReq.success) {
        const data = (
          (getAllTrendsReq.data?.data || []) as StakingHistory[]
        ).map((trend) => ({
          ...trend,
          date: new Date(trend.date),
        }))
        history = data
        //   for (const trend of data) {
        //     await storage.saveStakingHistory({
        //       ...trend,
        //       date: new Date(trend.date),
        //     })
        //   }
      }
    }

    // Update in-memory cache
    apiCache.stakingHistory = history
    apiCache.lastUpdated.stakingHistory = now

    return history
  } catch (error) {
    console.error('Error fetching staking history:', error)

    // Return cached data if available
    if (apiCache.stakingHistory) {
      return apiCache.stakingHistory
    }
  }
}
