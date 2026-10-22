/*
  Warnings:

  - You are about to drop the column `rol_usuario` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Artesano` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioId` to the `Artesano` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artesano" ADD COLUMN     "usuarioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "rol_usuario";

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "usuarioId" UUID NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("usuarioId","rolId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_rol_key" ON "Rol"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_usuarioId_key" ON "Artesano"("usuarioId");

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--Agregar Roles
INSERT INTO "Rol" ("nombre_rol")
VALUES
('PARTICIPANTE'),
('ADMINISTRADOR');
