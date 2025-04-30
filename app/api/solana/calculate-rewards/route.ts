import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  try {
    const { amount, commission, days } = await req.json()

    if (
      typeof amount !== 'number' ||
      typeof commission !== 'number' ||
      typeof days !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400 }
      )
    }

    // Simple APY calculation
    const baseApy = 7.3 // Base average APY
    const apy = baseApy * (1 - commission / 100)
    const rewards = amount * (apy / 100) * (days / 365)
    const endBalance = amount + rewards

    return NextResponse.json({
      apy,
      rewards,
      endBalance,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
