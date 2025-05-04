// src/services/AnalysisService.js
import axiosInstance from './axiosInstance'

const AnalysisService = {
  analyzeCsv,
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

export default AnalysisService
