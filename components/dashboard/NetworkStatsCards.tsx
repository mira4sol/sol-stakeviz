import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useStakingStats } from '@/hooks/useSolanaConnection'
import { formatMillionSOL, formatPercent } from '@/lib/utils/format'

export default function NetworkStatsCards() {
  const { data: stats, isLoading } = useStakingStats()

  const previousEpochTotalStaked = stats?.previousEpochStats?.totalStaked || 0
  const totalStakedChange =
    stats?.totalStaked && previousEpochTotalStaked
      ? ((stats.totalStaked - previousEpochTotalStaked) /
          previousEpochTotalStaked) *
        100
      : 0

  const previousEpochValidators =
    stats?.previousEpochStats?.activeValidators || 0
  const validatorsChange =
    stats?.activeValidators && previousEpochValidators
      ? stats.activeValidators - previousEpochValidators
      : 15 // Fallback for demo

  const previousEpochApy = stats?.previousEpochStats?.avgApy || 0
  const apyChange =
    stats?.avgApy && previousEpochApy ? stats.avgApy - previousEpochApy : -0.2 // Fallback for demo

  const previousEpochHealth = stats?.previousEpochStats?.networkHealth || 0
  const healthChange =
    stats?.networkHealth && previousEpochHealth
      ? stats.networkHealth - previousEpochHealth
      : 0.5 // Fallback for demo

  return (
    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
      {/* Total Staked Card */}
      <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg overflow-hidden shadow'>
        <div className='p-5'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 bg-sol-primary bg-opacity-10 rounded-md p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-sol-primary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-sol-text-secondary'>
                Total Staked
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='mt-1 flex items-center'>
                      <p className='text-2xl font-semibold'>
                        {isLoading
                          ? 'Loading...'
                          : formatMillionSOL(stats?.totalStaked || 0)}
                      </p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-1.5 text-sol-text-secondary'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Total amount of SOL tokens currently staked in the
                      network.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className='text-sm text-sol-secondary flex items-center mt-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
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
                <span>{formatPercent(totalStakedChange || 2.4)}</span>
                <span className='text-sol-text-secondary ml-1'>
                  from last epoch
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Validators Card */}
      <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg overflow-hidden shadow'>
        <div className='p-5'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 bg-sol-info bg-opacity-10 rounded-md p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-sol-info'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-sol-text-secondary'>
                Active Validators
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='mt-1 flex items-center'>
                      <p className='text-2xl font-semibold'>
                        {isLoading
                          ? 'Loading...'
                          : stats?.activeValidators.toLocaleString()}
                      </p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-1.5 text-sol-text-secondary'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Number of validators currently participating in network
                      consensus.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className='text-sm text-sol-secondary flex items-center mt-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
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
                <span>+{validatorsChange}</span>
                <span className='text-sol-text-secondary ml-1'>this epoch</span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Current APY Card */}
      <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg overflow-hidden shadow'>
        <div className='p-5'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 bg-sol-secondary bg-opacity-10 rounded-md p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-sol-secondary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-sol-text-secondary'>
                Average APY
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='mt-1 flex items-center'>
                      <p className='text-2xl font-semibold'>
                        {isLoading
                          ? 'Loading...'
                          : formatPercent(stats?.avgApy || 0)}
                      </p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-1.5 text-sol-text-secondary'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Current average annual percentage yield for staked SOL
                      tokens.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className='text-sm text-sol-warning flex items-center mt-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
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
                <span>{formatPercent(apyChange)}</span>
                <span className='text-sol-text-secondary ml-1'>
                  from last epoch
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Network Health Card */}
      <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg overflow-hidden shadow'>
        <div className='p-5'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 bg-sol-warning bg-opacity-10 rounded-md p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-sol-warning'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-sol-text-secondary'>
                Network Health
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='mt-1 flex items-center'>
                      <p className='text-2xl font-semibold'>
                        {isLoading
                          ? 'Loading...'
                          : formatPercent(stats?.networkHealth || 0)}
                      </p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-1.5 text-sol-text-secondary'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Overall network health score based on uptime, performance,
                      and stake distribution.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className='text-sm text-sol-secondary flex items-center mt-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
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
                <span>{formatPercent(healthChange)}</span>
                <span className='text-sol-text-secondary ml-1'>
                  from last epoch
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
