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
    salesPricePerPortion: {
      type: Number,
      default: 0,
      min: 0,
    },
    potentialFoodCost: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalNutritionValue: {
      type: String,
      trim: true,
      default: '',
    },
    nutritionValuePerBatch: {
      type: String,
      trim: true,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields for calculations
recipeSchema.virtual('weightPerPortion').get(function() {
  if (!this.batchWeight || !this.portions) return null;
  // Parse batchWeight and calculate
  const weightMatch = this.batchWeight.match(/([0-9.]+)/);
  if (!weightMatch) return null;
  const weight = parseFloat(weightMatch[1]);
  const unit = this.batchWeight.replace(/[0-9.]/g, '').trim();
  return `${(weight / this.portions).toFixed(1)} ${unit}`;
});

recipeSchema.virtual('totalRecipeCost').get(function() {
  return this.ingredients.reduce((sum, ing) => sum + (ing.ingredientCost || 0), 0);
});

recipeSchema.virtual('costPerPortion').get(function() {
  const total = this.totalRecipeCost;
  return this.portions > 0 ? parseFloat((total / this.portions).toFixed(2)) : 0;
});

recipeSchema.virtual('ingredientCostTotal').get(function() {
  return this.ingredients.reduce((sum, ing) => sum + (ing.ingredientCost || 0), 0);
});

recipeSchema.virtual('calculatedFoodCostPercent').get(function() {
  if (this.salesPricePerPortion > 0 && this.costPerPortion > 0) {
    return parseFloat(((this.costPerPortion / this.salesPricePerPortion) * 100).toFixed(2));
  }
  return 0;
});

recipeSchema.index({ name: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
