'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { rewardsApi } from '@/lib/api'
import { Header } from '@/components/header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Flame, Award, Target } from 'lucide-react'

export default function RewardsPage() {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: rewardsApi.getUserRewards,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  const mockBadges = [
    { id: '1', name: 'First Goal', description: 'Created your first goal', icon: '🎯', type: 'bronze', earned: true },
    { id: '2', name: 'Goal Crusher', description: 'Completed 5 goals', icon: '💪', type: 'silver', earned: false },
    { id: '3', name: 'Momentum Master', description: 'Completed 10 goals', icon: '🏆', type: 'gold', earned: false },
    { id: '4', name: 'Streak Keeper', description: '7-day streak', icon: '🔥', type: 'bronze', earned: true },
    { id: '5', name: 'Consistency King', description: '30-day streak', icon: '👑', type: 'gold', earned: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Rewards</h1>
          <p className="text-muted-foreground">
            Track your progress and earn badges for achieving milestones
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border p-6 text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{rewards?.total_points || 0}</h3>
            <p className="text-muted-foreground">Total Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border p-6 text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{rewards?.current_streak || 0}</h3>
            <p className="text-muted-foreground">Current Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border p-6 text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{mockBadges.filter(b => b.earned).length}</h3>
            <p className="text-muted-foreground">Badges Earned</p>
          </motion.div>
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border p-8"
        >
          <h2 className="text-2xl font-semibold mb-6">Achievement Badges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border text-center transition-all ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' 
                    : 'bg-muted/50 border-muted opacity-60'
                }`}
              >
                <div className={`text-4xl mb-3 ${badge.earned ? '' : 'grayscale'}`}>
                  {badge.icon}
                </div>
                <h3 className="font-semibold mb-2">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                
                <Badge 
                  variant={badge.earned ? 'default' : 'outline'}
                  className={
                    badge.earned 
                      ? badge.type === 'gold' 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0'
                        : badge.type === 'silver'
                        ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white border-0'
                        : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white border-0'
                      : ''
                  }
                >
                  {badge.earned ? 'Earned' : 'Locked'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Keep Building Momentum!</h3>
            <p className="text-muted-foreground">
              Complete more goals and maintain your streak to unlock new badges and earn more points.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}