# Convenciones de correos transaccionales

> Cómo enviamos correos transaccionales en Mi Proyecto Tickets.
> **Última actualización**: 2026-08-06

## Stack

- **Proveedor de envío**: [PROVEEDOR] (producción).
- **Entorno de desarrollo**: [HERRAMIENTA_DEV] (previsualización local sin enviar).

## Configuración por entorno

| Entorno    | Mecanismo de envío       |
| ---------- | ------------------------ |
| Desarrollo | [Previsualización local] |
| Test       | [Captura en memoria]     |
| Producción | [PROVEEDOR real]         |

## Reglas

- Todo correo se envía en **HTML y texto plano** (multipart).
- Operaciones idempotentes: registrar `*_enviado_at` para no reenviar.
- No incluir secretos ni PII innecesaria en el cuerpo.
- Asuntos y contenido localizados (ver [`i18n.md`](i18n.md)).
- Enlaces con URLs absolutas y firmadas/expirables cuando corresponda.

## Tipos de correo

| Correo           | Disparador          |
| ---------------- | ------------------- |
| Bienvenida       | Registro de usuario |
| Recuperar acceso | Solicitud de reset  |
| [OTRO]           | [Evento]            |

## Ejemplos

```text
Asunto: Bienvenido a Mi Proyecto Tickets
Cuerpo: HTML + texto plano, con CTA y enlace de verificación
```

## Referencias

- [Documentación del proveedor de email].
