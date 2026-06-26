// client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import UsersView from '../views/admin/UsersView.vue'
import PortfolioManageView from '../views/admin/PortfolioManageView.vue'
import RabView from '../views/admin/RabView.vue'
import FinancialView from '../views/admin/FinancialView.vue'
import AttendanceManageView from '../views/admin/AttendanceManageView.vue'
import AttendanceRekapView from '../views/admin/AttendanceRekapView.vue'
import SettingsView from '../views/admin/SettingsView.vue'
import POBelanjaView from '../views/admin/POBelanjaView.vue'
import SalarySlipView from '../views/admin/SalarySlipView.vue'
import StaffAttendanceView from '../views/user/StaffAttendanceView.vue'

const routes = [
  { path: '/', component: LandingView, name: 'landing' },
  { path: '/login', component: LoginView, name: 'login' },
  { path: '/portfolio', component: PortfolioView, name: 'portfolio' },
  
  // Admin Routes (Admin & Super Admin)
  { 
    path: '/admin', 
    component: DashboardView, 
    name: 'admin-dashboard',
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  { 
    path: '/admin/portfolio', 
    component: PortfolioManageView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  { 
    path: '/admin/rab', 
    component: RabView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  { 
    path: '/admin/financial', 
    component: FinancialView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  { 
    path: '/admin/po-belanja', 
    component: POBelanjaView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },
  
  // Super Admin Only Routes
  { 
    path: '/admin/users', 
    component: UsersView, 
    meta: { requiresAuth: true, roles: ['super_admin'] } 
  },
  { 
    path: '/admin/salary', 
    component: SalarySlipView, 
    meta: { requiresAuth: true, roles: ['super_admin'] } 
  },
  { 
    path: '/admin/attendance', 
    component: AttendanceManageView, 
    meta: { requiresAuth: true, roles: ['super_admin'] } 
  },
  { 
    path: '/admin/settings', 
    component: SettingsView, 
    meta: { requiresAuth: true, roles: ['super_admin'] } 
  },

  // Admin and Super Admin Read-Only
  { 
    path: '/admin/attendance/rekap', 
    component: AttendanceRekapView, 
    meta: { requiresAuth: true, roles: ['super_admin', 'admin'] } 
  },

  // Staff Only Route
  { 
    path: '/absensi', 
    component: StaffAttendanceView, 
    name: 'staff-attendance',
    meta: { requiresAuth: true, roles: ['staff'] } 
  },

  // Fallback redirect
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Re-check auth status with server if token exists
  if (authStore.token && !authStore.user) {
    await authStore.checkAuthStatus()
  }

  const isAuthenticated = authStore.isAuthenticated
  const user = authStore.user

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next({ name: 'login' })
    }

    if (to.meta.roles && !to.meta.roles.includes(user.role)) {
      // Role not allowed, redirect to correct home page
      if (['admin', 'super_admin'].includes(user.role)) {
        return next({ name: 'admin-dashboard' })
      } else if (user.role === 'staff') {
        return next({ name: 'staff-attendance' })
      } else {
        authStore.logout()
        return next({ name: 'login' })
      }
    }
  }

  // If going to login while authenticated, send home
  if (to.name === 'login' && isAuthenticated) {
    if (['admin', 'super_admin'].includes(user.role)) {
      return next({ name: 'admin-dashboard' })
    } else if (user.role === 'staff') {
      return next({ name: 'staff-attendance' })
    } else {
      authStore.logout()
      return next()
    }
  }

  next()
})

export default router
