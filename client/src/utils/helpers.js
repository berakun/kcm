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
  const date = new Date(dateStr)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }
  return date.toLocaleDateString('id-ID', options)
}

export function formatTime(dateStr) {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toTimeString().split(' ')[0].substring(0, 5)
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
