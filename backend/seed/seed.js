import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Menu from '../models/Menu.js';
import SubMenu from '../models/SubMenu.js';
import Ingredient from '../models/Ingredient.js';
import Recipe from '../models/Recipe.js';

dotenv.config();

const rawIngredients = [
  // ==================== SPIRITS ====================
  { name: 'Tequila', unit: 'ml', price: 3.00, waste: 2, nutrition: 'Alcohol 40%' },
  { name: 'Gin', unit: 'ml', price: 2.50, waste: 2, nutrition: 'Alcohol 40%' },
  { name: 'Whiskey', unit: 'ml', price: 4.00, waste: 2, nutrition: 'Alcohol 40%' },
  { name: 'Vodka', unit: 'ml', price: 2.00, waste: 2, nutrition: 'Alcohol 40%' },
  { name: 'Cointreau', unit: 'ml', price: 5.00, waste: 2, nutrition: 'Alcohol 40%' },

  // ==================== MIXERS ====================
  { name: 'Agave', unit: 'ml', price: 1.50, waste: 3, nutrition: 'Sugar 60%' },
  { name: 'Tonic', unit: 'ml', price: 0.50, waste: 2, nutrition: 'Sugar 8%' },
  { name: 'Soda', unit: 'ml', price: 0.30, waste: 2, nutrition: 'Carbonated water' },
  { name: 'Sugar Syrup', unit: 'ml', price: 0.40, waste: 3, nutrition: 'Sugar 65%' },
  { name: 'Maple', unit: 'ml', price: 2.00, waste: 3, nutrition: 'Sugar 60%' },
  { name: 'Muddled Malta', unit: 'ml', price: 0.80, waste: 5, nutrition: 'Sugar 10%' },

  // ==================== FRUITS ====================
  { name: 'Lime', unit: 'piece', price: 15.00, waste: 10, nutrition: 'Vitamin C' },
  { name: 'Orange', unit: 'piece', price: 20.00, waste: 10, nutrition: 'Vitamin C' },
  { name: 'Fig', unit: 'g', price: 2.00, waste: 8, nutrition: 'Fiber, Potassium' },
  { name: 'Winter Fruit', unit: 'g', price: 1.50, waste: 10, nutrition: 'Vitamins A, C' },
  { name: 'Macerated Strawberry', unit: 'g', price: 3.00, waste: 8, nutrition: 'Vitamin C' },
  { name: 'Baby Potato', unit: 'g', price: 0.50, waste: 8, nutrition: 'Carbohydrates' },
  { name: 'Sweet Potato', unit: 'g', price: 0.40, waste: 10, nutrition: 'Vitamin A' },
  { name: 'Purple Yam', unit: 'g', price: 0.60, waste: 10, nutrition: 'Antioxidants' },
  { name: 'Tomato', unit: 'g', price: 0.30, waste: 8, nutrition: 'Vitamin C' },
  { name: 'Eggplant', unit: 'g', price: 0.40, waste: 10, nutrition: 'Fiber' },
  { name: 'Cranberry', unit: 'g', price: 2.50, waste: 8, nutrition: 'Vitamin C' },
  { name: 'Sugar Snap Pea', unit: 'g', price: 1.00, waste: 10, nutrition: 'Vitamin K' },
  { name: 'Berry', unit: 'g', price: 3.00, waste: 10, nutrition: 'Antioxidants' },
  { name: 'Green Pea', unit: 'g', price: 0.50, waste: 8, nutrition: 'Protein, Fiber' },

  // ==================== VEGETABLES ====================
  { name: 'Asparagus', unit: 'g', price: 1.50, waste: 12, nutrition: 'Vitamin K' },
  { name: 'Brussel Sprout', unit: 'g', price: 1.20, waste: 10, nutrition: 'Vitamin C' },
  { name: 'Parsnip', unit: 'g', price: 1.00, waste: 10, nutrition: 'Fiber' },
  { name: 'Smashed Potato', unit: 'g', price: 0.50, waste: 8, nutrition: 'Carbohydrates' },
  { name: 'Baby Carrot', unit: 'g', price: 0.80, waste: 10, nutrition: 'Vitamin A' },
  { name: 'Shishito Pepper', unit: 'g', price: 2.00, waste: 8, nutrition: 'Vitamin C' },
  { name: 'Baby Broccoli', unit: 'g', price: 1.00, waste: 10, nutrition: 'Vitamin K' },
  { name: 'Kale', unit: 'g', price: 1.00, waste: 12, nutrition: 'Vitamin K' },
  { name: 'Wax Gourd', unit: 'g', price: 0.60, waste: 10, nutrition: 'Low calorie' },
  { name: 'Winter Vegetable', unit: 'g', price: 0.80, waste: 12, nutrition: 'Vitamins' },
  { name: 'Aloor Jhuri Bhaja', unit: 'g', price: 1.50, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Begun Bhaja', unit: 'g', price: 1.20, waste: 5, nutrition: 'Fiber' },

  // ==================== DAIRY & CHEESE ====================
  { name: 'Goat Cheese', unit: 'g', price: 4.00, waste: 5, nutrition: 'Protein, Calcium' },
  { name: 'Ricotta', unit: 'g', price: 2.00, waste: 5, nutrition: 'Protein' },
  { name: 'Mascarpone', unit: 'g', price: 3.00, waste: 5, nutrition: 'Fat, Protein' },
  { name: 'Parmesan Crumble', unit: 'g', price: 5.00, waste: 5, nutrition: 'Protein, Calcium' },
  { name: 'Camembert', unit: 'g', price: 4.50, waste: 5, nutrition: 'Protein, Fat' },
  { name: 'Chenna', unit: 'g', price: 1.00, waste: 5, nutrition: 'Protein' },
  { name: 'Yogurt', unit: 'g', price: 0.80, waste: 5, nutrition: 'Probiotics' },
  { name: 'Saffron', unit: 'pinch', price: 50.00, waste: 0, nutrition: 'Antioxidants' },
  { name: 'Sun-dried Tomato Butter', unit: 'g', price: 2.00, waste: 5, nutrition: 'Fat' },
  { name: 'Mustard Butter', unit: 'g', price: 1.80, waste: 5, nutrition: 'Fat' },
  { name: 'Vanilla Lemon Butter', unit: 'g', price: 2.20, waste: 5, nutrition: 'Fat' },
  { name: 'Reduced Milk', unit: 'ml', price: 0.60, waste: 3, nutrition: 'Calcium' },
  { name: 'Egg', unit: 'piece', price: 8.00, waste: 5, nutrition: 'Protein' },
  { name: 'Belpar Knolle', unit: 'g', price: 3.50, waste: 5, nutrition: 'Protein, Fat' },
  { name: '"Konark" French Tomme', unit: 'g', price: 3.00, waste: 5, nutrition: 'Protein, Fat' },
  { name: 'Butter', unit: 'g', price: 1.00, waste: 5, nutrition: 'Fat' },

  // ==================== BREADS & GRAINS ====================
  { name: 'Sourdough Bread', unit: 'slice', price: 25.00, waste: 8, nutrition: 'Carbohydrates' },
  { name: 'Sourdough Crisp', unit: 'g', price: 1.50, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Focaccia', unit: 'slice', price: 30.00, waste: 8, nutrition: 'Carbohydrates' },
  { name: 'Cornbread', unit: 'g', price: 1.00, waste: 8, nutrition: 'Carbohydrates' },
  { name: 'Cracker', unit: 'g', price: 1.20, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Gougère', unit: 'g', price: 1.80, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Palmier', unit: 'g', price: 1.60, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Fragrant Rice', unit: 'g', price: 0.60, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Arborio Rice', unit: 'g', price: 0.80, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Golden Moong', unit: 'g', price: 0.50, waste: 5, nutrition: 'Protein' },
  { name: 'Spaetzli', unit: 'g', price: 1.00, waste: 5, nutrition: 'Carbohydrates' },

  // ==================== NUTS & SEEDS ====================
  { name: 'Almond', unit: 'g', price: 2.50, waste: 5, nutrition: 'Protein, Fat' },
  { name: 'Almond Sliver', unit: 'g', price: 3.00, waste: 5, nutrition: 'Protein, Fat' },
  { name: 'Pistachio', unit: 'g', price: 4.00, waste: 5, nutrition: 'Protein, Fat' },
  { name: 'Pine Nut', unit: 'g', price: 5.00, waste: 5, nutrition: 'Protein, Fat' },
  { name: 'Walnut', unit: 'g', price: 2.00, waste: 5, nutrition: 'Omega-3' },
  { name: 'Cashewnut', unit: 'g', price: 2.50, waste: 5, nutrition: 'Protein, Fat' },
  { name: 'Poppy Seed', unit: 'g', price: 1.50, waste: 3, nutrition: 'Calcium' },
  { name: 'Chestnuts', unit: 'g', price: 1.20, waste: 10, nutrition: 'Carbohydrates' },

  // ==================== SPICES & HERBS ====================
  { name: 'Spice Mix', unit: 'g', price: 1.00, waste: 2, nutrition: 'Spices' },
  { name: 'Panch Phoron', unit: 'g', price: 0.80, waste: 2, nutrition: 'Spices' },
  { name: 'Fennel Crush', unit: 'g', price: 1.00, waste: 2, nutrition: 'Fiber' },
  { name: 'Thyme-chilli', unit: 'g', price: 1.50, waste: 2, nutrition: 'Spices' },
  { name: 'Mint', unit: 'leaves', price: 2.00, waste: 15, nutrition: 'Vitamins' },
  { name: 'Rosemary', unit: 'g', price: 2.00, waste: 10, nutrition: 'Antioxidants' },
  { name: 'Sage', unit: 'g', price: 1.80, waste: 10, nutrition: 'Vitamins' },
  { name: 'Star Anise', unit: 'g', price: 1.00, waste: 2, nutrition: 'Spices' },
  { name: 'Ginger', unit: 'g', price: 0.60, waste: 10, nutrition: 'Antioxidants' },
  { name: 'Chilli', unit: 'g', price: 0.80, waste: 5, nutrition: 'Vitamin C' },
  { name: 'Chilli Flakes', unit: 'g', price: 0.50, waste: 2, nutrition: 'Vitamin C' },
  { name: 'Mixed Peppercorn', unit: 'g', price: 0.60, waste: 2, nutrition: 'Spices' },
  { name: 'Pink Peppercorn', unit: 'g', price: 1.20, waste: 2, nutrition: 'Spices' },

  // ==================== CONDIMENTS ====================
  { name: 'Kasundi', unit: 'g', price: 1.00, waste: 3, nutrition: 'Mustard' },
  { name: 'Tamarind', unit: 'g', price: 0.60, waste: 5, nutrition: 'Vitamins' },
  { name: 'Coconut', unit: 'g', price: 0.50, waste: 5, nutrition: 'Fat' },
  { name: 'Balsamic Vinegar', unit: 'ml', price: 0.80, waste: 2, nutrition: 'Acetic acid' },
  { name: 'Extra Virgin Olive Oil', unit: 'ml', price: 0.80, waste: 2, nutrition: 'Healthy fat' },
  { name: 'Fig & Rosemary Preserve', unit: 'g', price: 1.50, waste: 3, nutrition: 'Sugar' },
  { name: 'Bitter Orange Preserve', unit: 'g', price: 1.20, waste: 3, nutrition: 'Sugar' },
  { name: 'Hot & Sweet Dip', unit: 'ml', price: 0.50, waste: 3, nutrition: 'Sugar, Spices' },
  { name: 'Jalapeno Salsa', unit: 'ml', price: 0.60, waste: 5, nutrition: 'Vegetables' },
  { name: 'Tomato Khejur Chutney', unit: 'g', price: 0.80, waste: 5, nutrition: 'Sugar' },
  { name: 'Raw Papaya Chutney', unit: 'g', price: 0.70, waste: 5, nutrition: 'Vitamins' },
  { name: 'Anarosher Chutney', unit: 'g', price: 0.70, waste: 5, nutrition: 'Vitamins' },

  // ==================== SPECIALTY ====================
  { name: 'Sandesh', unit: 'g', price: 1.50, waste: 5, nutrition: 'Protein' },
  { name: 'Nolen Gur', unit: 'g', price: 1.20, waste: 5, nutrition: 'Sugar' },
  { name: 'Callebaut', unit: 'g', price: 3.00, waste: 3, nutrition: 'Chocolate' },
  { name: 'Bori', unit: 'g', price: 0.80, waste: 5, nutrition: 'Protein' },
  { name: 'Papad Bhaja', unit: 'g', price: 0.50, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Paan', unit: 'piece', price: 15.00, waste: 5, nutrition: 'Betel leaf' },

  // ==================== ADDITIONAL ====================
  { name: 'Vanilla', unit: 'g', price: 2.50, waste: 2, nutrition: 'Flavor' },
  { name: 'Coffee', unit: 'ml', price: 0.50, waste: 2, nutrition: 'Caffeine' },
  { name: 'Poshtor Bora', unit: 'g', price: 0.80, waste: 5, nutrition: 'Protein' },
  { name: 'Sea Salt', unit: 'g', price: 0.20, waste: 0, nutrition: 'Sodium' },
  { name: 'Olive', unit: 'g', price: 1.50, waste: 5, nutrition: 'Fat' },
  { name: 'Jackfruit', unit: 'g', price: 1.00, waste: 5, nutrition: 'Carbohydrates' },
  { name: 'Raisin', unit: 'g', price: 1.00, waste: 2, nutrition: 'Sugar' },
  { name: 'Caramel', unit: 'g', price: 0.80, waste: 2, nutrition: 'Sugar' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany({});
    await Menu.deleteMany({});
    await SubMenu.deleteMany({});
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});

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

    const menusData = [
      'Cocktails', 'Small Plates', 'Cheese', 'Bengali', 'Italian', 'Desserts', 'Beverages', 'Accompaniments'
    ];
    const menus = await Menu.insertMany(menusData.map(n => ({ name: n })));

    const findMenu = name => menus.find(m => m.name === name)._id;

    const subMenusData = [
      { name: 'Bengali', menu: 'Small Plates' },
      { name: 'Swiss', menu: 'Small Plates' },
      { name: 'Individual Items', menu: 'Small Plates' },
      { name: 'Condiments', menu: 'Small Plates' },
      { name: 'Cheese Selection', menu: 'Cheese' },
      { name: 'Bengali Cuisine', menu: 'Bengali' },
      { name: 'Italian Cuisine', menu: 'Italian' },
      { name: 'Desserts', menu: 'Desserts' },
      { name: 'Beverages', menu: 'Beverages' },
      { name: 'Accompaniments', menu: 'Accompaniments' },
    ];
    const subMenus = await SubMenu.insertMany(subMenusData.map(s => ({
      name: s.name,
      menuId: findMenu(s.menu)
    })));

    const findSubMenu = name => subMenus.find(s => s.name === name)._id;

    const dbIngredients = await Ingredient.insertMany(rawIngredients.map(i => ({
      name: i.name,
      quantityUnit: i.unit,
      unitPrice: i.price,
      wastePercent: i.waste,
      nutritionValue: i.nutrition,
      status: 'Active',
      isActive: true
    })));

    const getIng = name => {
      const found = dbIngredients.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (!found) throw new Error(`Ingredient not found: ${name}`);
      return found;
    };

    const recipesData = [
      // ==================== COCKTAILS (Sales Price: ₹11-15, Food Cost: 30-40%) ====================
      {
        name: 'PICANTE',
        group: 'Cocktails',
        menu: 'Cocktails',
        portions: 1,
        batchWeight: '250 ml',
        salesPricePerPortion: 12.00,
        potentialFoodCost: 35.00,
        totalNutritionValue: '200 kcal',
        nutritionValuePerBatch: '100 kcal',
        method: 'Shake with ice, strain into chilled glass',
        special: 'Garnish with lime wheel',
        ingredients: [
          { n: 'Tequila', q: 45 },
          { n: 'Agave', q: 15 },
          { n: 'Lime', q: 1 }
        ]
      },
      {
        name: 'MUDDLED ORANGE GIN',
        group: 'Cocktails',
        menu: 'Cocktails',
        portions: 1,
        batchWeight: '250 ml',
        salesPricePerPortion: 14.00,
        potentialFoodCost: 32.00,
        totalNutritionValue: '180 kcal',
        nutritionValuePerBatch: '90 kcal',
        method: 'Muddle orange, combine with gin and malta, top with tonic and soda',
        special: 'Serve over ice',
        ingredients: [
          { n: 'Gin', q: 50 },
          { n: 'Muddled Malta', q: 30 },
          { n: 'Tonic', q: 60 },
          { n: 'Soda', q: 30 }
        ]
      },
      {
        name: 'MARGARITA',
        group: 'Cocktails',
        menu: 'Cocktails',
        portions: 1,
        batchWeight: '250 ml',
        salesPricePerPortion: 13.00,
        potentialFoodCost: 38.00,
        totalNutritionValue: '220 kcal',
        nutritionValuePerBatch: '110 kcal',
        method: 'Shake with ice, strain into salt-rimmed glass',
        special: 'Serve with lime wedge',
        ingredients: [
          { n: 'Tequila', q: 50 },
          { n: 'Lime', q: 1 },
          { n: 'Cointreau', q: 20 }
        ]
      },
      {
        name: 'WHISKEY SOUR',
        group: 'Cocktails',
        menu: 'Cocktails',
        portions: 1,
        batchWeight: '250 ml',
        salesPricePerPortion: 15.00,
        potentialFoodCost: 30.00,
        totalNutritionValue: '210 kcal',
        nutritionValuePerBatch: '105 kcal',
        method: 'Shake with ice, strain into rocks glass',
        special: 'Garnish with cherry',
        ingredients: [
          { n: 'Whiskey', q: 60 },
          { n: 'Lime', q: 1 },
          { n: 'Sugar Syrup', q: 15 }
        ]
      },
      {
        name: 'CAIPIROSKA',
        group: 'Cocktails',
        menu: 'Cocktails',
        portions: 1,
        batchWeight: '250 ml',
        salesPricePerPortion: 11.00,
        potentialFoodCost: 40.00,
        totalNutritionValue: '190 kcal',
        nutritionValuePerBatch: '95 kcal',
        method: 'Muddle lime and mint, add vodka and crushed ice',
        special: 'Serve in old fashioned glass',
        ingredients: [
          { n: 'Vodka', q: 50 },
          { n: 'Lime', q: 1 },
          { n: 'Mint', q: 5 }
        ]
      },

      // ==================== SMALL PLATES - BENGALI (Sales Price: ₹22-24, Food Cost: 42-46%) ====================
      {
        name: 'GHUGHNI',
        group: 'Bengali',
        menu: 'Small Plates',
        subMenu: 'Bengali',
        portions: 2,
        batchWeight: '5 kg',
        salesPricePerPortion: 24.00,
        potentialFoodCost: 45.00,
        totalNutritionValue: '850 kcal',
        nutritionValuePerBatch: '425 kcal',
        method: 'Cook coconut with spices, add tamarind and lime',
        special: 'Serve warm with crispy bread',
        ingredients: [
          { n: 'Coconut', q: 30 },
          { n: 'Tamarind', q: 10 },
          { n: 'Lime', q: 1 },
          { n: 'Spice Mix', q: 8 }
        ]
      },
      {
        name: 'ALOO KABLI',
        group: 'Bengali',
        menu: 'Small Plates',
        subMenu: 'Bengali',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 22.00,
        potentialFoodCost: 42.00,
        totalNutritionValue: '780 kcal',
        nutritionValuePerBatch: '390 kcal',
        method: 'Roast vegetables with spices, toss in tamarind glaze',
        special: 'Garnish with fresh coriander',
        ingredients: [
          { n: 'Baby Potato', q: 100 },
          { n: 'Sweet Potato', q: 80 },
          { n: 'Purple Yam', q: 80 },
          { n: 'Tamarind', q: 25 },
          { n: 'Spice Mix', q: 15 }
        ]
      },

      // ==================== SMALL PLATES - SWISS (Sales Price: ₹32, Food Cost: 38%) ====================
      {
        name: 'RACLETTE',
        group: 'Swiss',
        menu: 'Small Plates',
        subMenu: 'Swiss',
        portions: 2,
        batchWeight: '2 kg',
        salesPricePerPortion: 32.00,
        potentialFoodCost: 38.00,
        totalNutritionValue: '1200 kcal',
        nutritionValuePerBatch: '600 kcal',
        method: 'Roast vegetables until tender, serve with melted raclette cheese',
        special: 'Accompanied by bread and flavored butters',
        ingredients: [
          { n: 'Asparagus', q: 50 },
          { n: 'Brussel Sprout', q: 40 },
          { n: 'Parsnip', q: 30 },
          { n: 'Smashed Potato', q: 60 },
          { n: 'Baby Carrot', q: 40 },
          { n: 'Shishito Pepper', q: 25 },
          { n: 'Sourdough Bread', q: 2 },
          { n: 'Sun-dried Tomato Butter', q: 20 },
          { n: 'Mustard Butter', q: 20 }
        ]
      },

      // ==================== SMALL PLATES - INDIVIDUAL (Sales Price: ₹18-28, Food Cost: 25-40%) ====================
      {
        name: 'ROASTED CHESTNUTS',
        group: 'Individual Items',
        menu: 'Small Plates',
        subMenu: 'Individual Items',
        portions: 2,
        batchWeight: '1 kg',
        salesPricePerPortion: 18.00,
        potentialFoodCost: 40.00,
        totalNutritionValue: '600 kcal',
        nutritionValuePerBatch: '300 kcal',
        method: 'Roast chestnuts until soft, serve with dips',
        special: 'Sprinkle with chilli flakes',
        ingredients: [
          { n: 'Chestnuts', q: 200 },
          { n: 'Mixed Peppercorn', q: 5 },
          { n: 'Hot & Sweet Dip', q: 30 },
          { n: 'Jalapeno Salsa', q: 30 },
          { n: 'Chilli Flakes', q: 5 }
        ]
      },
      {
        name: 'CAMEMBERT',
        group: 'Individual Items',
        menu: 'Small Plates',
        subMenu: 'Individual Items',
        portions: 2,
        batchWeight: '1.5 kg',
        salesPricePerPortion: 28.00,
        potentialFoodCost: 35.00,
        totalNutritionValue: '950 kcal',
        nutritionValuePerBatch: '475 kcal',
        method: 'Bake camembert with fig and rosemary',
        special: 'Top with crushed pistachio',
        ingredients: [
          { n: 'Camembert', q: 150 },
          { n: 'Fig', q: 50 },
          { n: 'Rosemary', q: 5 },
          { n: 'Pistachio', q: 30 }
        ]
      },
      {
        name: 'GOAT CHEESE',
        group: 'Individual Items',
        menu: 'Small Plates',
        subMenu: 'Individual Items',
        portions: 2,
        batchWeight: '1 kg',
        salesPricePerPortion: 26.00,
        potentialFoodCost: 38.00,
        totalNutritionValue: '880 kcal',
        nutritionValuePerBatch: '440 kcal',
        method: 'Serve goat cheese at room temperature',
        special: 'Garnish with pink peppercorn and toasted pine nuts',
        ingredients: [
          { n: 'Goat Cheese', q: 120 },
          { n: 'Pink Peppercorn', q: 5 },
          { n: 'Pine Nut', q: 30 }
        ]
      },

      // ==================== SMALL PLATES - CONDIMENTS (Sales Price: ₹7-10, Food Cost: 35-45%) ====================
      {
        name: 'MIXED PEPPERCORN',
        group: 'Condiments',
        menu: 'Small Plates',
        subMenu: 'Condiments',
        portions: 2,
        batchWeight: '500 g',
        salesPricePerPortion: 8.00,
        potentialFoodCost: 40.00,
        totalNutritionValue: '50 kcal',
        nutritionValuePerBatch: '25 kcal',
        method: 'Freshly ground mixed peppercorns',
        special: 'Served in a small bowl',
        ingredients: [
          { n: 'Mixed Peppercorn', q: 5 }
        ]
      },
      {
        name: 'HOT & SWEET DIP',
        group: 'Condiments',
        menu: 'Small Plates',
        subMenu: 'Condiments',
        portions: 2,
        batchWeight: '500 ml',
        salesPricePerPortion: 10.00,
        potentialFoodCost: 35.00,
        totalNutritionValue: '150 kcal',
        nutritionValuePerBatch: '75 kcal',
        method: 'Blend hot and sweet ingredients',
        special: 'Serve chilled',
        ingredients: [
          { n: 'Hot & Sweet Dip', q: 30 }
        ]
      },
      {
        name: 'JALAPENO SALSA',
        group: 'Condiments',
        menu: 'Small Plates',
        subMenu: 'Condiments',
        portions: 2,
        batchWeight: '500 ml',
        salesPricePerPortion: 9.00,
        potentialFoodCost: 38.00,
        totalNutritionValue: '120 kcal',
        nutritionValuePerBatch: '60 kcal',
        method: 'Fresh jalapeno salsa',
        special: 'Served with tortilla chips',
        ingredients: [
          { n: 'Jalapeno Salsa', q: 30 }
        ]
      },
      {
        name: 'CHILLI FLAKES',
        group: 'Condiments',
        menu: 'Small Plates',
        subMenu: 'Condiments',
        portions: 2,
        batchWeight: '500 g',
        salesPricePerPortion: 7.00,
        potentialFoodCost: 45.00,
        totalNutritionValue: '40 kcal',
        nutritionValuePerBatch: '20 kcal',
        method: 'Dried chilli flakes',
        special: 'Served in a shaker',
        ingredients: [
          { n: 'Chilli Flakes', q: 5 }
        ]
      },

      // ==================== CHEESE (Sales Price: ₹13-22, Food Cost: 25-35%) ====================
      {
        name: 'BELPAR KNOLLE',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '1 kg',
        salesPricePerPortion: 20.00,
        potentialFoodCost: 28.00,
        totalNutritionValue: '750 kcal',
        nutritionValuePerBatch: '375 kcal',
        method: 'Serve at room temperature with winter fruit compote',
        special: 'Pairs well with dark bread',
        ingredients: [
          { n: 'Belpar Knolle', q: 100 },
          { n: 'Winter Fruit', q: 80 }
        ]
      },
      {
        name: 'KONARK FRENCH TOMME',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '2 kg',
        salesPricePerPortion: 22.00,
        potentialFoodCost: 30.00,
        totalNutritionValue: '800 kcal',
        nutritionValuePerBatch: '400 kcal',
        method: 'Serve at room temperature',
        special: 'Pairs with nuts and honey',
        ingredients: [
          { n: '"Konark" French Tomme', q: 150 }
        ]
      },
      {
        name: 'RICOTTA',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '2 kg',
        salesPricePerPortion: 18.00,
        potentialFoodCost: 32.00,
        totalNutritionValue: '700 kcal',
        nutritionValuePerBatch: '350 kcal',
        method: 'Serve ricotta with macerated strawberries',
        special: 'Drizzle with balsamic reduction',
        ingredients: [
          { n: 'Ricotta', q: 120 },
          { n: 'Macerated Strawberry', q: 60 },
          { n: 'Balsamic Vinegar', q: 15 }
        ]
      },
      {
        name: 'BREAD',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '2 kg',
        salesPricePerPortion: 16.00,
        potentialFoodCost: 25.00,
        totalNutritionValue: '650 kcal',
        nutritionValuePerBatch: '325 kcal',
        method: 'Artisanal bread selection',
        special: 'Served with butter and olive oil',
        ingredients: [
          { n: 'Gougère', q: 50 },
          { n: 'Palmier', q: 50 },
          { n: 'Cornbread', q: 50 },
          { n: 'Sourdough Crisp', q: 40 },
          { n: 'Cracker', q: 40 }
        ]
      },
      {
        name: 'VANILLA LEMON BUTTER',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '1 kg',
        salesPricePerPortion: 14.00,
        potentialFoodCost: 28.00,
        totalNutritionValue: '600 kcal',
        nutritionValuePerBatch: '300 kcal',
        method: 'Blend vanilla with lemon butter',
        special: 'Serve chilled',
        ingredients: [
          { n: 'Vanilla', q: 5 },
          { n: 'Vanilla Lemon Butter', q: 100 }
        ]
      },
      {
        name: 'PRESERVE',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '1 kg',
        salesPricePerPortion: 15.00,
        potentialFoodCost: 30.00,
        totalNutritionValue: '620 kcal',
        nutritionValuePerBatch: '310 kcal',
        method: 'Artisanal preserves',
        special: 'Serve with cheese and bread',
        ingredients: [
          { n: 'Fig & Rosemary Preserve', q: 60 },
          { n: 'Bitter Orange Preserve', q: 60 }
        ]
      },
      {
        name: 'WALNUT',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '1 kg',
        salesPricePerPortion: 17.00,
        potentialFoodCost: 35.00,
        totalNutritionValue: '680 kcal',
        nutritionValuePerBatch: '340 kcal',
        method: 'Roast walnuts with sage and sea salt',
        special: 'Serve warm',
        ingredients: [
          { n: 'Walnut', q: 80 },
          { n: 'Sage', q: 5 },
          { n: 'Sea Salt', q: 3 }
        ]
      },
      {
        name: 'OLIVE',
        group: 'Cheese Selection',
        menu: 'Cheese',
        subMenu: 'Cheese Selection',
        portions: 2,
        batchWeight: '1 kg',
        salesPricePerPortion: 13.00,
        potentialFoodCost: 32.00,
        totalNutritionValue: '640 kcal',
        nutritionValuePerBatch: '320 kcal',
        method: 'Marinate olives with chilli and rosemary',
        special: 'Serve at room temperature',
        ingredients: [
          { n: 'Olive', q: 30 },
          { n: 'Chilli', q: 10 },
          { n: 'Rosemary', q: 5 }
        ]
      },

      // ==================== BENGALI CUISINE (Sales Price: ₹20-28, Food Cost: 38-45%) ====================
      {
        name: 'CHANNAR PATURI',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 26.00,
        potentialFoodCost: 42.00,
        totalNutritionValue: '850 kcal',
        nutritionValuePerBatch: '425 kcal',
        method: 'Steam chhena wrapped in banana leaf with kasundi',
        special: 'Serve with mustard sauce',
        ingredients: [
          { n: 'Chenna', q: 150 },
          { n: 'Kasundi', q: 20 }
        ]
      },
      {
        name: 'SHUKNO ALOOR DOM',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 22.00,
        potentialFoodCost: 45.00,
        totalNutritionValue: '780 kcal',
        nutritionValuePerBatch: '390 kcal',
        method: 'Slow cook baby potatoes with panch phoron',
        special: 'Garnish with fresh coriander',
        ingredients: [
          { n: 'Baby Potato', q: 150 },
          { n: 'Panch Phoron', q: 10 }
        ]
      },
      {
        name: 'POTOL POSHTO',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 24.00,
        potentialFoodCost: 42.00,
        totalNutritionValue: '820 kcal',
        nutritionValuePerBatch: '410 kcal',
        method: 'Cook wax gourd in poppy seed paste',
        special: 'Serve with steamed rice',
        ingredients: [
          { n: 'Wax Gourd', q: 120 },
          { n: 'Poppy Seed', q: 30 }
        ]
      },
      {
        name: 'SONA MUGER DAL NARKOL DIYE',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '5 kg',
        salesPricePerPortion: 20.00,
        potentialFoodCost: 38.00,
        totalNutritionValue: '720 kcal',
        nutritionValuePerBatch: '360 kcal',
        method: 'Cook moong dal with coconut milk',
        special: 'Tempered with ghee and spices',
        ingredients: [
          { n: 'Golden Moong', q: 100 },
          { n: 'Coconut', q: 50 }
        ]
      },
      {
        name: 'KOSHA',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '4 kg',
        salesPricePerPortion: 28.00,
        potentialFoodCost: 40.00,
        totalNutritionValue: '900 kcal',
        nutritionValuePerBatch: '450 kcal',
        method: 'Slow cook jackfruit with almond paste',
        special: 'Rich Bengali kosha style',
        ingredients: [
          { n: 'Jackfruit', q: 150 },
          { n: 'Almond', q: 30 }
        ]
      },
      {
        name: 'DEVILLED CURRY',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 25.00,
        potentialFoodCost: 44.00,
        totalNutritionValue: '880 kcal',
        nutritionValuePerBatch: '440 kcal',
        method: 'Devilled egg curry with kasundi',
        special: 'Serve with luchi or paratha',
        ingredients: [
          { n: 'Egg', q: 2 },
          { n: 'Kasundi', q: 25 }
        ]
      },
      {
        name: 'CHORCHORI',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '5 kg',
        salesPricePerPortion: 23.00,
        potentialFoodCost: 43.00,
        totalNutritionValue: '860 kcal',
        nutritionValuePerBatch: '430 kcal',
        method: 'Mixed winter vegetable with dried lentil dumplings',
        special: 'Lightly spiced',
        ingredients: [
          { n: 'Winter Vegetable', q: 200 },
          { n: 'Bori', q: 30 }
        ]
      },
      {
        name: 'GOBINDO BHOG POLAO',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '5 kg',
        salesPricePerPortion: 27.00,
        potentialFoodCost: 44.00,
        totalNutritionValue: '890 kcal',
        nutritionValuePerBatch: '445 kcal',
        method: 'Cook rice with raisins and cashews',
        special: 'Aromatic Bengali pulao',
        ingredients: [
          { n: 'Fragrant Rice', q: 150 },
          { n: 'Raisin', q: 30 },
          { n: 'Cashewnut', q: 30 }
        ]
      },
      {
        name: 'KORAISHUTIR KOCHURI',
        group: 'Bengali Cuisine',
        menu: 'Bengali',
        subMenu: 'Bengali Cuisine',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 24.00,
        potentialFoodCost: 41.00,
        totalNutritionValue: '870 kcal',
        nutritionValuePerBatch: '435 kcal',
        method: 'Stuffed fried bread with spiced green peas',
        special: 'Serve with aloor dum',
        ingredients: [
          { n: 'Green Pea', q: 100 },
          { n: 'Spice Mix', q: 15 }
        ]
      },

      // ==================== ITALIAN CUISINE (Sales Price: ₹18-26, Food Cost: 36-42%) ====================
      {
        name: 'HOMESTYLE SALAD',
        group: 'Italian Cuisine',
        menu: 'Italian',
        subMenu: 'Italian Cuisine',
        portions: 2,
        batchWeight: '2 kg',
        salesPricePerPortion: 18.00,
        potentialFoodCost: 38.00,
        totalNutritionValue: '680 kcal',
        nutritionValuePerBatch: '340 kcal',
        method: 'Toss kale with cranberries and crumbled goat cheese',
        special: 'Drizzle with balsamic vinaigrette',
        ingredients: [
          { n: 'Kale', q: 40 },
          { n: 'Cranberry', q: 20 },
          { n: 'Goat Cheese', q: 24 }
        ]
      },
      {
        name: 'SPAETZLI',
        group: 'Italian Cuisine',
        menu: 'Italian',
        subMenu: 'Italian Cuisine',
        portions: 2,
        batchWeight: '2 kg',
        salesPricePerPortion: 22.00,
        potentialFoodCost: 40.00,
        totalNutritionValue: '780 kcal',
        nutritionValuePerBatch: '390 kcal',
        method: 'Cook spaetzli, toss with roasted broccoli and almonds',
        special: 'Finish with brown butter',
        ingredients: [
          { n: 'Spaetzli', q: 150 },
          { n: 'Baby Broccoli', q: 80 },
          { n: 'Almond Sliver', q: 30 }
        ]
      },
      {
        name: 'TOMATO & MAPLE RISOTTO',
        group: 'Italian Cuisine',
        menu: 'Italian',
        subMenu: 'Italian Cuisine',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 26.00,
        potentialFoodCost: 36.00,
        totalNutritionValue: '860 kcal',
        nutritionValuePerBatch: '430 kcal',
        method: 'Cook risotto with tomato and maple, finish with cheese',
        special: 'Top with roasted sugar snap peas',
        ingredients: [
          { n: 'Arborio Rice', q: 60 },
          { n: 'Tomato', q: 50 },
          { n: 'Maple', q: 30 },
          { n: 'Fennel Crush', q: 5 },
          { n: 'Goat Cheese', q: 25 },
          { n: 'Sugar Snap Pea', q: 30 }
        ]
      },
      {
        name: 'EGGPLANT PARMIGIANA',
        group: 'Italian Cuisine',
        menu: 'Italian',
        subMenu: 'Italian Cuisine',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 24.00,
        potentialFoodCost: 42.00,
        totalNutritionValue: '820 kcal',
        nutritionValuePerBatch: '410 kcal',
        method: 'Layer fried eggplant with tomato sauce and cheese',
        special: 'Bake until golden and bubbly',
        ingredients: [
          { n: 'Eggplant', q: 150 },
          { n: 'Thyme-chilli', q: 10 },
          { n: 'Parmesan Crumble', q: 40 }
        ]
      },

      // ==================== DESSERTS (Sales Price: ₹14-22, Food Cost: 30-38%) ====================
      {
        name: 'HOT BHAPA SANDESH',
        group: 'Desserts',
        menu: 'Desserts',
        subMenu: 'Desserts',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 16.00,
        potentialFoodCost: 35.00,
        totalNutritionValue: '620 kcal',
        nutritionValuePerBatch: '310 kcal',
        method: 'Steamed sandesh with jaggery and ginger',
        special: 'Serve warm',
        ingredients: [
          { n: 'Sandesh', q: 120 },
          { n: 'Nolen Gur', q: 40 },
          { n: 'Ginger', q: 10 }
        ]
      },
      {
        name: 'CHANNAR PAYESH',
        group: 'Desserts',
        menu: 'Desserts',
        subMenu: 'Desserts',
        portions: 2,
        batchWeight: '5 kg',
        salesPricePerPortion: 18.00,
        potentialFoodCost: 30.00,
        totalNutritionValue: '660 kcal',
        nutritionValuePerBatch: '330 kcal',
        method: 'Cook chhenna with reduced milk and saffron',
        special: 'Serve chilled with pistachio',
        ingredients: [
          { n: 'Chenna', q: 100 },
          { n: 'Reduced Milk', q: 200 },
          { n: 'Saffron', q: 1 }
        ]
      },
      {
        name: 'MISHTI DOI',
        group: 'Desserts',
        menu: 'Desserts',
        subMenu: 'Desserts',
        portions: 2,
        batchWeight: '5 kg',
        salesPricePerPortion: 15.00,
        potentialFoodCost: 32.00,
        totalNutritionValue: '600 kcal',
        nutritionValuePerBatch: '300 kcal',
        method: 'Sweetened yogurt with caramel',
        special: 'Serve in earthenware pots',
        ingredients: [
          { n: 'Yogurt', q: 150 },
          { n: 'Caramel', q: 30 }
        ]
      },
      {
        name: 'TIRAMISU',
        group: 'Desserts',
        menu: 'Desserts',
        subMenu: 'Desserts',
        portions: 2,
        batchWeight: '2 kg',
        salesPricePerPortion: 20.00,
        potentialFoodCost: 32.00,
        totalNutritionValue: '700 kcal',
        nutritionValuePerBatch: '350 kcal',
        method: 'Classic Italian tiramisu with mascarpone',
        special: 'Dust with cocoa powder',
        ingredients: [
          { n: 'Mascarpone', q: 100 },
          { n: 'Coffee', q: 30 }
        ]
      },
      {
        name: 'CAKE',
        group: 'Desserts',
        menu: 'Desserts',
        subMenu: 'Desserts',
        portions: 2,
        batchWeight: '3 kg',
        salesPricePerPortion: 22.00,
        potentialFoodCost: 38.00,
        totalNutritionValue: '750 kcal',
        nutritionValuePerBatch: '375 kcal',
        method: 'Rich chocolate cake with orange and berries',
        special: 'Serve with berry compote',
        ingredients: [
          { n: 'Callebaut', q: 40 },
          { n: 'Orange', q: 1 },
          { n: 'Berry', q: 25 }
        ]
      },
      {
        name: 'HOT CHOCOLATE',
        group: 'Desserts',
        menu: 'Desserts',
        subMenu: 'Desserts',
        portions: 2,
        batchWeight: '2 L',
        salesPricePerPortion: 14.00,
        potentialFoodCost: 35.00,
        totalNutritionValue: '580 kcal',
        nutritionValuePerBatch: '290 kcal',
        method: 'Melt chocolate with milk and star anise',
        special: 'Top with whipped cream',
        ingredients: [
          { n: 'Callebaut', q: 60 },
          { n: 'Star Anise', q: 5 }
        ]
      },

      // ==================== BEVERAGES (Sales Price: ₹8, Food Cost: 40%) ====================
      {
        name: 'PAAN',
        group: 'Beverages',
        menu: 'Beverages',
        subMenu: 'Beverages',
        portions: 1,
        batchWeight: '1 kg',
        salesPricePerPortion: 8.00,
        potentialFoodCost: 40.00,
        totalNutritionValue: '150 kcal',
        nutritionValuePerBatch: '150 kcal',
        method: 'Traditional betel leaf preparation',
        special: 'Served with sweet fillings',
        ingredients: [
          { n: 'Paan', q: 1 }
        ]
      },

      // ==================== ACCOMPANIMENTS (Sales Price: ₹30, Food Cost: 35%) ====================
      {
        name: 'ACCOMPANIMENTS',
        group: 'Accompaniments',
        menu: 'Accompaniments',
        subMenu: 'Accompaniments',
        portions: 4,
        batchWeight: '5 kg',
        salesPricePerPortion: 30.00,
        potentialFoodCost: 35.00,
        totalNutritionValue: '950 kcal',
        nutritionValuePerBatch: '237.5 kcal',
        method: 'Selection of traditional accompaniments',
        special: 'Served with main courses',
        ingredients: [
          { n: 'Aloor Jhuri Bhaja', q: 50 },
          { n: 'Begun Bhaja', q: 50 },
          { n: 'Poshtor Bora', q: 40 },
          { n: 'Tomato Khejur Chutney', q: 30 },
          { n: 'Raw Papaya Chutney', q: 30 },
          { n: 'Anarosher Chutney', q: 30 },
          { n: 'Papad Bhaja', q: 20 },
          { n: 'Sourdough Bread', q: 2 },
          { n: 'Focaccia', q: 2 },
          { n: 'Balsamic Vinegar', q: 15 },
          { n: 'Extra Virgin Olive Oil', q: 15 }
        ]
      }
    ];

    const mappedRecipes = recipesData.map(r => {
      const rec = {
        name: r.name,
        recipeGroup: r.group,
        menuId: findMenu(r.menu),
        portions: r.portions,
        batchWeight: r.batchWeight || '',
        salesPricePerPortion: r.salesPricePerPortion || 0,
        potentialFoodCost: r.potentialFoodCost || 0,
        totalNutritionValue: r.totalNutritionValue || '',
        nutritionValuePerBatch: r.nutritionValuePerBatch || '',
        methodOfPreparation: r.method,
        specialInstructions: r.special || '',
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
        isActive: true,
        ingredients: []
      };
      if (r.subMenu) rec.subMenuId = findSubMenu(r.subMenu);
      
      rec.ingredients = r.ingredients.map(ing => {
        const dbI = getIng(ing.n);
        const yq = Number((ing.q * (1 - dbI.wastePercent / 100)).toFixed(2));
        const cost = Number((ing.q * dbI.unitPrice).toFixed(2));
        return {
          ingredientId: dbI._id,
          quantity: ing.q,
          unit: dbI.quantityUnit,
          unitPrice: dbI.unitPrice,
          wastePercent: dbI.wastePercent,
          yieldQuantity: yq,
          ingredientCost: cost,
          nutritionValue: dbI.nutritionValue || ''
        };
      });
      return rec;
    });

    await Recipe.insertMany(mappedRecipes);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`  - ${menus.length} Menus`);
    console.log(`  - ${subMenus.length} Sub-Menus`);
    console.log(`  - ${dbIngredients.length} Ingredients`);
    console.log(`  - ${mappedRecipes.length} Recipes`);
    console.log('💰 All prices updated to real market rates (₹)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();