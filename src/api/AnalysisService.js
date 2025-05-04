// src/services/AnalysisService.js
import axiosInstance from './axiosInstance'

const AnalysisService = {
  analyzeCsv,
  analyzeSingle,
}

function analyzeCsv(file, roiWeight = 0.6, eieWeight = 0.4) {
  const formData = new FormData()
  formData.append('file', file)

  return axiosInstance
    .post('/analyze/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: {
        roi_weight: roiWeight,
        eie_weight: eieWeight,
      },
    })
    .then(res => res.data) // { status: 'ok', filename: '...' }
}

function analyzeSingle(idea, roiWeight = 0.6, eieWeight = 0.4) {
  return axiosInstance
    .post(
      '/analyze/single',
      idea,
      {
        params: {
          roi_weight: roiWeight,
          eie_weight: eieWeight,
        }
      }
    )
    .then(res => res.data) // { status: 'ok', idea_id: '...', analysis: { ... } }
}

export default AnalysisService
