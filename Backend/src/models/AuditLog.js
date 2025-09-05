import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE'],
      required: true,
    },
    entity: { type: String, default: 'Student' },
    entityId: { type: mongoose.Schema.Types.ObjectId, refPath: 'entity' },
    changes: { type: Object }, // { before: {...}, after: {...} }
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
)

export default mongoose.model('AuditLog', auditLogSchema)
