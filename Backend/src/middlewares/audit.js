import AuditLog from '../models/AuditLog.js'

export const audit = (action) => async (req, res, next) => {
  // controller should attach req.audit = { before, after, entityId }
  res.on('finish', async () => {
    try {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.audit) {
        await AuditLog.create({
          user: req.user?.id,
          action,
          entity: 'Student',
          entityId: req.audit.entityId,
          changes: { before: req.audit.before, after: req.audit.after },
          ip: req.ip,
          userAgent: req.get('user-agent'),
        })
      }
    } catch (_) {}
  })
  next()
}
