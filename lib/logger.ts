type SecurityEvent =
  | 'LOGIN_FAILED'
  | 'LOGIN_SUCCESS'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'BOOKING_CREATED'
  | 'BOOKING_CANCELLED'
  | 'ROLE_CHANGE'
  | 'DATA_EXPORT_REQUESTED'
  | 'DATA_DELETION_REQUESTED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_FAILED'
  | 'CONTACT_FORM_SUBMITTED'

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY'
type LogMetadata = Record<string, string | number | boolean | undefined>

// Campos que nunca deben aparecer en los registros de log
const SENSITIVE_KEYS = new Set([
  'password',
  'passwordHash',
  'cvv',
  'cardNumber',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'rut',
  'bankAccount',
])

function sanitize(metadata: LogMetadata): LogMetadata {
  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !SENSITIVE_KEYS.has(key))
  )
}

function write(level: LogLevel, message: string, metadata: LogMetadata): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...sanitize(metadata),
  }
  const line = JSON.stringify(entry)
  if (level === 'ERROR') {
    console.error(line)
  } else if (level === 'WARN') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

export function logInfo(message: string, metadata: LogMetadata = {}): void {
  write('INFO', message, metadata)
}

export function logWarn(message: string, metadata: LogMetadata = {}): void {
  write('WARN', message, metadata)
}

export function logError(message: string, metadata: LogMetadata = {}): void {
  write('ERROR', message, metadata)
}

export function logSecurityEvent(
  event: SecurityEvent,
  metadata: LogMetadata = {}
): void {
  write('SECURITY', event, metadata)
}

export function logRequest(
  method: string,
  path: string,
  status: number,
  durationMs: number,
  metadata: LogMetadata = {}
): void {
  write('INFO', 'HTTP_REQUEST', {
    method,
    path,
    status,
    durationMs,
    ...metadata,
  })
}
