import { Card } from '@/components/ui/card'
import { useValidators } from '@/hooks/useSolanaConnection'
import { formatPercent } from '@/lib/utils/format'

export default function ValidatorStatsCard() {
  const { data: validators, isLoading } = useValidators()

  // Calculate statistics
  const stats = !validators
    ? null
    : {
        totalValidators: validators?.length || 0,
        activeValidators: validators?.filter((v) => !v.delinquent)?.length || 0,
        delinquentValidators:
          validators?.filter((v) => v.delinquent).length || 0,

        // Average commission
        avgCommission:
          (validators?.reduce((sum, v) => sum + Number(v.commission), 0) || 0) /
          validators.length,

        // Vote success rate (opposite of skip rate)
        avgVoteSuccess:
          100 -
          (validators?.reduce((sum, v) => sum + Number(v.skipRate || 0), 0) ||
            0) /
            validators.length,
      }

  return (
    <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg shadow'>
      <div className='p-5'>
        <h3 className='text-lg font-medium mb-4'>Validator Stats</h3>
        <div className='space-y-5'>
          {/* Active Validators */}
          <div>
            <div className='flex items-center justify-between text-sm mb-1'>
              <span className='text-sol-text-secondary'>Active Validators</span>
              <span className='font-medium'>
                {isLoading
                  ? 'Loading...'
                  : stats?.activeValidators.toLocaleString() || ''}
              </span>
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5'>
              <div
                className='bg-primary h-1.5 rounded-full'
                style={{
                  width: stats
                    ? `${
                        (stats.activeValidators / stats.totalValidators) * 100
                      }%`
                    : '87%',
                }}
              ></div>
            </div>
            <div className='flex justify-between text-xs mt-1'>
              <span className='text-sol-text-secondary'>
                of {isLoading ? '...' : stats?.totalValidators.toLocaleString()}{' '}
                total
              </span>
              <span className='text-sol-primary'>
                {isLoading
                  ? '...'
                  : formatPercent(
                      ((stats?.activeValidators || 0) /
                        (stats?.totalValidators || 1)) *
                        100,
                      0
                    )}
              </span>
            </div>
          </div>

          {/* Delinquent Validators */}
          <div>
            <div className='flex items-center justify-between text-sm mb-1'>
              <span className='text-sol-text-secondary'>
                Delinquent Validators
              </span>
              <span className='font-medium'>
                {isLoading
                  ? 'Loading...'
                  : stats?.delinquentValidators.toLocaleString()}
              </span>
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5'>
              <div
                className='bg-warning h-1.5 rounded-full'
                style={{
                  width: stats
                    ? `${
                        (stats.delinquentValidators / stats.activeValidators) *
                        100
                      }%`
                    : '2.8%',
                }}
              ></div>
            </div>
            <div className='flex justify-between text-xs mt-1'>
              <span className='text-sol-text-secondary'>
                of{' '}
                {isLoading ? '...' : stats?.activeValidators.toLocaleString()}{' '}
                active
              </span>
              <span className='text-sol-warning'>
                {isLoading
                  ? '...'
                  : formatPercent(
                      ((stats?.delinquentValidators || 0) /
                        (stats?.activeValidators || 1)) *
                        100,
                      1
                    )}
              </span>
            </div>
          </div>

          {/* Avg Commission */}
          <div>
            <div className='flex items-center justify-between text-sm mb-1'>
              <span className='text-sol-text-secondary'>Avg Commission</span>
              <span className='font-medium'>
                {isLoading
                  ? 'Loading...'
                  : formatPercent(stats?.avgCommission || 0, 1)}
              </span>
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5'>
              <div
                className='bg-info h-1.5 rounded-full'
                style={{
                  width: stats ? `${(stats.avgCommission / 10) * 100}%` : '72%',
                }}
              ></div>
            </div>
            <div className='flex justify-between text-xs mt-1'>
              <span className='text-sol-text-secondary'>Range: 0% - 10%</span>
              <span className='text-sol-info'>
                {isLoading
                  ? '...'
                  : formatPercent(stats?.avgCommission || 0, 1)}
              </span>
            </div>
          </div>

          {/* Vote Success Rate */}
          <div>
            <div className='flex items-center justify-between text-sm mb-1'>
              <span className='text-sol-text-secondary'>Vote Success Rate</span>
              <span className='font-medium'>
                {isLoading
                  ? 'Loading...'
                  : formatPercent(stats?.avgVoteSuccess || 0, 1)}
              </span>
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5'>
              <div
                className='bg-secondary h-1.5 rounded-full'
                style={{ width: `${stats?.avgVoteSuccess || 99.7}%` }}
              ></div>
            </div>
            <div className='flex justify-between text-xs mt-1'>
              <span className='text-sol-text-secondary'>
                Network-wide average
              </span>
              <span className='text-sol-secondary'>
                {isLoading
                  ? '...'
                  : formatPercent(stats?.avgVoteSuccess || 0, 1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
