'use client'

import { useEffect, useState } from 'react'

export function DashboardHeader() {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
      setDate(now.toLocaleDateString('vi-VN', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="mt-2">
          <h1 className="text-xl font-bold text-foreground">
            HỆ THỐNG QUẢN LÝ GIỮ XE
          </h1>
          <div className='flex justify-around'>
            <button className="text-sm text-primary-foreground font-bold px-2 bg-primary rounded-xl cursor-pointer">
            Cổng vào
          </button>
          <button className="text-sm text-primary-foreground font-bold px-2 bg-primary rounded-xl cursor-pointe">
            Cổng ra
          </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="text-2xl font-bold tabular-nums text-foreground">
            {time}
          </div>
          <div className="text-sm text-muted-foreground">
            {date}
          </div>
        </div>
      </div>
    </header>
  )
}
