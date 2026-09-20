-- AlterTable
ALTER TABLE "Consulta" ALTER COLUMN "fecha_consulta" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Postulacion"
	ADD CONSTRAINT "Postulacion_estado_post_check"
		CHECK ("estado_postulacion" IN ('Pendiente', 'Rechazado', 'Aceptado'));

ALTER TABLE "Stand"
	ADD CONSTRAINT "Stand_numero_stand_check"
		CHECK ("numero_stand" > 0),
	ADD CONSTRAINT "Stand_estado_stand_check"
		CHECK ("estado_stand" IN ('DISPONIBLE', 'OCUPADO'));

ALTER TABLE "Edicion_Poncho"
	ADD CONSTRAINT "Edicion_anio_check"
		CHECK ("anio_edicion" > 0),
	ADD CONSTRAINT "Edicion_fechas_check"
		CHECK ("fecha_fin" >= "fecha_inicio"),
	ADD CONSTRAINT "Edicion_estado_edicion_check"
		CHECK ("estado_edicion" IN ('PLANIFICADA', 'ACTIVA', 'FINALIZADA'));

ALTER TABLE "Usuario"
	ADD CONSTRAINT "Usuario_rol_check"
		CHECK ("rol_usuario" IN ('administrador', 'artesano', 'visitante'));
