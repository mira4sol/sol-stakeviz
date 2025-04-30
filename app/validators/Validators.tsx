'use client'

import Sidebar from '@/components/layout/Sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useValidators } from '@/hooks/useSolanaConnection'
import {
  formatMillionSOL,
  formatPercent,
  formatPublicKey,
  getValidatorGradient,
  getValidatorInitials,
} from '@/lib/utils/format'
import { filterValidators, sortValidators } from '@/lib/utils/validators'
import React, { useState } from 'react'

export default function Validators() {
  const { data: validators, isLoading, refetch } = useValidators()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<
    'stake' | 'apy' | 'uptime' | 'commission' | 'skipRate'
  >('stake')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  // Filter and sort validators
  const filteredValidators = validators
    ? filterValidators(validators, searchQuery)
    : []

  // Apply additional filters based on active tab
  const activeValidators = filteredValidators.filter((v) => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return !v.delinquent
    if (activeTab === 'delinquent') return v.delinquent
    if (activeTab === 'high-apy')
      return parseFloat(v.apy?.toString() || '0') > 7.0
    if (activeTab === 'low-commission')
      return parseFloat(v.commission?.toString() || '0') < 5.0
    return true
  })

  // Sort validators
  const sortedValidators = sortValidators(
    activeValidators,
    sortBy,
    sortOrder === 'asc'
  )

  console.log('sortedValidators', sortedValidators)

  // Paginate
  const paginatedValidators = sortedValidators.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const totalPages = Math.ceil(sortedValidators.length / pageSize)

  // Calculations for statistics
  const stats = validators
    ? {
        total: validators.length,
        active: validators.filter((v) => !v.delinquent).length,
        delinquent: validators.filter((v) => v.delinquent).length,
        avgApy:
          validators.reduce(
            (sum, v) => sum + parseFloat(v.apy?.toString() || '0'),
            0
          ) / validators.length,
        avgCommission:
          validators.reduce(
            (sum, v) => sum + parseFloat(v.commission?.toString() || '0'),
            0
          ) / validators.length,
        totalStake: validators.reduce(
          (sum, v) => sum + parseFloat(v.activatedStake?.toString() || '0'),
          0
        ),
      }
    : {
        total: 0,
        active: 0,
        delinquent: 0,
        avgApy: 0,
        avgCommission: 0,
        totalStake: 0,
      }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(0) // Reset to first page on search
  }

  const handleSort = (
    criteria: 'stake' | 'apy' | 'uptime' | 'commission' | 'skipRate'
  ) => {
    if (sortBy === criteria) {
      // Toggle sort order if same criteria is selected
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new criteria and default to descending
      setSortBy(criteria)
      setSortOrder('desc')
    }
    setCurrentPage(0) // Reset to first page on sort change
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleRefresh = () => {
    refetch()
  }

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
                Solana Validators
              </h1>
              <p className='mt-1 text-sm text-sol-text-secondary'>
                Explore and analyze the network&apos;s validators
              </p>
            </div>
            <Button
              className='mt-4 sm:mt-0 bg-sol-primary hover:bg-opacity-90 text-white glow-primary'
              onClick={handleRefresh}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-2'
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
              Refresh Data
            </Button>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5'>
            <Card className='neo-card hover:bg-sol-card-hover p-4'>
              <div className='flex flex-col'>
                <span className='text-sol-text-secondary text-sm'>
                  Total Validators
                </span>
                <span className='text-3xl font-bold mt-1'>
                  {stats.total.toLocaleString()}
                </span>
                <div className='flex items-center mt-2'>
                  <span className='text-xs text-sol-text-secondary'>
                    Network contributors
                  </span>
                </div>
              </div>
            </Card>

            <Card className='neo-card hover:bg-sol-card-hover p-4'>
              <div className='flex flex-col'>
                <span className='text-sol-text-secondary text-sm'>
                  Active Validators
                </span>
                <span className='text-3xl font-bold mt-1 text-sol-secondary'>
                  {stats.active.toLocaleString()}
                </span>
                <div className='flex items-center mt-2'>
                  <span className='text-xs text-sol-text-secondary'>
                    {((stats.active / stats.total) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
            </Card>

            <Card className='neo-card hover:bg-sol-card-hover p-4'>
              <div className='flex flex-col'>
                <span className='text-sol-text-secondary text-sm'>
                  Delinquent
                </span>
                <span className='text-3xl font-bold mt-1 text-sol-warning'>
                  {stats.delinquent.toLocaleString()}
                </span>
                <div className='flex items-center mt-2'>
                  <span className='text-xs text-sol-text-secondary'>
                    {((stats.delinquent / stats.total) * 100).toFixed(1)}% of
                    total
                  </span>
                </div>
              </div>
            </Card>

            <Card className='neo-card hover:bg-sol-card-hover p-4'>
              <div className='flex flex-col'>
                <span className='text-sol-text-secondary text-sm'>
                  Average APY
                </span>
                <span className='text-3xl font-bold mt-1 text-sol-info'>
                  {formatPercent(stats.avgApy)}
                </span>
                <div className='flex items-center mt-2'>
                  <span className='text-xs text-sol-text-secondary'>
                    Current network average
                  </span>
                </div>
              </div>
            </Card>

            <Card className='neo-card hover:bg-sol-card-hover p-4'>
              <div className='flex flex-col'>
                <span className='text-sol-text-secondary text-sm'>
                  Average Commission
                </span>
                <span className='text-3xl font-bold mt-1'>
                  {formatPercent(stats.avgCommission)}
                </span>
                <div className='flex items-center mt-2'>
                  <span className='text-xs text-sol-text-secondary'>
                    Fee charged by validators
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Controls */}
          <div className='mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center'>
            <div className='relative flex-grow'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-sol-text-secondary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              <Input
                className='pl-10 bg-sol-dark-lighter border-gray-700 focus:border-sol-primary'
                placeholder='Search by name or key'
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div className='flex space-x-3'>
              <Select
                value={sortBy}
                onValueChange={(value) => handleSort(value as any)}
              >
                <SelectTrigger className='w-[160px] border-gray-700'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent className='text-sol-text border border-gray-700'>
                  <SelectItem value='stake'>Stake Amount</SelectItem>
                  <SelectItem value='apy'>APY</SelectItem>
                  <SelectItem value='uptime'>Uptime</SelectItem>
                  <SelectItem value='commission'>Commission</SelectItem>
                  <SelectItem value='skipRate'>Skip Rate</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant='outline'
                size='icon'
                className='bg-sol-dark-lighter border-gray-700'
                onClick={() =>
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }
              >
                {sortOrder === 'asc' ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-6'>
            <TabsList className='grid w-full grid-cols-5 bg-sol-dark-lighter rounded-lg p-1'>
              <TabsTrigger
                value='all'
                className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value='active'
                className='rounded-md data-[state=active]:bg-sol-secondary data-[state=active]:text-white'
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value='delinquent'
                className='rounded-md data-[state=active]:bg-sol-warning data-[state=active]:text-white'
              >
                Delinquent
              </TabsTrigger>
              <TabsTrigger
                value='high-apy'
                className='rounded-md data-[state=active]:bg-sol-info data-[state=active]:text-white'
              >
                High APY
              </TabsTrigger>
              <TabsTrigger
                value='low-commission'
                className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
              >
                Low Commission
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Validators Table */}
          <Card className='neo-card mt-6'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-700'>
                <thead>
                  <tr>
                    <th className='px-4 py-3.5 text-left text-sm font-semibold text-sol-text-secondary'>
                      Validator
                    </th>
                    <th
                      className='px-4 py-3.5 text-left text-sm font-semibold text-sol-text-secondary cursor-pointer'
                      onClick={() => handleSort('stake')}
                    >
                      <div className='flex items-center'>
                        <span>Stake</span>
                        {sortBy === 'stake' && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className={`ml-1 h-4 w-4 ${
                              sortOrder === 'desc' ? '' : 'transform rotate-180'
                            }`}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className='px-4 py-3.5 text-left text-sm font-semibold text-sol-text-secondary cursor-pointer'
                      onClick={() => handleSort('apy')}
                    >
                      <div className='flex items-center'>
                        <span>APY</span>
                        {sortBy === 'apy' && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className={`ml-1 h-4 w-4 ${
                              sortOrder === 'desc' ? '' : 'transform rotate-180'
                            }`}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className='px-4 py-3.5 text-left text-sm font-semibold text-sol-text-secondary cursor-pointer'
                      onClick={() => handleSort('commission')}
                    >
                      <div className='flex items-center'>
                        <span>Commission</span>
                        {sortBy === 'commission' && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className={`ml-1 h-4 w-4 ${
                              sortOrder === 'desc' ? '' : 'transform rotate-180'
                            }`}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className='px-4 py-3.5 text-left text-sm font-semibold text-sol-text-secondary cursor-pointer'
                      onClick={() => handleSort('uptime')}
                    >
                      <div className='flex items-center'>
                        <span>Uptime</span>
                        {sortBy === 'uptime' && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className={`ml-1 h-4 w-4 ${
                              sortOrder === 'desc' ? '' : 'transform rotate-180'
                            }`}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className='px-4 py-3.5 text-left text-sm font-semibold text-sol-text-secondary cursor-pointer'
                      onClick={() => handleSort('skipRate')}
                    >
                      <div className='flex items-center'>
                        <span>Skip Rate</span>
                        {sortBy === 'skipRate' && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className={`ml-1 h-4 w-4 ${
                              sortOrder === 'desc' ? '' : 'transform rotate-180'
                            }`}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className='px-4 py-3.5 text-left text-sm font-semibold text-sol-text-secondary'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-700 bg-sol-card'>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className='animate-pulse'>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='h-10 w-10 rounded-md bg-gray-700'></div>
                            <div className='ml-3'>
                              <div className='h-4 w-24 bg-gray-700 rounded'></div>
                              <div className='h-3 w-16 bg-gray-700 rounded mt-2'></div>
                            </div>
                          </div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='h-4 w-16 bg-gray-700 rounded'></div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='h-4 w-12 bg-gray-700 rounded'></div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='h-4 w-12 bg-gray-700 rounded'></div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='h-4 w-20 bg-gray-700 rounded'></div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='h-4 w-12 bg-gray-700 rounded'></div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='h-6 w-16 bg-gray-700 rounded'></div>
                        </td>
                      </tr>
                    ))
                  ) : paginatedValidators.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className='px-4 py-8 text-center text-sol-text-secondary'
                      >
                        No validators found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedValidators.map((validator) => (
                      <tr
                        key={validator.pubkey}
                        className='hover:bg-sol-card-hover transition-colors'
                      >
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div
                              className={`h-10 w-10 rounded-md bg-gradient-to-r ${getValidatorGradient(
                                validator.pubkey
                              )} flex items-center justify-center text-white font-semibold`}
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
                              <div className='text-xs text-sol-text-secondary font-mono'>
                                {formatPublicKey(validator.pubkey, 4, 4)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {formatMillionSOL(validator.activatedStake)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Total SOL staked with this validator</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-sol-secondary font-medium'>
                          {formatPercent(validator.apy || 0)}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm'>
                          {formatPercent(validator.commission)}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <Progress
                              value={validator.uptime || 0}
                              className='h-2 w-20 bg-gray-700'
                            />
                            <span className='ml-2 text-xs'>
                              {formatPercent(validator.uptime || 0)}
                            </span>
                          </div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm'>
                          {formatPercent(validator.skipRate || 0, 2)}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          {validator.delinquent ? (
                            <Badge className='bg-red-800 hover:bg-red-700 text-white'>
                              Delinquent
                            </Badge>
                          ) : (
                            <Badge className='bg-green-800 hover:bg-green-700 text-white'>
                              Active
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between'>
              <div className='text-sm text-sol-text-secondary'>
                Showing{' '}
                <span className='font-medium'>
                  {paginatedValidators.length}
                </span>{' '}
                of{' '}
                <span className='font-medium'>{sortedValidators.length}</span>{' '}
                validators
              </div>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-sol-dark-lighter border-gray-700'
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
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-sol-dark-lighter border-gray-700'
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
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
