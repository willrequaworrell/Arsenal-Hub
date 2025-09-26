import React, { ReactNode } from 'react'
import { Card, CardContent, CardTitle } from '../card'

interface DashboardCardProps {
  children: ReactNode
  title: string
}

const DashboardCard = ({children, title}: DashboardCardProps) => {
  return (
    <Card className="flex-1 h-full px-6 shadow-sm">
      <CardTitle className="text-lg font-bold border-b-4 border-b-red-500">{title}</CardTitle>
      <CardContent className="h-full rounded-xl p-0 overflow-hidden">
        {children}
      </CardContent>
    </Card>
  )
}

export default DashboardCard
