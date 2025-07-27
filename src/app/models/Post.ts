import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', postSchema);