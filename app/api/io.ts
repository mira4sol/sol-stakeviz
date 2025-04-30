import { StakingHistory } from '@/types/schema'
import fs from 'fs'
import path from 'path'

// ES module compatible __dirname, decode %20 to spaces
export const __filename = decodeURIComponent(new URL(import.meta.url).pathname)
export const __dirname = path.dirname(__filename)
export const historyFilePath = path.resolve(__dirname, 'staking_history.json')

export const loadStakingHistoryFromFile = (): StakingHistory[] | undefined => {
  if (fs.existsSync(historyFilePath)) {
    try {
      // Create the file if it does not exist
      if (!fs.existsSync(historyFilePath)) {
        try {
          fs.mkdirSync(path.dirname(historyFilePath), { recursive: true })
          fs.writeFileSync(historyFilePath, '[]', 'utf-8')
        } catch (err) {
          console.error('Failed to create staking history file:', err)
        }
      }

      const data = fs.readFileSync(historyFilePath, 'utf-8')
      const parsed = JSON.parse(data)
      // Convert date strings back to Date objects
      // history = parsed.map((entry: any) => ({
      return parsed.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }))
      // return history
      // apiCache.stakingHistory = this.history
      // // Set currentHistoryId to max id + 1
      // if (this.history.length > 0) {
      //   this.currentHistoryId = Math.max(...this.history.map((h) => h.id)) + 1
      // }
    } catch (err) {
      console.error('Failed to load staking history from file:', err)
      // this.history = []
    }
  }
}

export const saveStakingHistoryToFile = (history: StakingHistory[]) => {
  try {
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save staking history to file:', err)
  }
}
