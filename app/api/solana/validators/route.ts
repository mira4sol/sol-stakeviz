import { NextResponse } from 'next/server'
import { getValidators } from '../../solana'

export const GET = async () => {
  try {
    const validators = await getValidators()
    return NextResponse.json(validators)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
