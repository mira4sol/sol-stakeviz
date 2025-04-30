import { Card } from '@/components/ui/card'
import { useNetworkInfo, useStakingStats } from '@/hooks/useSolanaConnection'
import { formatMillionSOL, formatPercent } from '@/lib/utils/format'
import Chart from 'chart.js/auto'
import { useEffect, useRef } from 'react'

export default function NetworkParticipationChart() {
  const { data: networkInfo, isLoading: isLoadingNetwork } = useNetworkInfo()
  const { data: stats, isLoading: isLoadingStats } = useStakingStats()
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!networkInfo || !stats || !chartRef.current) return

    // Calculate values
    const totalStaked = stats.totalStaked
    const circulatingUnstaked = networkInfo.circulatingSupply - totalStaked
    const nonCirculating = networkInfo.nonCirculating

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Staked SOL', 'Circulating (unstaked)', 'Non-circulating'],
        datasets: [
          {
            data: [totalStaked, circulatingUnstaked, nonCirculating],
            backgroundColor: ['#14F195', '#3F85F4', '#4A5568'],
            borderWidth: 0,
            borderRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#21273A',
            titleColor: '#E9ECEF',
            bodyColor: '#E9ECEF',
            borderColor: '#2D3748',
            borderWidth: 1,
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
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [networkInfo, stats])

  // Calculate staking ratio
  const stakingRatio =
    networkInfo && stats
      ? (stats.totalStaked / networkInfo.totalSupply) * 100
      : 72.3

  const isLoading = isLoadingNetwork || isLoadingStats

  return (
    <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg shadow'>
      <div className='p-5'>
        <h3 className='text-lg font-medium mb-4'>Network Participation</h3>
        <div className='flex items-center justify-center py-2'>
          <div className='h-56 w-56 relative'>
            {isLoading ? (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sol-primary'></div>
              </div>
            ) : (
              <>
                <canvas ref={chartRef} id='networkParticipationChart'></canvas>
                <div className='absolute inset-0 flex items-center justify-center flex-col'>
                  <span className='text-3xl font-bold'>
                    {formatPercent(stakingRatio)}
                  </span>
                  <span className='text-xs text-sol-text-secondary'>
                    Staking Ratio
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className='mt-4 space-y-3'>
          <div className='flex items-center'>
            <div className='h-3 w-3 rounded-full bg-secondary'></div>
            <span className='ml-2 text-sm'>
              Staked SOL:{' '}
              <span className='font-medium'>
                {isLoading
                  ? 'Loading...'
                  : formatMillionSOL(stats?.totalStaked || 0)}
              </span>
            </span>
          </div>
          <div className='flex items-center'>
            <div className='h-3 w-3 rounded-full bg-info'></div>
            <span className='ml-2 text-sm'>
              Circulating (unstaked):{' '}
              <span className='font-medium'>
                {isLoading
                  ? 'Loading...'
                  : formatMillionSOL(
                      (networkInfo?.circulatingSupply || 0) -
                        (stats?.totalStaked || 0)
                    )}
              </span>
            </span>
          </div>
          <div className='flex items-center'>
            <div className='h-3 w-3 rounded-full bg-gray-600'></div>
            <span className='ml-2 text-sm'>
              Non-circulating:{' '}
              <span className='font-medium'>
                {isLoading
                  ? 'Loading...'
                  : formatMillionSOL(networkInfo?.nonCirculating || 0)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
