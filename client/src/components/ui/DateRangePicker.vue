<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger Input -->
    <div
      class="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-gray-400 transition-colors"
      @click="togglePicker"
    >
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span class="text-sm text-gray-700">{{ displayText }}</span>
    </div>

    <!-- Dropdown Picker -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 flex"
      :class="align === 'right' ? 'right-0' : 'left-0'"
    >
      <!-- Calendar Section -->
      <div class="p-4">
        <!-- Date Inputs -->
        <div class="flex gap-3 mb-4">
          <div class="flex items-center gap-2 border border-blue-500 rounded px-2 py-1.5">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <input
              type="date"
              :value="startDate"
              @input="updateStartDate($event.target.value)"
              class="text-sm border-0 outline-none w-28"
            />
          </div>
          <div class="flex items-center gap-2 border border-gray-300 rounded px-2 py-1.5">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <input
              type="date"
              :value="endDate"
              @input="updateEndDate($event.target.value)"
              class="text-sm border-0 outline-none w-28"
            />
          </div>
        </div>

        <!-- Calendars -->
        <div class="flex gap-4">
          <!-- Left Calendar -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <select v-model="leftMonth" class="text-sm font-semibold border-0 bg-transparent cursor-pointer">
                <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
              </select>
              <select v-model="leftYear" class="text-sm font-semibold border-0 bg-transparent cursor-pointer">
                <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            <div class="grid grid-cols-7 gap-0.5 text-center text-xs text-gray-500 mb-1">
              <div v-for="d in weekDays" :key="d" class="py-1">{{ d }}</div>
            </div>
            <div class="grid grid-cols-7 gap-0.5 text-center">
              <div
                v-for="(day, i) in leftCalendarDays"
                :key="'l'+i"
                class="py-1.5 text-sm cursor-pointer rounded"
                :class="getDayClass(day, 'left')"
                @click="selectDate(day, 'left')"
              >
                {{ day.date || '' }}
              </div>
            </div>
          </div>

          <!-- Right Calendar -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <select v-model="rightMonth" class="text-sm font-semibold border-0 bg-transparent cursor-pointer">
                <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
              </select>
              <select v-model="rightYear" class="text-sm font-semibold border-0 bg-transparent cursor-pointer">
                <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
              </select>
              <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div class="grid grid-cols-7 gap-0.5 text-center text-xs text-gray-500 mb-1">
              <div v-for="d in weekDays" :key="d" class="py-1">{{ d }}</div>
            </div>
            <div class="grid grid-cols-7 gap-0.5 text-center">
              <div
                v-for="(day, i) in rightCalendarDays"
                :key="'r'+i"
                class="py-1.5 text-sm cursor-pointer rounded"
                :class="getDayClass(day, 'right')"
                @click="selectDate(day, 'right')"
              >
                {{ day.date || '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Presets -->
      <div class="border-l border-gray-200 p-4 flex flex-col justify-between" style="min-width: 140px;">
        <div class="space-y-2">
          <button
            v-for="preset in presets"
            :key="preset.label"
            @click="applyPreset(preset)"
            class="block w-full text-left px-3 py-1.5 text-sm rounded transition-colors"
            :class="activePreset === preset.label ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ preset.label }}
          </button>
        </div>
        <div class="flex gap-2 mt-4">
          <button
            @click="applySelection"
            class="flex-1 bg-green-500 text-white text-sm py-1.5 px-3 rounded hover:bg-green-600 transition-colors"
          >
            Apply
          </button>
          <button
            @click="cancelSelection"
            class="flex-1 border border-gray-300 text-gray-600 text-sm py-1.5 px-3 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  align: { type: String, default: 'left' }
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'change'])

const containerRef = ref(null)
const isOpen = ref(false)
const activePreset = ref(null)

const today = new Date()
const leftMonth = ref(today.getMonth())
const leftYear = ref(today.getFullYear())
const rightMonth = ref(today.getMonth() === 11 ? 0 : today.getMonth() + 1)
const rightYear = ref(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear())

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const yearRange = computed(() => {
  const years = []
  for (let y = today.getFullYear() - 5; y <= today.getFullYear() + 5; y++) {
    years.push(y)
  }
  return years
})

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 15 days', days: 15 },
  { label: 'Last 30 days', days: 30 },
  { label: 'This month', type: 'thisMonth' },
  { label: 'Last Month', type: 'lastMonth' },
  { label: 'Custom Range', type: 'custom' }
]

const displayText = computed(() => {
  if (props.startDate && props.endDate) {
    return `${props.startDate} - ${props.endDate}`
  }
  return 'Pilih tanggal...'
})

function getCalendarDays(month, year) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  const days = []
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: daysInPrevMonth - i, month: month - 1, year, isCurrentMonth: false })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, month, year, isCurrentMonth: true })
  }
  
  // Next month days
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, month: month + 1, year, isCurrentMonth: false })
  }
  
  return days
}

const leftCalendarDays = computed(() => getCalendarDays(leftMonth.value, leftYear.value))
const rightCalendarDays = computed(() => getCalendarDays(rightMonth.value, rightYear.value))

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function isInRange(day) {
  if (!props.startDate || !props.endDate) return false
  const start = parseDate(props.startDate)
  const end = parseDate(props.endDate)
  const current = new Date(day.year, day.month, day.date)
  return current >= start && current <= end
}

function isStartOrEnd(day) {
  const current = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
  return current === props.startDate || current === props.endDate
}

function getDayClass(day, side) {
  if (!day.isCurrentMonth) return 'text-gray-300'
  
  if (isStartOrEnd(day)) return 'bg-blue-500 text-white font-semibold'
  if (isInRange(day)) return 'bg-blue-100 text-blue-700'
  
  return 'hover:bg-gray-100'
}

function selectDate(day, side) {
  if (!day.isCurrentMonth) return
  
  const selected = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
  
  if (!props.startDate || (props.startDate && props.endDate)) {
    // Start new selection
    emit('update:startDate', selected)
    emit('update:endDate', '')
    activePreset.value = null
  } else {
    // Complete selection
    const start = parseDate(props.startDate)
    const clicked = parseDate(selected)
    
    if (clicked < start) {
      emit('update:startDate', selected)
      emit('update:endDate', props.startDate)
    } else {
      emit('update:endDate', selected)
    }
    activePreset.value = null
  }
}

function updateStartDate(val) {
  emit('update:startDate', val)
  activePreset.value = null
}

function updateEndDate(val) {
  emit('update:endDate', val)
  activePreset.value = null
}

function prevMonth() {
  if (leftMonth.value === 0) {
    leftMonth.value = 11
    leftYear.value--
  } else {
    leftMonth.value--
  }
  syncRightCalendar()
}

function nextMonth() {
  if (rightMonth.value === 11) {
    rightMonth.value = 0
    rightYear.value++
  } else {
    rightMonth.value++
  }
  syncLeftCalendar()
}

function syncRightCalendar() {
  if (leftMonth.value === 11) {
    rightMonth.value = 0
    rightYear.value = leftYear.value + 1
  } else {
    rightMonth.value = leftMonth.value + 1
    rightYear.value = leftYear.value
  }
}

function syncLeftCalendar() {
  if (rightMonth.value === 0) {
    leftMonth.value = 11
    leftYear.value = rightYear.value - 1
  } else {
    leftMonth.value = rightMonth.value - 1
    leftYear.value = rightYear.value
  }
}

function applyPreset(preset) {
  activePreset.value = preset.label
  
  if (preset.type === 'thisMonth') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    emit('update:startDate', formatDate(start))
    emit('update:endDate', formatDate(end))
  } else if (preset.type === 'lastMonth') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const end = new Date(today.getFullYear(), today.getMonth(), 0)
    emit('update:startDate', formatDate(start))
    emit('update:endDate', formatDate(end))
  } else if (preset.days) {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - preset.days)
    emit('update:startDate', formatDate(start))
    emit('update:endDate', formatDate(end))
  }
}

function applySelection() {
  emit('change')
  isOpen.value = false
}

function cancelSelection() {
  isOpen.value = false
}

function togglePicker() {
  isOpen.value = !isOpen.value
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
