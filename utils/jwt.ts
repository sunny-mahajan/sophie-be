import jwt from "jsonwebtoken";

export function generateJwtToken(email: string): string {
  try {
    const { JWT_SECRET, JWT_EXPIRATION } = process.env;
    return jwt.sign({ email }, JWT_SECRET || "", {
      expiresIn: JWT_EXPIRATION ?? "24h",
    });
  } catch {
    throw new Error(
      "Failed to generate an invite token. Please try again later or contact support if the issue persists."
    );
  }
}
