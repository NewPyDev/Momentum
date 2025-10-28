'use client'

import { useEffect } from 'react'

export function AdBanner() {
  useEffect(() => {
    // Initialize Google AdSense if available
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [])

  return (
    <div className="w-full bg-muted/50 border border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
      {/* Placeholder for development */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Advertisement</div>
        <div className="text-xs text-muted-foreground">
          Upgrade to Premium to remove ads
        </div>
      </div>
      
      {/* Google AdSense - Replace with your ad unit */}
      {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
          data-ad-slot="your-ad-slot-id"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  )
}