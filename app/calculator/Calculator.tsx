'use client'

import Sidebar from '@/components/layout/Sidebar'
import { Badge } from '@/components/ui/badge'
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
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAPYCalculator, useStakingStats } from '@/hooks/useSolanaConnection'
import { formatPercent, formatSOL } from '@/lib/utils/format'
import React, { useEffect, useState } from 'react'

export default function Calculator() {
  const { data: stats, isLoading: isLoadingStats } = useStakingStats()
  const calculator = useAPYCalculator()

  // Calculator state
  const [amount, setAmount] = useState<string>('1000')
  const [commission, setCommission] = useState<number>(7)
  const [timePeriod, setTimePeriod] = useState<string>('365')
  const [compounding, setCompounding] = useState<string>('daily')
  const [calculatorTab, setCalculatorTab] = useState<string>('basic')

  // Advanced options
  const [lockupPeriod, setLockupPeriod] = useState<number>(0)
  const [unstakeFee, setUnstakeFee] = useState<number>(0)
  const [reinvestThreshold, setReinvestThreshold] = useState<number>(0)
  const [apyTrend, setApyTrend] = useState<string>('stable')

  // Results
  const [results, setResults] = useState({
    apy: 0,
    rewards: 0,
    endBalance: 0,
    monthlyRewards: [] as number[],
    roi: 0,
    annualRewards: 0,
  })

  // Time period options
  const timePeriodOptions = [
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' },
    { value: '180', label: '180 Days' },
    { value: '365', label: '1 Year' },
    { value: '730', label: '2 Years' },
    { value: '1095', label: '3 Years' },
  ]

  // Commission options
  const commissionOptions = [
    { value: 0, label: '0%' },
    { value: 1, label: '1%' },
    { value: 2, label: '2%' },
    { value: 3, label: '3%' },
    { value: 5, label: '5%' },
    { value: 7, label: '7%' },
    { value: 10, label: '10%' },
  ]

  // Compounding options
  const compoundingOptions = [
    { value: 'never', label: 'No Compounding' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'daily', label: 'Daily' },
  ]

  // APY Trend options
  const apyTrendOptions = [
    { value: 'stable', label: 'Stable' },
    { value: 'increasing', label: 'Gradually Increasing' },
    { value: 'decreasing', label: 'Gradually Decreasing' },
    { value: 'volatile', label: 'Volatile' },
  ]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
  }

  const handleCalculate = () => {
    const amountValue = parseFloat(amount) || 0
    const daysValue = parseInt(timePeriod) || 365

    if (amountValue <= 0) {
      return
    }

    calculator.mutate(
      {
        amount: amountValue,
        commission: commission,
        days: daysValue,
      },
      {
        onSuccess: (data) => {
          // Basic results
          const roi = (data.rewards / amountValue) * 100

          // Calculate monthly rewards (simplified)
          const monthlyRewards = []
          const dailyRate = data.apy / 365 / 100
          let currentAmount = amountValue

          // Calculate 12 months of rewards
          for (let month = 1; month <= 12; month++) {
            // Days in this month (simplified to 30 days)
            const daysInMonth = 30
            let monthlyReward = 0

            // Apply compounding logic
            if (compounding === 'never') {
              // No compounding, just add the reward
              monthlyReward = currentAmount * dailyRate * daysInMonth
            } else if (compounding === 'daily') {
              // Compound daily
              for (let day = 1; day <= daysInMonth; day++) {
                const dailyReward = currentAmount * dailyRate
                currentAmount += dailyReward
                monthlyReward += dailyReward
              }
            } else if (compounding === 'monthly') {
              // Compound monthly
              monthlyReward = currentAmount * dailyRate * daysInMonth
              if (month <= daysValue / 30) {
                currentAmount += monthlyReward
              }
            } else if (compounding === 'quarterly' && month % 3 === 0) {
              // Compound quarterly
              monthlyReward = currentAmount * dailyRate * daysInMonth
              if (month <= daysValue / 30) {
                currentAmount += monthlyReward * 3 // Add 3 months of rewards
              }
            } else if (compounding === 'yearly' && month % 12 === 0) {
              // Compound yearly
              monthlyReward = currentAmount * dailyRate * daysInMonth
              if (month <= daysValue / 30) {
                currentAmount += monthlyReward * 12 // Add 12 months of rewards
              }
            } else {
              // Regular month with no compounding event
              monthlyReward = currentAmount * dailyRate * daysInMonth
            }

            // Apply advanced options
            if (calculatorTab === 'advanced') {
              // Apply lockup period (no rewards during lockup)
              if (month * 30 <= lockupPeriod) {
                monthlyReward = 0
              }

              // Apply APY trend
              if (apyTrend === 'increasing') {
                monthlyReward *= 1 + month * 0.01
              } else if (apyTrend === 'decreasing') {
                monthlyReward *= 1 - month * 0.005
              } else if (apyTrend === 'volatile') {
                // Random fluctuation between -10% and +10%
                const volatilityFactor = 0.9 + Math.random() * 0.2
                monthlyReward *= volatilityFactor
              }

              // Apply reinvestment threshold (no compounding until threshold is met)
              if (reinvestThreshold > 0 && monthlyReward < reinvestThreshold) {
                // Don't compound this month
                if (compounding !== 'never') {
                  currentAmount -= monthlyReward // Remove the automatic compounding
                }
              }
            }

            monthlyRewards.push(parseFloat(monthlyReward.toFixed(2)))

            // Stop calculating if we've exceeded the time period
            if (month * 30 > daysValue) break
          }

          setResults({
            apy: data.apy,
            rewards: data.rewards,
            endBalance: data.endBalance,
            monthlyRewards,
            roi,
            annualRewards: data.rewards * (365 / daysValue),
          })
        },
        onError: (error) => {
          console.error('Calculation error:', error)
        },
      }
    )
  }

  // Calculate on initial load
  useEffect(() => {
    if (!isLoadingStats && !calculator.isPending) {
      handleCalculate()
    }
  }, [isLoadingStats])

  // Risk assessment based on validator commission and other factors
  const getRiskLevel = () => {
    let riskScore = 0

    // Commission risk
    if (commission <= 2)
      riskScore += 1 // Lower commission = higher risk (potentially unsustainable)
    else if (commission > 10) riskScore += 2 // Higher commission = higher risk (lower returns)

    // Time period risk
    const days = parseInt(timePeriod)
    if (days > 365 * 2) riskScore += 2 // Longer periods have more uncertainty

    // Compounding risk
    if (compounding === 'daily') riskScore += 1 // Daily compounding has gas fee/transaction risks

    // Advanced options risk
    if (calculatorTab === 'advanced') {
      if (lockupPeriod > 30) riskScore += 1
      if (unstakeFee > 0) riskScore += 1
      if (apyTrend !== 'stable') riskScore += 1
    }

    // Map score to risk level
    if (riskScore <= 1) return { level: 'low', color: 'bg-green-600' }
    if (riskScore <= 3) return { level: 'medium', color: 'bg-yellow-500' }
    return { level: 'high', color: 'bg-red-500' }
  }

  const risk = getRiskLevel()

  return (
    <div className='flex h-screen overflow-hidden bg-sol-dark'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Top Navigation Bar */}
        {/* <Navbar /> */}

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto bg-sol-dark p-4 sm:p-6 lg:p-8'>
          {/* Page Header */}
          <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-2xl font-semibold glow-text'>
                Staking Calculator
              </h1>
              <p className='mt-1 text-sm text-sol-text-secondary'>
                Plan your Solana staking strategy and calculate potential
                rewards
              </p>
            </div>
            <div className='mt-4 sm:mt-0'>
              <Card className='neo-card p-3 flex items-center'>
                <div>
                  <div className='text-xs text-sol-text-secondary'>
                    Current Network APY
                  </div>
                  <div className='text-xl font-medium text-sol-secondary'>
                    {isLoadingStats
                      ? 'Loading...'
                      : formatPercent(stats?.avgApy || 0)}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Input Panel */}
            <Card className='neo-card lg:col-span-1'>
              <div className='p-5'>
                <h3 className='text-lg font-medium mb-5'>Staking Parameters</h3>

                <Tabs
                  defaultValue='basic'
                  value={calculatorTab}
                  onValueChange={setCalculatorTab}
                  className='mb-6'
                >
                  <TabsList className='grid w-full grid-cols-2 bg-sol-dark-lighter rounded-lg p-1'>
                    <TabsTrigger
                      value='basic'
                      className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
                    >
                      Basic
                    </TabsTrigger>
                    <TabsTrigger
                      value='advanced'
                      className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
                    >
                      Advanced
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value='basic' className='mt-0'>
                    <div className='space-y-5'>
                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          Amount to Stake (SOL)
                        </label>
                        <div className='relative'>
                          <Input
                            type='text'
                            className='pr-12 bg-sol-dark-lighter border-gray-700 focus:ring-sol-primary focus:border-sol-primary'
                            placeholder='1000'
                            value={amount}
                            onChange={handleAmountChange}
                          />
                          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                            <span className='text-sol-text-secondary text-sm'>
                              SOL
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          Validator Commission
                        </label>
                        <div className='grid grid-cols-2 gap-4'>
                          <Select
                            value={commission.toString()}
                            onValueChange={(value) =>
                              setCommission(parseInt(value))
                            }
                          >
                            <SelectTrigger className='bg-sol-dark-lighter border-gray-700'>
                              <SelectValue placeholder='Select commission' />
                            </SelectTrigger>
                            <SelectContent className='bg-sol-card text-sol-text border border-gray-700'>
                              {commissionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value.toString()}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className='flex items-center'>
                            <div className='w-full'>
                              <Slider
                                value={[commission]}
                                min={0}
                                max={10}
                                step={1}
                                onValueChange={(value) =>
                                  setCommission(value[0])
                                }
                                className='my-1.5'
                              />
                            </div>
                            <span className='ml-2 text-sm font-medium'>
                              {commission}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          Time Period
                        </label>
                        <Select
                          value={timePeriod}
                          onValueChange={setTimePeriod}
                        >
                          <SelectTrigger className='bg-sol-dark-lighter border-gray-700'>
                            <SelectValue placeholder='Select time period' />
                          </SelectTrigger>
                          <SelectContent className='bg-sol-card text-sol-text border border-gray-700'>
                            {timePeriodOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          Compounding Strategy
                        </label>
                        <Select
                          value={compounding}
                          onValueChange={setCompounding}
                        >
                          <SelectTrigger className='bg-sol-dark-lighter border-gray-700'>
                            <SelectValue placeholder='Select compounding' />
                          </SelectTrigger>
                          <SelectContent className='bg-sol-card text-sol-text border border-gray-700'>
                            {compoundingOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='advanced' className='mt-0'>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          Lockup Period (Days)
                        </label>
                        <div className='flex items-center'>
                          <div className='w-full'>
                            <Slider
                              value={[lockupPeriod]}
                              min={0}
                              max={60}
                              step={1}
                              onValueChange={(value) =>
                                setLockupPeriod(value[0])
                              }
                              className='my-1.5'
                            />
                          </div>
                          <span className='ml-2 text-sm font-medium w-12 text-right'>
                            {lockupPeriod}
                          </span>
                        </div>
                        <p className='text-xs text-sol-text-secondary mt-1'>
                          Days before rewards start accumulating.
                        </p>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          Unstake Fee (%)
                        </label>
                        <div className='flex items-center'>
                          <div className='w-full'>
                            <Slider
                              value={[unstakeFee]}
                              min={0}
                              max={1}
                              step={0.1}
                              onValueChange={(value) => setUnstakeFee(value[0])}
                              className='my-1.5'
                            />
                          </div>
                          <span className='ml-2 text-sm font-medium w-12 text-right'>
                            {unstakeFee.toFixed(1)}%
                          </span>
                        </div>
                        <p className='text-xs text-sol-text-secondary mt-1'>
                          Fee charged when unstaking (typically 0%).
                        </p>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          Reinvestment Threshold (SOL)
                        </label>
                        <div className='flex items-center'>
                          <div className='w-full'>
                            <Slider
                              value={[reinvestThreshold]}
                              min={0}
                              max={10}
                              step={0.5}
                              onValueChange={(value) =>
                                setReinvestThreshold(value[0])
                              }
                              className='my-1.5'
                            />
                          </div>
                          <span className='ml-2 text-sm font-medium w-12 text-right'>
                            {reinvestThreshold.toFixed(1)}
                          </span>
                        </div>
                        <p className='text-xs text-sol-text-secondary mt-1'>
                          Minimum reward amount before compounding.
                        </p>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-sol-text-secondary mb-1'>
                          APY Trend Scenario
                        </label>
                        <Select value={apyTrend} onValueChange={setApyTrend}>
                          <SelectTrigger className='bg-sol-dark-lighter border-gray-700'>
                            <SelectValue placeholder='Select APY trend' />
                          </SelectTrigger>
                          <SelectContent className='bg-sol-card text-sol-text border border-gray-700'>
                            {apyTrendOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-sol-text-secondary mt-1'>
                          Model different APY scenarios over time.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className='mt-6'>
                  <Button
                    className='w-full bg-gradient-to-r from-sol-primary to-sol-info hover:opacity-90 text-white glow-primary'
                    onClick={handleCalculate}
                    disabled={calculator.isPending}
                  >
                    {calculator.isPending ? (
                      <div className='flex items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Calculating...
                      </div>
                    ) : (
                      'Calculate Rewards'
                    )}
                  </Button>
                </div>

                <div className='mt-4 text-xs text-center text-sol-text-secondary'>
                  Calculations are estimates based on current network conditions
                </div>
              </div>
            </Card>

            {/* Results Panel */}
            <Card className='neo-card lg:col-span-2'>
              <div className='p-5'>
                <h3 className='text-lg font-medium mb-6'>Staking Results</h3>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-6'>
                  <Card className='bg-sol-dark-lighter p-4 rounded-lg'>
                    <div className='text-sm text-sol-text-secondary'>
                      Estimated APY
                    </div>
                    <div className='text-3xl font-bold text-sol-secondary mt-1'>
                      {formatPercent(results.apy)}
                    </div>
                    <div className='text-xs text-sol-text-secondary mt-2'>
                      Annual percentage yield
                    </div>
                  </Card>

                  <Card className='bg-sol-dark-lighter p-4 rounded-lg'>
                    <div className='text-sm text-sol-text-secondary'>
                      Total Rewards
                    </div>
                    <div className='text-3xl font-bold text-sol-primary mt-1'>
                      {formatSOL(results.rewards)}
                    </div>
                    <div className='text-xs text-sol-text-secondary mt-2'>
                      For selected time period
                    </div>
                  </Card>

                  <Card className='bg-sol-dark-lighter p-4 rounded-lg'>
                    <div className='text-sm text-sol-text-secondary'>
                      Final Balance
                    </div>
                    <div className='text-3xl font-bold mt-1'>
                      {formatSOL(results.endBalance)}
                    </div>
                    <div className='text-xs text-sol-text-secondary mt-2'>
                      Principal + rewards
                    </div>
                  </Card>
                </div>

                {/* Results Visualization */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h4 className='font-medium text-sm mb-3'>
                      Monthly Rewards Projection
                    </h4>
                    <div className='bg-sol-dark-lighter rounded-lg p-4 h-52 flex items-end justify-between'>
                      {results.monthlyRewards.map((reward, index) => {
                        const maxReward = Math.max(...results.monthlyRewards)
                        const height = (reward / maxReward) * 100
                        return (
                          <div
                            key={index}
                            className='flex flex-col items-center h-full'
                          >
                            <div
                              className='w-6 bg-gradient-to-t from-primary to-secondary rounded-t'
                              style={{ height: `${Math.max(height, 5)}%` }}
                            ></div>
                            <div className='text-xs mt-2'>{index + 1}</div>
                          </div>
                        )
                      })}
                    </div>
                    <div className='text-center text-xs text-sol-text-secondary mt-2'>
                      Month
                    </div>
                  </div>

                  <div>
                    <h4 className='font-medium text-sm mb-3'>
                      Additional Statistics
                    </h4>
                    <div className='space-y-4'>
                      <div>
                        <div className='flex items-center justify-between text-sm mb-1'>
                          <span className='text-sol-text-secondary'>
                            Return on Investment
                          </span>
                          <span className='font-medium text-sol-primary'>
                            {formatPercent(results.roi)}
                          </span>
                        </div>
                        <div className='w-full bg-sol-dark-lighter rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-sol-primary to-sol-secondary h-2 rounded-full'
                            style={{ width: `${Math.min(results.roi, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className='border border-gray-700 rounded-lg p-3'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <div className='text-xs text-sol-text-secondary'>
                              Annual Rewards
                            </div>
                            <div className='text-lg font-medium'>
                              {formatSOL(results.annualRewards)}
                            </div>
                          </div>
                          <div>
                            <div className='text-xs text-sol-text-secondary'>
                              Monthly Average
                            </div>
                            <div className='text-lg font-medium'>
                              {formatSOL(results.annualRewards / 12)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='border border-gray-700 rounded-lg p-3'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <div className='text-xs text-sol-text-secondary'>
                              Risk Assessment
                            </div>
                            <div className='text-lg font-medium capitalize'>
                              {risk.level} Risk
                            </div>
                          </div>
                          <Badge
                            className={`${risk.color} px-3 py-1 text-white`}
                          >
                            {risk.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className='mt-6 text-xs text-sol-text-secondary p-3 border border-gray-700 rounded-lg'>
                  <p className='mb-1'>
                    <strong>Disclaimer:</strong> This calculator provides
                    estimates only and does not constitute financial advice.
                  </p>
                  <p>
                    Actual returns may vary based on network conditions,
                    validator performance, and broader market factors. Always
                    conduct your own research before staking.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className='neo-card mt-6'>
            <div className='p-5'>
              <h3 className='text-lg font-medium mb-4'>
                Frequently Asked Questions
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-medium text-sol-primary mb-2'>
                    What is staking?
                  </h4>
                  <p className='text-sm text-sol-text-secondary'>
                    Staking is the process of participating in a proof-of-stake
                    (PoS) blockchain network by locking up your cryptocurrencies
                    to support network operations. In return, stakers earn
                    rewards derived from transaction fees and network emissions.
                  </p>
                </div>

                <div>
                  <h4 className='font-medium text-sol-primary mb-2'>
                    How does validator commission affect rewards?
                  </h4>
                  <p className='text-sm text-sol-text-secondary'>
                    Validators charge a commission fee on the rewards they
                    generate. A validator with a 10% commission will keep 10% of
                    all staking rewards, distributing the remaining 90% to
                    delegators based on their stake amount.
                  </p>
                </div>

                <div>
                  <h4 className='font-medium text-sol-primary mb-2'>
                    What is compounding and why does it matter?
                  </h4>
                  <p className='text-sm text-sol-text-secondary'>
                    Compounding refers to reinvesting your staking rewards to
                    generate additional returns. By reinvesting regularly, your
                    stake grows over time, which leads to increasingly larger
                    rewards and a higher effective yield.
                  </p>
                </div>

                <div>
                  <h4 className='font-medium text-sol-primary mb-2'>
                    How are staking rewards taxed?
                  </h4>
                  <p className='text-sm text-sol-text-secondary'>
                    Tax regulations vary by jurisdiction, but in many countries,
                    staking rewards are considered taxable income when received.
                    Additionally, when you sell staked assets, capital gains
                    taxes may apply. Consult a tax professional for advice
                    specific to your situation.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
