import axios from 'axios'
import Cookies from 'js-cookie'
import { 
  User, 
  Goal, 
  Step, 
  UserReward, 
  AuthResponse, 
  CreateGoalRequest, 
  UpdateGoalRequest, 
  CreateStepRequest 
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { email, password, username })
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Goals API
export const goalsApi = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get('/goals')
    return response.data
  },

  getById: async (id: string): Promise<Goal> => {
    const response = await api.get(`/goals/${id}`)
    return response.data
  },

  create: async (data: CreateGoalRequest): Promise<Goal> => {
    const response = await api.post('/goals', data)
    return response.data
  },

  update: async (id: string, data: UpdateGoalRequest): Promise<Goal> => {
    const response = await api.put(`/goals/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`)
  },
}

// Steps API
export const stepsApi = {
  create: async (goalId: string, data: CreateStepRequest): Promise<Step> => {
    const response = await api.post(`/goals/${goalId}/steps`, data)
    return response.data
  },

  update: async (goalId: string, stepId: string, data: Partial<Step>): Promise<Step> => {
    const response = await api.put(`/goals/${goalId}/steps/${stepId}`, data)
    return response.data
  },

  delete: async (goalId: string, stepId: string): Promise<void> => {
    await api.delete(`/goals/${goalId}/steps/${stepId}`)
  },

  toggleComplete: async (goalId: string, stepId: string): Promise<Step> => {
    const response = await api.patch(`/goals/${goalId}/steps/${stepId}/toggle`)
    return response.data
  },
}

// Rewards API
export const rewardsApi = {
  getUserRewards: async (): Promise<UserReward> => {
    const response = await api.get('/rewards')
    return response.data
  },
}

// Payments API
export const paymentsApi = {
  createSubscription: async (): Promise<{ checkout_url: string }> => {
    const response = await api.post('/payments/subscribe')
    return response.data
  },

  cancelSubscription: async (): Promise<void> => {
    await api.post('/payments/cancel')
  },
}