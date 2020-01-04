import { Request } from 'firebase-functions/lib/providers/https'
import { Response } from 'firebase-functions'

/**
 * List of allowed origins.
 */
const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://zoidberg:3000', 'https://yata.now.sh']

/**
 * An error used to return a specific error with a specific HTTP status code.
 */
export class ApiError extends Error {
  /**
   * The error constructor.
   * @param message - The error message to send to the user.
   * @param code - The HTTP status code to use when sending the response to the user.
   */
  constructor(message: string, public code: number) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Handles CORS.
 * @param request - The resquest.
 * @param response - The response.
 */
export function cors(request: Request, response: Response) {
  const origin = request.headers.origin as string

  if (ALLOWED_ORIGINS.includes(origin)) {
    response.set('Access-Control-Allow-Origin', origin)
  }
}
