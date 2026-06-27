// client/src/utils/helpers.js

export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return 'Rp 0'
  return 'Rp ' + parseFloat(value).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

export function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return '-'
  let standardized = dateStr
  if (typeof standardized === 'string' && standardized.includes(' ') && !standardized.includes('T')) {
    standardized = standardized.replace(' ', 'T')
  }
  const date = new Date(standardized)
  if (isNaN(date.getTime())) return '-'
  const tz = { timeZone: 'Asia/Jakarta' }
  if (includeTime) {
    return date.toLocaleString('id-ID', { ...tz, year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  return date.toLocaleDateString('id-ID', { ...tz, year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatTime(dateStr) {
  if (!dateStr) return '-'
  try {
    let standardized = dateStr
    if (typeof standardized === 'string' && standardized.includes(' ') && !standardized.includes('T')) {
      standardized = standardized.replace(' ', 'T')
    }
    const date = new Date(standardized)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')
  } catch (e) {
    return '-'
  }
}

export function getImageUrl(imgPath, fallback = '/assets/images/placeholder.jpg') {
  if (!imgPath) return fallback
  // If already a full URL (http/https), return as-is
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
  // Otherwise treat as local path
  return '/' + imgPath
}
