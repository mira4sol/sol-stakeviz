/**
 * Format a number to a string with a specified number of decimal places
 */
export function formatNumber(num: number | string, decimals = 2): string {
  // Handle string inputs by converting to numbers
  const value = typeof num === 'string' ? parseFloat(num) : num

  // Check if the value is a valid number
  if (isNaN(value)) {
    return '0'
  }

  return value.toFixed(decimals)
}

/**
 * Format a number to a string with commas as thousands separators
 */
export function formatWithCommas(num: number | string, decimals = 2): string {
  // Handle string inputs by converting to numbers
  const value = typeof num === 'string' ? parseFloat(num) : num

  // Check if the value is a valid number
  if (isNaN(value)) {
    return '0'
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format a SOL amount (adds SOL suffix)
 */
export function formatSOL(amount: number | string, decimals = 2): string {
  // Handle string inputs by converting to numbers
  const value = typeof amount === 'string' ? parseFloat(amount) : amount

  // Check if the value is a valid number
  if (isNaN(value)) {
    return '0 SOL'
  }

  return `${formatWithCommas(value, decimals)} SOL`
}

/**
 * Format a million SOL amount (adds M SOL suffix)
 */
export function formatMillionSOL(
  amount: number | string,
  decimals = 1
): string {
  // Handle string inputs by converting to numbers
  const value = typeof amount === 'string' ? parseFloat(amount) : amount

  // Check if the value is a valid number
  if (isNaN(value)) {
    return '0M SOL'
  }

  return `${formatWithCommas(value / 1000000, decimals)}M SOL`
}

export function formatShortSOL(amount: number | string, decimals = 1): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(value)) return '0 SOL'

  const absValue = Math.abs(value)
  let formatted: string
  let suffix: string

  if (absValue >= 1e12) {
    formatted = (value / 1e12).toFixed(decimals)
    suffix = 'T'
  } else if (absValue >= 1e9) {
    formatted = (value / 1e9).toFixed(decimals)
    suffix = 'B'
  } else if (absValue >= 1e6) {
    formatted = (value / 1e6).toFixed(decimals)
    suffix = 'M'
  } else if (absValue >= 1e3) {
    formatted = (value / 1e3).toFixed(decimals)
    suffix = 'K'
  } else {
    formatted = value.toFixed(decimals)
    suffix = ''
  }

  // Remove trailing .0 if decimals = 1
  if (decimals === 1) {
    formatted = formatted.replace(/\.0$/, '')
  }

  return `${formatted}${suffix} SOL`
}

/**
 * Format a percentage
 */
export function formatPercent(percent: number | string, decimals = 1): string {
  // Handle string inputs by converting to numbers
  const value = typeof percent === 'string' ? parseFloat(percent) : percent

  // Check if the value is a valid number
  if (isNaN(value)) {
    return '0%'
  }

  return `${formatNumber(value, decimals)}%`
}

/**
 * Format a time duration to a string (e.g. "1d 14h 22m")
 */
export function formatDuration(
  days: number,
  hours: number,
  minutes: number
): string {
  return `${days}d ${hours}h ${minutes}m`
}

/**
 * Format a date to a string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

/**
 * Format a validator's public key (shortened)
 */
export function formatPublicKey(
  pubkey: string,
  startChars = 4,
  endChars = 4
): string {
  if (!pubkey || pubkey.length <= startChars + endChars) {
    return pubkey || ''
  }
  return `${pubkey.slice(0, startChars)}..${pubkey.slice(-endChars)}`
}

/**
 * Generate validator display initials from pubkey
 */
export function getValidatorInitials(
  name: string | null,
  pubkey: string
): string {
  if (name) {
    const words = name.split(' ')
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  // Use first character of pubkey
  return pubkey.slice(0, 1).toUpperCase()
}

/**
 * Generate a color gradient based on pubkey
 */
export function getValidatorGradient(pubkey: string): string {
  // Use the first few characters of pubkey to generate a consistent color
  if (!pubkey || pubkey.length === 0) {
    // Default gradient if no pubkey provided
    return 'from-blue-400 to-cyan-500'
  }

  const hash = pubkey.slice(0, 6)
  const colors = [
    ['from-purple-400', 'to-indigo-500'],
    ['from-blue-400', 'to-cyan-500'],
    ['from-red-400', 'to-pink-500'],
    ['from-amber-400', 'to-orange-500'],
    ['from-green-400', 'to-emerald-500'],
    ['from-teal-400', 'to-cyan-500'],
    ['from-indigo-400', 'to-purple-500'],
    ['from-pink-400', 'to-rose-500'],
  ]

  try {
    // Handle potential parsing errors
    let index = 0
    if (/^[0-9a-f]+$/i.test(hash)) {
      index = parseInt(hash, 16) % colors.length
    } else {
      // Use string charCode sum if not a valid hex
      const sum = hash
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      index = sum % colors.length
    }

    return `${colors[index][0]} ${colors[index][1]}`
  } catch (error) {
    // Fallback gradient
    return 'from-blue-400 to-cyan-500'
  }
}
