'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Goal } from '@/types'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Eye, Target } from 'lucide-react'
import { calculateProgress, getBadgeForProgress } from '@/lib/utils'
import Link from 'next/link'

interface GoalCardProps {
  goal: Goal
  onUpdate: () => void
}

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const progress = calculateProgress(goal.completed_steps, goal.total_steps)
  const badgeType = getBadgeForProgress(progress)

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'gold': return 'default'
      case 'silver': return 'secondary'
      case 'bronze': return 'outline'
      default: return 'outline'
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600'
      default: return ''
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {goal.emoji ? (
              <span className="text-2xl">{goal.emoji}</span>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg leading-tight">{goal.title}</h3>
              {badgeType !== 'none' && (
                <Badge 
                  variant={getBadgeVariant(badgeType)}
                  className={`text-xs mt-1 ${getBadgeColor(badgeType)} text-white border-0`}
                >
                  {badgeType.charAt(0).toUpperCase() + badgeType.slice(1)} Badge
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/goals/${goal.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Goal
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{goal.completed_steps} of {goal.total_steps} steps</span>
            <span>{goal.total_steps - goal.completed_steps} remaining</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-muted/30 border-t">
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href={`/goals/${goal.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}