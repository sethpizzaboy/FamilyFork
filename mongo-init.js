// MongoDB initialization script for Family Fork
db = db.getSiblingDB('familyfork');

// Create collections
db.createCollection('families');
db.createCollection('recipes');
db.createCollection('meal_plans');
db.createCollection('grocery_lists');
db.createCollection('inventory');

// Create indexes for better performance
db.families.createIndex({ "name": 1 });
db.families.createIndex({ "created_at": 1 });

db.recipes.createIndex({ "name": 1 });
db.recipes.createIndex({ "dietary_tags": 1 });
db.recipes.createIndex({ "created_at": 1 });

db.meal_plans.createIndex({ "family_id": 1 });
db.meal_plans.createIndex({ "week_start": 1 });

db.grocery_lists.createIndex({ "family_id": 1 });
db.grocery_lists.createIndex({ "created_at": 1 });

db.inventory.createIndex({ "family_id": 1 });
db.inventory.createIndex({ "expiration_date": 1 });

print('Family Fork database initialized successfully!');

