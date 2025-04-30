import { Card } from '@/components/ui/card'
import { useStakingHistory } from '@/hooks/useSolanaConnection'
import { formatShortSOL } from '@/lib/utils/format'
import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

export default function StakingTrendChart() {
  const { data: history, isLoading } = useStakingHistory()
  const [timeRange, setTimeRange] = useState('1M')
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Format and filter history data based on time range
  useEffect(() => {
    if (!history || !chartRef.current) return

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

    console.log('history', history)

    // Filter and prepare data
    const filteredHistory = history
      .filter((entry) => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Prepare chart data
    const labels = filteredHistory.map((entry) => {
      const date = new Date(entry.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    })

    const totalStakedData = filteredHistory.map(
      // (entry) => entry.totalStaked / 1000000
      (entry) => entry.totalStaked
    )
    const activeValidatorsData = filteredHistory.map(
      (entry) => entry.activeValidators
    )

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Staked SOL',
            data: totalStakedData,
            borderColor: '#5E5BF9',
            backgroundColor: 'rgba(94, 91, 249, 0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#5E5BF9',
            pointRadius: 2,
            pointHoverRadius: 4,
          },
          {
            label: 'Active Validators',
            data: activeValidatorsData,
            borderColor: '#14F195',
            backgroundColor: 'rgba(20, 241, 149, 0.1)',
            fill: false,
            tension: 0.3,
            pointBackgroundColor: '#14F195',
            pointRadius: 2,
            pointHoverRadius: 4,
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
        // stacked: false,
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#9CA3AF',
              callback: (value) => formatShortSOL(value), // or 1, as you prefer
            },
            title: {
              display: true,
              text: 'Total Staked SOL (Millions)',
              color: '#9CA3AF',
            },
          },
          y1: {
            beginAtZero: false,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#9CA3AF',
            },
            title: {
              display: true,
              text: 'Active Validators',
              color: '#9CA3AF',
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#9CA3AF',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#E9ECEF',
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: '#21273A',
            titleColor: '#E9ECEF',
            bodyColor: '#E9ECEF',
            borderColor: '#2D3748',
            borderWidth: 1,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [history, timeRange])

  // Mock data for initial render if needed
  const mockData = !history || history.length === 0

  return (
    <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg shadow'>
      <div className='p-5'>
        <div className='flex items-center justify-between mb-5'>
          <h3 className='text-lg font-medium'>Staking Trends</h3>
          <div className='flex items-center space-x-2'>
            <button
              className={`text-xs px-2 py-1 rounded ${
                timeRange === '1M'
                  ? 'text-sol-primary border border-sol-primary bg-sol-primary bg-opacity-10'
                  : 'text-sol-text-secondary hover:text-sol-text'
              }`}
              onClick={() => setTimeRange('1M')}
            >
              1M
            </button>
            <button
              className={`text-xs px-2 py-1 rounded ${
                timeRange === '3M'
                  ? 'text-sol-primary border border-sol-primary bg-sol-primary bg-opacity-10'
                  : 'text-sol-text-secondary hover:text-sol-text'
              }`}
              onClick={() => setTimeRange('3M')}
            >
              3M
            </button>
            <button
              className={`text-xs px-2 py-1 rounded ${
                timeRange === '6M'
                  ? 'text-sol-primary border border-sol-primary bg-sol-primary bg-opacity-10'
                  : 'text-sol-text-secondary hover:text-sol-text'
              }`}
              onClick={() => setTimeRange('6M')}
            >
              6M
            </button>
            <button
              className={`text-xs px-2 py-1 rounded ${
                timeRange === '1Y'
                  ? 'text-sol-primary border border-sol-primary bg-sol-primary bg-opacity-10'
                  : 'text-sol-text-secondary hover:text-sol-text'
              }`}
              onClick={() => setTimeRange('1Y')}
            >
              1Y
            </button>
          </div>
        </div>
        <div className='h-80 relative'>
          {isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sol-primary'></div>
            </div>
          ) : (
            <canvas ref={chartRef} id='stakingTrendChart'></canvas>
          )}
        </div>
      </div>
    </Card>
  )
}
