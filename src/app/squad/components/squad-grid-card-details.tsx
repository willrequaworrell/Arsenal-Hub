// app/squad/components/squad-grid-card-details.tsx
"use client"

import { PlayerStatistics } from "@/lib/api-football/schemas/players"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

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
  const WIDGET_TITLE_STYLE = "text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-4 mb-4 -mx-5 px-5"
  const HERO_NUMBER_STYLE = "text-3xl font-bold text-slate-900 leading-none"
  const HERO_LABEL_STYLE = "text-xs text-slate-400 font-medium mt-1 block"

  // Calculations for Accuracy Bars
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        
        {/* Left Column: Profile & Combined Overview */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* 1. Profile Summary Card */}
          <div className="rounded-xl bg-slate-50 p-5 flex flex-col">
            <div className={WIDGET_TITLE_STYLE}>Profile</div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <ProfileItem label="Age" value={pInfo.age} numberStyle={HERO_NUMBER_STYLE} labelStyle={HERO_LABEL_STYLE} />
              <ProfileItem label="Nationality" value={pInfo.nationality} numberStyle="text-2xl font-bold text-slate-900 leading-none truncate" labelStyle={HERO_LABEL_STYLE} />
              <ProfileItem label="Height" value={heightDisplay} numberStyle={HERO_NUMBER_STYLE} labelStyle={HERO_LABEL_STYLE} />
              <ProfileItem label="Weight" value={weightDisplay} numberStyle={HERO_NUMBER_STYLE} labelStyle={HERO_LABEL_STYLE} />
            </div>
          </div>

          {/* 2. Season Overview (Combined Widget) */}
          <div className="rounded-xl bg-slate-50 p-5 flex flex-col">
            <div className={WIDGET_TITLE_STYLE}>Season Overview</div>
            
            <div className="flex flex-col gap-6">
              
              {/* Row 1: Playing Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={HERO_NUMBER_STYLE}>{plStats?.games?.appearences ?? 0}</div>
                  <span className={HERO_LABEL_STYLE}>Appearances</span>
                </div>
                <div>
                  <div className={HERO_NUMBER_STYLE}>{plStats?.games?.minutes ?? 0}</div>
                  <span className={HERO_LABEL_STYLE}>Minutes Played</span>
                </div>
              </div>

              {/* Row 2: Goals & Assists (Outfield) or Saves/Conceded (GK) */}
              {!isGoalkeeper && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.total ?? 0}</div>
                    <span className={HERO_LABEL_STYLE}>Goals</span>
                  </div>
                  <div>
                    <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.assists ?? 0}</div>
                    <span className={HERO_LABEL_STYLE}>Assists</span>
                  </div>
                </div>
              )}
              {isGoalkeeper && (
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.saves ?? 0}</div>
                    <span className={HERO_LABEL_STYLE}>Saves</span>
                  </div>
                   <div>
                    <div className={HERO_NUMBER_STYLE}>{plStats?.goals?.conceded ?? 0}</div>
                    <span className={HERO_LABEL_STYLE}>Conceded</span>
                  </div>
                 </div>
              )}

              {/* Row 3: Performance & Discipline */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="flex flex-col">
                   <div className="flex items-end gap-3 relative">
                    <div>
                      <div className={HERO_NUMBER_STYLE}>
                        {rawRating > 0 ? rawRating.toFixed(2) : "N/A"}
                      </div>
                      <span className={HERO_LABEL_STYLE}>Avg Rating</span>
                    </div>
                    <div className="h-10 w-10 relative pb-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          innerRadius="70%" 
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
        </div>

        {/* Right Column: Detailed Statistics (Unified List) */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="rounded-xl bg-slate-50 p-6 h-full">
            <div className={WIDGET_TITLE_STYLE}>Detailed Statistics</div>
            
            <div className="space-y-4 mt-2">
              {isGoalkeeper ? (
                <>
                  <StatRow label="Penalties Saved" value={plStats?.penalty?.saved ?? 0} />
                  
                   <div className="py-2">
                    <StatRow label="Passes" value={plStats?.passes?.total ?? 0} />
                    {passAccuracy && passAccuracy > 0 ? (
                      <AccuracyBar label="Pass Accuracy" percent={passAccuracy} />
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  {/* Shooting Section */}
                  {/* Removed border-b and mb-2 */}
                  <div>
                    <StatRow label="Shots" value={totalShots} />
                    {totalShots > 0 && (
                      <AccuracyBar label="Shot Accuracy" percent={shotAccuracy} />
                    )}
                  </div>

                  {/* Passing Section */}
                   {/* Removed border-b and mb-2 */}
                   <div>
                    <StatRow label="Passes" value={plStats?.passes?.total ?? 0} />
                    {passAccuracy && passAccuracy > 0 ? (
                      <AccuracyBar label="Pass Accuracy" percent={passAccuracy} />
                    ) : null}
                     <StatRow label="Key Passes" value={plStats?.passes?.key ?? 0} />
                  </div>

                  {/* Other Stats */}
                  <StatRow label="Dribbles Succ." value={plStats?.dribbles?.success ?? 0} />
                  <StatRow label="Tackles" value={plStats?.tackles?.total ?? 0} />
                  <StatRow label="Interceptions" value={plStats?.tackles?.interceptions ?? 0} />
                  <StatRow label="Duels Won" value={plStats?.duels?.won ?? 0} />
                  <StatRow label="Blocks" value={plStats?.tackles?.blocks ?? 0} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileItem({ label, value, numberStyle, labelStyle }: { label: string, value: string | number | null, numberStyle: string, labelStyle: string }) {
  if (!value) return null
  return (
    <div>
      <p className={numberStyle}>{value}</p>
      <p className={labelStyle}>{label}</p>
    </div>
  )
}

function StatRow({ label, value, subValue }: { label: string, value: string | number, subValue?: string }) {
  return (
    <div className="flex justify-between items-center text-sm py-1.5">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">
        {value} <span className="text-xs text-slate-400 font-normal ml-1">{subValue}</span>
      </span>
    </div>
  )
}

function AccuracyBar({ label, percent }: { label: string, percent: number }) {
  return (
    <div className="mt-1 mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
