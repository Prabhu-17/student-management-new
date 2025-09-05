import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    phone: { type: String, required: true },
    className: { type: String, required: true, index: true }, // ✅ not "class"
    gender: { type: String, enum: ['male', 'female','Male','Female'], required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    profilePhotoUrl: { type: String }, // stores uploaded photo path
  },
  { timestamps: true }
)

export default mongoose.model('Student', studentSchema)
