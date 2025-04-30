import { StakingHistory } from '@/types/schema'
import { apiResponse } from '../http.lib'
import { createClient } from '../supabase/server'

export class TrendsService {
  static async getAllTrends(page = 1, limit = 10) {
    try {
      const supabase = await createClient()
      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('trends')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error)
        return apiResponse(false, 'Failed to fetch trends data', error.message)

      return apiResponse(true, 'trends data retrieved', {
        data,
        total: count,
        page,
        limit,
      })
    } catch (error: any) {
      return apiResponse(false, 'Error fetching trends data', error.message)
    }
  }

  static async insertTrend(payload: Omit<StakingHistory, 'id' | 'created_at'>) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('trends')
        .insert({ ...payload })
        .select()
        .single()

      if (error)
        return apiResponse(false, 'Failed to insert trend', error.message)

      return apiResponse(true, 'trends created successfully', data)
    } catch (error: any) {
      return apiResponse(false, 'Error creating trends', error.message)
    }
  }
}
