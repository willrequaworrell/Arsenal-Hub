export type APIFootballResponse = {
  get: string
  parameters: Record<string, unknown>
  errors?: Record<string, string>
  results: number
  paging: { current: number; total: number }
  response: unknown[]
}

export function validateAPIFootballResponse(data: unknown): {
  valid: boolean
  error?: string
  details?: Record<string, string>
} {
  // Check if it's an API-Football response structure
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid response structure' }
  }

  const response = data as Record<string, unknown>

  // Check for API-Football errors
  if (response.errors && typeof response.errors === 'object') {
    const errors = response.errors as Record<string, string>
    if (Object.keys(errors).length > 0) {
      return {
        valid: false,
        error: 'API-Football validation error',
        details: errors,
      }
    }
  }

  // Check if results is 0 but we expected data
  if (
    response.results === 0 &&
    (!response.response || 
     (Array.isArray(response.response) && response.response.length === 0))
  ) {
    return {
      valid: false,
      error: 'No data returned from API-Football',
    }
  }

  return { valid: true }
}
