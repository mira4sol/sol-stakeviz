'use client'

import Sidebar from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useNetworkInfo,
  useStakingHistory,
  useStakingStats,
  useValidators,
} from '@/hooks/useSolanaConnection'
import { formatMillionSOL, formatPercent } from '@/lib/utils/format'
import {
  calculateAPYDistribution,
  calculateStakeDistribution,
} from '@/lib/utils/validators'
import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

export default function Analytics() {
  const { data: networkInfo, isLoading: isLoadingNetwork } = useNetworkInfo()
  const { data: validators, isLoading: isLoadingValidators } = useValidators()
  const { data: history, isLoading: isLoadingHistory } = useStakingHistory()
  const { data: stats, isLoading: isLoadingStats } = useStakingStats()

  const [timeRange, setTimeRange] = useState('1M')
  const [distributionType, setDistributionType] = useState('stake')

  // Chart refs
  const historyChartRef = useRef<HTMLCanvasElement | null>(null)
  const historyChartInstance = useRef<Chart | null>(null)

  const distributionChartRef = useRef<HTMLCanvasElement | null>(null)
  const distributionChartInstance = useRef<Chart | null>(null)

  const apyChartRef = useRef<HTMLCanvasElement | null>(null)
  const apyChartInstance = useRef<Chart | null>(null)

  const participationChartRef = useRef<HTMLCanvasElement | null>(null)
  const participationChartInstance = useRef<Chart | null>(null)

  // Initialize history chart
  useEffect(() => {
    if (!history || !historyChartRef.current) return

    // Determine date range based on selected timeframe
    const now = new Date()
    const ranges = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
    }

    const days = ranges[timeRange as keyof typeof ranges]
    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Filter and prepare data
    const filteredHistory = history
      .filter((entry) => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Format dates for display
    const labels = filteredHistory.map((entry) => {
      const date = new Date(entry.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    })

    const totalStakedData = filteredHistory.map(
      (entry) => entry.totalStaked / 1000000
    )
    const avgApyData = filteredHistory.map((entry) => entry.avgApy || 0)

    // Clean up previous chart
    if (historyChartInstance.current) {
      historyChartInstance.current.destroy()
    }

    // Create new chart
    const ctx = historyChartRef.current.getContext('2d')
    if (!ctx) return

    historyChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Staked (M SOL)',
            data: totalStakedData,
            borderColor: 'rgba(120, 70, 255, 1)',
            backgroundColor: 'rgba(120, 70, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(120, 70, 255, 1)',
            pointRadius: 2,
            pointHoverRadius: 5,
            yAxisID: 'y',
          },
          {
            label: 'Average APY (%)',
            data: avgApyData,
            borderColor: 'rgba(50, 200, 150, 1)',
            backgroundColor: 'rgba(50, 200, 150, 0.1)',
            fill: false,
            tension: 0.4,
            pointBackgroundColor: 'rgba(50, 200, 150, 1)',
            pointRadius: 2,
            pointHoverRadius: 5,
            borderDash: [5, 5],
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'rgb(240, 240, 240)',
              font: {
                family: 'system-ui, -apple-system, sans-serif',
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 45, 0.8)',
            borderColor: 'rgba(120, 70, 255, 0.2)',
            borderWidth: 1,
            padding: 10,
            titleColor: 'rgb(240, 240, 240)',
            bodyColor: 'rgb(240, 240, 240)',
            titleFont: {
              family: 'system-ui, -apple-system, sans-serif',
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              family: 'system-ui, -apple-system, sans-serif',
              size: 13,
            },
            displayColors: true,
            boxPadding: 5,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: 'rgba(240, 240, 240, 0.7)',
              font: {
                family: 'system-ui, -apple-system, sans-serif',
                size: 11,
              },
            },
            title: {
              display: true,
              text: 'Total Staked (M SOL)',
              color: 'rgba(240, 240, 240, 0.7)',
              font: {
                family: 'system-ui, -apple-system, sans-serif',
                size: 12,
                weight: 'normal',
              },
            },
          },
          y1: {
            beginAtZero: false,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: 'rgba(240, 240, 240, 0.7)',
              font: {
                family: 'system-ui, -apple-system, sans-serif',
                size: 11,
              },
            },
            title: {
              display: true,
              text: 'APY (%)',
              color: 'rgba(240, 240, 240, 0.7)',
              font: {
                family: 'system-ui, -apple-system, sans-serif',
                size: 12,
                weight: 'normal',
              },
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: 'rgba(240, 240, 240, 0.7)',
              font: {
                family: 'system-ui, -apple-system, sans-serif',
                size: 11,
              },
            },
          },
        },
      },
    })

    return () => {
      if (historyChartInstance.current) {
        historyChartInstance.current.destroy()
      }
    }
  }, [history, timeRange])

  // Initialize distribution charts
  useEffect(() => {
    if (!validators || !distributionChartRef.current) return

    const distributionData = calculateStakeDistribution(validators)

    // Clean up previous chart
    if (distributionChartInstance.current) {
      distributionChartInstance.current.destroy()
    }

    // Create new chart
    const ctx = distributionChartRef.current.getContext('2d')
    if (!ctx) return

    // Create stake distribution chart
    if (distributionType === 'stake') {
      distributionChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: distributionData.labels.slice(0, 20),
          datasets: [
            {
              label: 'Stake Amount (M SOL)',
              data: distributionData.data.slice(0, 20),
              backgroundColor: 'rgba(120, 70, 255, 0.8)',
              borderColor: 'rgba(120, 70, 255, 1)',
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 45, 0.8)',
              borderColor: 'rgba(120, 70, 255, 0.2)',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                title: function (tooltipItems) {
                  // return `Validator ${tooltipItems[0].dataIndex + 1}`
                  return (
                    distributionData?.toolTips?.[tooltipItems[0].dataIndex] ||
                    ''
                  )
                },
                label: function (context) {
                  return `Stake: ${context.parsed.y.toFixed(2)}M SOL`
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: 'rgba(240, 240, 240, 0.7)',
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: 'rgba(240, 240, 240, 0.7)',
              },
            },
          },
        },
      })
    } else {
      // Create APY distribution chart
      const apyData = calculateAPYDistribution(validators)

      distributionChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: apyData.labels,
          datasets: [
            {
              label: 'Number of Validators',
              data: apyData.data,
              backgroundColor: [
                'rgba(50, 200, 150, 0.6)',
                'rgba(60, 190, 160, 0.6)',
                'rgba(70, 180, 170, 0.6)',
                'rgba(80, 170, 180, 0.6)',
                'rgba(90, 160, 190, 0.6)',
                'rgba(100, 150, 200, 0.6)',
                'rgba(110, 140, 210, 0.6)',
                'rgba(120, 130, 220, 0.6)',
                'rgba(130, 120, 230, 0.6)',
              ],
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.9,
              categoryPercentage: 0.9,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 45, 0.8)',
              borderColor: 'rgba(120, 70, 255, 0.2)',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                title: function (tooltipItems) {
                  return `APY Range: ${tooltipItems[0].label}`
                },
                label: function (context) {
                  return `${context.parsed.y} Validators`
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
              },
              ticks: {
                color: 'rgba(240, 240, 240, 0.7)',
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: 'rgba(240, 240, 240, 0.7)',
              },
            },
          },
        },
      })
    }

    return () => {
      if (distributionChartInstance.current) {
        distributionChartInstance.current.destroy()
      }
    }
  }, [validators, distributionType])

  // Initialize participation chart
  useEffect(() => {
    if (!networkInfo || !stats || !participationChartRef.current) return

    // Calculate values
    const totalStaked = stats.totalStaked
    const circulatingUnstaked = networkInfo.circulatingSupply - totalStaked
    const nonCirculating = networkInfo.nonCirculating

    // Clean up previous chart
    if (participationChartInstance.current) {
      participationChartInstance.current.destroy()
    }

    // Create new chart
    const ctx = participationChartRef.current.getContext('2d')
    if (!ctx) return

    participationChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Staked SOL', 'Circulating (unstaked)', 'Non-circulating'],
        datasets: [
          {
            data: [totalStaked, circulatingUnstaked, nonCirculating],
            backgroundColor: [
              'rgba(50, 200, 150, 0.8)',
              'rgba(120, 70, 255, 0.8)',
              'rgba(80, 80, 100, 0.8)',
            ],
            borderWidth: 2,
            borderColor: 'rgba(30, 30, 45, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgb(240, 240, 240)',
              padding: 15,
              font: {
                family: 'system-ui, -apple-system, sans-serif',
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 45, 0.8)',
            borderColor: 'rgba(120, 70, 255, 0.2)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce(
                  (acc: number, val: number) => acc + val,
                  0
                )
                const percentage = Math.round((context.parsed * 100) / total)
                return `${context.label}: ${context.parsed.toFixed(
                  1
                )}M SOL (${percentage}%)`
              },
            },
          },
        },
      },
    })

    return () => {
      if (participationChartInstance.current) {
        participationChartInstance.current.destroy()
      }
    }
  }, [networkInfo, stats])

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
                Analytics Dashboard
              </h1>
              <p className='mt-1 text-sm text-sol-text-secondary'>
                In-depth analysis of Solana&apos;s staking ecosystem
              </p>
            </div>
            <div className='mt-4 sm:mt-0 grid grid-cols-2 gap-2'>
              <Card className='neo-card p-3 flex items-center'>
                <div className='h-3 w-3 rounded-full bg-sol-secondary relative pulse-dot mr-2'></div>
                <div>
                  <div className='text-xs text-sol-text-secondary'>
                    Current Epoch
                  </div>
                  <div className='text-sm font-medium'>
                    {isLoadingNetwork ? '...' : networkInfo?.currentEpoch}
                  </div>
                </div>
              </Card>
              <Card className='neo-card p-3 flex items-center'>
                <div className='h-3 w-3 rounded-full bg-sol-info relative pulse-dot mr-2'></div>
                <div>
                  <div className='text-xs text-sol-text-secondary'>
                    Network Health
                  </div>
                  <div className='text-sm font-medium'>
                    {isLoadingStats
                      ? '...'
                      : formatPercent(stats?.networkHealth || 0)}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Staking History Chart */}
          <Card className='neo-card mb-6'>
            <div className='p-5'>
              <div className='flex items-center justify-between mb-5'>
                <h3 className='text-lg font-medium'>
                  Staking History Analysis
                </h3>
                <div className='flex space-x-1'>
                  <Button
                    variant={timeRange === '1M' ? 'default' : 'outline'}
                    size='sm'
                    className={
                      timeRange === '1M'
                        ? 'bg-sol-primary'
                        : 'bg-sol-dark-lighter border-gray-700'
                    }
                    onClick={() => setTimeRange('1M')}
                  >
                    1M
                  </Button>
                  <Button
                    variant={timeRange === '3M' ? 'default' : 'outline'}
                    size='sm'
                    className={
                      timeRange === '3M'
                        ? 'bg-sol-primary'
                        : 'bg-sol-dark-lighter border-gray-700'
                    }
                    onClick={() => setTimeRange('3M')}
                  >
                    3M
                  </Button>
                  <Button
                    variant={timeRange === '6M' ? 'default' : 'outline'}
                    size='sm'
                    className={
                      timeRange === '6M'
                        ? 'bg-sol-primary'
                        : 'bg-sol-dark-lighter border-gray-700'
                    }
                    onClick={() => setTimeRange('6M')}
                  >
                    6M
                  </Button>
                  <Button
                    variant={timeRange === '1Y' ? 'default' : 'outline'}
                    size='sm'
                    className={
                      timeRange === '1Y'
                        ? 'bg-sol-primary'
                        : 'bg-sol-dark-lighter border-gray-700'
                    }
                    onClick={() => setTimeRange('1Y')}
                  >
                    1Y
                  </Button>
                </div>
              </div>

              <div className='h-80 relative'>
                {isLoadingHistory ? (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sol-primary'></div>
                  </div>
                ) : (
                  <canvas ref={historyChartRef}></canvas>
                )}
              </div>

              <div className='mt-4 grid grid-cols-4 gap-4'>
                <div className='p-3 bg-sol-dark-lighter rounded-lg futuristic-border'>
                  <div className='text-xs text-sol-text-secondary'>
                    Current Staked
                  </div>
                  <div className='text-xl font-semibold mt-1'>
                    {isLoadingStats
                      ? '...'
                      : formatMillionSOL(stats?.totalStaked || 0)}
                  </div>
                </div>
                <div className='p-3 bg-sol-dark-lighter rounded-lg futuristic-border'>
                  <div className='text-xs text-sol-text-secondary'>
                    Staking Ratio
                  </div>
                  <div className='text-xl font-semibold mt-1'>
                    {isLoadingStats && isLoadingNetwork
                      ? '...'
                      : formatPercent(
                          ((stats?.totalStaked || 0) /
                            (networkInfo?.totalSupply || 1)) *
                            100
                        )}
                  </div>
                </div>
                <div className='p-3 bg-sol-dark-lighter rounded-lg futuristic-border'>
                  <div className='text-xs text-sol-text-secondary'>
                    Current APY
                  </div>
                  <div className='text-xl font-semibold mt-1 text-sol-secondary'>
                    {isLoadingStats ? '...' : formatPercent(stats?.avgApy || 0)}
                  </div>
                </div>
                <div className='p-3 bg-sol-dark-lighter rounded-lg futuristic-border'>
                  <div className='text-xs text-sol-text-secondary'>
                    Active Validators
                  </div>
                  <div className='text-xl font-semibold mt-1'>
                    {isLoadingStats
                      ? '...'
                      : stats?.activeValidators.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Distribution Charts Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
            <Card className='neo-card'>
              <div className='p-5'>
                <div className='flex items-center justify-between mb-5'>
                  <h3 className='text-lg font-medium'>Distribution Analysis</h3>
                  <Select
                    value={distributionType}
                    onValueChange={setDistributionType}
                  >
                    <SelectTrigger className='w-[140px] bg-sol-dark-lighter border-gray-700'>
                      <SelectValue placeholder='Distribution Type' />
                    </SelectTrigger>
                    <SelectContent className='bg-sol-card text-sol-text border border-gray-700'>
                      <SelectItem value='stake'>Stake Distribution</SelectItem>
                      <SelectItem value='apy'>APY Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='h-80 relative'>
                  {isLoadingValidators ? (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sol-primary'></div>
                    </div>
                  ) : (
                    <canvas ref={distributionChartRef}></canvas>
                  )}
                </div>

                <div className='mt-4 flex items-center justify-between text-sm'>
                  {distributionType === 'stake' ? (
                    <>
                      <div className='p-3 bg-sol-dark-lighter rounded-lg'>
                        <div className='text-xs text-sol-text-secondary'>
                          Top 20 Control
                        </div>
                        <div className='text-lg font-semibold mt-1'>
                          {isLoadingValidators
                            ? '...'
                            : formatPercent(
                                calculateStakeDistribution(validators || [])
                                  .top20Percentage
                              )}
                        </div>
                      </div>
                      <div className='p-3 bg-sol-dark-lighter rounded-lg'>
                        <div className='text-xs text-sol-text-secondary'>
                          Nakamoto Coefficient
                        </div>
                        <div className='text-lg font-semibold mt-1'>42</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='p-3 bg-sol-dark-lighter rounded-lg'>
                        <div className='text-xs text-sol-text-secondary'>
                          Average APY
                        </div>
                        <div className='text-lg font-semibold mt-1 text-sol-secondary'>
                          {isLoadingValidators
                            ? '...'
                            : formatPercent(
                                calculateAPYDistribution(validators || [])
                                  .avgApy
                              )}
                        </div>
                      </div>
                      <div className='p-3 bg-sol-dark-lighter rounded-lg'>
                        <div className='text-xs text-sol-text-secondary'>
                          APY Range
                        </div>
                        <div className='text-lg font-semibold mt-1'>
                          {isLoadingValidators
                            ? '...'
                            : `${formatPercent(
                                calculateAPYDistribution(validators || [])
                                  .minMaxRange.min
                              )} - 
                             ${formatPercent(
                               calculateAPYDistribution(validators || [])
                                 .minMaxRange.max
                             )}`}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <Card className='neo-card'>
              <div className='p-5'>
                <h3 className='text-lg font-medium mb-5'>
                  Network Participation
                </h3>

                <div className='h-80 relative'>
                  {isLoadingNetwork || isLoadingStats ? (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sol-primary'></div>
                    </div>
                  ) : (
                    <canvas ref={participationChartRef}></canvas>
                  )}
                </div>

                <div className='mt-4 grid grid-cols-3 gap-3'>
                  <div className='p-2 rounded-lg bg-sol-dark-lighter'>
                    <div className='flex items-center'>
                      <div className='h-3 w-3 rounded-full bg-sol-secondary mr-2'></div>
                      <span className='text-xs'>Staked</span>
                    </div>
                    <div className='mt-1 text-sm font-medium'>
                      {isLoadingStats
                        ? '...'
                        : formatMillionSOL(stats?.totalStaked || 0)}
                    </div>
                  </div>
                  <div className='p-2 rounded-lg bg-sol-dark-lighter'>
                    <div className='flex items-center'>
                      <div className='h-3 w-3 rounded-full bg-sol-primary mr-2'></div>
                      <span className='text-xs'>Unstaked</span>
                    </div>
                    <div className='mt-1 text-sm font-medium'>
                      {isLoadingStats && isLoadingNetwork
                        ? '...'
                        : formatMillionSOL(
                            (networkInfo?.circulatingSupply || 0) -
                              (stats?.totalStaked || 0)
                          )}
                    </div>
                  </div>
                  <div className='p-2 rounded-lg bg-sol-dark-lighter'>
                    <div className='flex items-center'>
                      <div className='h-3 w-3 rounded-full bg-gray-600 mr-2'></div>
                      <span className='text-xs'>Non-circ.</span>
                    </div>
                    <div className='mt-1 text-sm font-medium'>
                      {isLoadingNetwork
                        ? '...'
                        : formatMillionSOL(networkInfo?.nonCirculating || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Metrics Section */}
          <Card className='neo-card mb-6'>
            <div className='p-5'>
              <h3 className='text-lg font-medium mb-5'>
                Network Health Indicators
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-1'>
                      <span className='text-sol-text-secondary'>
                        Validator Diversity
                      </span>
                      <span className='font-medium'>
                        {isLoadingValidators ? '...' : formatPercent(85.4)}
                      </span>
                    </div>
                    <div className='w-full bg-sol-dark-lighter rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-sol-primary to-sol-secondary h-2 rounded-full'
                        style={{ width: '85.4%' }}
                      ></div>
                    </div>
                    <div className='mt-1 text-xs text-sol-text-secondary'>
                      Higher is better - indicates stake distribution equity
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between text-sm mb-1'>
                      <span className='text-sol-text-secondary'>
                        Voting Performance
                      </span>
                      <span className='font-medium'>
                        {isLoadingValidators ? '...' : formatPercent(99.7)}
                      </span>
                    </div>
                    <div className='w-full bg-sol-dark-lighter rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-sol-primary to-sol-secondary h-2 rounded-full'
                        style={{ width: '99.7%' }}
                      ></div>
                    </div>
                    <div className='mt-1 text-xs text-sol-text-secondary'>
                      Percentage of successful votes in the network
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between text-sm mb-1'>
                      <span className='text-sol-text-secondary'>
                        Delinquency Rate
                      </span>
                      <span className='font-medium'>
                        {isLoadingValidators ? '...' : formatPercent(1.3)}
                      </span>
                    </div>
                    <div className='w-full bg-sol-dark-lighter rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-sol-warning to-red-500 h-2 rounded-full'
                        style={{ width: '1.3%' }}
                      ></div>
                    </div>
                    <div className='mt-1 text-xs text-sol-text-secondary'>
                      Lower is better - percentage of delinquent validators
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm mb-1'>
                      <span className='text-sol-text-secondary'>
                        Staking Participation
                      </span>
                      <span className='font-medium'>
                        {isLoadingStats && isLoadingNetwork
                          ? '...'
                          : formatPercent(
                              ((stats?.totalStaked || 0) /
                                (networkInfo?.circulatingSupply || 1)) *
                                100
                            )}
                      </span>
                    </div>
                    <div className='w-full bg-sol-dark-lighter rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-sol-primary to-sol-secondary h-2 rounded-full'
                        style={{
                          width: `${
                            ((stats?.totalStaked || 0) /
                              (networkInfo?.circulatingSupply || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className='mt-1 text-xs text-sol-text-secondary'>
                      Percentage of circulating supply being staked
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between text-sm mb-1'>
                      <span className='text-sol-text-secondary'>
                        Uptime Average
                      </span>
                      <span className='font-medium'>
                        {isLoadingValidators ? '...' : formatPercent(99.8)}
                      </span>
                    </div>
                    <div className='w-full bg-sol-dark-lighter rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-sol-primary to-sol-secondary h-2 rounded-full'
                        style={{ width: '99.8%' }}
                      ></div>
                    </div>
                    <div className='mt-1 text-xs text-sol-text-secondary'>
                      Average validator uptime across the network
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between text-sm mb-1'>
                      <span className='text-sol-text-secondary'>
                        Commission Fairness
                      </span>
                      <span className='font-medium'>
                        {isLoadingValidators ? '...' : formatPercent(92.5)}
                      </span>
                    </div>
                    <div className='w-full bg-sol-dark-lighter rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-sol-primary to-sol-secondary h-2 rounded-full'
                        style={{ width: '92.5%' }}
                      ></div>
                    </div>
                    <div className='mt-1 text-xs text-sol-text-secondary'>
                      Measures commission consistency across validators
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Bottom Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
            <Card className='neo-card p-4'>
              <div className='flex items-center'>
                <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-sol-primary to-sol-info flex items-center justify-center text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <div className='text-sm text-sol-text-secondary'>
                    Consensus Health
                  </div>
                  <div className='text-2xl font-bold'>
                    {formatPercent(99.8)}
                  </div>
                  <div className='text-xs text-sol-secondary flex items-center mt-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3 mr-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 10l7-7m0 0l7 7m-7-7v18'
                      />
                    </svg>
                    <span>+0.1% from last week</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className='neo-card p-4'>
              <div className='flex items-center'>
                <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-sol-secondary to-teal-400 flex items-center justify-center text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <div className='text-sm text-sol-text-secondary'>
                    Epoch Progress
                  </div>
                  <div className='text-2xl font-bold'>
                    {isLoadingNetwork
                      ? '...'
                      : formatPercent(networkInfo?.epochProgress || 0)}
                  </div>
                  <div className='text-xs text-sol-text-secondary flex items-center mt-1'>
                    Current epoch completion
                  </div>
                </div>
              </div>
            </Card>

            <Card className='neo-card p-4'>
              <div className='flex items-center'>
                <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-sol-warning to-orange-500 flex items-center justify-center text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <div className='text-sm text-sol-text-secondary'>
                    Average Block Time
                  </div>
                  <div className='text-2xl font-bold'>400ms</div>
                  <div className='text-xs text-sol-warning flex items-center mt-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3 mr-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 14l-7 7m0 0l-7-7m7 7V3'
                      />
                    </svg>
                    <span>+20ms from last month</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className='neo-card p-4'>
              <div className='flex items-center'>
                <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <div className='text-sm text-sol-text-secondary'>
                    Security Score
                  </div>
                  <div className='text-2xl font-bold'>
                    {formatPercent(96.3)}
                  </div>
                  <div className='text-xs text-sol-secondary flex items-center mt-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3 mr-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 10l7-7m0 0l7 7m-7-7v18'
                      />
                    </svg>
                    <span>+2.1% from last quarter</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
