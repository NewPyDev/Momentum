'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { goalsApi } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/header'
import { GoalCard } from '@/components/goals/goal-card'
import { CreateGoalModal } from '@/components/goals/create-goal-modal'
import { AdBanner } from '@/components/ads/ad-banner'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus, Target } from 'lucide-react'

export function Dashboard() {
  const { user } = useAuth()
  const [showCreateGoal, setShowCreateGoal] = useState(false)

  const { data: goals, isLoading, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getAll,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-muted-foreground">
            Keep building momentum towards your goals.
          </p>
        </motion.div>

        {/* Ad Banner for Free Users */}
        {!user?.is_premium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <AdBanner />
          </motion.div>
        )}

        {/* Goals Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Goals</h2>
          <Button onClick={() => setShowCreateGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {goals && goals.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GoalCard goal={goal} onUpdate={refetch} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first goal to start building momentum!
            </p>
            <Button onClick={() => setShowCreateGoal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </motion.div>
        )}

        {/* Free User Limitations */}
        {!user?.is_premium && goals && goals.length >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border"
          >
            <h3 className="font-semibold mb-2">Goal Limit Reached</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've reached the 5-goal limit for free accounts. Upgrade to Premium for unlimited goals and no ads!
            </p>
            <Button size="sm">Upgrade to Premium</Button>
          </motion.div>
        )}
      </main>

      <CreateGoalModal
        isOpen={showCreateGoal}
        onClose={() => setShowCreateGoal(false)}
        onSuccess={refetch}
      />
    </div>
  )
}