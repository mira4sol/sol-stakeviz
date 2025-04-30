// app/api/cron/update-staking-history/route.ts
import { NextResponse } from 'next/server'
import { getValidators } from '../../solana'

export const GET = async () => {
  await getValidators() // This will internally call updateStakingHistory
  return NextResponse.json({ status: 'ok' })
}
