'use client'

import Sidebar from '@/components/layout/Sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Docs() {
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
                Documentation
              </h1>
              <p className='mt-1 text-sm text-sol-text-secondary'>
                Learn about Solana staking, validators, and how to use this
                dashboard
              </p>
            </div>
          </div>

          {/* Documentation Tabs */}
          <Card className='neo-card'>
            <div className='p-5'>
              <Tabs defaultValue='overview'>
                <TabsList className='grid w-full grid-cols-4 bg-sol-dark-lighter rounded-lg p-1 mb-6'>
                  <TabsTrigger
                    value='overview'
                    className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value='staking'
                    className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
                  >
                    Staking Guide
                  </TabsTrigger>
                  <TabsTrigger
                    value='validators'
                    className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
                  >
                    Validators
                  </TabsTrigger>
                  <TabsTrigger
                    value='dashboard'
                    className='rounded-md data-[state=active]:bg-sol-primary data-[state=active]:text-white'
                  >
                    Dashboard Guide
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value='overview' className='space-y-6'>
                  <div className='prose prose-invert max-w-none'>
                    <h2 className='text-xl font-bold text-sol-secondary'>
                      Understanding Solana Staking
                    </h2>

                    <p>
                      Solana is a high-performance blockchain designed for
                      scalability, using a unique combination of Proof of
                      History (PoH) and Proof of Stake (PoS) consensus
                      mechanisms. Staking is fundamental to Solana&apos;s
                      security and operations, allowing token holders to
                      participate in network governance and earn rewards.
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-6'>
                      <Card className='bg-sol-dark-lighter p-4 rounded-lg'>
                        <h3 className='text-lg font-medium text-sol-primary mb-2'>
                          What is Staking?
                        </h3>
                        <p className='text-sm'>
                          Staking is the process of delegating SOL tokens to
                          validators who process transactions and maintain the
                          Solana network. By staking your SOL, you contribute to
                          the security and efficiency of the blockchain while
                          earning rewards proportional to your stake.
                        </p>
                      </Card>

                      <Card className='bg-sol-dark-lighter p-4 rounded-lg'>
                        <h3 className='text-lg font-medium text-sol-primary mb-2'>
                          Benefits of Staking
                        </h3>
                        <ul className='text-sm list-disc pl-5 space-y-1'>
                          <li>Earn passive income through staking rewards</li>
                          <li>
                            Support the security and decentralization of Solana
                          </li>
                          <li>Participate in network governance</li>
                          <li>Counter the effects of inflation</li>
                        </ul>
                      </Card>
                    </div>

                    <h3 className='text-lg font-bold'>
                      Key Metrics in This Dashboard
                    </h3>

                    <p>
                      This dashboard provides a comprehensive view of
                      Solana&apos;s staking ecosystem, including:
                    </p>

                    <ul className='space-y-2 my-4'>
                      <li className='flex items-start'>
                        <div className='h-5 w-5 rounded-full bg-sol-primary flex items-center justify-center text-white mr-2 mt-0.5'>
                          1
                        </div>
                        <div>
                          <strong className='text-sol-primary'>
                            Network Statistics:
                          </strong>{' '}
                          Current epoch information, total staked SOL, active
                          validators, and network health indicators.
                        </div>
                      </li>
                      <li className='flex items-start'>
                        <div className='h-5 w-5 rounded-full bg-sol-primary flex items-center justify-center text-white mr-2 mt-0.5'>
                          2
                        </div>
                        <div>
                          <strong className='text-sol-primary'>
                            Validator Performance:
                          </strong>{' '}
                          Detailed metrics on validator uptime, commission
                          rates, APY, and stake distribution.
                        </div>
                      </li>
                      <li className='flex items-start'>
                        <div className='h-5 w-5 rounded-full bg-sol-primary flex items-center justify-center text-white mr-2 mt-0.5'>
                          3
                        </div>
                        <div>
                          <strong className='text-sol-primary'>
                            Historical Trends:
                          </strong>{' '}
                          Track changes in staking metrics, APY variations, and
                          network participation over time.
                        </div>
                      </li>
                      <li className='flex items-start'>
                        <div className='h-5 w-5 rounded-full bg-sol-primary flex items-center justify-center text-white mr-2 mt-0.5'>
                          4
                        </div>
                        <div>
                          <strong className='text-sol-primary'>
                            Reward Calculator:
                          </strong>{' '}
                          Estimate potential returns based on your stake amount,
                          validator commission, and time horizon.
                        </div>
                      </li>
                    </ul>

                    <h3 className='text-lg font-bold mt-6'>Data Sources</h3>

                    <p>
                      This dashboard aggregates data from several authoritative
                      sources to provide accurate and comprehensive information:
                    </p>

                    <div className='bg-sol-dark-lighter p-4 rounded-lg my-4'>
                      <ul className='space-y-2'>
                        <li className='flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          <span>
                            <strong>Solana RPC API:</strong> Real-time
                            blockchain data directly from the Solana network
                          </span>
                        </li>
                        <li className='flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          <span>
                            <strong>Solana Beach:</strong> Supplementary
                            validator metadata
                          </span>
                        </li>
                        <li className='flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          <span>
                            <strong>SolanaFM:</strong> Historical transaction
                            and staking data
                          </span>
                        </li>
                        <li className='flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          <span>
                            <strong>Validators API:</strong> Performance metrics
                            from the validator network
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Staking Guide Tab */}
                <TabsContent value='staking' className='space-y-6'>
                  <div className='prose prose-invert max-w-none'>
                    <h2 className='text-xl font-bold text-sol-secondary'>
                      Complete Solana Staking Guide
                    </h2>

                    <p>
                      This comprehensive guide walks you through the process of
                      staking your SOL tokens, understanding rewards, managing
                      risks, and making informed decisions about validators.
                    </p>

                    <div className='my-6'>
                      <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                        How Staking Works on Solana
                      </h3>

                      <div className='relative border border-gray-700 rounded-lg p-5 bg-gradient-to-br from-sol-dark-lighter to-sol-card'>
                        <div className='absolute -top-3 left-4 px-2 bg-sol-dark text-sol-primary text-sm font-medium'>
                          Staking Process
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                          <div className='flex flex-col items-center text-center'>
                            <div className='h-12 w-12 rounded-full bg-sol-dark flex items-center justify-center mb-2'>
                              <svg
                                className='h-6 w-6 text-sol-secondary'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                                />
                              </svg>
                            </div>
                            <div className='text-sm font-medium'>
                              Acquire SOL
                            </div>
                            <div className='text-xs text-sol-text-secondary mt-1'>
                              Purchase SOL from exchanges or receive as payment
                            </div>
                          </div>

                          <div className='flex flex-col items-center text-center'>
                            <div className='h-12 w-12 rounded-full bg-sol-dark flex items-center justify-center mb-2'>
                              <svg
                                className='h-6 w-6 text-sol-secondary'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                                />
                              </svg>
                            </div>
                            <div className='text-sm font-medium'>
                              Choose Validator
                            </div>
                            <div className='text-xs text-sol-text-secondary mt-1'>
                              Research and select a reliable validator
                            </div>
                          </div>

                          <div className='flex flex-col items-center text-center'>
                            <div className='h-12 w-12 rounded-full bg-sol-dark flex items-center justify-center mb-2'>
                              <svg
                                className='h-6 w-6 text-sol-secondary'
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
                            <div className='text-sm font-medium'>
                              Delegate Stake
                            </div>
                            <div className='text-xs text-sol-text-secondary mt-1'>
                              Transfer SOL to staking accounts
                            </div>
                          </div>

                          <div className='flex flex-col items-center text-center'>
                            <div className='h-12 w-12 rounded-full bg-sol-dark flex items-center justify-center mb-2'>
                              <svg
                                className='h-6 w-6 text-sol-secondary'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                              </svg>
                            </div>
                            <div className='text-sm font-medium'>
                              Earn Rewards
                            </div>
                            <div className='text-xs text-sol-text-secondary mt-1'>
                              Receive staking rewards each epoch
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Choosing the Right Validator
                    </h3>

                    <p>
                      Selecting a validator is one of the most critical
                      decisions in your staking journey. Consider these factors:
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>
                      <Card className='bg-sol-dark-lighter p-3'>
                        <h4 className='font-medium text-sol-secondary'>
                          Commission Rate
                        </h4>
                        <p className='text-sm'>
                          The percentage of rewards that validators keep for
                          themselves. Lower commission means higher returns for
                          you, but extremely low rates might be unsustainable.
                        </p>
                      </Card>

                      <Card className='bg-sol-dark-lighter p-3'>
                        <h4 className='font-medium text-sol-secondary'>
                          Performance
                        </h4>
                        <p className='text-sm'>
                          Check uptime, skip rate, and block production
                          statistics. Validators with poor performance will earn
                          fewer rewards.
                        </p>
                      </Card>

                      <Card className='bg-sol-dark-lighter p-3'>
                        <h4 className='font-medium text-sol-secondary'>
                          Stake Concentration
                        </h4>
                        <p className='text-sm'>
                          For network health, consider delegating to validators
                          with less total stake to promote decentralization.
                        </p>
                      </Card>

                      <Card className='bg-sol-dark-lighter p-3'>
                        <h4 className='font-medium text-sol-secondary'>
                          Track Record
                        </h4>
                        <p className='text-sm'>
                          Validators with longer operational history and
                          community presence tend to be more reliable.
                        </p>
                      </Card>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Understanding Staking Rewards
                    </h3>

                    <div className='bg-sol-dark-lighter p-4 rounded-lg my-4'>
                      <p className='mb-3'>
                        Solana&apos;s staking rewards are influenced by multiple
                        factors:
                      </p>

                      <ul className='space-y-2'>
                        <li className='flex items-start'>
                          <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-sol-dark text-xs mr-2 mt-0.5'>
                            •
                          </div>
                          <div>
                            <strong>Inflation Rate:</strong> Solana has a
                            variable inflation schedule that decreases over
                            time, starting at 8% and eventually stabilizing at
                            1.5%.
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-sol-dark text-xs mr-2 mt-0.5'>
                            •
                          </div>
                          <div>
                            <strong>Validator Commission:</strong> The
                            percentage of rewards taken by validators before
                            distributing to delegators.
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-sol-dark text-xs mr-2 mt-0.5'>
                            •
                          </div>
                          <div>
                            <strong>Stake Activation:</strong> There&apos;s a
                            warm-up period (1 epoch) before your stake becomes
                            active and starts earning rewards.
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-sol-dark text-xs mr-2 mt-0.5'>
                            •
                          </div>
                          <div>
                            <strong>Validator Performance:</strong> Poor
                            performance (missed blocks, downtime) reduces
                            rewards for all delegators.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Risks and Considerations
                    </h3>

                    <div className='border border-gray-700 rounded-lg p-4 my-4'>
                      <h4 className='font-medium text-sol-warning mb-2'>
                        Potential Risks
                      </h4>

                      <ul className='space-y-2'>
                        <li className='flex items-start'>
                          <svg
                            className='h-5 w-5 text-sol-warning mr-2 mt-0.5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                            />
                          </svg>
                          <div>
                            <strong>Slashing Risk:</strong> Currently, Solana
                            does not implement slashing, but poor validator
                            performance can lead to reduced rewards.
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <svg
                            className='h-5 w-5 text-sol-warning mr-2 mt-0.5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                            />
                          </svg>
                          <div>
                            <strong>Lockup Period:</strong> When you decide to
                            unstake, your SOL is subject to a cooldown period
                            (approximately 2-3 days) during which you cannot
                            transfer them.
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <svg
                            className='h-5 w-5 text-sol-warning mr-2 mt-0.5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                            />
                          </svg>
                          <div>
                            <strong>Validator Changes:</strong> If a validator
                            modifies their commission or goes offline, your
                            rewards will be affected until you redelegate.
                          </div>
                        </li>
                        <li className='flex items-start'>
                          <svg
                            className='h-5 w-5 text-sol-warning mr-2 mt-0.5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                            />
                          </svg>
                          <div>
                            <strong>Market Risk:</strong> While staking helps
                            counter inflation, it doesn&apos;t protect against
                            market price volatility of SOL.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Staking Strategies
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-4'>
                      <Card className='p-4 neo-card'>
                        <div className='mb-2'>
                          <Badge className='bg-green-600'>Conservative</Badge>
                        </div>
                        <h4 className='font-medium mb-2'>Stability Focus</h4>
                        <ul className='text-sm space-y-1 text-sol-text-secondary'>
                          <li>• Larger, established validators</li>
                          <li>• 5-8% commission range</li>
                          <li>• Multiple validators for diversification</li>
                          <li>• Prioritize uptime over max returns</li>
                        </ul>
                      </Card>

                      <Card className='p-4 neo-card'>
                        <div className='mb-2'>
                          <Badge className='bg-blue-600'>Balanced</Badge>
                        </div>
                        <h4 className='font-medium mb-2'>Optimized Returns</h4>
                        <ul className='text-sm space-y-1 text-sol-text-secondary'>
                          <li>• Mix of established and mid-size validators</li>
                          <li>• 3-6% commission range</li>
                          <li>• Monthly rebalancing of stakes</li>
                          <li>• Regular compounding of rewards</li>
                        </ul>
                      </Card>

                      <Card className='p-4 neo-card'>
                        <div className='mb-2'>
                          <Badge className='bg-orange-600'>Growth</Badge>
                        </div>
                        <h4 className='font-medium mb-2'>Maximum Yield</h4>
                        <ul className='text-sm space-y-1 text-sol-text-secondary'>
                          <li>• Smaller, promising validators</li>
                          <li>• 0-3% commission preference</li>
                          <li>• Weekly monitoring and adjustment</li>
                          <li>• Direct governance participation</li>
                        </ul>
                      </Card>
                    </div>

                    <div className='border-t border-gray-700 pt-6 mt-6'>
                      <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                        Further Resources
                      </h3>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Card className='bg-sol-dark-lighter p-3 flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                            />
                          </svg>
                          <span>
                            Solana Docs:{' '}
                            <a
                              href='https://docs.solana.com/staking'
                              className='text-sol-primary hover:underline'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Official Staking Guide
                            </a>
                          </span>
                        </Card>

                        <Card className='bg-sol-dark-lighter p-3 flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                            />
                          </svg>
                          <span>
                            Solana Foundation:{' '}
                            <a
                              href='https://solana.org/validators'
                              className='text-sol-primary hover:underline'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Validator Resource Center
                            </a>
                          </span>
                        </Card>

                        <Card className='bg-sol-dark-lighter p-3 flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
                            />
                          </svg>
                          <span>
                            Community:{' '}
                            <a
                              href='https://discord.com/invite/solana'
                              className='text-sol-primary hover:underline'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Solana Discord
                            </a>
                          </span>
                        </Card>

                        <Card className='bg-sol-dark-lighter p-3 flex items-center'>
                          <svg
                            className='h-5 w-5 text-sol-secondary mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          <span>
                            Events:{' '}
                            <a
                              href='https://solana.com/events'
                              className='text-sol-primary hover:underline'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Solana Events Calendar
                            </a>
                          </span>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Validators Tab */}
                <TabsContent value='validators' className='space-y-6'>
                  <div className='prose prose-invert max-w-none'>
                    <h2 className='text-xl font-bold text-sol-secondary'>
                      Validator Ecosystem
                    </h2>

                    <p>
                      Validators are the backbone of the Solana network,
                      processing transactions, participating in consensus, and
                      securing the blockchain. Understanding their role and
                      metrics is crucial for informed staking decisions.
                    </p>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Validator Requirements
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-6'>
                      <Card className='p-4 neo-card'>
                        <h4 className='font-medium mb-2'>
                          Hardware Requirements
                        </h4>
                        <ul className='text-sm space-y-2'>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>CPU:</strong> 12 cores / 24 threads,
                              2.8GHz+
                            </span>
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>RAM:</strong> 128GB RAM, DDR4 ECC
                            </span>
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>Storage:</strong> 2TB NVMe SSD drive
                            </span>
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>Network:</strong> 1 Gbps connection
                            </span>
                          </li>
                        </ul>
                      </Card>

                      <Card className='p-4 neo-card'>
                        <h4 className='font-medium mb-2'>
                          Financial Requirements
                        </h4>
                        <ul className='text-sm space-y-2'>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>Vote Account:</strong> ~1.1 SOL deposit
                            </span>
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>Infrastructure Costs:</strong>{' '}
                              $1,000-$1,500/month
                            </span>
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>Competitive Stake:</strong> Significant
                              SOL to attract delegations
                            </span>
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='h-4 w-4 text-sol-secondary mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                            <span>
                              <strong>Operating Capital:</strong> Funds for
                              upgrades and maintenance
                            </span>
                          </li>
                        </ul>
                      </Card>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Key Validator Metrics
                    </h3>

                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-700 my-4'>
                        <thead>
                          <tr>
                            <th className='px-4 py-3 bg-sol-dark-lighter text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                              Metric
                            </th>
                            <th className='px-4 py-3 bg-sol-dark-lighter text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                              Description
                            </th>
                            <th className='px-4 py-3 bg-sol-dark-lighter text-left text-xs font-medium text-sol-text-secondary uppercase tracking-wider'>
                              Ideal Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-700'>
                          <tr>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-sol-primary'>
                              Uptime
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Percentage of time the validator is online and
                              operational
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              99.5% or higher
                            </td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-sol-primary'>
                              Skip Rate
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Percentage of blocks that the validator missed
                              when scheduled
                            </td>
                            <td className='px-4 py-3 text-sm'>Under 1%</td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-sol-primary'>
                              Commission
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Percentage of rewards kept by the validator
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              5-10% (sustainable)
                            </td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-sol-primary'>
                              Vote Credits
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Measure of voting participation in consensus
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              100% of maximum possible
                            </td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-sol-primary'>
                              Activated Stake
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Total SOL delegated to the validator that is
                              currently earning rewards
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Varies (higher = more network influence)
                            </td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-sol-primary'>
                              Version
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Software version running on the validator
                            </td>
                            <td className='px-4 py-3 text-sm'>
                              Latest stable release
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Validator Distribution
                    </h3>

                    <p>
                      A healthy validator ecosystem is geographically
                      distributed to enhance network resilience. Validators are
                      located worldwide, with concentrations in:
                    </p>

                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3 my-4'>
                      <Card className='p-3 bg-sol-dark-lighter'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-gradient-to-r from-sol-primary to-sol-info flex items-center justify-center text-white mr-2'>
                            <span className='text-sm font-medium'>NA</span>
                          </div>
                          <div>
                            <div className='text-sm font-medium'>
                              North America
                            </div>
                            <div className='text-xs text-sol-text-secondary'>
                              ~38% of validators
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-gradient-to-r from-sol-primary to-sol-info flex items-center justify-center text-white mr-2'>
                            <span className='text-sm font-medium'>EU</span>
                          </div>
                          <div>
                            <div className='text-sm font-medium'>Europe</div>
                            <div className='text-xs text-sol-text-secondary'>
                              ~35% of validators
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-gradient-to-r from-sol-primary to-sol-info flex items-center justify-center text-white mr-2'>
                            <span className='text-sm font-medium'>AS</span>
                          </div>
                          <div>
                            <div className='text-sm font-medium'>Asia</div>
                            <div className='text-xs text-sol-text-secondary'>
                              ~20% of validators
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-gradient-to-r from-sol-primary to-sol-info flex items-center justify-center text-white mr-2'>
                            <span className='text-sm font-medium'>OC</span>
                          </div>
                          <div>
                            <div className='text-sm font-medium'>Oceania</div>
                            <div className='text-xs text-sol-text-secondary'>
                              ~4% of validators
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-gradient-to-r from-sol-primary to-sol-info flex items-center justify-center text-white mr-2'>
                            <span className='text-sm font-medium'>SA</span>
                          </div>
                          <div>
                            <div className='text-sm font-medium'>
                              South America
                            </div>
                            <div className='text-xs text-sol-text-secondary'>
                              ~2% of validators
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-gradient-to-r from-sol-primary to-sol-info flex items-center justify-center text-white mr-2'>
                            <span className='text-sm font-medium'>AF</span>
                          </div>
                          <div>
                            <div className='text-sm font-medium'>Africa</div>
                            <div className='text-xs text-sol-text-secondary'>
                              ~1% of validators
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Superminority and Decentralization
                    </h3>

                    <p>
                      In Solana, if more than 33% of the stake is controlled by
                      malicious validators, they could potentially halt the
                      network. This critical threshold is known as the
                      &quot;superminority.&quot;
                    </p>

                    <div className='bg-sol-dark-lighter p-4 rounded-lg my-4'>
                      <h4 className='font-medium mb-2'>Nakamoto Coefficient</h4>
                      <p className='text-sm mb-3'>
                        The Nakamoto Coefficient is a measure of
                        decentralization, representing the minimum number of
                        validators that would need to collude to compromise the
                        network. For Solana:
                      </p>
                      <div className='flex items-center space-x-4'>
                        <div className='p-3 bg-sol-dark rounded-lg'>
                          <div className='text-xs text-sol-text-secondary'>
                            Current Value
                          </div>
                          <div className='text-2xl font-bold text-sol-primary'>
                            ~30
                          </div>
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm'>
                            This means approximately 30 validators would need to
                            work together to reach the 33% threshold. A higher
                            number indicates better decentralization.
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Validator Economics
                    </h3>

                    <div className='border-t border-gray-700 pt-4 mt-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                          <h4 className='font-medium mb-2'>Revenue Sources</h4>
                          <ul className='text-sm space-y-1'>
                            <li className='flex items-start'>
                              <svg
                                className='h-4 w-4 text-sol-secondary mr-2 mt-0.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                              <span>
                                <strong>Commission fees:</strong> Percentage of
                                delegator rewards
                              </span>
                            </li>
                            <li className='flex items-start'>
                              <svg
                                className='h-4 w-4 text-sol-secondary mr-2 mt-0.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                              <span>
                                <strong>Transaction fees:</strong> Small portion
                                from processed transactions
                              </span>
                            </li>
                            <li className='flex items-start'>
                              <svg
                                className='h-4 w-4 text-sol-secondary mr-2 mt-0.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                              <span>
                                <strong>Self-stake rewards:</strong> Rewards on
                                validator&apos;s own stake
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className='font-medium mb-2'>
                            Operational Costs
                          </h4>
                          <ul className='text-sm space-y-1'>
                            <li className='flex items-start'>
                              <svg
                                className='h-4 w-4 text-sol-warning mr-2 mt-0.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                />
                              </svg>
                              <span>
                                <strong>Infrastructure:</strong> Server costs,
                                bandwidth, storage
                              </span>
                            </li>
                            <li className='flex items-start'>
                              <svg
                                className='h-4 w-4 text-sol-warning mr-2 mt-0.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                />
                              </svg>
                              <span>
                                <strong>Personnel:</strong> Technical support
                                and maintenance
                              </span>
                            </li>
                            <li className='flex items-start'>
                              <svg
                                className='h-4 w-4 text-sol-warning mr-2 mt-0.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                />
                              </svg>
                              <span>
                                <strong>Monitoring:</strong> 24/7 system
                                monitoring tools
                              </span>
                            </li>
                            <li className='flex items-start'>
                              <svg
                                className='h-4 w-4 text-sol-warning mr-2 mt-0.5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                />
                              </svg>
                              <span>
                                <strong>Security:</strong> Cybersecurity
                                measures and protections
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Dashboard Guide Tab */}
                <TabsContent value='dashboard' className='space-y-6'>
                  <div className='prose prose-invert max-w-none'>
                    <h2 className='text-xl font-bold text-sol-secondary'>
                      Dashboard User Guide
                    </h2>

                    <p>
                      This comprehensive dashboard provides real-time insights
                      into Solana&apos;s staking ecosystem. Here&apos;s how to
                      make the most of each section:
                    </p>

                    <div className='my-6'>
                      <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                        Overview Dashboard
                      </h3>

                      <div className='border border-gray-700 rounded-lg p-4 bg-sol-dark-lighter mb-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div>
                            <h4 className='font-medium mb-2'>
                              Network Stats Cards
                            </h4>
                            <p className='text-sm'>
                              Quick summary of key metrics including total
                              staked SOL, active validators, average APY, and
                              network health. Use these to get an immediate
                              pulse on the network&apos;s status.
                            </p>
                          </div>
                          <div>
                            <h4 className='font-medium mb-2'>
                              Stake Distribution Chart
                            </h4>
                            <p className='text-sm'>
                              Visualizes how stake is distributed among top
                              validators. Use this to identify stake
                              concentration and assess network decentralization.
                            </p>
                          </div>
                          <div>
                            <h4 className='font-medium mb-2'>
                              Staking Trend Chart
                            </h4>
                            <p className='text-sm'>
                              Shows historical staking data over time. Use the
                              timeframe selector to view trends from 1 month to
                              1 year, helping you identify patterns and seasonal
                              changes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='border border-gray-700 rounded-lg p-4 bg-sol-dark-lighter mb-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div>
                            <h4 className='font-medium mb-2'>
                              Validator Performance
                            </h4>
                            <p className='text-sm'>
                              Detailed table of top-performing validators with
                              key metrics. Use sorting and pagination controls
                              to find validators matching your criteria. Export
                              functionality available for offline analysis.
                            </p>
                          </div>
                          <div>
                            <h4 className='font-medium mb-2'>
                              APY Distribution
                            </h4>
                            <p className='text-sm'>
                              Shows the distribution of APY rates across
                              validators. Use this to understand the range of
                              returns available and identify competitive rates.
                            </p>
                          </div>
                          <div>
                            <h4 className='font-medium mb-2'>
                              Network Participation
                            </h4>
                            <p className='text-sm'>
                              Visualizes the breakdown of Solana&apos;s total
                              supply between staked, unstaked, and
                              non-circulating tokens. Helps you understand the
                              overall staking ratio.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Validators Page
                    </h3>

                    <div className='border border-gray-700 rounded-lg p-4 bg-sol-dark-lighter mb-4'>
                      <div className='mb-3'>
                        <h4 className='font-medium mb-2'>
                          Features & Functionality
                        </h4>
                        <ul className='text-sm space-y-2'>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              1
                            </div>
                            <div>
                              <strong>Search and Filter:</strong> Quickly locate
                              validators by name or public key using the search
                              bar. Use tab filters to view specific validator
                              categories.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              2
                            </div>
                            <div>
                              <strong>Sorting Controls:</strong> Sort the
                              validator list by different criteria including
                              stake amount, APY, commission, uptime, and skip
                              rate.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              3
                            </div>
                            <div>
                              <strong>Detailed Metrics:</strong> View
                              comprehensive statistics for each validator,
                              helping you make informed delegation decisions.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              4
                            </div>
                            <div>
                              <strong>Status Indicators:</strong> Quickly
                              identify active vs. delinquent validators through
                              visual badges.
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Analytics Page
                    </h3>

                    <div className='border border-gray-700 rounded-lg p-4 bg-sol-dark-lighter mb-4'>
                      <div className='mb-3'>
                        <h4 className='font-medium mb-2'>
                          Advanced Analytics Tools
                        </h4>
                        <ul className='text-sm space-y-2'>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              1
                            </div>
                            <div>
                              <strong>Staking History Analysis:</strong>{' '}
                              In-depth historical analysis with customizable
                              timeframes. Toggle between different time periods
                              to identify trends.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              2
                            </div>
                            <div>
                              <strong>Distribution Analysis:</strong> Visualize
                              stake and APY distribution across the network.
                              Switch between distribution types to gain
                              different perspectives.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              3
                            </div>
                            <div>
                              <strong>Network Health Indicators:</strong>{' '}
                              Comprehensive health metrics including validator
                              diversity, voting performance, and staking
                              participation.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              4
                            </div>
                            <div>
                              <strong>Key Performance Metrics:</strong>{' '}
                              Additional statistics on consensus health, epoch
                              progress, average block time, and security score.
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Staking Calculator
                    </h3>

                    <div className='border border-gray-700 rounded-lg p-4 bg-sol-dark-lighter mb-4'>
                      <div className='mb-3'>
                        <h4 className='font-medium mb-2'>
                          How to Use the Calculator
                        </h4>
                        <ul className='text-sm space-y-2'>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              1
                            </div>
                            <div>
                              <strong>Basic Parameters:</strong> Input your
                              planned stake amount, select validator commission,
                              time period, and compounding strategy.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              2
                            </div>
                            <div>
                              <strong>Advanced Options:</strong> For more
                              precise calculations, use the advanced tab to
                              specify lockup periods, unstake fees, reinvestment
                              thresholds, and APY trend scenarios.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              3
                            </div>
                            <div>
                              <strong>Results Interpretation:</strong> View
                              estimated APY, total rewards, final balance,
                              monthly projections, and risk assessment to make
                              informed decisions.
                            </div>
                          </li>
                          <li className='flex items-start'>
                            <div className='min-w-4 h-4 w-4 rounded-full bg-sol-secondary flex items-center justify-center text-xs text-sol-dark mr-2 mt-0.5'>
                              4
                            </div>
                            <div>
                              <strong>Risk Assessment:</strong> Pay attention to
                              the risk indicator, which evaluates various
                              factors to provide a risk level assessment of your
                              staking strategy.
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className='text-lg font-medium mb-4 text-sol-primary'>
                      Tips for Dashboard Use
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>
                      <Card className='p-3 bg-sol-dark-lighter'>
                        <h4 className='font-medium text-sol-secondary mb-2'>
                          Data Refresh
                        </h4>
                        <p className='text-sm'>
                          Use the refresh button in the top right of most
                          sections to update data. The dashboard also
                          automatically updates at regular intervals.
                        </p>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <h4 className='font-medium text-sol-secondary mb-2'>
                          Interactive Elements
                        </h4>
                        <p className='text-sm'>
                          Most charts feature hover tooltips with additional
                          details. Click on legends to toggle visibility of
                          specific data series.
                        </p>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <h4 className='font-medium text-sol-secondary mb-2'>
                          Responsive Design
                        </h4>
                        <p className='text-sm'>
                          The dashboard is fully responsive. On smaller screens,
                          some elements will reformat for better viewing
                          experience.
                        </p>
                      </Card>

                      <Card className='p-3 bg-sol-dark-lighter'>
                        <h4 className='font-medium text-sol-secondary mb-2'>
                          Export Data
                        </h4>
                        <p className='text-sm'>
                          Look for export buttons near tables and charts to
                          download data for offline analysis or record-keeping.
                        </p>
                      </Card>
                    </div>

                    <div className='border-t border-gray-700 pt-6 mt-6'>
                      <div className='flex justify-center'>
                        <Button className='bg-gradient-to-r from-sol-primary to-sol-info text-white glow-primary'>
                          Start Exploring
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
