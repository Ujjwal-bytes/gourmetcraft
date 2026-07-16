import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a menu name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

menuSchema.index({ name: 1 });

const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
