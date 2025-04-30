import { Validator } from '../../types/types'

/**
 * Sorts validators by specified criteria
 */
export function sortValidators(
  validators: Validator[],
  sortBy: 'stake' | 'apy' | 'uptime' | 'commission' | 'skipRate' = 'stake',
  ascending = false
): Validator[] {
  return [...validators].sort((a, b) => {
    let valueA: number
    let valueB: number

    switch (sortBy) {
      case 'stake':
        valueA = Number(a.activatedStake)
        valueB = Number(b.activatedStake)
        break
      case 'apy':
        valueA = Number(a.apy || 0)
        valueB = Number(b.apy || 0)
        break
      case 'uptime':
        valueA = Number(a.uptime || 0)
        valueB = Number(b.uptime || 0)
        break
      case 'commission':
        valueA = Number(a.commission)
        valueB = Number(b.commission)
        break
      case 'skipRate':
        valueA = Number(a.skipRate || 0)
        valueB = Number(b.skipRate || 0)
        break
      default:
        valueA = Number(a.activatedStake)
        valueB = Number(b.activatedStake)
    }

    return ascending ? valueA - valueB : valueB - valueA
  })
}

/**
 * Filters validators by name or pubkey
 */
export function filterValidators(
  validators: Validator[],
  search: string
): Validator[] {
  if (!search) return validators

  const searchLower = search.toLowerCase()

  return validators.filter((validator) => {
    const nameMatch = validator.name?.toLowerCase().includes(searchLower)
    const pubkeyMatch = validator.pubkey.toLowerCase().includes(searchLower)
    const votePubkeyMatch = validator.votePubkey
      .toLowerCase()
      .includes(searchLower)

    return nameMatch || pubkeyMatch || votePubkeyMatch
  })
}

/**
 * Get top N validators by stake
 */
export function getTopValidatorsByStake(
  validators: Validator[],
  limit: number
): Validator[] {
  return sortValidators(validators, 'stake').slice(0, limit)
}

/**
 * Calculate stake distribution statistics
 */
export function calculateStakeDistribution(
  validators: Validator[],
  count: number = 20
) {
  if (!validators.length)
    return { labels: [], data: [], totalStake: 0, top20Percentage: 0 }

  const sortedValidators = sortValidators(validators, 'stake')
  const totalStake = sortedValidators.reduce(
    (sum, v) => sum + Number(v.activatedStake),
    0
  )

  // Calculate top 20 percentage
  const top20 = sortedValidators.slice(0, count)
  const top20Stake = top20.reduce((sum, v) => sum + Number(v.activatedStake), 0)
  const top20Percentage = (top20Stake / totalStake) * 100

  // Prepare data for chart
  const labels = sortedValidators.slice(0, count).map((v, i) => `Val ${i + 1}`)
  const toolTips = sortedValidators.slice(0, count).map((v, i) => `${v.name}`)
  const data = sortedValidators
    .slice(0, count)
    .map((v) => Number(v.activatedStake) / 1000000) // Convert to millions

  return {
    labels,
    data,
    totalStake,
    top20Percentage,
    toolTips,
  }
}

/**
 * Calculate APY distribution statistics
 */
export function calculateAPYDistribution(validators: Validator[]) {
  if (!validators.length)
    return { labels: [], data: [], avgApy: 0, minMaxRange: { min: 0, max: 0 } }

  // Filter validators with valid APY
  const validatorWithApy = validators.filter((v) => v.apy !== null)

  if (!validatorWithApy.length) {
    return { labels: [], data: [], avgApy: 0, minMaxRange: { min: 0, max: 0 } }
  }

  // Calculate average APY
  const apyValues = validatorWithApy.map((v) => Number(v.apy))
  const avgApy = apyValues.reduce((sum, apy) => sum + apy, 0) / apyValues.length

  // Find min and max APY
  const minApy = Math.min(...apyValues)
  const maxApy = Math.max(...apyValues)

  // Create APY ranges
  const ranges = [
    '6.5-6.7%',
    '6.7-6.9%',
    '6.9-7.1%',
    '7.1-7.3%',
    '7.3-7.5%',
    '7.5-7.7%',
    '7.7-7.9%',
    '7.9-8.1%',
    '8.1-8.3%',
  ]

  const rangeValues = [6.5, 6.7, 6.9, 7.1, 7.3, 7.5, 7.7, 7.9, 8.1, 8.3]

  // Count validators in each range
  const data = new Array(ranges.length).fill(0)

  apyValues.forEach((apy) => {
    for (let i = 0; i < rangeValues.length - 1; i++) {
      if (apy >= rangeValues[i] && apy < rangeValues[i + 1]) {
        data[i]++
        break
      }
    }
  })

  return {
    labels: ranges,
    data,
    avgApy,
    minMaxRange: { min: minApy, max: maxApy },
  }
}

/**
 * Get validator performance data
 */
export function getValidatorPerformanceData(
  validators: Validator[],
  limit = 10
) {
  if (!validators || !Array.isArray(validators) || validators.length === 0) {
    return []
  }

  // Get top validators by performance (composite score of uptime, APY, and stake)
  try {
    const performanceValidators = [...validators]
      .filter((v) => {
        // Safe check for valid validator object with required fields
        return (
          v &&
          typeof v === 'object' &&
          v.pubkey &&
          v.votePubkey &&
          v.uptime !== undefined &&
          v.uptime !== null &&
          v.apy !== undefined &&
          v.apy !== null
        )
      })
      .map((v) => {
        // Handle string to number conversion safely
        try {
          const normalizedUptime = Number(v.uptime || 0) / 100
          const normalizedApy = Number(v.apy || 0) / 8 // Assuming max APY around 8%
          const score = normalizedUptime * 0.6 + normalizedApy * 0.4
          return { ...v, score }
        } catch (err) {
          // If conversion fails, use default low score
          console.warn(`Error processing validator ${v.pubkey}:`, err)
          return { ...v, score: 0 }
        }
      })
      .sort((a, b) => {
        // Safe sorting with fallbacks
        const scoreA = a.score !== undefined ? a.score : 0
        const scoreB = b.score !== undefined ? b.score : 0
        return scoreB - scoreA
      })
      .slice(0, limit)

    return performanceValidators
  } catch (error) {
    console.error('Error generating validator performance data:', error)
    return []
  }
}

/**
 * Get top 10 validators by stake with percentage and hex color for pie chart
 */
export function getTop10ValidatorsStakeDistribution(validators: Validator[]) {
  if (!validators || !Array.isArray(validators) || validators.length === 0) {
    return []
  }

  // Sort and get top 10 by stake
  const topValidators = sortValidators(validators, 'stake').slice(0, 10)
  const totalStake = validators.reduce(
    (sum, v) => sum + Number(v.activatedStake),
    0
  )

  // Fixed palette of 10 visually distinct hex colors
  const hexColors = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#00A86B', // Green
    '#C9CBCF', // Gray
    '#E7E9ED', // Light Gray
    '#B8860B', // Dark Yellow
  ]

  return topValidators.map((v, i) => ({
    name: v.name || v.pubkey,
    activatedStake: v.activatedStake,
    percentage: totalStake > 0 ? (v.activatedStake / totalStake) * 100 : 0,
    color: hexColors[i % hexColors.length],
    pubkey: v.pubkey,
  }))
}
