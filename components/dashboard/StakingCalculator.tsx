import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAPYCalculator } from '@/hooks/useSolanaConnection'
import { formatPercent, formatSOL } from '@/lib/utils/format'
import { useState } from 'react'

export default function StakingCalculator() {
  const [amount, setAmount] = useState<string>('')
  const [commission, setCommission] = useState<string>('7.0')
  const [timeperiod, setTimeperiod] = useState<string>('365')
  const [rewards, setRewards] = useState<number>(0)
  const [endBalance, setEndBalance] = useState<number>(0)
  const [apy, setApy] = useState<number>(7.1)

  const calculator = useAPYCalculator()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
  }

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '')
    // Ensure commission doesn't exceed 100%
    if (parseFloat(value) <= 100) {
      setCommission(value)
    }
  }

  const handleCalculate = () => {
    const amountValue = parseFloat(amount) || 0
    const commissionValue = parseFloat(commission) || 0
    const daysValue = parseInt(timeperiod) || 365

    if (amountValue <= 0) {
      return
    }

    calculator.mutate(
      {
        amount: amountValue,
        commission: commissionValue,
        days: daysValue,
      },
      {
        onSuccess: (data) => {
          setApy(data.apy)
          setRewards(data.rewards)
          setEndBalance(data.endBalance)
        },
        onError: (error) => {
          console.error('Calculation error:', error)
        },
      }
    )
  }

  return (
    <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg shadow'>
      <div className='p-5'>
        <h3 className='text-lg font-medium mb-4'>Staking Calculator</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
              Amount to Stake (SOL)
            </label>
            <div className='relative rounded-md shadow-sm'>
              <Input
                type='text'
                className='pr-12 border bg-sol-dark-lighter border-gray-700 focus:ring-sol-primary focus:border-sol-primary'
                placeholder='0.0'
                value={amount}
                onChange={handleAmountChange}
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <span className='text-sol-text-secondary text-sm'>SOL</span>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
              Validator Commission
            </label>
            <div className='relative rounded-md shadow-sm'>
              <Input
                type='text'
                className='pr-12 bg-sol-dark-lighter border border-gray-700 focus:ring-sol-primary focus:border-sol-primary'
                placeholder='7.0'
                value={commission}
                onChange={handleCommissionChange}
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <span className='text-sol-text-secondary text-sm'>%</span>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
              Time Period
            </label>
            <Select value={timeperiod} onValueChange={setTimeperiod}>
              <SelectTrigger className=' border bg-sol-dark-lighter border-gray-700 focus:ring-sol-primary focus:border-sol-primary'>
                <SelectValue placeholder='Select time period' />
              </SelectTrigger>
              <SelectContent className='bg-sol-dark-lighter text-sol-text border border-gray-700'>
                <SelectItem value='30'>30 Days</SelectItem>
                <SelectItem value='90'>90 Days</SelectItem>
                <SelectItem value='180'>180 Days</SelectItem>
                <SelectItem value='365'>1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='pt-4 border-t border-gray-700'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-sol-text-secondary'>Estimated APY</span>
              <span className='font-medium text-sol-secondary'>
                {formatPercent(apy)}
              </span>
            </div>

            <div className='flex items-center justify-between text-sm mt-2'>
              <span className='text-sol-text-secondary'>Estimated Rewards</span>
              <span className='font-medium'>+{formatSOL(rewards)}</span>
            </div>

            <div className='flex items-center justify-between text-sm mt-2'>
              <span className='text-sol-text-secondary'>End Balance</span>
              <span className='font-medium'>{formatSOL(endBalance)}</span>
            </div>
          </div>

          <Button
            className='mt-2 w-full bg-sol-primary hover:bg-opacity-90 text-white'
            onClick={handleCalculate}
            disabled={calculator.isPending}
          >
            {calculator.isPending ? 'Calculating...' : 'Calculate'}
          </Button>

          <div className='text-xs text-sol-text-secondary text-center'>
            Calculations are estimates based on current network conditions
          </div>
        </div>
      </div>
    </Card>
  )
}
