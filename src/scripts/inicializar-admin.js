import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { registrarAdminSchema } from "../validators/usuarios.schema.js";

try {
  const dto = registrarAdminSchema.strict().parse({
    nombre: process.env.ADMIN_NOMBRE,
    apellido: process.env.ADMIN_APELLIDO,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  const passwordHash = await bcrypt.hash(dto.password, 10);

  await prisma.usuario.create({
    data: {
      nombre_usuario: dto.nombre,
      apellido_usuario: dto.apellido,
      email_usuario: dto.email,
      password: passwordHash,
      activo: true,
      roles: {
        create: {
          rol: { connect: { nombre_rol: "ADMINISTRADOR" } },
        },
      },
    },
  });
  console.log("Administrador inicial creado.");
} finally {
  await prisma.$disconnect();
}
