import React, { ReactNode } from 'react'
import { Card, CardContent, CardTitle } from '../card'
import { cn } from '@/lib/utils'

interface CardContainerProps {
  children: ReactNode
  title: string
  className?: string
}

const CardContainer = ({children, title, className=""}: CardContainerProps) => {
  return (
    <Card className={cn("h-full px-6 shadow-sm", className)}>
      <CardTitle className="text-lg font-bold border-b-4 border-b-red-500">{title}</CardTitle>
      <CardContent className="h-full rounded-xl p-0 overflow-hidden">
        {children}
      </CardContent>
    </Card>
  )
}

export default CardContainer
