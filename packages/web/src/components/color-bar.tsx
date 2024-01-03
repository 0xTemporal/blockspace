'use client'

import { FastAverageColor } from 'fast-average-color'
import { useEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'

const fac = new FastAverageColor()

type ColorBarProps = {
  avatar: string
  size?: 'sm' | 'lg'
  className?: string
}

export const ColorBar = ({ avatar, size = 'lg', className }: ColorBarProps) => {
  const [color, setColor] = useState<string>()

  useEffect(() => {
    ;(async () => {
      try {
        const { hex } = await fac.getColorAsync(avatar)
        setColor(hex)
      } catch {
        setColor('#333')
      }
    })()
  }, [avatar])

  return (
    <div
      className={twJoin(
        'w-full transition-colors',
        !color && 'animate-pulse bg-slate-300 duration-500',
        size === 'lg' ? 'h-24' : 'h-5',
        className,
      )}
      style={{ background: color }}
    />
  )
}
