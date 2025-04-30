import { usePathname } from 'next/navigation'
import React from 'react'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  isActive?: boolean
}

const NavItem = ({ href, icon, children, isActive }: NavItemProps) => {
  // We'll use a standard <a> tag instead of the Link component to avoid nesting issues
  return (
    <a
      href={href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-sol-primary bg-opacity-10 text-sol-primary'
          : 'text-sol-text hover:bg-sol-card-hover'
      }`}
    >
      {icon}
      {children}
    </a>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className='hidden md:flex md:flex-shrink-0'>
      <div className='flex flex-col w-64 bg-sol-card'>
        {/* Logo and branding */}
        <div className='px-6 pt-6 pb-4'>
          <div className='flex items-center'>
            <div className='h-10 w-10 flex items-center justify-center bg-sol-secondary rounded-md'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='text-sol-dark text-xl'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='22 12 18 12 15 21 9 3 6 12 2 12'></polyline>
              </svg>
            </div>
            <span className='ml-2 text-xl font-semibold'>
              Sol Stake<span className='text-sol-secondary'>Viz</span>
            </span>
          </div>
          <p className='mt-1 text-xs text-sol-text-secondary'>
            Solana Staking Dashboard
          </p>
        </div>

        {/* Navigation */}
        <div className='flex-1 flex flex-col overflow-y-auto'>
          <nav className='flex-1 px-4 py-4'>
            <div className='space-y-1'>
              <NavItem
                href='/'
                isActive={pathname === '/'}
                icon={
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-3 text-lg h-5 w-5'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect x='3' y='3' width='7' height='7'></rect>
                    <rect x='14' y='3' width='7' height='7'></rect>
                    <rect x='14' y='14' width='7' height='7'></rect>
                    <rect x='3' y='14' width='7' height='7'></rect>
                  </svg>
                }
              >
                Overview
              </NavItem>
              <NavItem
                href='/validators'
                isActive={pathname === '/validators'}
                icon={
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-3 text-lg h-5 w-5'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M2 20h20'></path>
                    <path d='M5 20V8.2a1.2 1.2 0 0 1 1.2-1.2h3.6a1.2 1.2 0 0 1 1.2 1.2V20'></path>
                    <path d='M13 20V8.2a1.2 1.2 0 0 1 1.2-1.2h3.6a1.2 1.2 0 0 1 1.2 1.2V20'></path>
                  </svg>
                }
              >
                Validators
              </NavItem>
              <NavItem
                href='/analytics'
                isActive={pathname === '/analytics'}
                icon={
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-3 text-lg h-5 w-5'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M3 3v18h18'></path>
                    <path d='m19 9-5 5-4-4-3 3'></path>
                  </svg>
                }
              >
                Analytics
              </NavItem>
              <NavItem
                href='/calculator'
                isActive={pathname === '/calculator'}
                icon={
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-3 text-lg h-5 w-5'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect width='16' height='20' x='4' y='2' rx='2'></rect>
                    <path d='M8 10h8'></path>
                    <path d='M8 14h8'></path>
                    <path d='M8 18h8'></path>
                  </svg>
                }
              >
                Calculator
              </NavItem>
            </div>

            <div className='mt-8'>
              <h3 className='px-3 text-xs font-semibold text-sol-text-secondary uppercase tracking-wider'>
                Resources
              </h3>
              <div className='mt-2 space-y-1'>
                <NavItem
                  href='/docs'
                  isActive={pathname === '/docs'}
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='mr-3 text-lg h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'></path>
                    </svg>
                  }
                >
                  Documentation
                </NavItem>
                {/* <NavItem
                  href='/help'
                  isActive={pathname === '/help'}
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='mr-3 text-lg h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <circle cx='12' cy='12' r='10'></circle>
                      <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'></path>
                      <path d='M12 17h.01'></path>
                    </svg>
                  }
                >
                  Help Center
                </NavItem> */}
              </div>
            </div>
          </nav>
        </div>

        {/* Network Status */}
        <div className='p-4 border-t border-gray-700'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <div className='h-3 w-3 rounded-full bg-sol-secondary relative'>
                <div className='absolute inset-0 bg-sol-secondary rounded-full animate-pulse'></div>
              </div>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium'>Network Status</p>
              <p className='text-xs text-sol-text-secondary'>Connected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
