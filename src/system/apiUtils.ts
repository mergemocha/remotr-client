/**
 * Base URL for the API. Defaults to site host in production, localhost in development.
 */
export const API_BASE_URL = `http://${process.env?.NODE_ENV === 'development' ? 'localhost' : window.location.hostname}:3000/api/v1`

/**
 * Returns the base URL for a daemon action (i.e. http://$host/api/v1/daemons/$mac/)
 *
 * @param mac - Target daemon MAC address
 * @returns String with aforementioned format
 */
export function getDaemonActionBaseURL (mac: string): string {
  return `${API_BASE_URL}/daemons/${mac}`
}

/**
 * Declaratively parts of an URL together using forward slashes (analogous to Node.js path.join()).
 *
 * @param args Array of URL parts to join together
 * @returns Joined URL
 */
export function joinUrl (...args: string[]): string {
  return args.join('/')
}

/**
 * Enumeration of generic request failure reasons.
 */
export enum RequestFailureReason {
  RECEIVED_ERROR_RESPONSE,
  NO_RESPONSE,
  UNKNOWN_ERROR
}

/**
 * Textual representations of various HTTP error codes.
 */
export enum ResponseCode {
  UNAUTHORIZED,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
  ORIGIN_IS_UNREACHABLE,
  DAEMON_RETURNED_ERROR
}

/**
 * Converts a response code into its textual representation.
 *
 * @param code - HTTP error code
 * @returns ResponseCode or undefined if no match was found
 */
function getTypeForResponseCode (code: number): ResponseCode | undefined {
  switch (code) {
    case 401: return ResponseCode.UNAUTHORIZED
    case 404: return ResponseCode.NOT_FOUND
    case 429: return ResponseCode.TOO_MANY_REQUESTS
    case 500: return ResponseCode.INTERNAL_SERVER_ERROR
    case 523: return ResponseCode.ORIGIN_IS_UNREACHABLE
    case 555: return ResponseCode.DAEMON_RETURNED_ERROR
  }
}

/**
 * Determines the failure reason for an HTTP request based on its error (from Axios).
 *
 * @param requestError Axios request error object
 * @returns Object with format { reason: RequestFailureReason, code?: ResponseCode }
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function determineRequestErrorReason (requestError: any): { reason: RequestFailureReason, code?: ResponseCode } {
  let reason

  if (requestError.response) reason = RequestFailureReason.RECEIVED_ERROR_RESPONSE
  else if (requestError.request) reason = RequestFailureReason.NO_RESPONSE
  else reason = RequestFailureReason.UNKNOWN_ERROR

  return {
    reason,
    code: requestError.response ? getTypeForResponseCode(requestError.response.status) : undefined
  }
}
