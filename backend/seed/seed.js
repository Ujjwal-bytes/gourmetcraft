import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Menu from '../models/Menu.js';
import SubMenu from '../models/SubMenu.js';
import Ingredient from '../models/Ingredient.js';
import Recipe from '../models/Recipe.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Menu.deleteMany({});
    await SubMenu.deleteMany({});
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Existing data cleared.');

    // Create Users
    const adminUser = await User.create({
      name: 'Admin Gourmet',
      email: 'admin@gourmetcraft.com',
      password: 'admin123',
      role: 'admin',
    });

    const regularUser = await User.create({
      name: 'John User',
      email: 'user@gourmetcraft.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users seeded.');

    // Create Menus
    const menus = await Menu.insertMany([
      { name: 'Breakfast', description: 'Morning meals and early bites to start the day' },
      { name: 'Lunch', description: 'Midday meals and light fare' },
      { name: 'Dinner', description: 'Evening meals and main courses' },
      { name: 'Desserts', description: 'Sweet treats and after-meal delights' },
      { name: 'Beverages', description: 'Hot and cold drinks for all occasions' },
    ]);

    console.log('Menus seeded.');

    // Create SubMenus
    const subMenus = await SubMenu.insertMany([
      { name: 'Continental', menuId: menus[0]._id, description: 'European-style breakfast options' },
      { name: 'Asian', menuId: menus[1]._id, description: 'Asian-inspired lunch dishes' },
      { name: 'Italian', menuId: menus[2]._id, description: 'Classic Italian dinner recipes' },
      { name: 'Mexican', menuId: menus[1]._id, description: 'Mexican-style lunch specialties' },
      { name: 'Mediterranean', menuId: menus[2]._id, description: 'Mediterranean dinner cuisine' },
    ]);

    console.log('SubMenus seeded.');

    // Create Ingredients
    const ingredients = await Ingredient.insertMany([
      { name: 'Flour', quantityUnit: 'grams', unitPrice: 0.5, wastePercent: 2, nutritionValue: '364 kcal/100g', status: 'Active' },
      { name: 'Sugar', quantityUnit: 'grams', unitPrice: 0.8, wastePercent: 1, nutritionValue: '387 kcal/100g', status: 'Active' },
      { name: 'Butter', quantityUnit: 'grams', unitPrice: 3.5, wastePercent: 0, nutritionValue: '717 kcal/100g', status: 'Active' },
      { name: 'Eggs', quantityUnit: 'pieces', unitPrice: 0.25, wastePercent: 12, nutritionValue: '155 kcal/100g', status: 'Active' },
      { name: 'Milk', quantityUnit: 'ml', unitPrice: 1.2, wastePercent: 0, nutritionValue: '42 kcal/100ml', status: 'Active' },
      { name: 'Salt', quantityUnit: 'grams', unitPrice: 0.1, wastePercent: 0, nutritionValue: '0 kcal/100g', status: 'Active' },
      { name: 'Pepper', quantityUnit: 'grams', unitPrice: 2.0, wastePercent: 0, nutritionValue: '251 kcal/100g', status: 'Active' },
      { name: 'Olive Oil', quantityUnit: 'ml', unitPrice: 4.0, wastePercent: 0, nutritionValue: '884 kcal/100ml', status: 'Active' },
      { name: 'Garlic', quantityUnit: 'grams', unitPrice: 1.5, wastePercent: 15, nutritionValue: '149 kcal/100g', status: 'Active' },
      { name: 'Onion', quantityUnit: 'grams', unitPrice: 0.6, wastePercent: 10, nutritionValue: '40 kcal/100g', status: 'Active' },
    ]);

    console.log('Ingredients seeded.');

    // Create Recipes
    await Recipe.insertMany([
      {
        name: 'Classic Pancakes',
        recipeGroup: 'Breakfast Specials',
        menuId: menus[0]._id,
        subMenuId: subMenus[0]._id,
        portions: 4,
        batchWeight: '500g',
        ingredients: [
          { ingredientId: ingredients[0]._id, quantity: 200, unit: 'grams', unitPrice: 0.5, wastePercent: 2, yieldQuantity: 196, ingredientCost: 1.0, nutritionValue: '364 kcal/100g' },
          { ingredientId: ingredients[3]._id, quantity: 2, unit: 'pieces', unitPrice: 0.25, wastePercent: 12, yieldQuantity: 1.76, ingredientCost: 0.5, nutritionValue: '155 kcal/100g' },
          { ingredientId: ingredients[4]._id, quantity: 300, unit: 'ml', unitPrice: 1.2, wastePercent: 0, yieldQuantity: 300, ingredientCost: 3.6, nutritionValue: '42 kcal/100ml' },
          { ingredientId: ingredients[2]._id, quantity: 50, unit: 'grams', unitPrice: 3.5, wastePercent: 0, yieldQuantity: 50, ingredientCost: 1.75, nutritionValue: '717 kcal/100g' },
          { ingredientId: ingredients[1]._id, quantity: 30, unit: 'grams', unitPrice: 0.8, wastePercent: 1, yieldQuantity: 29.7, ingredientCost: 0.24, nutritionValue: '387 kcal/100g' },
        ],
        methodOfPreparation: '1. Mix flour, sugar, and salt in a bowl.\n2. Make a well in the center and add eggs and milk.\n3. Whisk until smooth batter forms.\n4. Melt butter and add to batter.\n5. Heat a non-stick pan over medium heat.\n6. Pour 1/4 cup batter per pancake.\n7. Cook until bubbles form on surface, flip and cook other side.\n8. Serve warm with maple syrup.',
        specialInstructions: 'Do not over-mix the batter. Lumps are okay for fluffy pancakes.',
        createdBy: adminUser._id,
      },
      {
        name: 'Spaghetti Carbonara',
        recipeGroup: 'Pasta Dishes',
        menuId: menus[2]._id,
        subMenuId: subMenus[2]._id,
        portions: 2,
        batchWeight: '400g',
        ingredients: [
          { ingredientId: ingredients[3]._id, quantity: 4, unit: 'pieces', unitPrice: 0.25, wastePercent: 12, yieldQuantity: 3.52, ingredientCost: 1.0, nutritionValue: '155 kcal/100g' },
          { ingredientId: ingredients[7]._id, quantity: 30, unit: 'ml', unitPrice: 4.0, wastePercent: 0, yieldQuantity: 30, ingredientCost: 1.2, nutritionValue: '884 kcal/100ml' },
          { ingredientId: ingredients[8]._id, quantity: 10, unit: 'grams', unitPrice: 1.5, wastePercent: 15, yieldQuantity: 8.5, ingredientCost: 0.15, nutritionValue: '149 kcal/100g' },
          { ingredientId: ingredients[6]._id, quantity: 5, unit: 'grams', unitPrice: 2.0, wastePercent: 0, yieldQuantity: 5, ingredientCost: 0.1, nutritionValue: '251 kcal/100g' },
          { ingredientId: ingredients[5]._id, quantity: 5, unit: 'grams', unitPrice: 0.1, wastePercent: 0, yieldQuantity: 5, ingredientCost: 0.005, nutritionValue: '0 kcal/100g' },
        ],
        methodOfPreparation: '1. Cook spaghetti in salted boiling water until al dente.\n2. Fry diced pancetta/guanciale in olive oil until crispy.\n3. Beat eggs with grated Pecorino Romano cheese.\n4. Drain pasta, reserving some cooking water.\n5. Toss hot pasta with pancetta.\n6. Remove from heat and quickly mix in egg mixture.\n7. Add pasta water as needed for creamy sauce.\n8. Season with black pepper and serve immediately.',
        specialInstructions: 'Never add cream. The creaminess comes from the egg and cheese emulsion. Remove pan from heat before adding egg mixture.',
        createdBy: adminUser._id,
      },
      {
        name: 'Caesar Salad',
        recipeGroup: 'Salads',
        menuId: menus[1]._id,
        subMenuId: subMenus[4]._id,
        portions: 2,
        batchWeight: '350g',
        ingredients: [
          { ingredientId: ingredients[8]._id, quantity: 15, unit: 'grams', unitPrice: 1.5, wastePercent: 15, yieldQuantity: 12.75, ingredientCost: 0.225, nutritionValue: '149 kcal/100g' },
          { ingredientId: ingredients[7]._id, quantity: 40, unit: 'ml', unitPrice: 4.0, wastePercent: 0, yieldQuantity: 40, ingredientCost: 1.6, nutritionValue: '884 kcal/100ml' },
          { ingredientId: ingredients[3]._id, quantity: 1, unit: 'pieces', unitPrice: 0.25, wastePercent: 12, yieldQuantity: 0.88, ingredientCost: 0.25, nutritionValue: '155 kcal/100g' },
          { ingredientId: ingredients[5]._id, quantity: 3, unit: 'grams', unitPrice: 0.1, wastePercent: 0, yieldQuantity: 3, ingredientCost: 0.003, nutritionValue: '0 kcal/100g' },
          { ingredientId: ingredients[6]._id, quantity: 2, unit: 'grams', unitPrice: 2.0, wastePercent: 0, yieldQuantity: 2, ingredientCost: 0.04, nutritionValue: '251 kcal/100g' },
        ],
        methodOfPreparation: '1. Wash and chop romaine lettuce.\n2. Make dressing: blend garlic, olive oil, egg yolk, lemon juice, and anchovy paste.\n3. Toast bread cubes with olive oil for croutons.\n4. Toss lettuce with dressing.\n5. Top with croutons and shaved Parmesan.\n6. Season with salt and pepper.',
        specialInstructions: 'Use fresh romaine lettuce for best crunch. Dressing can be made ahead and refrigerated.',
        createdBy: adminUser._id,
      },
      {
        name: 'Chocolate Cake',
        recipeGroup: 'Baked Goods',
        menuId: menus[3]._id,
        subMenuId: subMenus[0]._id,
        portions: 8,
        batchWeight: '1200g',
        ingredients: [
          { ingredientId: ingredients[0]._id, quantity: 300, unit: 'grams', unitPrice: 0.5, wastePercent: 2, yieldQuantity: 294, ingredientCost: 1.5, nutritionValue: '364 kcal/100g' },
          { ingredientId: ingredients[1]._id, quantity: 250, unit: 'grams', unitPrice: 0.8, wastePercent: 1, yieldQuantity: 247.5, ingredientCost: 2.0, nutritionValue: '387 kcal/100g' },
          { ingredientId: ingredients[2]._id, quantity: 150, unit: 'grams', unitPrice: 3.5, wastePercent: 0, yieldQuantity: 150, ingredientCost: 5.25, nutritionValue: '717 kcal/100g' },
          { ingredientId: ingredients[3]._id, quantity: 4, unit: 'pieces', unitPrice: 0.25, wastePercent: 12, yieldQuantity: 3.52, ingredientCost: 1.0, nutritionValue: '155 kcal/100g' },
          { ingredientId: ingredients[4]._id, quantity: 200, unit: 'ml', unitPrice: 1.2, wastePercent: 0, yieldQuantity: 200, ingredientCost: 2.4, nutritionValue: '42 kcal/100ml' },
        ],
        methodOfPreparation: '1. Preheat oven to 350°F (175°C).\n2. Grease and flour two 9-inch cake pans.\n3. Mix flour, sugar, cocoa powder, baking soda, and salt.\n4. Add eggs, milk, oil, and vanilla; beat until smooth.\n5. Stir in boiling water (batter will be thin).\n6. Pour into prepared pans.\n7. Bake 30-35 minutes until toothpick comes out clean.\n8. Cool in pans for 10 minutes, then remove to wire racks.\n9. Frost with chocolate ganache when completely cooled.',
        specialInstructions: 'The boiling water makes the cake incredibly moist. Do not skip this step. Allow cakes to cool completely before frosting.',
        createdBy: adminUser._id,
      },
      {
        name: 'Margherita Pizza',
        recipeGroup: 'Pizza',
        menuId: menus[2]._id,
        subMenuId: subMenus[2]._id,
        portions: 4,
        batchWeight: '800g',
        ingredients: [
          { ingredientId: ingredients[0]._id, quantity: 400, unit: 'grams', unitPrice: 0.5, wastePercent: 2, yieldQuantity: 392, ingredientCost: 2.0, nutritionValue: '364 kcal/100g' },
          { ingredientId: ingredients[7]._id, quantity: 30, unit: 'ml', unitPrice: 4.0, wastePercent: 0, yieldQuantity: 30, ingredientCost: 1.2, nutritionValue: '884 kcal/100ml' },
          { ingredientId: ingredients[5]._id, quantity: 8, unit: 'grams', unitPrice: 0.1, wastePercent: 0, yieldQuantity: 8, ingredientCost: 0.008, nutritionValue: '0 kcal/100g' },
          { ingredientId: ingredients[1]._id, quantity: 5, unit: 'grams', unitPrice: 0.8, wastePercent: 1, yieldQuantity: 4.95, ingredientCost: 0.04, nutritionValue: '387 kcal/100g' },
          { ingredientId: ingredients[8]._id, quantity: 10, unit: 'grams', unitPrice: 1.5, wastePercent: 15, yieldQuantity: 8.5, ingredientCost: 0.15, nutritionValue: '149 kcal/100g' },
          { ingredientId: ingredients[9]._id, quantity: 50, unit: 'grams', unitPrice: 0.6, wastePercent: 10, yieldQuantity: 45, ingredientCost: 0.3, nutritionValue: '40 kcal/100g' },
        ],
        methodOfPreparation: '1. Mix flour, yeast, salt, sugar, and olive oil with warm water.\n2. Knead dough for 10 minutes until smooth and elastic.\n3. Let dough rise for 1 hour in a warm place.\n4. Punch down and divide into 4 portions.\n5. Roll each portion into a thin circle.\n6. Spread tomato sauce, add fresh mozzarella slices.\n7. Bake at 475°F (245°C) for 10-12 minutes.\n8. Top with fresh basil leaves and drizzle with olive oil.',
        specialInstructions: 'Use a pizza stone if available for crispier crust. Fresh mozzarella should be sliced and drained before use.',
        createdBy: adminUser._id,
      },
    ]);

    console.log('Recipes seeded.');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('  Admin: admin@gourmetcraft.com / admin123');
    console.log('  User:  user@gourmetcraft.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
