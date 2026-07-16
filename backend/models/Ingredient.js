import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an ingredient name'],
      unique: true,
      trim: true,
    },
    quantityUnit: {
      type: String,
      required: [true, 'Please provide a quantity unit'],
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Please provide a unit price'],
      min: [0, 'Unit price cannot be negative'],
    },
    wastePercent: {
      type: Number,
      default: 0,
      min: [0, 'Waste percent cannot be negative'],
      max: [100, 'Waste percent cannot exceed 100'],
    },
    nutritionValue: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ingredientSchema.index({ name: 1 });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
