'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import { User, Crown, Moon, Sun, Bell, Shield, CreditCard } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)

  const handleUpgrade = () => {
    // In production, this would redirect to Paddle checkout
    window.open('https://checkout.paddle.com/subscription?vendor=demo', '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Account Information */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Username</label>
                  <Input value={user?.username || ''} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Member Since</label>
                  <Input 
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''} 
                    disabled 
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about your progress</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" onClick={logout} className="w-full justify-start text-destructive hover:text-destructive">
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Subscription Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Current Plan */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
              
              {user?.is_premium ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 mb-4">
                    Premium Member
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enjoy unlimited goals and ad-free experience
                  </p>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className="mb-4">
                    Free Plan
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    Limited to 5 goals with ads
                  </p>
                  <Button onClick={handleUpgrade} className="w-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>

            {/* Premium Benefits */}
            {!user?.is_premium && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border p-6">
                <h3 className="font-semibold mb-4">Premium Benefits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    Unlimited goals
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    No advertisements
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    Exclusive badge themes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    Priority support
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}