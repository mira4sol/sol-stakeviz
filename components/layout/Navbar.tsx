import { useValidators } from '@/hooks/useSolanaConnection'
import { filterValidators } from '@/lib/utils/validators'
import { useState } from 'react'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: validators } = useValidators()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)

    // This would filter validators, but we're not showing results in this simplified version
    if (validators) {
      const filtered = filterValidators(validators, e.target.value)
    }
  }

  return (
    <div className='bg-sol-card border-b border-gray-700'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Mobile menu button */}
          <div className='flex items-center md:hidden'>
            <button
              type='button'
              className='text-gray-400 hover:text-white focus:outline-none'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <a
              href='#'
              className='bg-sol-primary bg-opacity-10 text-sol-primary block px-3 py-2 rounded-md text-base font-medium'
            >
              Overview
            </a>
            <a
              href='#'
              className='text-sol-text hover:bg-sol-card-hover block px-3 py-2 rounded-md text-base font-medium'
            >
              Validators
            </a>
            <a
              href='#'
              className='text-sol-text hover:bg-sol-card-hover block px-3 py-2 rounded-md text-base font-medium'
            >
              Analytics
            </a>
            <a
              href='#'
              className='text-sol-text hover:bg-sol-card-hover block px-3 py-2 rounded-md text-base font-medium'
            >
              Calculator
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
