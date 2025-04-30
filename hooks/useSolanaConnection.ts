import { calculateRewards, computeStakingStats } from '@/lib/utils/solana'
import {
  APYCalculationResult,
  NetworkInfo,
  StakingHistory,
  StakingStats,
  Validator,
} from '@/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'

/**
 * Hook to fetch network information
 */
export function useNetworkInfo() {
  return useQuery<NetworkInfo>({
    queryKey: ['/api/solana/network'],
    refetchInterval: 60000, // Refetch every minute
  })
}

/**
 * Hook to fetch validators
 */
export function useValidators() {
  return useQuery<Validator[]>({
    queryKey: ['/api/solana/validators'],
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}

/**
 * Hook to fetch staking history
 */
export function useStakingHistory() {
  return useQuery<StakingHistory[]>({
    queryKey: ['/api/solana/history'],
  })
}

/**
 * Hook to compute staking statistics
 */
export function useStakingStats() {
  const { data: validators, isLoading, error } = useValidators()

  const stats: StakingStats | undefined = validators
    ? {
        ...computeStakingStats(validators),
        previousEpochStats: undefined, // We don't have previous epoch data in this implementation
      }
    : undefined

  return {
    data: stats,
    isLoading,
    error,
  }
}

/**
 * Hook for APY calculation
 */
export function useAPYCalculator() {
  return useMutation<
    APYCalculationResult,
    Error,
    { amount: number; commission: number; days: number }
  >({
    mutationFn: ({ amount, commission, days }) =>
      calculateRewards(amount, commission, days),
  })
}
