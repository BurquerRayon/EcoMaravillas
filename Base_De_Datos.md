--- crear la base de datos
create database eco_maravillas

--- usar base de datos
use eco_maravillas

--1-- Tabla Sexo
CREATE TABLE Sexo (
    id_sexo INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100)
);

--2-- Tabla Nacionalidad
CREATE TABLE Nacionalidad (
    id_nacionalidad INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    codigo_iso VARCHAR(3)
);

--3-- Tabla Persona
CREATE TABLE Persona (
    id_persona INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    apellido NVARCHAR(100),
    cedula NVARCHAR(11),
    fecha_nacimiento DATE,
    edad TINYINT,
    telefono VARCHAR(15),
    id_nacionalidad INT,
    id_sexo INT,
    FOREIGN KEY (id_nacionalidad) REFERENCES Nacionalidad(id_nacionalidad),
    FOREIGN KEY (id_sexo) REFERENCES Sexo(id_sexo)
);

--4-- Tabla Rol
CREATE TABLE Rol (
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    descripcion TEXT
);

--5-- Tabla Permisos
CREATE TABLE Permiso (
    id_permiso INT IDENTITY(1,1) PRIMARY KEY,
    nombre_permiso NVARCHAR(100),
    descripcion TEXT
);

--6-- Tabla Rol_Permisos
CREATE TABLE Rol_Permiso (
id_rol INT NOT NULL,
id_permiso INT NOT NULL,
PRIMARY KEY (id_rol, id_permiso),
FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso)
);

--7-- Tabla usuarios
CREATE TABLE Usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    id_rol INT,
    id_persona INT,
    correo VARCHAR(255) UNIQUE,
    contrasena VARCHAR(255),
    estado VARCHAR(50),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
);

--8-- Tabla Notificaciones
CREATE TABLE Notificacion (
    id_notificacion INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT,
    mensaje NVARCHAR(100),
    fecha DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

--9-- Tabla Turistas
CREATE TABLE Turista (
    id_turista INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT,
    fecha_creacion DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

--10-- Tabla Turista_Documentos
CREATE TABLE Turista_Documentos (
    id_turistas_documentos INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT,
    nombre_en_documento NVARCHAR(100),
    numero_documento NVARCHAR(50),
    fecha_emision DATE,
    fecha_expiracion DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

--11-- tabla Tipo_Documentos
CREATE TABLE Tipo_Documentos (
    id_tipo_documentos INT IDENTITY(1,1) PRIMARY KEY,
    id_turistas_documentos INT,
    nombre NVARCHAR(100),
    pais_origen NVARCHAR(100),
    foto_frontal_documento NVARCHAR(255),
    foto_reverso_documento NVARCHAR(255),
    FOREIGN KEY (id_turistas_documentos) REFERENCES Turista_Documentos(id_turistas_documentos)
);

--12-- Tabla de reservas
CREATE TABLE Reservas (
    id_Reserva INT IDENTITY(1,1) PRIMARY KEY,
    id_Turista INT NOT NULL,
    estado NVARCHAR(50) DEFAULT 'pendiente',
	total_pago_estimado DECIMAL(10,2),
    CONSTRAINT FK_Reservas_Turista FOREIGN KEY (id_turista) REFERENCES Turista(id_turista)
);

--13-- Tabla: Atracciones
CREATE TABLE Atraccion (
    id_atraccion INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    descripcion TEXT,
    duracion INT,
    max_personas INT,
	precio DECIMAL(10,2)
);

--14-- Tabla de reservas_Detalles
CREATE TABLE Reserva_Detalles (
    id_detalle_reserva INT IDENTITY(1,1) PRIMARY KEY,
    id_reserva INT,
    id_atraccion INT,
    cantidad INT,
    tarifa_unitaria DECIMAL(10,2),
	fecha DATE NOT NULL,
    hora TIME NOT NULL,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (id_reserva) REFERENCES Reservas(id_reserva),
    FOREIGN KEY (id_atraccion) REFERENCES Atraccion(id_atraccion)
);

--16-- tabla metodo de pago
CREATE TABLE Metodo_Pago (
    id_metodo_pago INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50)
);

--17-- tabla moneda
CREATE TABLE Moneda (
    id_moneda INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50),
    simbolo VARCHAR(5),
    codigo_iso VARCHAR(3),
    tasa_cambio DECIMAL(10,4)
);

--18-- Tabla banco
CREATE TABLE Banco (
    id_banco INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
	codigo_banco NVARCHAR(100)
);

--19-- tabla Cuenta de bancos
CREATE TABLE Cuenta_Banco (
    id_cuenta_banco INT IDENTITY(1,1) PRIMARY KEY,
    numero_cuenta NVARCHAR(50),
    id_banco INT,
    FOREIGN KEY (id_banco) REFERENCES Banco(id_banco)
);

--22-- tabla de habitats
CREATE TABLE Habitat (
    id_habitat INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    descripcion TEXT,
    ubicacion NVARCHAR(200)
);

--20-- tala especimen
CREATE TABLE Especimen (
    id_especimen INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    nombre_cientifico NVARCHAR(150),
    tipo NVARCHAR(10),
    estado_conservacion NVARCHAR(100),
    observacion TEXT,
    id_habitat INT,
    FOREIGN KEY (id_habitat) REFERENCES Habitat(id_habitat)
);

--21-- tabla imagenes especimenes
CREATE TABLE Especimen_Imagen (
    id_imagen INT IDENTITY(1,1) PRIMARY KEY,
    id_especimen INT,
    url_imagen NVARCHAR(255),
    descripcion NVARCHAR(255),
    fecha DATETIME,
    FOREIGN KEY (id_especimen) REFERENCES Especimen(id_especimen)
);

--23-- tabla monitoreo especimen
CREATE TABLE Monitoreo_Especimen (
    id_monitoreo INT IDENTITY(1,1) PRIMARY KEY,
    id_especimen INT,
    fecha DATE,
    observacion TEXT,
    cambios_poblacion TEXT,
    cambios_ubicacion TEXT,
    estado TEXT,
    FOREIGN KEY (id_especimen) REFERENCES Especimen(id_especimen)
);

--24-- tabla tipo de reportes
CREATE TABLE Tipo_Reporte (
    id_tipo_reporte INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100),
    descripcion TEXT
);

--25--tabla de reportes
CREATE TABLE Reporte (
    id_reporte INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT,
    id_tipo_reporte INT,
    descripcion TEXT,
    fecha DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_tipo_reporte) REFERENCES Tipo_Reporte(id_tipo_reporte)
);

--26-- tabla personal
CREATE TABLE Personal (
    id_personal INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT,
    especialidad NVARCHAR(100),
    fecha_contratacion DATE,
    numero_licencia NVARCHAR(50),
    turno NVARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

--15-- tabla de pago
CREATE TABLE Pagos (
    id_pagos INT IDENTITY(1,1) PRIMARY KEY,
    id_reserva INT,
    id_metodo_pago INT,
    id_cuenta_banco INT,
	id_moneda INT,
    fecha DATETIME,
    monto DECIMAL(10,2),
    tipo_cambio DECIMAL(10,4),
    FOREIGN KEY (id_reserva) REFERENCES Reservas(id_reserva),
    FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_Pago(id_metodo_pago),
    FOREIGN KEY (id_cuenta_banco) REFERENCES Cuenta_Banco(id_cuenta_banco),
	FOREIGN KEY (id_moneda) REFERENCES Moneda(id_moneda)
);
