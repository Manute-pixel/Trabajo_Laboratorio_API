import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, describe, test } from "node:test";
import jwt from "jsonwebtoken";
import prisma from "../../src/config/prisma.js";
import { secretoJWT } from "../../src/config/jwt.js";
import {
  generarToken,
  verificarToken,
} from "../../src/services/tokens.service.js";
import {
  eliminarRevocacionesVencidas,
  revocarToken,
  tokenEstaRevocado,
} from "../../src/services/revocaciones.js";

const jtis = [];

after(async () => {
  if (jtis.length) {
    await prisma.tokenRevocado.deleteMany({
      where: { jti: { in: jtis } },
    });
  }
  await prisma.$disconnect();
});

describe("servicio de tokens", () => {
test("Genera y verifica tokens de usuario", () => {
  const usuarioId = randomUUID();
  const token = generarToken({ id: usuarioId });
  const payload = verificarToken(token);

  assert.equal(payload.id, usuarioId);
  assert.ok(payload.jti);
  assert.ok(payload.exp > Math.floor(Date.now() / 1000));

  assert.throws(() => verificarToken("token-invalido"), jwt.JsonWebTokenError);
  const claimsInvalidos = jwt.sign(
    { sub: "no-es-uuid", jti: randomUUID() },
    secretoJWT,
    { algorithm: "HS256", expiresIn: "1m" },
  );
  assert.throws(
    () => verificarToken(claimsInvalidos),
    jwt.JsonWebTokenError,
  );
});
});

describe("servicio de revocaciones", () => {
test("Revoca tokens, actualiza revocaciones y elimina registros vencidos", async () => {
  const token = generarToken({ id: randomUUID() });
  const payload = verificarToken(token);
  jtis.push(payload.jti);

  assert.equal(await tokenEstaRevocado(payload.jti), false);
  await revocarToken(payload);
  assert.equal(await tokenEstaRevocado(payload.jti), true);

  await revocarToken({ ...payload, exp: payload.exp + 60 });
  const actualizada = await prisma.tokenRevocado.findUnique({
    where: { jti: payload.jti },
  });
  assert.equal(actualizada.venceEn.getTime(), (payload.exp + 60) * 1000);

  const jtiVencido = randomUUID();
  jtis.push(jtiVencido);
  await prisma.tokenRevocado.create({
    data: {
      jti: jtiVencido,
      venceEn: new Date(Date.now() - 60_000),
    },
  });

  const eliminadas = await eliminarRevocacionesVencidas();
  assert.ok(eliminadas.count >= 1);
  assert.equal(await tokenEstaRevocado(jtiVencido), false);
});
});
