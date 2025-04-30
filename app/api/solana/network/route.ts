import { NextResponse } from 'next/server'
import { getNetworkInfo, getValidators } from '../../solana'

export const GET = async () => {
  try {
    const networkInfo = await getNetworkInfo()
    return NextResponse.json(networkInfo)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
