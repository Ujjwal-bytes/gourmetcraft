import mongoose from 'mongoose';

const recipeIngredientSchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    wastePercent: {
      type: Number,
      default: 0,
    },
    yieldQuantity: {
      type: Number,
      default: 0,
    },
    ingredientCost: {
      type: Number,
      default: 0,
    },
    nutritionValue: {
      type: String,
    },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a recipe name'],
      unique: true,
      trim: true,
    },
    recipeGroup: {
      type: String,
      trim: true,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: [true, 'Please provide a menu reference'],
    },
    subMenuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubMenu',
    },
    portions: {
      type: Number,
      required: [true, 'Please provide number of portions'],
      min: [1, 'Portions must be at least 1'],
    },
    batchWeight: {
      type: String,
      trim: true,
    },
    ingredients: [recipeIngredientSchema],
    methodOfPreparation: {
      type: String,
      required: [true, 'Please provide method of preparation'],
    },
    specialInstructions: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

recipeSchema.index({ name: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
