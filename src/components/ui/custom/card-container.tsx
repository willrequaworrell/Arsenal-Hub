import React, { ReactNode } from 'react'
import { Card, CardContent, CardTitle } from '../card'

interface CardContainerProps {
  children: ReactNode
  title: string
}

const CardContainer = ({children, title}: CardContainerProps) => {
  return (
    <Card className="h-full px-6 shadow-sm">
      <CardTitle className="text-lg font-bold border-b-4 border-b-red-500">{title}</CardTitle>
      <CardContent className="h-full rounded-xl p-0 overflow-hidden">
        {children}
      </CardContent>
    </Card>
  )
}

export default CardContainer
