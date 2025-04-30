// Validator model for caching validator data
export interface Validator {
  id: number
  name: string | null
  pubkey: string
  votePubkey: string
  commission: string
  activatedStake: string
  delinquent: boolean
  apy: string | null
  skipRate: string | null
  uptime: string | null
  lastUpdated: Date
}

// Staking history for trends
export interface StakingHistory {
  date: Date
  id: number
  totalStaked: string
  activeValidators: number
  avgApy: string | null
  stakeRatio: string | null
}

// Network information type
export interface NetworkInfo {
  currentSlot: number
  currentEpoch: number
  epochProgress: number
  timeToNextEpoch: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  totalSupply: number
  circulatingSupply: number
  nonCirculating: number
}
