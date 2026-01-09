// app/squad/components/squad-grid-card-details.tsx
"use client"

import { PlayerStatistics } from "@/lib/schemas/players"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { Timer, Shirt, ArrowUpRight, Shield, CircleSlash, Target, CalendarDays, Globe, Ruler, Weight } from "lucide-react"

type PlayerStatsPanelProps = {
  player: PlayerStatistics
  onClose: () => void
}

export default function PlayerStatsPanel({ player, onClose }: PlayerStatsPanelProps) {
  const plStats = player.statistics.find(s => s.league.id === 39)
  const pInfo = player.player
  const position = plStats?.games?.position
  const isGoalkeeper = position === "Goalkeeper"

  const formatUnit = (value: string | number | null, unit: string) => {
    if (!value) return null
    const valStr = String(value)
    if (valStr.toLowerCase().includes(unit.toLowerCase())) return valStr
    return `${valStr} ${unit}`
  }

  const heightDisplay = formatUnit(pInfo.height, "cm")
  const weightDisplay = formatUnit(pInfo.weight, "kg")

  const rawRating = plStats?.games?.rating ? parseFloat(plStats.games.rating) : 0
  const ratingColor = 
    rawRating >= 7.5 ? "#10b981" : 
    rawRating >= 7.0 ? "#22c55e" : 
    rawRating >= 6.0 ? "#eab308" : 
    "#94a3b8"

  const ratingData = [{ value: rawRating, fill: ratingColor }]

  // Standardized Styles
  const WIDGET_TITLE_STYLE = "text-sm font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-4 mb-4 -mx-5 px-5"
  
  // HERO STATS
  const HERO_NUMBER_STYLE = "text-2xl font-bold text-slate-900 leading-none"
  const HERO_LABEL_STYLE = "text-sm text-slate-500 font-medium mt-1 block" // Reverted centering
  
  // ICON STYLE (Neutral Slate)
  const ICON_STYLE = "w-5 h-5 text-slate-400 mr-2" 

  // Detailed Stats Styles
  const DETAIL_LABEL_STYLE = "text-sm text-slate-500 font-medium" 
  const DETAIL_VALUE_STYLE = "text-base font-bold text-slate-900"

  const passAccuracy = plStats?.passes?.accuracy
  const totalShots = plStats?.shots?.total ?? 0
  const shotsOnTarget = plStats?.shots?.on ?? 0
  const shotAccuracy = totalShots > 0 ? Math.round((shotsOnTarget / totalShots) * 100) : 0

  return (
    <div className="relative w-full outline-4 outline-red-500 bg-white p-6 sm:p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 transition-colors z-10"
        aria-label="Close details"
      >
        ✕
      </button>

      <div className="flex flex-col gap-6 pt-2">
        
        {/* Row 1: Profile (Full Width) */}
        <div className="rounded-xl bg-slate-50 p-5">
           <div className={WIDGET_TITLE_STYLE}>Profile</div>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <ProfileItem 
                label="Age" 
                value={pInfo.age} 
                icon={<CalendarDays className={ICON_STYLE} />}
                numberStyle={HERO_NUMBER_STYLE} 
                labelStyle={HERO_LABEL_STYLE} 
              />
              <ProfileItem 
                label="Nationality" 
                value={pInfo.nationality} 
                icon={<Globe className={ICON_STYLE} />}
                numberStyle="text-xl font-bold text-slate-900 leading-none truncate" 
                labelStyle={HERO_LABEL_STYLE} 
              />
              <ProfileItem 
                label="Height" 
                value={heightDisplay} 
                icon={<Ruler className={ICON_STYLE} />}
                numberStyle={HERO_NUMBER_STYLE} 
                labelStyle={HERO_LABEL_STYLE} 
              />
              <ProfileItem 
                label="Weight" 
                value={weightDisplay} 
                icon={<Weight className={ICON_STYLE} />}
                numberStyle={HERO_NUMBER_STYLE} 
                labelStyle={HERO_LABEL_STYLE} 
              />
           </div>
        </div>

        {/* Row 2: Stats Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Season Overview */}
            <div className="lg:col-span-1 rounded-xl bg-slate-50 p-5 h-full">
                <div className={WIDGET_TITLE_STYLE}>Season Overview</div>
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center">
                                <Shirt className={ICON_STYLE} />
                                <div className={HERO_NUMBER_STYLE}>{plStats?.games?.appearences ?? 0}</div>
                            </div>
                            <span className={HERO_LABEL_STYLE}>Appearances</span>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <Timer className={ICON_STYLE} />
                                <div className={HERO_NUMBER_STYLE}>{plStats?.games?.minutes ?? 0}</div>
                            </div>
                            <span className={HERO_LABEL_STYLE}>Minutes</span>
                        </div>
                    </div>
                    {!isGoalkeeper && (
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center">
                                <Target className={ICON_STYLE} /> 
                                <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.total ?? 0}</div>
                            </div>
                            <span className={HERO_LABEL_STYLE}>Goals</span>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <ArrowUpRight className={ICON_STYLE} />
                                <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.assists ?? 0}</div>
                            </div>
                            <span className={HERO_LABEL_STYLE}>Assists</span>
                        </div>
                        </div>
                    )}
                    {isGoalkeeper && (
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                             <div className="flex items-center">
                                <Shield className={ICON_STYLE} />
                                <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.saves ?? 0}</div>
                            </div>
                            <span className={HERO_LABEL_STYLE}>Saves</span>
                        </div>
                        <div>
                             <div className="flex items-center">
                                <CircleSlash className={ICON_STYLE} />
                                <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.conceded ?? 0}</div>
                            </div>
                            <span className={HERO_LABEL_STYLE}>Conceded</span>
                        </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <div>
                              <div className="flex items-center">
                                <div className={HERO_NUMBER_STYLE}>
                                    {rawRating > 0 ? rawRating.toFixed(2) : "N/A"}
                                </div>
                                <div className="h-10 w-10 ml-1 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart 
                                        innerRadius="60%" 
                                        outerRadius="100%" 
                                        barSize={5} 
                                        data={ratingData} 
                                        startAngle={90} 
                                        endAngle={-270}
                                        >
                                        <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
                                        <RadialBar background dataKey="value" cornerRadius={0} />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>
                              </div>
                              <span className={HERO_LABEL_STYLE}>Avg Rating</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end">
                          <div className="flex items-center gap-6 h-[30px]">
                              <div className="flex items-center gap-2">
                              <div className="h-6 w-4 rounded-[1px] bg-yellow-400 shadow-sm border border-yellow-500/20"></div>
                              <span className={HERO_NUMBER_STYLE}>{plStats?.cards?.yellow ?? 0}</span>
                              </div>
                              <div className="flex items-center gap-2">
                              <div className="h-6 w-4 rounded-[1px] bg-red-500 shadow-sm border border-red-600/20"></div>
                              <span className={HERO_NUMBER_STYLE}>{plStats?.cards?.red ?? 0}</span>
                              </div>
                          </div>
                          <span className={HERO_LABEL_STYLE}>Cards</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Detailed Statistics */}
            <div className="lg:col-span-2 rounded-xl bg-slate-50 p-6 h-full">
                <div className={WIDGET_TITLE_STYLE}>Detailed Statistics</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                
                {isGoalkeeper ? (
                    <>
                    <div className="space-y-4">
                        <StatRow label="Penalties Saved" value={plStats?.penalty?.saved ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        <StatRow label="Passes" value={plStats?.passes?.total ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                    </div>
                    <div className="space-y-4">
                        {passAccuracy && passAccuracy > 0 ? (
                        <AccuracyBar label="Pass Accuracy" percent={passAccuracy} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        ) : null}
                    </div>
                    </>
                ) : (
                    <>
                    <div className="space-y-6">
                        <div>
                        <StatRow label="Shots" value={totalShots} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        {totalShots > 0 && (
                            <div className="mt-2">
                            <AccuracyBar label="Shot Accuracy" percent={shotAccuracy} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                            </div>
                        )}
                        </div>
                        
                        <div>
                        <StatRow label="Passes" value={plStats?.passes?.total ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        {passAccuracy && passAccuracy > 0 ? (
                            <div className="mt-2">
                            <AccuracyBar label="Pass Accuracy" percent={passAccuracy} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                            </div>
                        ) : null}
                        </div>
                        <StatRow label="Key Passes" value={plStats?.passes?.key ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                    </div>

                    <div className="space-y-4">
                        <StatRow label="Dribbles Succ." value={plStats?.dribbles?.success ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        <StatRow label="Tackles" value={plStats?.tackles?.total ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        <StatRow label="Interceptions" value={plStats?.tackles?.interceptions ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        <StatRow label="Duels Won" value={plStats?.duels?.won ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                        <StatRow label="Blocks" value={plStats?.tackles?.blocks ?? 0} labelStyle={DETAIL_LABEL_STYLE} valueStyle={DETAIL_VALUE_STYLE} />
                    </div>
                    </>
                )}

                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

function ProfileItem({ label, value, icon, numberStyle, labelStyle }: { label: string, value: string | number | null, icon?: React.ReactNode, numberStyle: string, labelStyle: string }) {
  if (!value) return null
  return (
    <div>
      <div className="flex items-center">
        {icon}
        <p className={numberStyle}>{value}</p>
      </div>
      <p className={labelStyle}>{label}</p>
    </div>
  )
}

function StatRow({ label, value, subValue, labelStyle, valueStyle }: { label: string, value: string | number, subValue?: string, labelStyle: string, valueStyle: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className={labelStyle}>{label}</span>
      <span className={valueStyle}>
        {value} <span className="text-xs text-slate-400 font-normal ml-1">{subValue}</span>
      </span>
    </div>
  )
}

function AccuracyBar({ label, percent, labelStyle, valueStyle }: { label: string, percent: number, labelStyle: string, valueStyle: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className={labelStyle}>{label}</span>
        <span className={valueStyle}>{percent}%</span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
