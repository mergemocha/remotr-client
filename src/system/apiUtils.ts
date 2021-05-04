export const API_BASE_URL = `http://${process.env?.NODE_ENV === 'development' ? 'localhost' : window.location.hostname}:3000/api/v1`

export function getDaemonActionBaseURL (mac: string): string {
  return `${API_BASE_URL}/daemons/${mac}`
}

export function joinUrl (...args: string[]): string {
  return args.join('/')
}

export enum RequestFailureReason {
  RECEIVED_ERROR_RESPONSE,
  NO_RESPONSE,
  UNKNOWN_ERROR
}

export enum ResponseCode {
  UNAUTHORIZED,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
  ORIGIN_IS_UNREACHABLE,
  DAEMON_RETURNED_ERROR
}

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
