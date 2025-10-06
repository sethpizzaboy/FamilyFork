from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, date
from enum import Enum
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import hashlib
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "lightspeedup.smtp@gmail.com"
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')  # Set this in environment variables
ADMIN_EMAIL = "sethpizzaboy@gmail.com"
FRIEND_EMAIL = "ddeturk@gmail.com"

# Admin authentication
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '')  # Set this in environment variables
if not ADMIN_TOKEN:
    ADMIN_TOKEN = secrets.token_urlsafe(32)
    logging.warning(f"ADMIN_TOKEN not set, generated: {ADMIN_TOKEN}")

# Email service
async def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
    """Send email notification"""
    try:
        if not SMTP_PASSWORD:
            logging.warning("SMTP_PASSWORD not set, skipping email")
            return False
        
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject
        
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        logging.info(f"Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        logging.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

# Admin authentication
def verify_admin_token(token: str) -> bool:
    """Verify admin token"""
    return token == ADMIN_TOKEN

def get_admin_auth():
    """Dependency for admin authentication"""
    def admin_auth(token: str = Depends(lambda: None)):
        if not token or not verify_admin_token(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token"
            )
        return True
    return admin_auth

# Create the main app without a prefix
app = FastAPI(title="Family Meal Prep Tool", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums for dietary restrictions
class DietaryRestriction(str, Enum):
    GLUTEN_FREE = "gluten_free"
    DAIRY_FREE = "dairy_free"
    NO_ADDED_SUGAR = "no_added_sugar"
    PESCATARIAN = "pescatarian"
    CARNIVORE = "carnivore"
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    NUT_FREE = "nut_free"
    SOY_FREE = "soy_free"
    EGG_FREE = "egg_free"

class FilterMode(str, Enum):
    STRICT = "strict"
    FLEXIBLE = "flexible"

class MealType(str, Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

class DayOfWeek(str, Enum):
    SUNDAY = "sunday"
    MONDAY = "monday" 
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"

# Bug Tracking Enums
class BugStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REOPENED = "reopened"

class BugPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class BugType(str, Enum):
    BUG = "bug"
    FEATURE_REQUEST = "feature_request"
    IMPROVEMENT = "improvement"
    QUESTION = "question"

# Models
class FamilyMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    dietary_restrictions: List[DietaryRestriction] = []
    favorite_ingredients: List[str] = []
    allergies: List[str] = []
    dislikes: List[str] = []
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FamilyMemberCreate(BaseModel):
    name: str
    dietary_restrictions: List[DietaryRestriction] = []
    favorite_ingredients: List[str] = []
    allergies: List[str] = []
    dislikes: List[str] = []
    notes: str = ""

class Ingredient(BaseModel):
    name: str
    quantity: str
    unit: str
    store_section: str = "general"

class Recipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    dietary_restrictions_compliant: List[DietaryRestriction] = []
    ingredients: List[Ingredient] = []
    instructions: List[str] = []
    prep_time_minutes: int = 0
    cook_time_minutes: int = 0
    servings: int = 4
    meal_types: List[MealType] = []
    tags: List[str] = []
    is_favorite: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class RecipeCreate(BaseModel):
    name: str
    description: str = ""
    dietary_restrictions_compliant: List[DietaryRestriction] = []
    ingredients: List[Ingredient] = []
    instructions: List[str] = []
    prep_time_minutes: int = 0
    cook_time_minutes: int = 0
    servings: int = 4
    meal_types: List[MealType] = []
    tags: List[str] = []

class MealPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    week_start_date: date
    family_member_id: str
    day_of_week: DayOfWeek
    meal_type: MealType
    recipe_id: str
    servings: int = 1
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MealPlanCreate(BaseModel):
    week_start_date: date
    family_member_id: str
    day_of_week: DayOfWeek
    meal_type: MealType
    recipe_id: str
    servings: int = 1
    notes: str = ""

class GroceryListItem(BaseModel):
    ingredient_name: str
    total_quantity: str
    unit: str
    store_section: str
    from_recipes: List[str] = []

class GroceryList(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    week_start_date: date
    items: List[GroceryListItem] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InventoryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    quantity: float
    unit: str
    category: str = "general"  # produce, meat, dairy, pantry, etc.
    barcode: Optional[str] = None
    brand: Optional[str] = None
    expiration_date: Optional[date] = None
    purchase_date: Optional[date] = None
    location: str = "pantry"  # pantry, fridge, freezer
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InventoryItemCreate(BaseModel):
    name: str
    quantity: float
    unit: str
    category: str = "general"
    barcode: Optional[str] = None
    brand: Optional[str] = None
    expiration_date: Optional[date] = None
    purchase_date: Optional[date] = None
    location: str = "pantry"
    notes: str = ""

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    barcode: Optional[str] = None
    brand: Optional[str] = None
    expiration_date: Optional[date] = None
    purchase_date: Optional[date] = None
    location: Optional[str] = None
    notes: Optional[str] = None

# Bug Tracking Models
class BugReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    bug_type: BugType
    priority: BugPriority = BugPriority.MEDIUM
    status: BugStatus = BugStatus.OPEN
    reporter_email: str
    reporter_name: str = ""
    assigned_to: Optional[str] = None
    tags: List[str] = []
    attachments: List[str] = []
    steps_to_reproduce: Optional[str] = None
    expected_behavior: Optional[str] = None
    actual_behavior: Optional[str] = None
    environment: Optional[str] = None
    browser_info: Optional[str] = None
    device_info: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None

class BugComment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bug_id: str
    author_email: str
    author_name: str = ""
    comment: str
    is_internal: bool = False  # Internal comments only visible to admin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BugReportCreate(BaseModel):
    title: str
    description: str
    bug_type: BugType
    priority: BugPriority = BugPriority.MEDIUM
    reporter_email: str
    reporter_name: str = ""
    tags: List[str] = []
    steps_to_reproduce: Optional[str] = None
    expected_behavior: Optional[str] = None
    actual_behavior: Optional[str] = None
    environment: Optional[str] = None
    browser_info: Optional[str] = None
    device_info: Optional[str] = None

class BugCommentCreate(BaseModel):
    bug_id: str
    author_email: str
    author_name: str = ""
    comment: str
    is_internal: bool = False

class BugUpdate(BaseModel):
    status: Optional[BugStatus] = None
    priority: Optional[BugPriority] = None
    assigned_to: Optional[str] = None
    tags: Optional[List[str]] = None
    internal_notes: Optional[str] = None

class BarcodeProductInfo(BaseModel):
    name: str
    brand: Optional[str] = None
    category: str = "general"
    unit: str = "each"

# Helper functions
def prepare_for_mongo(data: dict) -> dict:
    """Convert Python objects to MongoDB-compatible format"""
    if isinstance(data.get('created_at'), datetime):
        data['created_at'] = data['created_at'].isoformat()
    if isinstance(data.get('week_start_date'), date):
        data['week_start_date'] = data['week_start_date'].isoformat()
    return data

def parse_from_mongo(item: dict) -> dict:
    """Parse MongoDB data back to Python objects"""
    if isinstance(item.get('created_at'), str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    if isinstance(item.get('week_start_date'), str):
        item['week_start_date'] = datetime.fromisoformat(item['week_start_date']).date()
    return item

# Initialize AI chat helper
async def get_ai_recommendations(prompt: str) -> str:
    """Get AI recommendations using emergent LLM"""
    try:
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"meal-prep-{uuid.uuid4()}",
            system_message="You are a helpful nutritionist and meal planning assistant specializing in dietary restrictions including Brain Balance diet, pescatarian, carnivore, and various food allergies. Provide practical, family-friendly meal suggestions and grocery optimization advice."
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logging.error(f"AI recommendation error: {e}")
        return "Unable to generate AI recommendations at this time."

# Family Members endpoints
@api_router.post("/family-members", response_model=FamilyMember)
async def create_family_member(member: FamilyMemberCreate):
    member_dict = member.dict()
    member_obj = FamilyMember(**member_dict)
    member_data = prepare_for_mongo(member_obj.dict())
    await db.family_members.insert_one(member_data)
    return member_obj

@api_router.get("/family-members", response_model=List[FamilyMember])
async def get_family_members():
    members = await db.family_members.find().to_list(1000)
    return [FamilyMember(**parse_from_mongo(member)) for member in members]

@api_router.get("/family-members/{member_id}", response_model=FamilyMember)
async def get_family_member(member_id: str):
    member = await db.family_members.find_one({"id": member_id})
    if not member:
        raise HTTPException(status_code=404, detail="Family member not found")
    return FamilyMember(**parse_from_mongo(member))

@api_router.put("/family-members/{member_id}", response_model=FamilyMember)
async def update_family_member(member_id: str, member_update: FamilyMemberCreate):
    update_data = member_update.dict()
    await db.family_members.update_one({"id": member_id}, {"$set": update_data})
    updated_member = await db.family_members.find_one({"id": member_id})
    if not updated_member:
        raise HTTPException(status_code=404, detail="Family member not found")
    return FamilyMember(**parse_from_mongo(updated_member))

@api_router.delete("/family-members/{member_id}")
async def delete_family_member(member_id: str):
    result = await db.family_members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Family member not found")
    return {"message": "Family member deleted successfully"}

# Recipe endpoints
@api_router.post("/recipes", response_model=Recipe)
async def create_recipe(recipe: RecipeCreate):
    recipe_dict = recipe.dict()
    recipe_obj = Recipe(**recipe_dict)
    recipe_data = prepare_for_mongo(recipe_obj.dict())
    await db.recipes.insert_one(recipe_data)
    return recipe_obj

@api_router.get("/recipes", response_model=List[Recipe])
async def get_recipes(
    dietary_restrictions: Optional[List[DietaryRestriction]] = None,
    filter_mode: FilterMode = FilterMode.FLEXIBLE,
    meal_type: Optional[MealType] = None,
    search: Optional[str] = None
):
    query = {}
    
    # Apply dietary restriction filters
    if dietary_restrictions:
        if filter_mode == FilterMode.STRICT:
            # Recipe must comply with ALL dietary restrictions
            query["dietary_restrictions_compliant"] = {"$all": dietary_restrictions}
        else:
            # Recipe must comply with AT LEAST ONE dietary restriction
            query["dietary_restrictions_compliant"] = {"$in": dietary_restrictions}
    
    # Apply meal type filter
    if meal_type:
        query["meal_types"] = meal_type
    
    # Apply search filter
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    recipes = await db.recipes.find(query).to_list(1000)
    return [Recipe(**parse_from_mongo(recipe)) for recipe in recipes]

@api_router.get("/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str):
    recipe = await db.recipes.find_one({"id": recipe_id})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return Recipe(**parse_from_mongo(recipe))

@api_router.put("/recipes/{recipe_id}", response_model=Recipe)
async def update_recipe(recipe_id: str, recipe_update: RecipeCreate):
    update_data = recipe_update.dict()
    await db.recipes.update_one({"id": recipe_id}, {"$set": update_data})
    updated_recipe = await db.recipes.find_one({"id": recipe_id})
    if not updated_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return Recipe(**parse_from_mongo(updated_recipe))

@api_router.delete("/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str):
    result = await db.recipes.delete_one({"id": recipe_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"message": "Recipe deleted successfully"}

# Meal Plan endpoints
@api_router.post("/meal-plans", response_model=MealPlan)
async def create_meal_plan(meal_plan: MealPlanCreate):
    meal_plan_dict = meal_plan.dict()
    meal_plan_obj = MealPlan(**meal_plan_dict)
    meal_plan_data = prepare_for_mongo(meal_plan_obj.dict())
    await db.meal_plans.insert_one(meal_plan_data)
    return meal_plan_obj

@api_router.get("/meal-plans", response_model=List[MealPlan])
async def get_meal_plans(
    week_start_date: Optional[str] = None,
    family_member_id: Optional[str] = None
):
    query = {}
    if week_start_date:
        query["week_start_date"] = week_start_date
    if family_member_id:
        query["family_member_id"] = family_member_id
    
    meal_plans = await db.meal_plans.find(query).to_list(1000)
    return [MealPlan(**parse_from_mongo(plan)) for plan in meal_plans]

@api_router.delete("/meal-plans/{meal_plan_id}")
async def delete_meal_plan(meal_plan_id: str):
    result = await db.meal_plans.delete_one({"id": meal_plan_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return {"message": "Meal plan deleted successfully"}

# Grocery List endpoints
@api_router.post("/grocery-list/{week_start_date}")
async def generate_grocery_list(week_start_date: str):
    """Generate grocery list from meal plans for a specific week"""
    try:
        # Get all meal plans for the week
        meal_plans = await db.meal_plans.find({"week_start_date": week_start_date}).to_list(1000)
        
        if not meal_plans:
            return GroceryList(week_start_date=datetime.fromisoformat(week_start_date).date())
        
        # Collect all recipe IDs
        recipe_ids = [plan["recipe_id"] for plan in meal_plans]
        
        # Get all recipes
        recipes = await db.recipes.find({"id": {"$in": recipe_ids}}).to_list(1000)
        
        # Aggregate ingredients
        ingredient_totals = {}
        
        for plan in meal_plans:
            recipe = next((r for r in recipes if r["id"] == plan["recipe_id"]), None)
            if recipe:
                servings_multiplier = plan.get("servings", 1) / recipe.get("servings", 4)
                
                for ingredient in recipe.get("ingredients", []):
                    key = f"{ingredient['name']}_{ingredient['unit']}"
                    
                    if key not in ingredient_totals:
                        ingredient_totals[key] = {
                            "ingredient_name": ingredient["name"],
                            "total_quantity": 0,
                            "unit": ingredient["unit"],
                            "store_section": ingredient.get("store_section", "general"),
                            "from_recipes": []
                        }
                    
                    try:
                        quantity = float(ingredient["quantity"]) * servings_multiplier
                        ingredient_totals[key]["total_quantity"] += quantity
                    except ValueError:
                        # Handle non-numeric quantities like "1 cup"
                        ingredient_totals[key]["total_quantity"] = f"See recipes: {', '.join(ingredient_totals[key]['from_recipes'])}"
                    
                    if recipe["name"] not in ingredient_totals[key]["from_recipes"]:
                        ingredient_totals[key]["from_recipes"].append(recipe["name"])
        
        # Convert to grocery list items
        grocery_items = []
        for item in ingredient_totals.values():
            grocery_items.append(GroceryListItem(
                ingredient_name=item["ingredient_name"],
                total_quantity=str(item["total_quantity"]),
                unit=item["unit"],
                store_section=item["store_section"],
                from_recipes=item["from_recipes"]
            ))
        
        # Sort by store section
        grocery_items.sort(key=lambda x: x.store_section)
        
        grocery_list = GroceryList(
            week_start_date=datetime.fromisoformat(week_start_date).date(),
            items=grocery_items
        )
        
        # Save grocery list
        grocery_data = prepare_for_mongo(grocery_list.dict())
        await db.grocery_lists.insert_one(grocery_data)
        
        return grocery_list
        
    except Exception as e:
        logging.error(f"Error generating grocery list: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate grocery list")

@api_router.get("/grocery-lists/{week_start_date}", response_model=GroceryList)
async def get_grocery_list(week_start_date: str):
    grocery_list = await db.grocery_lists.find_one({"week_start_date": week_start_date})
    if not grocery_list:
        raise HTTPException(status_code=404, detail="Grocery list not found")
    return GroceryList(**parse_from_mongo(grocery_list))

# AI Recommendations endpoints
@api_router.post("/ai/recipe-recommendations")
async def get_recipe_recommendations(
    family_member_ids: List[str],
    meal_type: MealType,
    filter_mode: FilterMode = FilterMode.FLEXIBLE
):
    """Get AI-powered recipe recommendations for family members"""
    try:
        # Get family members
        members = await db.family_members.find({"id": {"$in": family_member_ids}}).to_list(1000)
        
        # Build prompt
        member_info = []
        for member in members:
            restrictions = ", ".join(member.get("dietary_restrictions", []))
            allergies = ", ".join(member.get("allergies", []))
            favorites = ", ".join(member.get("favorite_ingredients", []))
            member_info.append(f"- {member['name']}: Dietary restrictions: {restrictions}, Allergies: {allergies}, Favorites: {favorites}")
        
        prompt = f"""
        Please recommend {meal_type} recipes for a family with these members:
        {chr(10).join(member_info)}
        
        Filter mode: {filter_mode}
        
        Please provide 3-5 specific recipe suggestions that work for this family, considering their dietary restrictions and preferences. Include recipe names, brief descriptions, and why they work for this family.
        """
        
        recommendations = await get_ai_recommendations(prompt)
        return {"recommendations": recommendations}
        
    except Exception as e:
        logging.error(f"Error getting recipe recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to get recipe recommendations")

@api_router.post("/ai/grocery-optimization")
async def optimize_grocery_list(week_start_date: str):
    """Get AI suggestions for grocery list optimization"""
    try:
        # Get grocery list
        grocery_list = await db.grocery_lists.find_one({"week_start_date": week_start_date})
        
        if not grocery_list:
            raise HTTPException(status_code=404, detail="Grocery list not found for this week")
        
        # Build prompt
        items_text = []
        for item in grocery_list.get("items", []):
            items_text.append(f"- {item['ingredient_name']}: {item['total_quantity']} {item['unit']} (from: {', '.join(item['from_recipes'])})")
        
        prompt = f"""
        Here's a grocery list for the week:
        {chr(10).join(items_text)}
        
        Please provide optimization suggestions including:
        1. Ingredient substitutions to save money or improve nutrition
        2. Bulk buying recommendations
        3. Seasonal alternatives
        4. Store organization tips
        5. Items that could be prepared at home instead of bought pre-made
        
        Keep suggestions practical for a busy family.
        """
        
        optimization = await get_ai_recommendations(prompt)
        return {"optimization_suggestions": optimization}
        
    except Exception as e:
        logging.error(f"Error optimizing grocery list: {e}")
        raise HTTPException(status_code=500, detail="Failed to optimize grocery list")

# Inventory Management endpoints
@api_router.post("/inventory", response_model=InventoryItem)
async def create_inventory_item(item: InventoryItemCreate):
    item_dict = item.dict()
    item_obj = InventoryItem(**item_dict)
    item_data = prepare_for_mongo(item_obj.dict())
    await db.inventory.insert_one(item_data)
    return item_obj

@api_router.get("/inventory", response_model=List[InventoryItem])
async def get_inventory(
    category: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    expiring_soon: Optional[bool] = None
):
    query = {}
    
    # Filter by category
    if category:
        query["category"] = category
    
    # Filter by location
    if location:
        query["location"] = location
    
    # Search filter
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"notes": {"$regex": search, "$options": "i"}}
        ]
    
    # Filter items expiring soon (within 7 days)
    if expiring_soon:
        from datetime import timedelta
        week_from_now = (datetime.now(timezone.utc).date() + timedelta(days=7)).isoformat()
        query["expiration_date"] = {"$lte": week_from_now}
    
    items = await db.inventory.find(query).to_list(1000)
    return [InventoryItem(**parse_from_mongo(item)) for item in items]

@api_router.get("/inventory/{item_id}", response_model=InventoryItem)
async def get_inventory_item(item_id: str):
    item = await db.inventory.find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return InventoryItem(**parse_from_mongo(item))

@api_router.put("/inventory/{item_id}", response_model=InventoryItem)
async def update_inventory_item(item_id: str, item_update: InventoryItemUpdate):
    update_data = {k: v for k, v in item_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    update_data = prepare_for_mongo(update_data)
    await db.inventory.update_one({"id": item_id}, {"$set": update_data})
    
    updated_item = await db.inventory.find_one({"id": item_id})
    if not updated_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return InventoryItem(**parse_from_mongo(updated_item))

@api_router.delete("/inventory/{item_id}")
async def delete_inventory_item(item_id: str):
    result = await db.inventory.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {"message": "Inventory item deleted successfully"}

@api_router.post("/inventory/barcode/{barcode}")
async def lookup_barcode(barcode: str):
    """
    Lookup product information by barcode.
    In a real implementation, this would integrate with APIs like:
    - OpenFoodFacts API
    - UPC Database API
    - Edamam Food Database API
    
    For this MVP, we'll return mock data and let users manually enter details.
    """
    try:
        # Check if we already have this barcode in our database
        existing_item = await db.inventory.find_one({"barcode": barcode})
        if existing_item:
            return BarcodeProductInfo(
                name=existing_item["name"],
                brand=existing_item.get("brand"),
                category=existing_item.get("category", "general"),
                unit=existing_item.get("unit", "each")
            )
        
        # Mock response for demonstration
        # In production, integrate with food database APIs
        mock_products = {
            "012345678901": BarcodeProductInfo(
                name="Organic Quinoa",
                brand="Whole Foods",
                category="pantry",
                unit="lb"
            ),
            "123456789012": BarcodeProductInfo(
                name="Atlantic Salmon Fillet",
                brand="Fresh Market",
                category="fish",
                unit="lb"
            ),
            "234567890123": BarcodeProductInfo(
                name="Organic Broccoli",
                brand="Earthbound Farm",
                category="produce",
                unit="lb"
            )
        }
        
        if barcode in mock_products:
            return mock_products[barcode]
        else:
            # Return generic response for unknown barcodes
            return BarcodeProductInfo(
                name=f"Unknown Product (Barcode: {barcode})",
                brand="Unknown",
                category="general",
                unit="each"
            )
            
    except Exception as e:
        logging.error(f"Error looking up barcode {barcode}: {e}")
        raise HTTPException(status_code=500, detail="Failed to lookup barcode")

@api_router.post("/inventory/check-availability")
async def check_ingredient_availability(ingredient_names: List[str]):
    """
    Check which ingredients from a list are available in inventory
    """
    try:
        available_items = {}
        
        for ingredient_name in ingredient_names:
            # Search for similar items in inventory
            items = await db.inventory.find({
                "name": {"$regex": ingredient_name, "$options": "i"},
                "quantity": {"$gt": 0}
            }).to_list(100)
            
            if items:
                total_quantity = sum(item.get("quantity", 0) for item in items)
                available_items[ingredient_name] = {
                    "available": True,
                    "total_quantity": total_quantity,
                    "items": [InventoryItem(**parse_from_mongo(item)) for item in items]
                }
            else:
                available_items[ingredient_name] = {
                    "available": False,
                    "total_quantity": 0,
                    "items": []
                }
        
        return available_items
        
    except Exception as e:
        logging.error(f"Error checking ingredient availability: {e}")
        raise HTTPException(status_code=500, detail="Failed to check ingredient availability")

# Seed data endpoint for pre-populated recipes
@api_router.post("/seed-recipes")
async def seed_brain_balance_recipes():
    """Seed the database with brain balance and family-friendly recipes"""
    
    sample_recipes = [
        {
            "name": "Grilled Salmon with Roasted Vegetables",
            "description": "Brain Balance compliant pescatarian dish with omega-3 rich salmon and colorful vegetables",
            "dietary_restrictions_compliant": [DietaryRestriction.GLUTEN_FREE, DietaryRestriction.DAIRY_FREE, DietaryRestriction.NO_ADDED_SUGAR, DietaryRestriction.PESCATARIAN],
            "ingredients": [
                {"name": "Salmon fillet", "quantity": "4", "unit": "pieces", "store_section": "fish"},
                {"name": "Broccoli", "quantity": "2", "unit": "cups", "store_section": "produce"},
                {"name": "Bell peppers", "quantity": "2", "unit": "pieces", "store_section": "produce"},
                {"name": "Sweet potato", "quantity": "2", "unit": "medium", "store_section": "produce"},
                {"name": "Olive oil", "quantity": "3", "unit": "tbsp", "store_section": "pantry"},
                {"name": "Lemon", "quantity": "1", "unit": "piece", "store_section": "produce"},
                {"name": "Garlic", "quantity": "3", "unit": "cloves", "store_section": "produce"}
            ],
            "instructions": [
                "Preheat oven to 425°F",
                "Cut vegetables into chunks and toss with olive oil, salt, and pepper", 
                "Roast vegetables for 20 minutes",
                "Season salmon with lemon, garlic, salt, and pepper",
                "Grill salmon for 4-6 minutes per side",
                "Serve salmon over roasted vegetables"
            ],
            "prep_time_minutes": 15,
            "cook_time_minutes": 25,
            "servings": 4,
            "meal_types": [MealType.DINNER],
            "tags": ["brain-balance", "omega-3", "anti-inflammatory"]
        },
        {
            "name": "Grass-Fed Beef Stir Fry",
            "description": "Carnivore-friendly stir fry with grass-fed beef and minimal vegetables",
            "dietary_restrictions_compliant": [DietaryRestriction.GLUTEN_FREE, DietaryRestriction.DAIRY_FREE, DietaryRestriction.NO_ADDED_SUGAR],
            "ingredients": [
                {"name": "Grass-fed beef strips", "quantity": "1", "unit": "lb", "store_section": "meat"},
                {"name": "Zucchini", "quantity": "2", "unit": "medium", "store_section": "produce"},
                {"name": "Bell pepper", "quantity": "1", "unit": "piece", "store_section": "produce"},
                {"name": "Coconut oil", "quantity": "2", "unit": "tbsp", "store_section": "pantry"},
                {"name": "Coconut aminos", "quantity": "3", "unit": "tbsp", "store_section": "pantry"},
                {"name": "Ginger", "quantity": "1", "unit": "tbsp", "store_section": "produce"},
                {"name": "Garlic", "quantity": "2", "unit": "cloves", "store_section": "produce"}
            ],
            "instructions": [
                "Heat coconut oil in large pan over high heat",
                "Add beef strips and cook until browned",
                "Add vegetables and stir fry for 3-4 minutes", 
                "Add garlic, ginger, and coconut aminos",
                "Cook for another 2 minutes until vegetables are tender-crisp",
                "Serve immediately"
            ],
            "prep_time_minutes": 10,
            "cook_time_minutes": 15,
            "servings": 4,
            "meal_types": [MealType.DINNER],
            "tags": ["carnivore-friendly", "quick", "high-protein"]
        },
        {
            "name": "Brain Balance Smoothie Bowl",
            "description": "Nutritious breakfast bowl compliant with Brain Balance diet",
            "dietary_restrictions_compliant": [DietaryRestriction.GLUTEN_FREE, DietaryRestriction.DAIRY_FREE, DietaryRestriction.NO_ADDED_SUGAR],
            "ingredients": [
                {"name": "Frozen berries", "quantity": "1", "unit": "cup", "store_section": "frozen"},
                {"name": "Banana", "quantity": "1", "unit": "piece", "store_section": "produce"},
                {"name": "Coconut milk", "quantity": "0.5", "unit": "cup", "store_section": "pantry"},
                {"name": "Chia seeds", "quantity": "2", "unit": "tbsp", "store_section": "pantry"},
                {"name": "Unsweetened coconut flakes", "quantity": "2", "unit": "tbsp", "store_section": "pantry"},
                {"name": "Pumpkin seeds", "quantity": "1", "unit": "tbsp", "store_section": "pantry"}
            ],
            "instructions": [
                "Blend frozen berries, half the banana, and coconut milk until smooth",
                "Pour into bowl",
                "Slice remaining banana and arrange on top",
                "Sprinkle with chia seeds, coconut flakes, and pumpkin seeds",
                "Serve immediately"
            ],
            "prep_time_minutes": 5,
            "cook_time_minutes": 0,
            "servings": 1,
            "meal_types": [MealType.BREAKFAST],
            "tags": ["brain-balance", "antioxidants", "quick"]
        }
    ]
    
    # Clear existing recipes and add new ones
    await db.recipes.delete_many({})
    
    for recipe_data in sample_recipes:
        recipe_obj = Recipe(**recipe_data)
        recipe_dict = prepare_for_mongo(recipe_obj.dict())
        await db.recipes.insert_one(recipe_dict)
    
    return {"message": f"Seeded {len(sample_recipes)} brain balance recipes successfully"}

# === RECIPE DATABASE INITIALIZATION ===
async def initialize_recipe_database():
    """Initialize the database with pre-built recipes for quick, healthy meals"""
    try:
        if db is None:
            return

        # Check if recipes already exist
        existing_recipes = await db.recipes.count_documents({})
        if existing_recipes > 0:
            return  # Recipes already initialized

        # Quick, healthy recipes for specific dietary needs
        recipes = [
            # PESCATARIAN + NO SUGAR + NO DAIRY + NO GLUTEN (20 minutes)
            {
                "name": "Lemon Herb Salmon with Roasted Vegetables",
                "description": "Quick, healthy salmon with seasonal vegetables - perfect for pescatarian diet",
                "dietary_restrictions_compliant": ["pescatarian", "dairy_free", "no_added_sugar", "gluten_free"],
                "ingredients": [
                    {"name": "Salmon fillets", "quantity": "4", "unit": "pieces", "store_section": "meat"},
                    {"name": "Zucchini", "quantity": "2", "unit": "medium", "store_section": "produce"},
                    {"name": "Bell peppers", "quantity": "2", "unit": "pieces", "store_section": "produce"},
                    {"name": "Olive oil", "quantity": "3", "unit": "tbsp", "store_section": "pantry"},
                    {"name": "Lemon", "quantity": "1", "unit": "piece", "store_section": "produce"},
                    {"name": "Fresh herbs", "quantity": "2", "unit": "tbsp", "store_section": "produce"},
                    {"name": "Salt", "quantity": "1", "unit": "tsp", "store_section": "pantry"},
                    {"name": "Black pepper", "quantity": "1", "unit": "tsp", "store_section": "pantry"}
                ],
                "instructions": [
                    "Preheat oven to 425°F (220°C)",
                    "Cut vegetables into 1-inch pieces",
                    "Toss vegetables with 2 tbsp olive oil, salt, and pepper",
                    "Place vegetables on baking sheet, roast for 15 minutes",
                    "Season salmon with salt, pepper, and herbs",
                    "Add salmon to baking sheet, roast for 8-10 minutes",
                    "Serve with lemon wedges"
                ],
                "prep_time_minutes": 10,
                "cook_time_minutes": 15,
                "servings": 4,
                "meal_types": ["dinner"],
                "tags": ["quick", "healthy", "pescatarian", "one-pan"]
            },
            
            # CARNIVORE (20 minutes)
            {
                "name": "Beef Stir-Fry with Vegetables",
                "description": "Quick beef stir-fry - perfect for carnivore diet",
                "dietary_restrictions_compliant": ["carnivore"],
                "ingredients": [
                    {"name": "Beef strips", "quantity": "1", "unit": "lb", "store_section": "meat"},
                    {"name": "Broccoli", "quantity": "1", "unit": "head", "store_section": "produce"},
                    {"name": "Carrots", "quantity": "2", "unit": "medium", "store_section": "produce"},
                    {"name": "Coconut oil", "quantity": "2", "unit": "tbsp", "store_section": "pantry"},
                    {"name": "Garlic", "quantity": "3", "unit": "cloves", "store_section": "produce"},
                    {"name": "Ginger", "quantity": "1", "unit": "tbsp", "store_section": "produce"},
                    {"name": "Salt", "quantity": "1", "unit": "tsp", "store_section": "pantry"}
                ],
                "instructions": [
                    "Cut beef into thin strips",
                    "Cut vegetables into bite-sized pieces",
                    "Heat oil in large pan over high heat",
                    "Add beef, cook for 3-4 minutes until browned",
                    "Add vegetables, cook for 5-6 minutes",
                    "Add garlic and ginger, cook for 1 minute",
                    "Season with salt, serve immediately"
                ],
                "prep_time_minutes": 10,
                "cook_time_minutes": 10,
                "servings": 4,
                "meal_types": ["dinner"],
                "tags": ["quick", "carnivore", "one-pan"]
            },
            
            # BRAIN BALANCE (NO DAIRY + NO SUGAR + NO GLUTEN) (20 minutes)
            {
                "name": "Turkey and Vegetable Skillet",
                "description": "Quick, brain-healthy meal with turkey and vegetables",
                "dietary_restrictions_compliant": ["dairy_free", "no_added_sugar", "gluten_free"],
                "ingredients": [
                    {"name": "Ground turkey", "quantity": "1", "unit": "lb", "store_section": "meat"},
                    {"name": "Sweet potatoes", "quantity": "2", "unit": "medium", "store_section": "produce"},
                    {"name": "Spinach", "quantity": "2", "unit": "cups", "store_section": "produce"},
                    {"name": "Avocado", "quantity": "1", "unit": "piece", "store_section": "produce"},
                    {"name": "Coconut oil", "quantity": "2", "unit": "tbsp", "store_section": "pantry"},
                    {"name": "Turmeric", "quantity": "1", "unit": "tsp", "store_section": "pantry"},
                    {"name": "Salt", "quantity": "1", "unit": "tsp", "store_section": "pantry"}
                ],
                "instructions": [
                    "Dice sweet potatoes into small cubes",
                    "Heat oil in large skillet",
                    "Add sweet potatoes, cook for 8 minutes",
                    "Add ground turkey, cook for 5 minutes",
                    "Add spinach, cook for 2 minutes",
                    "Season with turmeric and salt",
                    "Top with sliced avocado"
                ],
                "prep_time_minutes": 10,
                "cook_time_minutes": 15,
                "servings": 4,
                "meal_types": ["dinner"],
                "tags": ["quick", "brain-healthy", "one-pan"]
            },
            
            # MEAL PREP RECIPES (1 hour for multiple meals)
            {
                "name": "Sunday Meal Prep - Protein Bowls",
                "description": "Batch cook proteins and vegetables for the week",
                "dietary_restrictions_compliant": ["pescatarian", "carnivore", "dairy_free", "no_added_sugar", "gluten_free"],
                "ingredients": [
                    {"name": "Chicken breast", "quantity": "2", "unit": "lbs", "store_section": "meat"},
                    {"name": "Salmon fillets", "quantity": "1", "unit": "lb", "store_section": "meat"},
                    {"name": "Ground turkey", "quantity": "1", "unit": "lb", "store_section": "meat"},
                    {"name": "Broccoli", "quantity": "2", "unit": "heads", "store_section": "produce"},
                    {"name": "Sweet potatoes", "quantity": "4", "unit": "large", "store_section": "produce"},
                    {"name": "Cauliflower", "quantity": "1", "unit": "head", "store_section": "produce"},
                    {"name": "Olive oil", "quantity": "1/4", "unit": "cup", "store_section": "pantry"},
                    {"name": "Salt", "quantity": "2", "unit": "tsp", "store_section": "pantry"},
                    {"name": "Black pepper", "quantity": "1", "unit": "tsp", "store_section": "pantry"}
                ],
                "instructions": [
                    "Preheat oven to 400°F (200°C)",
                    "Cut all vegetables into bite-sized pieces",
                    "Season proteins with salt and pepper",
                    "Roast vegetables for 25-30 minutes",
                    "Cook proteins separately (bake, grill, or pan-fry)",
                    "Let cool, portion into containers",
                    "Store in refrigerator for up to 5 days"
                ],
                "prep_time_minutes": 30,
                "cook_time_minutes": 30,
                "servings": 12,
                "meal_types": ["lunch", "dinner"],
                "tags": ["meal-prep", "batch-cooking", "weekly-prep"]
            },
            
            # QUICK BREAKFAST (10 minutes)
            {
                "name": "Protein Smoothie Bowl",
                "description": "Quick, nutritious breakfast for all diets",
                "dietary_restrictions_compliant": ["pescatarian", "dairy_free", "no_added_sugar", "gluten_free"],
                "ingredients": [
                    {"name": "Frozen berries", "quantity": "1", "unit": "cup", "store_section": "frozen"},
                    {"name": "Banana", "quantity": "1", "unit": "medium", "store_section": "produce"},
                    {"name": "Coconut milk", "quantity": "1", "unit": "cup", "store_section": "pantry"},
                    {"name": "Protein powder", "quantity": "1", "unit": "scoop", "store_section": "pantry"},
                    {"name": "Chia seeds", "quantity": "1", "unit": "tbsp", "store_section": "pantry"},
                    {"name": "Almond butter", "quantity": "1", "unit": "tbsp", "store_section": "pantry"}
                ],
                "instructions": [
                    "Blend frozen berries, banana, and coconut milk",
                    "Add protein powder, blend until smooth",
                    "Pour into bowl",
                    "Top with chia seeds and almond butter",
                    "Serve immediately"
                ],
                "prep_time_minutes": 5,
                "cook_time_minutes": 0,
                "servings": 1,
                "meal_types": ["breakfast"],
                "tags": ["quick", "healthy", "smoothie"]
            },
            
            # QUICK LUNCH (15 minutes)
            {
                "name": "Mediterranean Salad Bowl",
                "description": "Quick, healthy lunch with Mediterranean flavors",
                "dietary_restrictions_compliant": ["pescatarian", "dairy_free", "no_added_sugar", "gluten_free"],
                "ingredients": [
                    {"name": "Mixed greens", "quantity": "4", "unit": "cups", "store_section": "produce"},
                    {"name": "Canned tuna", "quantity": "2", "unit": "cans", "store_section": "pantry"},
                    {"name": "Cucumber", "quantity": "1", "unit": "medium", "store_section": "produce"},
                    {"name": "Tomatoes", "quantity": "2", "unit": "medium", "store_section": "produce"},
                    {"name": "Olives", "quantity": "1/2", "unit": "cup", "store_section": "pantry"},
                    {"name": "Olive oil", "quantity": "3", "unit": "tbsp", "store_section": "pantry"},
                    {"name": "Lemon", "quantity": "1", "unit": "piece", "store_section": "produce"},
                    {"name": "Salt", "quantity": "1", "unit": "tsp", "store_section": "pantry"}
                ],
                "instructions": [
                    "Wash and chop all vegetables",
                    "Drain and flake tuna",
                    "Combine all ingredients in large bowl",
                    "Drizzle with olive oil and lemon juice",
                    "Season with salt, toss gently",
                    "Serve immediately"
                ],
                "prep_time_minutes": 10,
                "cook_time_minutes": 0,
                "servings": 4,
                "meal_types": ["lunch"],
                "tags": ["quick", "healthy", "no-cook"]
            }
        ]

        # Insert all recipes
        for recipe in recipes:
            recipe["created_at"] = datetime.now(timezone.utc)
            await db.recipes.insert_one(recipe)

        logging.info(f"Initialized {len(recipes)} recipes in database")

    except Exception as e:
        logging.error(f"Error initializing recipe database: {str(e)}")

# === INVENTORY MANAGEMENT ENDPOINTS ===
@api_router.get("/inventory")
async def get_inventory():
    """Get all inventory items"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        items = await db.inventory.find().to_list(1000)
        return items
        
    except Exception as e:
        logging.error(f"Error getting inventory: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/inventory")
async def create_inventory_item(item: dict):
    """Create a new inventory item"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Add timestamp
        item['created_at'] = datetime.now(timezone.utc)
        item['updated_at'] = datetime.now(timezone.utc)
        
        result = await db.inventory.insert_one(item)
        item['_id'] = str(result.inserted_id)
        
        return item
        
    except Exception as e:
        logging.error(f"Error creating inventory item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/inventory/{item_id}")
async def update_inventory_item(item_id: str, item: dict):
    """Update an inventory item"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Add update timestamp
        item['updated_at'] = datetime.now(timezone.utc)
        
        result = await db.inventory.update_one(
            {"_id": item_id},
            {"$set": item}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        return {"message": "Inventory item updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating inventory item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/inventory/{item_id}")
async def delete_inventory_item(item_id: str):
    """Delete an inventory item"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        result = await db.inventory.delete_one({"_id": item_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        return {"message": "Inventory item deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting inventory item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# === RECIPE DATABASE INITIALIZATION ENDPOINT ===
@api_router.post("/recipes/initialize")
async def initialize_recipes():
    """Initialize the database with pre-built recipes for quick, healthy meals"""
    try:
        await initialize_recipe_database()
        return {"message": "Recipe database initialized successfully with quick, healthy meals"}
    except Exception as e:
        logging.error(f"Error initializing recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize recipes: {str(e)}")

# === AI-POWERED RECIPE SUGGESTIONS ===
@api_router.get("/recipes/suggestions/inventory")
async def get_recipe_suggestions_from_inventory():
    """Get recipe suggestions based on available inventory items"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Get all inventory items
        inventory_items = await db.inventory.find().to_list(1000)
        
        if not inventory_items:
            return {"message": "No inventory items found. Add some items to get recipe suggestions!"}
        
        # Extract ingredient names from inventory
        available_ingredients = [item.get('name', '').lower() for item in inventory_items if item.get('name')]
        
        # Find recipes that can be made with available ingredients
        suggested_recipes = []
        
        # Get all recipes
        all_recipes = await db.recipes.find().to_list(100)
        
        for recipe in all_recipes:
            recipe_ingredients = [ing.get('name', '').lower() for ing in recipe.get('ingredients', [])]
            
            # Calculate match percentage
            matches = 0
            total_ingredients = len(recipe_ingredients)
            
            for recipe_ingredient in recipe_ingredients:
                # Check for exact matches or partial matches
                for available_ingredient in available_ingredients:
                    if (recipe_ingredient in available_ingredient or 
                        available_ingredient in recipe_ingredient or
                        any(word in available_ingredient for word in recipe_ingredient.split())):
                        matches += 1
                        break
            
            if matches > 0:
                match_percentage = (matches / total_ingredients) * 100
                recipe['match_percentage'] = match_percentage
                recipe['available_ingredients'] = matches
                recipe['total_ingredients'] = total_ingredients
                suggested_recipes.append(recipe)
        
        # Sort by match percentage (highest first)
        suggested_recipes.sort(key=lambda x: x['match_percentage'], reverse=True)
        
        return {
            "suggested_recipes": suggested_recipes[:10],  # Top 10 suggestions
            "inventory_summary": {
                "total_items": len(inventory_items),
                "available_ingredients": available_ingredients[:10]  # Show first 10
            }
        }
        
    except Exception as e:
        logging.error(f"Error getting recipe suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/recipes/suggestions/ai")
async def get_ai_meal_suggestions(request: dict):
    """Get AI-powered meal suggestions based on inventory and dietary restrictions"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Get inventory items
        inventory_items = await db.inventory.find().to_list(1000)
        available_ingredients = [item.get('name', '') for item in inventory_items if item.get('name')]
        
        # Get dietary restrictions from request
        dietary_restrictions = request.get('dietary_restrictions', [])
        max_time_minutes = request.get('max_time_minutes', 30)
        meal_type = request.get('meal_type', 'dinner')
        
        # AI-powered recipe suggestions based on available ingredients
        ai_suggestions = []
        
        # Get all recipes
        all_recipes = await db.recipes.find().to_list(100)
        
        for recipe in all_recipes:
            # Check dietary restrictions
            recipe_dietary = recipe.get('dietary_restrictions_compliant', [])
            if dietary_restrictions and not any(diet in recipe_dietary for diet in dietary_restrictions):
                continue
            
            # Check cooking time
            total_time = recipe.get('prep_time_minutes', 0) + recipe.get('cook_time_minutes', 0)
            if total_time > max_time_minutes:
                continue
            
            # Check meal type
            recipe_meal_types = recipe.get('meal_types', [])
            if meal_type and meal_type not in recipe_meal_types:
                continue
            
            # Calculate ingredient availability
            recipe_ingredients = [ing.get('name', '') for ing in recipe.get('ingredients', [])]
            available_count = 0
            
            for recipe_ingredient in recipe_ingredients:
                for available_ingredient in available_ingredients:
                    if (recipe_ingredient.lower() in available_ingredient.lower() or 
                        available_ingredient.lower() in recipe_ingredient.lower()):
                        available_count += 1
                        break
            
            if available_count > 0:
                availability_percentage = (available_count / len(recipe_ingredients)) * 100
                recipe['availability_percentage'] = availability_percentage
                recipe['available_ingredients_count'] = available_count
                recipe['total_ingredients_count'] = len(recipe_ingredients)
                ai_suggestions.append(recipe)
        
        # Sort by availability percentage
        ai_suggestions.sort(key=lambda x: x['availability_percentage'], reverse=True)
        
        return {
            "ai_suggestions": ai_suggestions[:5],  # Top 5 AI suggestions
            "inventory_analysis": {
                "total_items": len(inventory_items),
                "available_ingredients": available_ingredients[:10],
                "dietary_restrictions": dietary_restrictions,
                "max_time_minutes": max_time_minutes,
                "meal_type": meal_type
            }
        }
        
    except Exception as e:
        logging.error(f"Error getting AI meal suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/recipes/suggestions/missing-ingredients/{recipe_id}")
async def get_missing_ingredients_for_recipe(recipe_id: str):
    """Get missing ingredients for a specific recipe based on inventory"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Get the recipe
        recipe = await db.recipes.find_one({"_id": recipe_id})
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        # Get inventory items
        inventory_items = await db.inventory.find().to_list(1000)
        available_ingredients = [item.get('name', '').lower() for item in inventory_items if item.get('name')]
        
        # Check which ingredients are missing
        missing_ingredients = []
        available_ingredients_for_recipe = []
        
        for ingredient in recipe.get('ingredients', []):
            ingredient_name = ingredient.get('name', '').lower()
            found = False
            
            for available_ingredient in available_ingredients:
                if (ingredient_name in available_ingredient or 
                    available_ingredient in ingredient_name or
                    any(word in available_ingredient for word in ingredient_name.split())):
                    available_ingredients_for_recipe.append(ingredient)
                    found = True
                    break
            
            if not found:
                missing_ingredients.append(ingredient)
        
        return {
            "recipe_name": recipe.get('name', ''),
            "missing_ingredients": missing_ingredients,
            "available_ingredients": available_ingredients_for_recipe,
            "completion_percentage": (len(available_ingredients_for_recipe) / len(recipe.get('ingredients', []))) * 100
        }
        
    except Exception as e:
        logging.error(f"Error getting missing ingredients: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/recipes/suggestions/shopping-list/{recipe_id}")
async def get_shopping_list_for_recipe(recipe_id: str):
    """Generate shopping list for a specific recipe based on missing ingredients"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Get missing ingredients
        missing_data = await get_missing_ingredients_for_recipe(recipe_id)
        
        if isinstance(missing_data, dict) and 'missing_ingredients' in missing_data:
            missing_ingredients = missing_data['missing_ingredients']
        else:
            missing_ingredients = []
        
        # Organize by store section
        shopping_list = {}
        for ingredient in missing_ingredients:
            store_section = ingredient.get('store_section', 'general')
            if store_section not in shopping_list:
                shopping_list[store_section] = []
            shopping_list[store_section].append({
                'name': ingredient.get('name', ''),
                'quantity': ingredient.get('quantity', ''),
                'unit': ingredient.get('unit', '')
            })
        
        return {
            "recipe_name": missing_data.get('recipe_name', ''),
            "shopping_list": shopping_list,
            "total_items_needed": len(missing_ingredients),
            "completion_percentage": missing_data.get('completion_percentage', 0)
        }
        
    except Exception as e:
        logging.error(f"Error generating shopping list: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# === BUG TRACKING ENDPOINTS ===
@api_router.post("/bugs")
async def create_bug_report(bug_report: BugReportCreate):
    """Create a new bug report or feature request"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Create bug report
        bug_dict = {
            "id": str(uuid.uuid4()),
            "title": bug_report.title,
            "description": bug_report.description,
            "bug_type": bug_report.bug_type,
            "priority": bug_report.priority,
            "status": BugStatus.OPEN,
            "reporter_email": bug_report.reporter_email,
            "reporter_name": bug_report.reporter_name,
            "tags": bug_report.tags,
            "steps_to_reproduce": bug_report.steps_to_reproduce,
            "expected_behavior": bug_report.expected_behavior,
            "actual_behavior": bug_report.actual_behavior,
            "environment": bug_report.environment,
            "browser_info": bug_report.browser_info,
            "device_info": bug_report.device_info,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        result = await db.bug_reports.insert_one(bug_dict)
        bug_dict["_id"] = str(result.inserted_id)
        
        # Send email notifications
        subject = f"New {bug_report.bug_type.value.title()} Report: {bug_report.title}"
        
        # Email to admin (you)
        admin_body = f"""
New {bug_report.bug_type.value.title()} Report

Title: {bug_report.title}
Description: {bug_report.description}
Priority: {bug_report.priority.value.title()}
Reporter: {bug_report.reporter_name} ({bug_report.reporter_email})
Type: {bug_report.bug_type.value.title()}

Steps to Reproduce:
{bug_report.steps_to_reproduce or 'Not provided'}

Expected Behavior:
{bug_report.expected_behavior or 'Not provided'}

Actual Behavior:
{bug_report.actual_behavior or 'Not provided'}

Environment: {bug_report.environment or 'Not provided'}
Browser: {bug_report.browser_info or 'Not provided'}
Device: {bug_report.device_info or 'Not provided'}

Report ID: {bug_dict['id']}
Created: {bug_dict['created_at'].strftime('%Y-%m-%d %H:%M:%S UTC')}

Please log in to the admin panel to manage this report.
        """
        
        # Email to friend
        friend_body = f"""
Thank you for reporting this {bug_report.bug_type.value}!

Your report has been received and assigned ID: {bug_dict['id']}

Title: {bug_report.title}
Priority: {bug_report.priority.value.title()}
Status: Open

We'll review your report and get back to you soon. You'll receive email updates when the status changes.

Thank you for helping improve Family Fork!
        """
        
        # Send emails
        await send_email(ADMIN_EMAIL, subject, admin_body)
        await send_email(bug_report.reporter_email, f"Report Received: {bug_report.title}", friend_body)
        
        return bug_dict
        
    except Exception as e:
        logging.error(f"Error creating bug report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/bugs")
async def get_bug_reports(status_filter: Optional[str] = None, limit: int = 50):
    """Get bug reports (public endpoint for friend to view their reports)"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        query = {}
        if status_filter:
            query["status"] = status_filter
        
        reports = await db.bug_reports.find(query).sort("created_at", -1).limit(limit).to_list(limit)
        
        # Convert ObjectId to string
        for report in reports:
            report["_id"] = str(report["_id"])
        
        return reports
        
    except Exception as e:
        logging.error(f"Error getting bug reports: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/bugs/{bug_id}")
async def get_bug_report(bug_id: str):
    """Get a specific bug report"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        report = await db.bug_reports.find_one({"id": bug_id})
        if not report:
            raise HTTPException(status_code=404, detail="Bug report not found")
        
        report["_id"] = str(report["_id"])
        
        # Get comments
        comments = await db.bug_comments.find({"bug_id": bug_id}).sort("created_at", 1).to_list(100)
        for comment in comments:
            comment["_id"] = str(comment["_id"])
        
        report["comments"] = comments
        return report
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting bug report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/bugs/{bug_id}/comments")
async def add_bug_comment(bug_id: str, comment: BugCommentCreate):
    """Add a comment to a bug report"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Verify bug exists
        bug = await db.bug_reports.find_one({"id": bug_id})
        if not bug:
            raise HTTPException(status_code=404, detail="Bug report not found")
        
        # Create comment
        comment_dict = {
            "id": str(uuid.uuid4()),
            "bug_id": bug_id,
            "author_email": comment.author_email,
            "author_name": comment.author_name,
            "comment": comment.comment,
            "is_internal": comment.is_internal,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = await db.bug_comments.insert_one(comment_dict)
        comment_dict["_id"] = str(result.inserted_id)
        
        # Send email notification to admin if not internal
        if not comment.is_internal:
            subject = f"New Comment on Bug Report: {bug['title']}"
            body = f"""
New comment added to bug report: {bug['title']}

Comment by: {comment.author_name} ({comment.author_email})
Comment: {comment.comment}

Bug Report ID: {bug_id}
Status: {bug['status'].value.title()}
Priority: {bug['priority'].value.title()}

Please log in to the admin panel to respond.
            """
            await send_email(ADMIN_EMAIL, subject, body)
        
        return comment_dict
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error adding bug comment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# === ADMIN BUG TRACKING ENDPOINTS ===
@api_router.get("/admin/bugs", dependencies=[Depends(get_admin_auth())])
async def get_all_bug_reports_admin():
    """Get all bug reports for admin (with internal comments)"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        reports = await db.bug_reports.find().sort("created_at", -1).to_list(1000)
        
        # Get comments for each report
        for report in reports:
            report["_id"] = str(report["_id"])
            comments = await db.bug_comments.find({"bug_id": report["id"]}).sort("created_at", 1).to_list(100)
            for comment in comments:
                comment["_id"] = str(comment["_id"])
            report["comments"] = comments
        
        return reports
        
    except Exception as e:
        logging.error(f"Error getting admin bug reports: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/bugs/{bug_id}", dependencies=[Depends(get_admin_auth())])
async def update_bug_report_admin(bug_id: str, update: BugUpdate):
    """Update bug report (admin only)"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Get current bug report
        bug = await db.bug_reports.find_one({"id": bug_id})
        if not bug:
            raise HTTPException(status_code=404, detail="Bug report not found")
        
        # Prepare update data
        update_data = {"updated_at": datetime.now(timezone.utc)}
        
        if update.status:
            update_data["status"] = update.status
            if update.status == BugStatus.RESOLVED:
                update_data["resolved_at"] = datetime.now(timezone.utc)
            elif update.status == BugStatus.CLOSED:
                update_data["closed_at"] = datetime.now(timezone.utc)
        
        if update.priority:
            update_data["priority"] = update.priority
        
        if update.assigned_to:
            update_data["assigned_to"] = update.assigned_to
        
        if update.tags:
            update_data["tags"] = update.tags
        
        # Update bug report
        result = await db.bug_reports.update_one(
            {"id": bug_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Bug report not found")
        
        # Add internal comment if provided
        if update.internal_notes:
            comment_dict = {
                "id": str(uuid.uuid4()),
                "bug_id": bug_id,
                "author_email": ADMIN_EMAIL,
                "author_name": "Admin",
                "comment": update.internal_notes,
                "is_internal": True,
                "created_at": datetime.now(timezone.utc)
            }
            await db.bug_comments.insert_one(comment_dict)
        
        # Send status update email to reporter
        if update.status and update.status != bug["status"]:
            subject = f"Bug Report Update: {bug['title']}"
            body = f"""
Your bug report has been updated:

Title: {bug['title']}
New Status: {update.status.value.title()}
Priority: {update.priority.value.title() if update.priority else bug['priority'].value.title()}

{update.internal_notes or 'No additional notes provided.'}

Report ID: {bug_id}
Updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}

Thank you for your feedback!
            """
            await send_email(bug["reporter_email"], subject, body)
        
        return {"message": "Bug report updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating bug report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/stats", dependencies=[Depends(get_admin_auth())])
async def get_bug_stats_admin():
    """Get bug tracking statistics for admin"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        total_bugs = await db.bug_reports.count_documents({})
        open_bugs = await db.bug_reports.count_documents({"status": BugStatus.OPEN})
        in_progress_bugs = await db.bug_reports.count_documents({"status": BugStatus.IN_PROGRESS})
        resolved_bugs = await db.bug_reports.count_documents({"status": BugStatus.RESOLVED})
        closed_bugs = await db.bug_reports.count_documents({"status": BugStatus.CLOSED})
        
        # Get recent bugs
        recent_bugs = await db.bug_reports.find().sort("created_at", -1).limit(10).to_list(10)
        for bug in recent_bugs:
            bug["_id"] = str(bug["_id"])
        
        return {
            "total_bugs": total_bugs,
            "open_bugs": open_bugs,
            "in_progress_bugs": in_progress_bugs,
            "resolved_bugs": resolved_bugs,
            "closed_bugs": closed_bugs,
            "recent_bugs": recent_bugs
        }
        
    except Exception as e:
        logging.error(f"Error getting bug stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# === QUICK RECIPE ENDPOINTS ===
@api_router.get("/recipes/quick")
async def get_quick_recipes(max_time_minutes: int = 30):
    """Get recipes that can be made in 30 minutes or less"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        recipes = await db.recipes.find({
            "$expr": {
                "$lte": [
                    {"$add": ["$prep_time_minutes", "$cook_time_minutes"]},
                    max_time_minutes
                ]
            }
        }).to_list(100)
        
        return recipes
    except Exception as e:
        logging.error(f"Error getting quick recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/recipes/meal-prep")
async def get_meal_prep_recipes():
    """Get recipes designed for meal prep and batch cooking"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        recipes = await db.recipes.find({
            "tags": {"$in": ["meal-prep", "batch-cooking", "weekly-prep"]}
        }).to_list(100)
        
        return recipes
    except Exception as e:
        logging.error(f"Error getting meal prep recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/recipes/diet/{diet_type}")
async def get_recipes_by_diet(diet_type: str):
    """Get recipes filtered by specific dietary restrictions"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        recipes = await db.recipes.find({
            "dietary_restrictions_compliant": diet_type
        }).to_list(100)
        
        return recipes
    except Exception as e:
        logging.error(f"Error getting recipes by diet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# === BARCODE LOOKUP ENDPOINT ===
@api_router.post("/inventory/barcode/{barcode}")
async def lookup_barcode(barcode: str):
    """Look up product information by barcode using Open Food Facts API"""
    try:
        import requests
        
        # Validate barcode format (should be numeric, 8-14 digits)
        if not barcode.isdigit() or len(barcode) < 8 or len(barcode) > 14:
            raise HTTPException(status_code=400, detail="Invalid barcode format")
        
        # Try Open Food Facts API first (free, comprehensive food database)
        try:
            response = requests.get(f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json", timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                if data.get('status') == 1 and data.get('product'):
                    product = data['product']
                    
                    # Extract product information
                    name = product.get('product_name', 'Unknown Product')
                    brand = product.get('brands', '')
                    category = product.get('categories_tags', ['general'])
                    
                    # Map Open Food Facts categories to our categories
                    category_mapping = {
                        'en:dairy': 'dairy',
                        'en:meat': 'meat',
                        'en:fish': 'fish',
                        'en:fruits': 'produce',
                        'en:vegetables': 'produce',
                        'en:cereals': 'pantry',
                        'en:beverages': 'general',
                        'en:snacks': 'general',
                        'en:frozen': 'frozen'
                    }
                    
                    mapped_category = 'general'
                    for cat in category:
                        for key, value in category_mapping.items():
                            if key in cat.lower():
                                mapped_category = value
                                break
                        if mapped_category != 'general':
                            break
                    
                    # Determine unit based on product type
                    unit = 'each'
                    if 'liquid' in product.get('text', '').lower() or 'beverage' in product.get('categories_tags', []):
                        unit = 'bottle'
                    elif 'frozen' in product.get('categories_tags', []):
                        unit = 'package'
                    
                    return {
                        "name": name,
                        "brand": brand,
                        "category": mapped_category,
                        "unit": unit,
                        "barcode": barcode,
                        "source": "Open Food Facts",
                        "nutrition_info": {
                            "calories": product.get('nutriments', {}).get('energy-kcal_100g'),
                            "protein": product.get('nutriments', {}).get('proteins_100g'),
                            "carbs": product.get('nutriments', {}).get('carbohydrates_100g'),
                            "fat": product.get('nutriments', {}).get('fat_100g')
                        }
                    }
        except Exception as e:
            logging.warning(f"Open Food Facts API failed: {e}")
        
        # Fallback: Try UPC Database API (if you have an API key)
        # You can add other barcode databases here as fallbacks
        
        # If no database found the product, return basic info
        return {
            "name": f"Product {barcode}",
            "brand": "",
            "category": "general",
            "unit": "each",
            "barcode": barcode,
            "source": "Manual Entry",
            "nutrition_info": {}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error looking up barcode {barcode}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to lookup barcode: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize the recipe database with quick, healthy meals on startup"""
    try:
        await initialize_recipe_database()
        logging.info("Recipe database initialization completed")
    except Exception as e:
        logging.error(f"Error during startup: {str(e)}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()