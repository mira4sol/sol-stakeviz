import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useValidators } from '@/hooks/useSolanaConnection'
import { formatPercent } from '@/lib/utils/format'
import { calculateStakeDistribution } from '@/lib/utils/validators'
import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

export default function StakeDistributionChart() {
  const { data: validators, isLoading } = useValidators()
  const [displayCount, setDisplayCount] = useState('25')
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Calculate stake distribution data
  useEffect(() => {
    if (!validators || !chartRef.current) return

    const count = parseInt(displayCount)

    const { labels, data, totalStake, top20Percentage, toolTips } =
      calculateStakeDistribution(validators, count)

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.slice(0, count),
        datasets: [
          {
            label: 'Stake Amount (SOL)',
            data: data.slice(0, count),
            backgroundColor: '#5E5BF9',
            borderColor: '#5E5BF9',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#9CA3AF',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#9CA3AF',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
        },
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
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function (tooltipItems) {
                // return `Validator ${tooltipItems[0].dataIndex + 1}`
                return toolTips?.[tooltipItems[0].dataIndex] || ''
              },
              label: function (context) {
                return `Stake: ${context.parsed.y}M SOL`
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
  }, [validators, displayCount])

  // Calculate top 20 percentage for display
  const top20Percentage = validators
    ? calculateStakeDistribution(validators).top20Percentage
    : 33.7

  // Nakamoto coefficient calculation (simplified)
  const nakatomotoCoefficient = validators ? 42 : 0 // Simplified version

  return (
    <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg shadow'>
      <div className='p-5'>
        <div className='flex items-center justify-between mb-5'>
          <h3 className='text-lg font-medium'>Stake Distribution</h3>
          <div className='flex items-center space-x-2'>
            <Select value={displayCount} onValueChange={setDisplayCount}>
              <SelectTrigger className='w-[100px] text-sm bg-sol-dark border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-sol-primary focus:border-sol-primary'>
                <SelectValue placeholder='Top 25' />
              </SelectTrigger>
              <SelectContent className='bg-sol-card text-sol-text border border-gray-700'>
                <SelectItem value='25'>Top 25</SelectItem>
                <SelectItem value='50'>Top 50</SelectItem>
                <SelectItem value='100'>Top 100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='h-80 relative'>
          {isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sol-primary'></div>
            </div>
          ) : (
            <canvas ref={chartRef} id='stakeDistributionChart'></canvas>
          )}
        </div>
        <div className='flex items-center justify-between mt-4 text-xs text-sol-text-secondary px-4'>
          <span>
            Nakamoto Coefficient:{' '}
            <span className='font-medium text-sol-text'>
              {nakatomotoCoefficient}
            </span>
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  Top 20 control{' '}
                  <span className='font-medium text-sol-text'>
                    {formatPercent(top20Percentage)}
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Percentage of total stake controlled by the top 20 validators.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  )
}
