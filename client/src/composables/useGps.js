// client/src/composables/useGps.js
import { ref } from 'vue'
import axios from 'axios'

export function useGps() {
  const position = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // Haversine formula
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000 // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  async function getCurrentPosition() {
    loading.value = true
    error.value = null
    
    // Fetch dynamic office settings
    let officeLat = -7.7326
    let officeLng = 110.3988
    let radiusMeters = 20
    
    try {
      const res = await axios.get('/api/attendance/settings')
      officeLat = parseFloat(res.data.office_latitude)
      officeLng = parseFloat(res.data.office_longitude)
      radiusMeters = parseFloat(res.data.office_radius)
    } catch (e) {
      console.warn('Failed to load office settings from server, using hardcoded fallback coordinates.')
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        error.value = 'Browser Anda tidak mendukung Geolocation.'
        loading.value = false
        reject(new Error(error.value))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          position.value = pos.coords
          const distance = calculateDistance(
            pos.coords.latitude, pos.coords.longitude,
            officeLat, officeLng
          )
          loading.value = false
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            distance: Math.round(distance),
            status: distance <= radiusMeters ? 'di_kantor' : 'luar_kantor'
          })
        },
        (err) => {
          let msg = 'Gagal mengakses GPS.'
          switch (err.code) {
            case err.PERMISSION_DENIED:
              msg = 'Akses lokasi ditolak.'
              break
            case err.POSITION_UNAVAILABLE:
              msg = 'Informasi lokasi tidak tersedia.'
              break
            case err.TIMEOUT:
              msg = 'Permintaan waktu lokasi habis.'
              break
          }
          error.value = msg
          loading.value = false
          reject(new Error(msg))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  return { position, error, loading, getCurrentPosition, calculateDistance }
}
