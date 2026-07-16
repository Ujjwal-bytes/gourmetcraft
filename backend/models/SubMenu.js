import mongoose from 'mongoose';

const subMenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a sub-menu name'],
      trim: true,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: [true, 'Please provide a menu reference'],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

subMenuSchema.index({ name: 1 });

const SubMenu = mongoose.model('SubMenu', subMenuSchema);
export default SubMenu;
