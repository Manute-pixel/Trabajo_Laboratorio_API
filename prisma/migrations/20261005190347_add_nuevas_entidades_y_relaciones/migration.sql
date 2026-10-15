/*
  Warnings:

  - You are about to drop the column `DNI` on the `Artesano` table. All the data in the column will be lost.
  - You are about to drop the column `localidad` on the `Artesano` table. All the data in the column will be lost.
  - You are about to drop the column `provincia` on the `Artesano` table. All the data in the column will be lost.
  - You are about to drop the column `rubro` on the `Artesano` table. All the data in the column will be lost.
  - You are about to drop the column `ArtesanoId` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `coordenadas` on the `Stand` table. All the data in the column will be lost.
  - You are about to drop the column `edicionId` on the `Stand` table. All the data in the column will be lost.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Telefono_Artesano` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dni]` on the table `Artesano` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_stand,sectorId]` on the table `Stand` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localidadId` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinciaId` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rubroId` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono_artesano` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Artesano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Categoria_Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pabellon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Postulacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artesanoId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_ArtesanoId_fkey";

-- DropForeignKey
ALTER TABLE "Stand" DROP CONSTRAINT "Stand_edicionId_fkey";

-- DropForeignKey
ALTER TABLE "Telefono_Artesano" DROP CONSTRAINT "Telefono_Artesano_id_artesano_fkey";

-- DropIndex
DROP INDEX "Artesano_DNI_key";

-- DropIndex
DROP INDEX "Stand_numero_stand_sectorId_edicionId_key";

-- AlterTable
ALTER TABLE "Artesano" DROP COLUMN "DNI",
DROP COLUMN "localidad",
DROP COLUMN "provincia",
DROP COLUMN "rubro",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dni" VARCHAR(10) NOT NULL,
ADD COLUMN     "localidadId" INTEGER NOT NULL,
ADD COLUMN     "provinciaId" INTEGER NOT NULL,
ADD COLUMN     "rubroId" INTEGER NOT NULL,
ADD COLUMN     "telefono_artesano" VARCHAR(20) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "fecha_Nacimiento" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Categoria_Producto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Edicion_Poncho" ALTER COLUMN "fecha_inicio" SET DATA TYPE DATE,
ALTER COLUMN "fecha_fin" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Pabellon" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Postulacion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "fecha_postulacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "ArtesanoId",
ADD COLUMN     "artesanoId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Sector" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "coordenadas",
DROP COLUMN "edicionId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ultimoAcceso" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Telefono_Artesano";

-- CreateTable
CREATE TABLE "Localidad" (
    "id" SERIAL NOT NULL,
    "nombre_localidad" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "id" SERIAL NOT NULL,
    "nombre_provincia" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubro" (
    "id" SERIAL NOT NULL,
    "nombre_rubro" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Localidad_nombre_localidad_key" ON "Localidad"("nombre_localidad");

-- CreateIndex
CREATE UNIQUE INDEX "Provincia_nombre_provincia_key" ON "Provincia"("nombre_provincia");

-- CreateIndex
CREATE UNIQUE INDEX "Rubro_nombre_rubro_key" ON "Rubro"("nombre_rubro");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_dni_key" ON "Artesano"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Stand_numero_stand_sectorId_key" ON "Stand"("numero_stand", "sectorId");

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
