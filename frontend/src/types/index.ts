export interface User {
  id: string
  email: string
  username: string
  is_premium: boolean
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  title: string
  description: string
  total_steps: number
  completed_steps: number
  progress: number
  emoji?: string
  image_url?: string
  user_id: string
  created_at: string
  updated_at: string
  steps: Step[]
}

export interface Step {
  id: string
  title: string
  description?: string
  is_completed: boolean
  goal_id: string
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  type: 'bronze' | 'silver' | 'gold'
  earned_at?: string
}

export interface UserReward {
  id: string
  user_id: string
  total_points: number
  current_streak: number
  longest_streak: number
  badges: Badge[]
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface CreateGoalRequest {
  title: string
  description: string
  total_steps: number
  emoji?: string
  image_url?: string
}

export interface UpdateGoalRequest {
  title?: string
  description?: string
  total_steps?: number
  emoji?: string
  image_url?: string
}

export interface CreateStepRequest {
  title: string
  description?: string
}