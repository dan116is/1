import { NextResponse } from "next/server";
import { prisma } from "../../../../db/prisma";
import bcrypt from "bcryptjs";
import { signSession } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email?.toString().trim();
  const password = body.password?.toString();

  if (!email || !password) {
    return NextResponse.json({ message: "חסר אימייל או סיסמה" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "משתמש לא נמצא" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: "סיסמה שגויה" }, { status: 401 });
  }

  const token = signSession({ userId: user.id, email: user.email });

  const response = NextResponse.json({ message: "התחברת בהצלחה" });
  response.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });

  return response;
}
