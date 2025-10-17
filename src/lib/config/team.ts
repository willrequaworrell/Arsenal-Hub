import { DEFAULT_TEAM_ID } from "./api-football"

// src/lib/config/team.ts
export const TEAM_CONFIG: Record<string, {
  name: string
  guardianTag: string  // The Guardian's tag for this team
}> = {
  "42": {
    name: "Arsenal",
    guardianTag: "football/arsenal",
  },
  "50": {
    name: "Manchester City",
    guardianTag: "football/manchester-city",
  },
  "33": {
    name: "Manchester United",
    guardianTag: "football/manchester-united",
  },
  "40": {
    name: "Liverpool",
    guardianTag: "football/liverpool",
  },
  "49": {
    name: "Chelsea",
    guardianTag: "football/chelsea",
  },
}


export function getTeamConfig(teamId: string) {
  return TEAM_CONFIG[teamId] ?? TEAM_CONFIG[DEFAULT_TEAM_ID]
}
