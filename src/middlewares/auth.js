import jwt from "jsonwebtoken";

// Emite el token que devuelve el login
export function firmarToken(usuario) {
  return jwt.sign({ sub: usuario._id.toString(), rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

// ¿Quién eres? Sin token válido -> 401
export function requireAuth(req, res, next) {
  const cabecera = req.headers.authorization ?? "";
  const token = cabecera.startsWith("Bearer ") ? cabecera.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "No autenticado: falta el token" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o caducado" });
  }
}

// ¿Qué puedes hacer? Sin el rol -> 403
export function requireRol(rol) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado: falta el token" });
    }
    if (req.user.rol !== rol) {
      return res.status(403).json({ error: `Sin permisos: se requiere el rol '${rol}'` });
    }
    next();
  };
}
