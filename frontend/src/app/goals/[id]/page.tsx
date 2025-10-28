'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { goalsApi, stepsApi } from '@/lib/api'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Check, X, Edit2, Trash2, Target } from 'lucide-react'
import { calculateProgress, getBadgeForProgress } from '@/lib/utils'
import Link from 'next/link'

export default function GoalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const goalId = params.id as string
  
  const [newStepTitle, setNewStepTitle] = useState('')
  const [isAddingStep, setIsAddingStep] = useState(false)

  const { data: goal, isLoading } = useQuery({
    queryKey: ['goal', goalId],
    queryFn: () => goalsApi.getById(goalId),
  })

  const addStepMutation = useMutation({
    mutationFn: (title: string) => stepsApi.create(goalId, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      setNewStepTitle('')
      setIsAddingStep(false)
    }
  })

  const toggleStepMutation = useMutation({
    mutationFn: (stepId: string) => stepsApi.toggleComplete(goalId, stepId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })

  const deleteStepMutation = useMutation({
    mutationFn: (stepId: string) => stepsApi.delete(goalId, stepId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', goalId] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })

  const handleAddStep = () => {
    if (newStepTitle.trim()) {
      addStepMutation.mutate(newStepTitle.trim())
    }
  }

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

  if (!goal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Goal not found</h1>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const progress = calculateProgress(goal.completed_steps, goal.total_steps)
  const badgeType = getBadgeForProgress(progress)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Goal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {goal.emoji ? (
                <span className="text-4xl">{goal.emoji}</span>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{goal.title}</h1>
                {badgeType !== 'none' && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
                    {badgeType.charAt(0).toUpperCase() + badgeType.slice(1)} Badge Earned!
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {goal.description && (
            <p className="text-muted-foreground mb-6">{goal.description}</p>
          )}

          {/* Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Progress</span>
              <span className="text-2xl font-bold gradient-text">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{goal.completed_steps} of {goal.total_steps} steps completed</span>
              <span>{goal.total_steps - goal.completed_steps} remaining</span>
            </div>
          </div>
        </motion.div>

        {/* Steps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Steps</h2>
            <Button onClick={() => setIsAddingStep(true)} disabled={isAddingStep}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>

          {/* Add Step Form */}
          {isAddingStep && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 border rounded-lg bg-muted/50"
            >
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter step title..."
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                  autoFocus
                />
                <Button 
                  onClick={handleAddStep} 
                  disabled={!newStepTitle.trim() || addStepMutation.isPending}
                >
                  {addStepMutation.isPending ? <LoadingSpinner size="sm" /> : <Check className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingStep(false)
                    setNewStepTitle('')
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Steps List */}
          <div className="space-y-3">
            {goal.steps && goal.steps.length > 0 ? (
              goal.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                    step.is_completed 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-background hover:bg-muted/50'
                  }`}
                >
                  <button
                    onClick={() => toggleStepMutation.mutate(step.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      step.is_completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {step.is_completed && <Check className="w-3 h-3" />}
                  </button>
                  
                  <span className={`flex-1 ${step.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                    {step.title}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteStepMutation.mutate(step.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No steps yet. Add your first step to get started!</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}