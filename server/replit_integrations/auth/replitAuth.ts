import type { Express, RequestHandler } from "express";

export async function setupAuth(app: Express) {
  // Stub
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  return next();
};

export function getSession() {
  return (req: any, res: any, next: any) => next();
}
