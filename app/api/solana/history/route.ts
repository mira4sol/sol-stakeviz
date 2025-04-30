import { NextResponse } from 'next/server'
import { getStakingHistory, getValidators } from '../../solana'

export const GET = async () => {
  try {
    const history = await getStakingHistory()
    return NextResponse.json(history)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
