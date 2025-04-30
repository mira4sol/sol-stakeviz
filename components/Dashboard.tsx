'use client'

import APYDistributionChart from '@/components/dashboard/APYDistributionChart'
import NetworkParticipationChart from '@/components/dashboard/NetworkParticipationChart'
import NetworkStatsCards from '@/components/dashboard/NetworkStatsCards'
import StakeDistributionChart from '@/components/dashboard/StakeDistributionChart'
import StakingCalculator from '@/components/dashboard/StakingCalculator'
import StakingTrendChart from '@/components/dashboard/StakingTrendChart'
import ValidatorPerformanceTable from '@/components/dashboard/ValidatorPerformanceTable'
import ValidatorStatsCard from '@/components/dashboard/ValidatorStatsCard'
import Sidebar from '@/components/layout/Sidebar'
import { useNetworkInfo, useValidators } from '@/hooks/useSolanaConnection'
import { formatDuration } from '@/lib/utils/format'

export function Dashboard() {
  const {
    data: networkInfo,
    isLoading: isLoadingNetwork,
    refetch: refetchNetwork,
  } = useNetworkInfo()
  const {
    data: validators,
    isLoading: isLoadingValidators,
    refetch: refetchValidators,
  } = useValidators()

  const handleRefresh = () => {
    refetchNetwork()
    refetchValidators()
  }

  return (
    <div className='flex h-screen overflow-hidden bg-sol-dark'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Top Navigation Bar */}
        {/* <Navbar /> */}

        {/* Main Dashboard Content */}
        <main className='flex-1 overflow-y-auto bg-sol-dark p-4 sm:p-6 lg:p-8'>
          {/* Dashboard Header */}
          <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-2xl font-semibold'>
                Solana Staking Overview
              </h1>
              <p className='mt-1 text-sm text-sol-text-secondary'>
                Last updated:{' '}
                {new Date().toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
              </p>
            </div>
            <div className='mt-4 sm:mt-0 flex space-x-3'>
              <div className='flex items-center text-sm space-x-2'>
                <div className='flex items-center'>
                  <div className='h-3 w-3 rounded-full bg-sol-secondary'></div>
                  <span className='ml-1.5'>
                    Epoch {isLoadingNetwork ? '...' : networkInfo?.currentEpoch}
                  </span>
                </div>
                <div className='flex items-center'>
                  <span className='text-sm text-sol-text-secondary'>
                    Next epoch in:
                  </span>
                  <span className='ml-1.5 font-mono text-sol-primary'>
                    {isLoadingNetwork
                      ? '...'
                      : formatDuration(
                          networkInfo?.timeToNextEpoch.days || 0,
                          networkInfo?.timeToNextEpoch.hours || 0,
                          networkInfo?.timeToNextEpoch.minutes || 0
                        )}
                  </span>
                </div>
              </div>
              <button
                className='px-3 py-2 text-sm font-medium rounded-md bg-sol-card hover:bg-sol-card-hover text-sol-text inline-flex items-center'
                onClick={handleRefresh}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1.5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' />
                  <path d='M21 3v5h-5' />
                  <path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' />
                  <path d='M3 21v-5h5' />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Network Stats Cards */}
          <NetworkStatsCards />

          {/* Charts Section */}
          <div className='mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2'>
            <StakeDistributionChart />
            <StakingTrendChart />
          </div>

          {/* Performance Metrics Section */}
          <div className='mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3'>
            <ValidatorPerformanceTable />
            <APYDistributionChart />
          </div>

          {/* Staking Insights Section */}
          <div className='mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3'>
            <NetworkParticipationChart />
            <ValidatorStatsCard />
            <StakingCalculator />
          </div>
        </main>
      </div>
    </div>
  )
}
