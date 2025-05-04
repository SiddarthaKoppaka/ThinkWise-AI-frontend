import { useQuery } from '@tanstack/react-query'
import * as ideaService from '../api/ideaService'

/**
 * Hook to fetch analytics summary metrics for the user's ideas.
 * @param {object} options React Query options
 */
export function useAnalytics(options = {}) {
  return useQuery(
    ['analytics'],
    ideaService.fetchAnalytics,
    { ...options }
  )
}