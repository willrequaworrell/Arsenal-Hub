// lib/api-football/validate-response.ts
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

  // Check for API-Football errors - this is the ONLY validation we need
  if (response.errors && typeof response.errors === 'object') {
    const errors = response.errors as Record<string, string>
    if (Object.keys(errors).length > 0) {
      return {
        valid: false,
        error: 'API-Football error',
        details: errors,
      }
    }
  }

  return { valid: true }
}
