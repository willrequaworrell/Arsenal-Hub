import React, { ReactNode } from 'react'
import { Card, CardContent, CardTitle } from '../card'
import { cn } from '@/lib/utils'

interface CardContainerProps {
  children: ReactNode
  title?: string
  className?: string
  onClick?: () => void
}

const CardContainer = ({children, title, className="", onClick}: CardContainerProps) => {
  return (
    <Card 
      className={cn("h-full py-0 shadow-sm rounded-none", className)}
      onClick={onClick}
    >
      {title && <CardTitle className="text-lg font-bold border-b-4 border-b-red-500">{title}</CardTitle>}
      <CardContent className="h-full  p-0 overflow-hidden">
        {children}
      </CardContent>
    </Card>
  )
}

export default CardContainer
