'use client'

import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface StatusBarProps {
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function StatusBar({ status }: StatusBarProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          bgClass: 'bg-success',
          textClass: 'text-success-foreground',
          icon: CheckCircle2,
          text: 'CHO XE QUA',
        }
      case 'error':
        return {
          bgClass: 'bg-destructive',
          textClass: 'text-destructive-foreground',
          icon: AlertCircle,
          text: 'LỖI',
        }
      case 'loading':
        return {
          bgClass: 'bg-muted',
          textClass: 'text-foreground',
          icon: Clock,
          text: 'ĐANG KIỂM TRA...',
        }
      default:
        return {
          bgClass: 'bg-muted',
          textClass: 'text-muted-foreground',
          icon: Clock,
          text: 'ĐANG CHỜ XE ĐẾN...',
        }
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <div className={`w-full ${config.bgClass} ${config.textClass} rounded-lg p-4 flex items-center gap-4 transition-all duration-300`}>
      <div className="flex-shrink-0">
        {status === 'loading' ? (
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
          </div>
        ) : (
          <IconComponent className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xl font-bold">{config.text}</p>
      </div>
    </div>
  )
}
