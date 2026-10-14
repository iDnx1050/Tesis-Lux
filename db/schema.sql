-- Esquema de la base de datos (PostgreSQL en Neon).
-- Idempotente: se puede aplicar varias veces con `npm run db:setup`.

-- Una fila por intento de pago con Webpay Plus. La orden se crea PENDING
-- antes de enviar a la clienta a Webpay, y se cierra al volver con el
-- resultado. Mientras está PENDING retiene el horario del show.
CREATE TABLE IF NOT EXISTS orders (
  buy_order           text        PRIMARY KEY,
  session_id          text        NOT NULL,
  token               text        UNIQUE,
  environment         text        NOT NULL
                      CHECK (environment IN ('integration', 'production')),
  status              text        NOT NULL DEFAULT 'PENDING'
                      CHECK (status IN ('PENDING', 'AUTHORIZED', 'REJECTED', 'ABORTED',
                                        'TIMEOUT', 'FAILED', 'REVERSED')),
  -- Monto en CLP calculado por el servidor, el mismo que se envía a Webpay.
  amount              integer     NOT NULL CHECK (amount > 0),

  -- Reserva
  vedeto_slug         text        NOT NULL,
  tier_id             text        NOT NULL,
  extras              text[]      NOT NULL DEFAULT '{}',
  region_id           text        NOT NULL,
  commune_name        text        NOT NULL,
  coupon_code         text,
  event_date          date        NOT NULL,
  event_time          text        NOT NULL CHECK (event_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  contact_name        text        NOT NULL,
  contact_email       text        NOT NULL,
  contact_phone       text        NOT NULL,
  address             text        NOT NULL,
  -- Hash con sal de la IP (nunca la IP en claro): límite de órdenes por IP.
  ip_hash             text,

  -- Resultado informado por Webpay
  response_code       integer,
  authorization_code  text,
  payment_type_code   text,
  installments_number integer,
  installments_amount integer,
  card_last4          text,
  vci                 text,
  transaction_date    timestamptz,
  calendar_event_id   text,

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Disponibilidad: órdenes de un artista en un rango de fechas.
CREATE INDEX IF NOT EXISTS orders_slot_idx ON orders (vedeto_slug, event_date);

-- Límite de órdenes pendientes por IP.
CREATE INDEX IF NOT EXISTS orders_ip_recent_idx ON orders (ip_hash, created_at);
