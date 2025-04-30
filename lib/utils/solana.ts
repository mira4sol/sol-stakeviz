import {
  APYCalculationResult,
  NetworkInfo,
  StakingHistory,
  Validator,
} from '../../types/types'

/**
 * Fetches network information from the API
 */
export async function fetchNetworkInfo(): Promise<NetworkInfo> {
  const response = await fetch('/api/solana/network')

  if (!response.ok) {
    throw new Error('Failed to fetch network information')
  }

  return await response.json()
}

/**
 * Fetches validator data from the API
 */
export async function fetchValidators(): Promise<Validator[]> {
  const response = await fetch('/api/solana/validators')

  if (!response.ok) {
    throw new Error('Failed to fetch validators')
  }

  return await response.json()
}

/**
 * Fetches staking history from the API
 */
export async function fetchStakingHistory(): Promise<StakingHistory[]> {
  const response = await fetch('/api/solana/history')

  if (!response.ok) {
    throw new Error('Failed to fetch staking history')
  }

  return await response.json()
}

/**
 * Calculates staking rewards
 */
export async function calculateRewards(
  amount: number,
  commission: number,
  days: number
): Promise<APYCalculationResult> {
  const response = await fetch('/api/solana/calculate-rewards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, commission, days }),
  })

  if (!response.ok) {
    throw new Error('Failed to calculate rewards')
  }

  return await response.json()
}

/**
 * Computes staking statistics from validator data
 */
export function computeStakingStats(validators: Validator[]): {
  totalStaked: number
  activeValidators: number
  avgApy: number
  networkHealth: number
} {
  if (!validators.length) {
    return {
      totalStaked: 0,
      activeValidators: 0,
      avgApy: 0,
      networkHealth: 0,
    }
  }

  const totalStaked = validators.reduce(
    (sum, val) => sum + Number(val.activatedStake),
    0
  )
  const activeValidators = validators.filter((v) => !v.delinquent).length

  // Calculate APY (exclude null APYs)
  const validApys = validators
    .filter((v) => v.apy !== null)
    .map((v) => Number(v.apy))

  const avgApy =
    validApys.length > 0
      ? validApys.reduce((sum, apy) => sum + apy, 0) / validApys.length
      : 0

  // Calculate network health (simplified version)
  // Based on % of active validators and their uptime
  const totalValidators = validators.length
  const validatorsRatio = activeValidators / totalValidators

  // Calculate average uptime (exclude null uptimes)
  const validUptimes = validators
    .filter((v) => v.uptime !== null)
    .map((v) => Number(v.uptime))

  const avgUptime =
    validUptimes.length > 0
      ? validUptimes.reduce((sum, uptime) => sum + uptime, 0) /
        validUptimes.length
      : 0

  // Health is a combo of validators ratio and uptime
  const networkHealth = (validatorsRatio * 0.5 + avgUptime * 0.005) * 100

  return {
    totalStaked,
    activeValidators,
    avgApy,
    networkHealth,
  }
}
