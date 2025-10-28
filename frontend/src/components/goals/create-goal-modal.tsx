'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { goalsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Target, Smile } from 'lucide-react'

interface CreateGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const EMOJI_OPTIONS = ['🎯', '💪', '🚀', '⭐', '🏆', '📚', '💼', '🏃‍♂️', '🎨', '🌟']

export function CreateGoalModal({ isOpen, onClose, onSuccess }: CreateGoalModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_steps: 5,
    emoji: ''
  })
  const [error, setError] = useState('')

  const createGoalMutation = useMutation({
    mutationFn: goalsApi.create,
    onSuccess: () => {
      onSuccess()
      onClose()
      setFormData({ title: '', description: '', total_steps: 5, emoji: '' })
      setError('')
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to create goal')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Goal title is required')
      return
    }
    if (formData.total_steps < 1) {
      setError('Goal must have at least 1 step')
      return
    }
    
    createGoalMutation.mutate(formData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Target className="w-6 h-6 mr-2" />
            Create New Goal
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Emoji Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Choose an emoji (optional)</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleInputChange('emoji', formData.emoji === emoji ? '' : emoji)}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg hover:bg-muted transition-colors ${
                    formData.emoji === emoji ? 'border-primary bg-primary/10' : 'border-muted'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">Goal Title *</label>
            <Input
              placeholder="e.g., Learn Spanish, Run a Marathon, Read 12 Books"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Describe your goal and why it's important to you..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Total Steps */}
          <div>
            <label className="text-sm font-medium mb-2 block">Number of Steps</label>
            <Input
              type="number"
              min="1"
              max="100"
              value={formData.total_steps}
              onChange={(e) => handleInputChange('total_steps', parseInt(e.target.value) || 1)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Break your goal into {formData.total_steps} manageable steps
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createGoalMutation.isPending} className="flex-1">
              {createGoalMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Create Goal'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}