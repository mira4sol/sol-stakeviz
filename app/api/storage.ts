import { StakingHistory, Validator } from '@/types/schema'

// Interface for storage operations
export interface IStorage {
  // Validator operations
  getValidators(): Promise<Validator[]>
  getValidatorByPubkey(pubkey: string): Promise<Validator | undefined>
  saveValidator(validator: Validator): Promise<Validator>
  saveValidators(validators: Validator[]): Promise<Validator[]>

  // Staking history operations
  getStakingHistory(): Promise<StakingHistory[]>
  getLatestStakingHistory(): Promise<StakingHistory | undefined>
  saveStakingHistory(entry: StakingHistory): Promise<StakingHistory>
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private validators: Map<string, Validator>
  private history: StakingHistory[]
  currentUserId: number
  currentValidatorId: number
  currentHistoryId: number

  constructor() {
    this.validators = new Map()
    this.history = []
    this.currentUserId = 1
    this.currentValidatorId = 1
    this.currentHistoryId = 1
  }

  // Validator methods
  async getValidators(): Promise<Validator[]> {
    return Array.from(this.validators.values())
  }

  async getValidatorByPubkey(pubkey: string): Promise<Validator | undefined> {
    return this.validators.get(pubkey)
  }

  async saveValidator(
    insertValidator: Omit<Validator, 'id'>
  ): Promise<Validator> {
    const id = this.currentValidatorId++
    // const validator: Validator = { ...insertValidator, id }
    const validator: Validator = {
      ...insertValidator,
      id,
      name: insertValidator.name ?? null,
      apy: insertValidator.apy ?? null,
      skipRate: insertValidator.skipRate ?? null,
      uptime: insertValidator.uptime ?? null,
    }
    this.validators.set(validator.pubkey, validator)
    return validator
  }

  async saveValidators(
    insertValidators: Omit<Validator, 'id'>[]
  ): Promise<Validator[]> {
    const validators: Validator[] = []

    for (const insertValidator of insertValidators) {
      const validator = await this.saveValidator(insertValidator)
      validators.push(validator)
    }

    return validators
  }

  // Staking history methods
  async getStakingHistory(): Promise<StakingHistory[]> {
    return [...this.history].sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  async getLatestStakingHistory(): Promise<StakingHistory | undefined> {
    if (this.history.length === 0) return undefined

    return this.history.reduce((latest, current) => {
      return latest.date > current.date ? latest : current
    })
  }

  async saveStakingHistory(
    entry: Omit<StakingHistory, 'id'>
  ): Promise<StakingHistory> {
    const id = this.currentHistoryId++
    // console.log('enrty', entry)
    const historyEntry: StakingHistory = {
      ...entry,
      id,
      avgApy: entry.avgApy ?? null,
      stakeRatio: entry.stakeRatio ?? null,
    }
    this.history.push(historyEntry)
    return historyEntry
  }
}

export const storage = new MemStorage()
