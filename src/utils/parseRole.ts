import { Roles } from "generated/prisma";

export function parseRole(role: string): Roles {
    const upperRole = role.toUpperCase()
  if (!Object.values(Roles).includes(upperRole as Roles)) {
    throw new Error(`Role inválido: ${role}`);
  }
  return upperRole as Roles;
}