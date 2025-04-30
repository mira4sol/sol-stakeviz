import { Card } from '@/components/ui/card'
import { useValidators } from '@/hooks/useSolanaConnection'
import {
  formatPercent,
  formatPublicKey,
  formatShortSOL,
  getValidatorGradient,
  getValidatorInitials,
} from '@/lib/utils/format'
import { getValidatorPerformanceData } from '@/lib/utils/validators'
import { useState } from 'react'

export default function ValidatorPerformanceTable() {
  const { data: validators, isLoading } = useValidators()
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 4

  // Get top validators by performance
  const performanceData =
    validators && Array.isArray(validators) && validators.length > 0
      ? getValidatorPerformanceData(validators, 20)
      : []

  // Make sure we have data before paginating
  const paginatedData =
    performanceData && performanceData.length > 0
      ? performanceData.slice(
          currentPage * pageSize,
          (currentPage + 1) * pageSize
        )
      : []

  const totalPages = Math.ceil(performanceData.length / pageSize)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const handleExport = () => {
    // Implementation for exporting data
    alert('Export functionality would be implemented here')
  }

  return (
    <Card className='bg-sol-card hover:bg-sol-card-hover rounded-lg shadow col-span-2'>
      <div className='p-5'>
        <div className='flex items-center justify-between mb-5'>
          <h3 className='text-lg font-medium'>Top Validators by Performance</h3>
          <div className='flex'>
            <button
              className='text-sm text-sol-text-secondary hover:text-sol-text flex items-center'
              onClick={handleExport}
            >
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
                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                />
              </svg>
              Export
            </button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-700'>
            <thead>
              <tr>
                <th className='px-3 py-3 text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                  Validator
                </th>
                <th className='px-3 py-3 text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                  Stake
                </th>
                <th className='px-3 py-3 text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                  APY
                </th>
                <th className='px-3 py-3 text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                  Uptime
                </th>
                <th className='px-3 py-3 text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                  Skip Rate
                </th>
                <th className='px-3 py-3 text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                  Commission
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-700'>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-3 py-4 text-center text-sol-text'
                  >
                    Loading validators...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-3 py-4 text-center text-sol-text'
                  >
                    No validator data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((validator, index) => (
                  <tr
                    key={validator.pubkey}
                    className='hover:bg-sol-card-hover transition-colors'
                  >
                    <td className='px-3 py-3 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div
                          className={`h-7 w-7 rounded-md bg-gradient-to-r ${getValidatorGradient(
                            validator.pubkey
                          )} flex items-center justify-center text-white font-medium`}
                        >
                          {getValidatorInitials(
                            validator.name,
                            validator.pubkey
                          )}
                        </div>
                        <div className='ml-3'>
                          <div className='text-sm font-medium'>
                            {validator.name || 'Validator'}
                          </div>
                          <div className='text-xs text-sol-text-secondary font-mono truncate w-20'>
                            {formatPublicKey(validator.pubkey)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 whitespace-nowrap text-sm'>
                      {formatShortSOL(Number(validator.activatedStake || 0))}
                    </td>
                    <td className='px-3 py-3 whitespace-nowrap text-sm text-sol-secondary'>
                      {formatPercent(Number(validator.apy || 0))}
                    </td>
                    <td className='px-3 py-3 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-16 bg-gray-700 rounded-full h-2'>
                          <div
                            className='bg-secondary h-2 rounded-full'
                            style={{
                              width: `${Number(validator.uptime || 0)}%`,
                            }}
                          ></div>
                        </div>
                        <span className='ml-2 text-xs'>
                          {formatPercent(Number(validator.uptime || 0))}
                        </span>
                      </div>
                    </td>
                    <td className='px-3 py-3 whitespace-nowrap text-sm'>
                      {formatPercent(Number(validator.skipRate || 0), 2)}
                    </td>
                    <td className='px-3 py-3 whitespace-nowrap text-sm'>
                      {formatPercent(Number(validator.commission || 0))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className='mt-4 flex items-center justify-between px-3'>
            <div className='text-sm text-sol-text-secondary'>
              Showing{' '}
              <span className='font-medium text-sol-text'>
                {paginatedData.length}
              </span>{' '}
              of{' '}
              <span className='font-medium text-sol-text'>
                {performanceData.length}
              </span>{' '}
              validators
            </div>
            <div className='flex space-x-2'>
              <button
                className={`px-3 py-1 rounded border border-gray-700 ${
                  currentPage > 0
                    ? 'hover:bg-sol-card-hover text-sol-text-secondary'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <button
                className={`px-3 py-1 rounded border border-gray-700 ${
                  currentPage < totalPages - 1
                    ? 'hover:bg-sol-card-hover text-sol-text-secondary'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
