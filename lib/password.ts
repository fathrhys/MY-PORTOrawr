import { randomBytes, scrypt, timingSafeEqual } from "crypto";

type ScryptParams = { N: number; r: number; p: number };
type ParsedHash = { params: ScryptParams; salt: Buffer; hash: Buffer };

const DEFAULT_PARAMS: ScryptParams = { N: 16384, r: 8, p: 1 };
const KEY_LEN = 32;

function parseHash(input: string): ParsedHash | null {
  const parts = input.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return null;
  const salt = Buffer.from(parts[4], "base64url");
  const hash = Buffer.from(parts[5], "base64url");
  return { params: { N, r, p }, salt, hash };
}

function scryptAsync(password: string, salt: Buffer, params: ScryptParams) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LEN, params, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });
}

export async function verifyPassword(password: string, storedHash: string) {
  const parsed = parseHash(storedHash);
  if (!parsed) return false;
  const derived = await scryptAsync(password, parsed.salt, parsed.params);
  if (derived.length !== parsed.hash.length) return false;
  return timingSafeEqual(derived, parsed.hash);
}

export async function hashPassword(password: string, params: ScryptParams = DEFAULT_PARAMS) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, params);
  return [
    "scrypt",
    params.N,
    params.r,
    params.p,
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join("$");
}
