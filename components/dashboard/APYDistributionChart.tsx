import { Card } from '@/components/ui/card'
import { useValidators } from '@/hooks/useSolanaConnection'
import { formatPercent } from '@/lib/utils/format'
import { calculateAPYDistribution } from '@/lib/utils/validators'
import Chart from 'chart.js/auto'
import { useEffect, useRef } from 'react'

export default function APYDistributionChart() {
  const { data: validators, isLoading } = useValidators()
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!validators || !chartRef.current) return

    const { labels, data, avgApy, minMaxRange } =
      calculateAPYDistribution(validators)

    // Destroy previous chart
    if (chartInstance.current) {
      // chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Generate gradient colors for bars
    const gradientColors = [
      '#3F85F4',
      '#4682F3',
      '#4E7FF2',
      '#567CF1',
      '#5E78F0',
      '#6675EF',
      '#6E72EE',
      '#766FED',
      '#7E6CEC',
      '#8669EB',
    ]

    if (!chartInstance.current)
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Number of Validators',
              data,
              backgroundColor: gradientColors,
              borderColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 0,
              borderRadius: 4,
              barPercentage: 0.9,
              categoryPercentage: 0.9,
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
              title: {
                display: true,
                text: 'Validator Count',
                color: '#9CA3AF',
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#9CA3AF',
              },
              title: {
                display: true,
                text: 'APY Range',
                color: '#9CA3AF',
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
        },
      })

    return () => {
      if (chartInstance.current) {
        // chartInstance.current.destroy()
      }
    }
  }, [validators])

  // Get APY distribution data for display
  const apyData = validators
    ? calculateAPYDistribution(validators)
    : { avgApy: 7.3, minMaxRange: { min: 6.7, max: 8.1 } }

  return (
    <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg shadow'>
      <div className='p-5'>
        <div className='flex items-center justify-between mb-5'>
          <h3 className='text-lg font-medium'>APY Distribution</h3>
        </div>
        <div className='h-80 relative'>
          {isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            </div>
          ) : (
            <canvas ref={chartRef} id='apyDistributionChart'></canvas>
          )}
        </div>
        <div className='mt-2'>
          <div className='flex items-center justify-between text-sm'>
            <div className='text-text-secondary'>Average APY</div>
            <div className='font-medium'>{formatPercent(apyData.avgApy)}</div>
          </div>
          <div className='flex items-center justify-between text-sm mt-1'>
            <div className='text-text-secondary'>Min-Max Range</div>
            <div className='font-medium'>
              {formatPercent(apyData.minMaxRange.min)} -{' '}
              {formatPercent(apyData.minMaxRange.max)}
            </div>
          </div>
          <div className='mt-3 space-y-2'>
            <div className='relative pt-1'>
              <div className='flex items-center justify-between text-xs'>
                <div>6.0%</div>
                <div>9.0%</div>
              </div>
              <div className='overflow-hidden h-1 mt-1 text-xs flex rounded bg-gray-700'>
                <div
                  className='bg-secondary h-full rounded-r-none'
                  style={{ width: '25%' }}
                ></div>
                <div
                  className='bg-primary h-full'
                  style={{ width: '50%' }}
                ></div>
                <div
                  className='bg-info h-full rounded-l-none'
                  style={{ width: '25%' }}
                ></div>
              </div>
              <div className='flex items-center justify-between text-xs mt-1 text-text-secondary'>
                <div>Low</div>
                <div>Average</div>
                <div>High</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
