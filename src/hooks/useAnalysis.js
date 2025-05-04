// src/hooks/useAnalysis.js
import { useMutation } from '@tanstack/react-query'
import AnalysisService from '../api/AnalysisService'

export function useAnalyzeCsv() {
  return useMutation(
    ({ file, roiWeight, eieWeight }) =>
      AnalysisService.analyzeCsv(file, roiWeight, eieWeight)
  )
}
