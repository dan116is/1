import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET ?? "itam23-dev-secret";

export type SessionPayload = {
  userId: string;
  email: string;
};

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}
