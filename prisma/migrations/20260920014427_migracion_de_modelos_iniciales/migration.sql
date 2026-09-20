-- CreateTable
CREATE TABLE "Categoria_Producto" (
    "id" SERIAL NOT NULL,
    "nombre_categoria" VARCHAR(100) NOT NULL,

    CONSTRAINT "Categoria_Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artesano" (
    "id" SERIAL NOT NULL,
    "nombre_artesano" VARCHAR(100) NOT NULL,
    "apellido_artesano" VARCHAR(100) NOT NULL,
    "DNI" VARCHAR(10) NOT NULL,
    "fecha_Nacimiento" TIMESTAMP(3) NOT NULL,
    "rubro" VARCHAR(100) NOT NULL,
    "localidad" VARCHAR(100) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "email_artesano" VARCHAR(100) NOT NULL,

    CONSTRAINT "Artesano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefono_Artesano" (
    "id_artesano" INTEGER NOT NULL,
    "telefono" VARCHAR(15) NOT NULL
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre_producto" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio_producto" DECIMAL(10,2) NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "ArtesanoId" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stand" (
    "id" SERIAL NOT NULL,
    "numero_stand" INTEGER NOT NULL,
    "coordenadas" VARCHAR(150) NOT NULL,
    "estado_stand" VARCHAR(15) NOT NULL DEFAULT 'DISPONIBLE',
    "edicionId" INTEGER NOT NULL,
    "sectorId" INTEGER NOT NULL,
    "artesanoId" INTEGER,

    CONSTRAINT "Stand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pabellon" (
    "id" SERIAL NOT NULL,
    "nombre_pabellon" VARCHAR(100) NOT NULL,
    "edicionId" INTEGER NOT NULL,

    CONSTRAINT "Pabellon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sector" (
    "id" SERIAL NOT NULL,
    "nombre_sector" VARCHAR(100) NOT NULL,
    "pabellonId" INTEGER NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edicion_Poncho" (
    "id" SERIAL NOT NULL,
    "nombre_edicion" VARCHAR(100) NOT NULL,
    "anio_edicion" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "estado_edicion" VARCHAR(100) NOT NULL DEFAULT 'PLANIFICADA',

    CONSTRAINT "Edicion_Poncho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postulacion" (
    "id" SERIAL NOT NULL,
    "fecha_postulacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_DATE,
    "estado_postulacion" VARCHAR(100) NOT NULL DEFAULT 'Pendiente',
    "artesanoId" INTEGER NOT NULL,
    "edicionId" INTEGER NOT NULL,

    CONSTRAINT "Postulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre_usuario" VARCHAR(100) NOT NULL,
    "apellido_usuario" VARCHAR(100) NOT NULL,
    "email_usuario" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "rol_usuario" VARCHAR(100) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" SERIAL NOT NULL,
    "tipo_consulta" VARCHAR(100) NOT NULL,
    "fecha_consulta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "busqueda_realizada" TEXT NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_Producto_nombre_categoria_key" ON "Categoria_Producto"("nombre_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_DNI_key" ON "Artesano"("DNI");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_email_artesano_key" ON "Artesano"("email_artesano");

-- CreateIndex
CREATE UNIQUE INDEX "Telefono_Artesano_id_artesano_telefono_key" ON "Telefono_Artesano"("id_artesano", "telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Stand_numero_stand_sectorId_edicionId_key" ON "Stand"("numero_stand", "sectorId", "edicionId");

-- CreateIndex
CREATE UNIQUE INDEX "Pabellon_nombre_pabellon_key" ON "Pabellon"("nombre_pabellon");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_nombre_sector_key" ON "Sector"("nombre_sector");

-- CreateIndex
CREATE UNIQUE INDEX "Edicion_Poncho_nombre_edicion_key" ON "Edicion_Poncho"("nombre_edicion");

-- CreateIndex
CREATE UNIQUE INDEX "Edicion_Poncho_anio_edicion_key" ON "Edicion_Poncho"("anio_edicion");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_usuario_key" ON "Usuario"("email_usuario");

-- AddForeignKey
ALTER TABLE "Telefono_Artesano" ADD CONSTRAINT "Telefono_Artesano_id_artesano_fkey" FOREIGN KEY ("id_artesano") REFERENCES "Artesano"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria_Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_ArtesanoId_fkey" FOREIGN KEY ("ArtesanoId") REFERENCES "Artesano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_edicionId_fkey" FOREIGN KEY ("edicionId") REFERENCES "Edicion_Poncho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pabellon" ADD CONSTRAINT "Pabellon_edicionId_fkey" FOREIGN KEY ("edicionId") REFERENCES "Edicion_Poncho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_edicionId_fkey" FOREIGN KEY ("edicionId") REFERENCES "Edicion_Poncho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
