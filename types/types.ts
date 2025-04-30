export interface ApiResponse<D = unknown> {
  success: boolean
  message: string
  data?: D
}

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

export interface Validator {
  id: number
  pubkey: string
  votePubkey: string
  name: string | null
  commission: number
  activatedStake: number
  delinquent: boolean
  apy: number | null
  skipRate: number | null
  uptime: number | null
  lastUpdated: string
}

export interface StakingHistory {
  id: number
  date: string
  totalStaked: number
  activeValidators: number
  avgApy: number | null
  stakeRatio: number | null
}

export interface StakingStats {
  totalStaked: number
  activeValidators: number
  avgApy: number
  networkHealth: number
  previousEpochStats?: {
    totalStaked: number
    activeValidators: number
    avgApy: number
    networkHealth: number
  }
}

export interface APYCalculationResult {
  apy: number
  rewards: number
  endBalance: number
}
