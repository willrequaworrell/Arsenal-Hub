import { FixtureTeamStatistics } from "@/lib/api-football/schemas/statistics"

  /*
   * Unified function to get and parse stats for your team vs opponent
   */
  export const getMatchStat = (type: string, isHomeTeam: boolean, homeStats?: FixtureTeamStatistics, awayStats?: FixtureTeamStatistics) => {
    const homeValue = homeStats?.statistics.find(s => s.type === type)?.value ?? 0
    const awayValue = awayStats?.statistics.find(s => s.type === type)?.value ?? 0
    const yourValue = isHomeTeam ? homeValue : awayValue
    const opponentValue = isHomeTeam ? awayValue : homeValue
    
    const parseValue = (value: string | number | null): number => {
      if (value === null || value === undefined) return 0
      if (typeof value === 'string') {
        return parseFloat(value.replace('%', ''))
      }
      return Number(value)
    }
    
    return {
      yourValue,
      opponentValue,
      yourNum: parseValue(yourValue),
      opponentNum: parseValue(opponentValue),
    }
  }