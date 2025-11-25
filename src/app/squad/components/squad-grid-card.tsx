// app/squad/components/squad-grid-card.tsx
"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { PlayerStatistics } from "@/lib/api-football/schemas/players"
import { getFlagUrlForNationality } from "@/lib/api-football/nationality-flags"
import CardContainer from "@/components/ui/custom/card-container"

type PlayerCardProps = {
  player: PlayerStatistics
  isExpanded: boolean
  onClick: () => void
}

export default function PlayerCard({ player, isExpanded, onClick }: PlayerCardProps) {
  const nationality = player.player.nationality || ""
  const flagUrl = getFlagUrlForNationality(nationality)

  return (
      <CardContainer
        onClick={onClick}
        className={`
          ${isExpanded && "outline-4 outline-red-500"}
          p-4 cursor-pointer hover:outline-4 hover:outline-red-500 `
        }
      >

        {/* Bottom: info band with name + flag */}
        <div className="flex items-center justify-between gap-3 bg-white border-b-4 border-red-500 px-4 py-3">
          {/* Name block */}
          <div className="min-w-0">
            {player.player.firstname && (
              <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">
                {player.player.firstname}
              </p>
            )}
            <p className="truncate text-lg font-bold text-slate-900">
              {player.player.lastname || player.player.name}
            </p>
          </div>

          {/* Nationality + flag block */}
          {nationality && (
            <div className="flex items-center gap-2">
              {flagUrl && (
                <div className=" border border-slate-200 bg-slate-100">
                  <Image
                    src={flagUrl}
                    alt={nationality}
                    width={24}
                    height={16}
                    className="object-center"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {/* Top: Player photo */}
        <div className="relative aspect-square w-full overflow-hidden ">
          <Image
            src={player.player.photo}
            alt={player.player.name}
            fill
            className="object-cover  p-8"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Expand chevron in photo corner */}
          {/* <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 p-1">
            <ChevronDown
              className={`h-4 w-4 text-white transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div> */}
        </div>
      </CardContainer>

      
  )
}
