// src/hooks/useIdeas.js
import { useQuery } from '@tanstack/react-query'
import * as ideaService from '../api/ideaService'

export function useAllIdeas() {
  return useQuery(
    ['ideas', 'all'],
    ideaService.fetchAllIdeas
  )
}

export function useOverallTop() {
  return useQuery(
    ['ideas', 'overall'],
    ideaService.fetchOverallTop
  )
}

export function useTopByFile(filename) {
  return useQuery(
    ['ideas', 'top', filename],
    () => ideaService.fetchTopByFile(filename),
    { enabled: !!filename }
  )
}

export function useIdeaDetail(id, options = {}) {
  return useQuery(
    ['ideas', 'detail', id],
    () => ideaService.fetchIdeaById(id),
    { enabled: Boolean(id), ...options }
  )
}