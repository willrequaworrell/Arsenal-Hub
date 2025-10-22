export type APIFootballResponse = {
  get: string
  parameters: Record<string, any>
  errors?: Record<string, string>
  results: number
  paging: { current: number; total: number }
  response: any[]
}

export function validateAPIFootballResponse(data: any): {
  valid: boolean
  error?: string
  details?: Record<string, string>
} {
  // Check if it's an API-Football response structure
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid response structure' }
  }

  // Check for API-Football errors
  if (data.errors && Object.keys(data.errors).length > 0) {
    return {
      valid: false,
      error: 'API-Football validation error',
      details: data.errors,
    }
  }

  // Check if results is 0 but we expected data
  if (data.results === 0 && (!data.response || data.response.length === 0)) {
    return {
      valid: false,
      error: 'No data returned from API-Football',
    }
  }

  return { valid: true }
}
