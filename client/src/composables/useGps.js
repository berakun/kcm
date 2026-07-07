// client/src/composables/useGps.js
import { ref } from 'vue'
import axios from 'axios'

export function useGps() {
  const position = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const isTracking = ref(false)
  const lastTrackingResult = ref(null)
  const officeRadius = ref(20) // default, akan di-update dari server

  let watchId = null
  let trackingInterval = null

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
    
    // Fetch dynamic office settings (termasuk radius)
    let officeLat = -7.6982573
    let officeLng = 110.405383
    let radiusMeters = 5
    
    try {
      const res = await axios.get('/api/attendance/settings')
      officeLat = parseFloat(res.data.office_latitude)
      officeLng = parseFloat(res.data.office_longitude)
      radiusMeters = parseFloat(res.data.office_radius || '5')
      officeRadius.value = radiusMeters
    } catch (e) {
      console.warn('Failed to load office settings from server, using hardcoded fallback.')
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
            accuracy: pos.coords.accuracy,
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

  // === REAL-TIME GPS TRACKING (Anti-Cheat) ===
  function startTracking() {
    if (isTracking.value) return
    isTracking.value = true

    // Kirim GPS pertama kali sekarang
    sendGpsUpdate()

    // Kirim GPS tiap 60 detik
    trackingInterval = setInterval(() => {
      sendGpsUpdate()
    }, 60000)

    // Watch position untuk perubahan real-time (fallback)
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          position.value = pos.coords
        },
        () => {}, // silent fail
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
      )
    }
  }

  function stopTracking() {
    isTracking.value = false
    if (trackingInterval) {
      clearInterval(trackingInterval)
      trackingInterval = null
    }
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  async function sendGpsUpdate() {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve(p.coords),
          (e) => reject(e),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
      })

      const res = await axios.post('/api/attendance/track-gps', {
        latitude: pos.latitude,
        longitude: pos.longitude,
        accuracy: pos.accuracy
      })

      lastTrackingResult.value = res.data
      return res.data
    } catch (e) {
      console.warn('GPS tracking error:', e.message)
      return null
    }
  }

  return {
    position, error, loading,
    isTracking, lastTrackingResult, officeRadius,
    getCurrentPosition,
    startTracking, stopTracking, sendGpsUpdate,
    calculateDistance
  }
}
