'use client'

import { AlertCircle, Info } from 'lucide-react'

interface MessageBoxProps {
  message?: string | null
  type?: 'info' | 'warning' | 'error'
}

export function MessageBox({ message, type = 'info' }: MessageBoxProps) {
  if (!message) {
    return (
      <div className="w-full bg-card border border-border rounded-lg p-4 min-h-20 flex items-center justify-center text-muted-foreground">
        <p className="text-sm">CHỜ DỮ LIỆU...</p>
      </div>
    )
  }

  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          bgClass: 'bg-destructive/10',
          borderClass: 'border-destructive/30',
          textClass: 'text-destructive',
          icon: AlertCircle,
        }
      case 'warning':
        return {
          bgClass: 'bg-amber-500/10',
          borderClass: 'border-amber-500/30',
          textClass: 'text-amber-500',
          icon: AlertCircle,
        }
      default:
        return {
          bgClass: 'bg-primary/10',
          borderClass: 'border-primary/30',
          textClass: 'text-blue-700',
          icon: Info,
        }
    }
  }

  const config = getTypeConfig()
  const IconComponent = config.icon

  return (
    <div className={`w-full ${config.bgClass} border ${config.borderClass} rounded-lg p-4 flex gap-3`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.textClass} mt-0.5`} />
      <p className={`text-sm font-medium ${config.textClass} flex items-center`}>
        {message}
      </p>
    </div>
  )
}
