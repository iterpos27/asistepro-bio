CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(150) NOT NULL,
  ruc VARCHAR(20),
  telefono VARCHAR(20),
  direccion TEXT,
  estado VARCHAR(20) DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  precio_mensual DECIMAL(10,2) DEFAULT 0,
  limite_empleados INTEGER NOT NULL,
  limite_sucursales INTEGER NOT NULL,
  incluye_reportes BOOLEAN DEFAULT TRUE,
  incluye_exportacion_excel BOOLEAN DEFAULT TRUE,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE suscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  plan_id UUID NOT NULL REFERENCES planes(id),
  estado VARCHAR(30) DEFAULT 'activa',
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  renovacion_automatica BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  suscripcion_id UUID REFERENCES suscripciones(id),
  numero_factura VARCHAR(50),
  subtotal DECIMAL(10,2) DEFAULT 0,
  impuestos DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  estado VARCHAR(30) DEFAULT 'pendiente',
  fecha_emision DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  factura_id UUID REFERENCES facturas(id),
  metodo_pago VARCHAR(50),
  referencia_pago VARCHAR(100),
  valor DECIMAL(10,2),
  estado VARCHAR(30) DEFAULT 'pendiente',
  fecha_pago TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100),
  cedula VARCHAR(20),
  correo VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol VARCHAR(30) NOT NULL,
  telefono VARCHAR(20),
  cargo VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sucursales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nombre VARCHAR(150) NOT NULL,
  direccion TEXT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  radio_metros INTEGER DEFAULT 50,
  qr_token TEXT UNIQUE NOT NULL,
  estado VARCHAR(20) DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nombre VARCHAR(100) NOT NULL,
  hora_entrada TIME NOT NULL,
  hora_salida TIME NOT NULL,
  tolerancia_minutos INTEGER DEFAULT 10,
  dias_laborales TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE usuarios ADD COLUMN sucursal_habitual_id UUID REFERENCES sucursales(id);
ALTER TABLE usuarios ADD COLUMN horario_id UUID REFERENCES horarios(id);

CREATE TABLE marcaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  sucursal_id UUID NOT NULL REFERENCES sucursales(id),
  tipo VARCHAR(20) NOT NULL,
  fecha_hora TIMESTAMP DEFAULT NOW(),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  distancia_metros DECIMAL(10, 2),
  estado VARCHAR(30) DEFAULT 'aceptada',
  motivo_novedad VARCHAR(100),
  observacion TEXT,
  ip VARCHAR(50),
  dispositivo TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  usuario_id UUID REFERENCES usuarios(id),
  accion VARCHAR(150) NOT NULL,
  modulo VARCHAR(100),
  detalle JSONB,
  ip VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO planes (nombre, precio_mensual, limite_empleados, limite_sucursales)
VALUES
('Gratis', 0, 5, 1),
('Básico', 9.99, 25, 2),
('Pyme', 19.99, 75, 5),
('Empresarial', 39.99, 200, 10),
('Corporativo', 0, 999999, 999999);
