import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Collector', 'Department_Head', 'Tender_Group'],
  },
  department: {
    type: String,
  },
  district: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.model('User', userSchema);
