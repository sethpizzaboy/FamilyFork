# Family Fork - Intelligent Meal Planning for Families

**Author:** Norelec  
**Version:** 0.1.0  
**License:** MIT

A comprehensive meal planning application designed to help families with different dietary needs create customized meal plans, manage recipes, and streamline grocery shopping. Built specifically to support families dealing with health challenges and multiple dietary restrictions.

## 📑 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [📋 Prerequisites](#-prerequisites)
- [🛠️ Installation & Setup](#️-installation--setup)
- [⚙️ Configuration](#️-configuration)
- [🎮 Usage Guide](#-usage-guide)
- [👨‍👩‍👧‍👦 Family Management](#-family-management)
- [🍽️ Meal Planning](#️-meal-planning)
- [📝 Recipe Management](#-recipe-management)
- [🛒 Grocery Lists](#-grocery-lists)
- [📊 Inventory Management](#-inventory-management)
- [🔧 API Documentation](#-api-documentation)
- [🐳 Docker Management](#-docker-management)
- [📈 Performance & Monitoring](#-performance--monitoring)
- [🔒 Security & Privacy](#-security--privacy)
- [🛠️ Development](#️-development)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🚀 Overview

Family Fork is a sophisticated meal planning application designed to help families with diverse dietary needs create customized meal plans, manage recipes, and streamline their grocery shopping. Built with modern web technologies and intelligent algorithms, it provides a comprehensive solution for family meal management.

### What Makes Family Fork Special?

- **Multi-Diet Support**: Handle 3+ different diets per family seamlessly
- **Health-Conscious Planning**: Special considerations for medical conditions
- **Intelligent Meal Suggestions**: AI-powered meal recommendations
- **Comprehensive Recipe Management**: Store, organize, and share family recipes
- **Smart Grocery Lists**: Automatically generate shopping lists
- **Inventory Tracking**: Keep track of pantry items and expiration dates
- **Family Collaboration**: Multiple family members can contribute and plan together

## ✨ Key Features

### 👨‍👩‍👧‍👦 Family Management
- **Multiple Family Members**: Add and manage all family members
- **Individual Dietary Restrictions**: Set specific dietary needs per person
- **Health Conditions**: Track special dietary requirements for medical conditions
- **Age-Appropriate Planning**: Consider different nutritional needs by age
- **Allergy Management**: Comprehensive allergy tracking and avoidance

### 🍽️ Intelligent Meal Planning
- **Weekly Meal Plans**: Generate complete weekly meal schedules
- **Dietary Compliance**: Ensure all meals meet family dietary requirements
- **Nutritional Balance**: Consider nutritional needs across the week
- **Meal Prep Optimization**: Plan for efficient Sunday meal prep sessions
- **Leftover Management**: Incorporate leftovers into future meal plans
- **Seasonal Planning**: Consider seasonal ingredients and preferences

### 📝 Recipe Management
- **Recipe Database**: Store unlimited family recipes
- **Dietary Tagging**: Tag recipes with dietary restrictions and preferences
- **Nutritional Information**: Track calories, macros, and nutritional content
- **Cooking Instructions**: Detailed step-by-step cooking guides
- **Ingredient Lists**: Comprehensive ingredient management
- **Recipe Sharing**: Share recipes with family members

### 🛒 Smart Grocery Lists
- **Automatic Generation**: Create shopping lists from meal plans
- **Store Organization**: Organize items by store layout or category
- **Quantity Management**: Calculate exact quantities needed
- **Price Tracking**: Optional price tracking and budget management
- **Shopping Optimization**: Optimize shopping routes and timing
- **Mobile-Friendly**: Access lists on mobile devices while shopping

### 📊 Inventory Management
- **Pantry Tracking**: Keep track of available ingredients
- **Expiration Monitoring**: Track expiration dates and use-by dates
- **Shopping Integration**: Know what you need vs. what you have
- **Waste Reduction**: Minimize food waste through better planning
- **Storage Organization**: Organize by storage location and type

## 🏗️ System Architecture

Family Fork uses a modern full-stack architecture with the following components:

```
┌─────────────────────────────────────────────────────────┐
│                    Family Fork System                   │
├─────────────────────────────────────────────────────────┤
│  Frontend (React)     │  Backend (FastAPI)            │
│  Port: 3000          │  Port: 8000                    │
│  - Family Dashboard   │  - Meal Planning Engine        │
│  - Recipe Management  │  - Recipe Database              │
│  - Grocery Lists      │  - Inventory Management        │
│  - Meal Planner       │  - Family Management           │
├─────────────────────────────────────────────────────────┤
│  MongoDB              │  Redis (Optional)             │
│  Port: 27017         │  Port: 6379                   │
│  - Family Data        │  - Session Cache               │
│  - Recipes            │  - Performance Data            │
│  - Meal Plans         │  - Real-time Updates          │
└─────────────────────────────────────────────────────────┘
```

### Component Details

#### **Frontend (React)**
- **Technology**: React 19 with modern hooks and functional components
- **UI Framework**: Radix UI components with Tailwind CSS
- **State Management**: React hooks with context for global state
- **Routing**: React Router for navigation between features
- **Responsive Design**: Mobile-first design for all devices

#### **Backend (FastAPI)**
- **Technology**: Python 3.10+ with FastAPI framework
- **Architecture**: Async/await for high performance
- **Database**: MongoDB for flexible data storage
- **API Design**: RESTful API with automatic documentation
- **Security**: Input validation, CORS protection, and data sanitization

#### **Database (MongoDB)**
- **Purpose**: Flexible document storage for family data
- **Collections**: Families, recipes, meal plans, inventory, grocery lists
- **Indexing**: Optimized queries for fast data retrieval
- **Scalability**: Horizontal scaling for growing families

## 📋 Prerequisites

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Windows 10, macOS 10.14, Ubuntu 18.04 | Windows 11, macOS 12+, Ubuntu 20.04+ |
| **RAM** | 4GB | 8GB+ |
| **Storage** | 2GB free space | 5GB+ free space |
| **CPU** | 2 cores | 4+ cores |
| **Network** | Stable internet connection | High-speed broadband |

### Required Software

- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download Python](https://python.org/)
- **MongoDB** (v5.0 or higher) - [Download MongoDB](https://mongodb.com/)
- **Git** (for cloning repository)
- **Web Browser** (Chrome, Firefox, Safari, Edge)

### Optional Software

- **Docker** (for containerized deployment)
- **VS Code** (for development)
- **Postman** (for API testing)

## 🛠️ Installation & Setup

### ⚡ Quick Start (Recommended)

**For users who just want to get started quickly:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sethpizzaboy/FamilyFork.git
   cd FamilyFork
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Start the backend:**
   ```bash
   cd backend
   python server.py
   ```

6. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

7. **Open your browser:** Go to `http://localhost:3000`

**That's it!** The application will be running with all features available.

### Option 1: Docker Setup (Recommended for Production)

1. **Create a docker-compose.yml file:**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - MONGO_URL=mongodb://mongo:27017/familyfork
         - DB_NAME=familyfork
       depends_on:
         - mongo
     
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - REACT_APP_BACKEND_URL=http://localhost:8000
       depends_on:
         - backend
     
     mongo:
       image: mongo:7.0
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
   
   volumes:
     mongo_data:
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

## ⚙️ Configuration

### Environment Variables

The application uses the following environment variables:

```env
# Backend Configuration
MONGO_URL=mongodb://localhost:27017/familyfork
DB_NAME=familyfork
CORS_ORIGINS=http://localhost:3000
HOST=0.0.0.0
PORT=8000

# Frontend Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Family Configuration

- **Maximum Family Members**: 10 members per family
- **Dietary Restrictions**: 10+ supported restrictions
- **Recipe Storage**: Unlimited recipes per family
- **Meal Plans**: 4 weeks of meal planning history
- **Inventory Items**: 500+ items per family

## 🎮 Usage Guide

### 1. Initial Setup

1. **Open the application** at `http://localhost:3000`
2. **Create your family profile:**
   - Add family members
   - Set dietary restrictions for each member
   - Configure health conditions if applicable
   - Set meal preferences and allergies

3. **Add your first recipes:**
   - Import existing recipes
   - Add new family favorites
   - Tag recipes with dietary information
   - Set cooking times and difficulty levels

### 2. Meal Planning

1. **Navigate to Meal Planner**
2. **Select the week** you want to plan
3. **Choose meals** for each day:
   - Breakfast, lunch, dinner, snacks
   - Consider dietary restrictions
   - Balance nutritional needs
   - Plan for meal prep efficiency

4. **Review and adjust** the meal plan
5. **Generate grocery list** automatically

### 3. Recipe Management

1. **Add new recipes:**
   - Enter recipe details
   - Add ingredients and quantities
   - Include cooking instructions
   - Set dietary tags and nutritional info

2. **Organize recipes:**
   - Create categories (breakfast, dinner, etc.)
   - Tag by dietary restrictions
   - Rate recipes for future planning
   - Share with family members

### 4. Grocery Shopping

1. **View generated grocery list**
2. **Organize by store layout** (optional)
3. **Check off items** as you shop
4. **Update inventory** when you return home

## 👨‍👩‍👧‍👦 Family Management

### Adding Family Members

1. **Navigate to Family Members**
2. **Click "Add Family Member"**
3. **Enter member details:**
   - Name and age
   - Dietary restrictions
   - Allergies and intolerances
   - Health conditions
   - Food preferences

4. **Save member profile**

### Dietary Restrictions

Family Fork supports the following dietary restrictions:

- **Gluten-Free**: No wheat, barley, rye, or gluten-containing ingredients
- **Dairy-Free**: No milk, cheese, butter, or dairy products
- **Vegan**: No animal products including meat, dairy, eggs, honey
- **Vegetarian**: No meat, but may include dairy and eggs
- **Pescatarian**: No meat, but includes fish and seafood
- **Nut-Free**: No tree nuts or peanuts
- **Soy-Free**: No soy products or soy-derived ingredients
- **Egg-Free**: No eggs or egg-containing products
- **Sugar-Free**: No added sugars or sweeteners
- **Low-Sodium**: Reduced sodium content
- **Keto**: Low-carb, high-fat diet
- **Paleo**: Whole foods, no processed ingredients

### Health Condition Support

- **Cancer Treatment**: Special dietary needs during treatment
- **Diabetes**: Blood sugar management through diet
- **Heart Disease**: Heart-healthy meal planning
- **Digestive Issues**: Easy-to-digest meal options
- **Food Allergies**: Comprehensive allergy management
- **Weight Management**: Calorie-controlled meal planning

## 🍽️ Meal Planning

### Weekly Meal Planning

1. **Select Planning Week**
2. **Choose Meal Types:**
   - Breakfast (7 days)
   - Lunch (7 days)
   - Dinner (7 days)
   - Snacks (as needed)

3. **Consider Dietary Needs:**
   - Ensure all meals meet family dietary requirements
   - Balance nutritional needs across the week
   - Plan for meal prep efficiency
   - Consider cooking time and complexity

4. **Generate Meal Plan**
5. **Review and Adjust**
6. **Save and Share** with family

### Meal Prep Optimization

- **Sunday Prep Sessions**: Plan for efficient meal prep
- **Batch Cooking**: Cook multiple meals at once
- **Ingredient Prep**: Pre-chop vegetables and prepare ingredients
- **Storage Planning**: Plan for proper food storage
- **Leftover Integration**: Use leftovers in future meals

### Nutritional Planning

- **Balanced Meals**: Ensure nutritional balance across the week
- **Portion Control**: Appropriate serving sizes for each family member
- **Vitamin Tracking**: Monitor key vitamins and minerals
- **Calorie Management**: Track daily calorie intake
- **Macro Balance**: Balance proteins, carbs, and fats

## 📝 Recipe Management

### Recipe Database

- **Unlimited Storage**: Store as many recipes as needed
- **Categorization**: Organize by meal type, cuisine, or dietary restriction
- **Search Functionality**: Find recipes by ingredients, dietary tags, or keywords
- **Rating System**: Rate recipes for future meal planning
- **Favorites**: Mark favorite recipes for quick access

### Recipe Information

- **Basic Details**: Name, description, serving size, prep time, cook time
- **Ingredients**: Complete ingredient list with quantities
- **Instructions**: Step-by-step cooking instructions
- **Nutritional Info**: Calories, macros, vitamins, and minerals
- **Dietary Tags**: Gluten-free, dairy-free, vegan, etc.
- **Difficulty Level**: Easy, medium, or hard
- **Cuisine Type**: American, Italian, Mexican, Asian, etc.

### Recipe Sharing

- **Family Sharing**: Share recipes with family members
- **Import/Export**: Import recipes from other sources
- **Print Recipes**: Print recipes for offline use
- **Digital Cookbook**: Create digital family cookbooks

## 🛒 Grocery Lists

### Automatic Generation

- **From Meal Plans**: Automatically generate lists from weekly meal plans
- **Ingredient Calculation**: Calculate exact quantities needed
- **Smart Deduplication**: Combine similar items and quantities
- **Store Organization**: Organize items by store layout or category

### Shopping Optimization

- **Store Layout**: Organize items by store sections (produce, dairy, meat, etc.)
- **Shopping Routes**: Optimize shopping path through the store
- **Price Tracking**: Optional price tracking and budget management
- **Mobile Access**: Access lists on mobile devices while shopping

### List Management

- **Multiple Lists**: Create lists for different stores or shopping trips
- **Item Checking**: Check off items as you shop
- **Quantity Updates**: Adjust quantities based on availability
- **Notes**: Add notes for special items or substitutions

## 📊 Inventory Management

### Pantry Tracking

- **Item Database**: Track all pantry items and ingredients
- **Quantity Management**: Monitor current quantities and usage
- **Expiration Dates**: Track expiration dates and use-by dates
- **Storage Locations**: Organize by storage location (pantry, fridge, freezer)

### Shopping Integration

- **Need vs. Have**: Know what you need vs. what you already have
- **Shopping Lists**: Generate lists based on what you need
- **Waste Reduction**: Minimize food waste through better planning
- **Restocking**: Know when to restock frequently used items

### Inventory Features

- **Barcode Scanning**: Optional barcode scanning for easy item entry
- **Category Organization**: Organize items by food category
- **Expiration Alerts**: Get alerts for items nearing expiration
- **Usage Tracking**: Track how quickly items are used

## 🔧 API Documentation

### Core Endpoints

- `GET /api/health` - System health check
- `GET /api/families` - List all families
- `POST /api/families` - Create new family
- `GET /api/families/{family_id}` - Get family details
- `PUT /api/families/{family_id}` - Update family information

### Family Management

- `GET /api/families/{family_id}/members` - List family members
- `POST /api/families/{family_id}/members` - Add family member
- `PUT /api/families/{family_id}/members/{member_id}` - Update member
- `DELETE /api/families/{family_id}/members/{member_id}` - Remove member

### Recipe Management

- `GET /api/recipes` - List all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/{recipe_id}` - Get recipe details
- `PUT /api/recipes/{recipe_id}` - Update recipe
- `DELETE /api/recipes/{recipe_id}` - Delete recipe

### Meal Planning

- `GET /api/meal-plans` - List meal plans
- `POST /api/meal-plans` - Create meal plan
- `GET /api/meal-plans/{plan_id}` - Get meal plan details
- `PUT /api/meal-plans/{plan_id}` - Update meal plan
- `DELETE /api/meal-plans/{plan_id}` - Delete meal plan

### Grocery Lists

- `GET /api/grocery-lists` - List grocery lists
- `POST /api/grocery-lists` - Create grocery list
- `GET /api/grocery-lists/{list_id}` - Get grocery list details
- `PUT /api/grocery-lists/{list_id}` - Update grocery list
- `DELETE /api/grocery-lists/{list_id}` - Delete grocery list

### Inventory Management

- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory item
- `GET /api/inventory/{item_id}` - Get inventory item details
- `PUT /api/inventory/{item_id}` - Update inventory item
- `DELETE /api/inventory/{item_id}` - Remove inventory item

## 🐳 Docker Management

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild Services
```bash
docker-compose up --build -d
```

## 📈 Performance & Monitoring

### Health Checks

All services include comprehensive health checks:

- **Backend**: API health endpoint with database connectivity
- **Frontend**: Web server availability and response time
- **MongoDB**: Database connection and query performance

### Monitoring Features

- **Real-time Updates**: Live data synchronization
- **Performance Metrics**: Response times and throughput monitoring
- **Error Tracking**: Comprehensive error logging and reporting
- **User Analytics**: Usage patterns and feature adoption

### Performance Optimization

- **Async Processing**: Non-blocking operations for high performance
- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Optional Redis caching for improved response times
- **Resource Management**: Efficient memory and CPU usage

## 🔒 Security & Privacy

### Security Features

- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Input Validation**: Comprehensive data validation and sanitization
- **CORS Protection**: Proper cross-origin resource sharing configuration
- **Authentication**: Optional user authentication for family data protection

### Privacy Protection

- **Local Data Storage**: All data stored locally by default
- **No Third-Party Tracking**: No external analytics or tracking
- **Data Ownership**: Families own and control their data
- **Secure Communication**: All API communication encrypted

### Best Practices

- **Regular Backups**: Automated backup of family data
- **Data Export**: Export family data for backup or migration
- **Privacy Controls**: Granular privacy settings for family members
- **Secure Development**: Security-first development practices

## 🛠️ Development

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sethpizzaboy/FamilyFork.git
   cd FamilyFork
   ```

2. **Install dependencies:**
   ```bash
   # Backend dependencies
   cd backend
   pip install -r requirements.txt
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start development servers:**
   ```bash
   # Backend
   cd backend
   python server.py
   
   # Frontend
   cd frontend
   npm start
   ```

### Code Structure

```
FamilyFork/
├── backend/                 # FastAPI backend
│   ├── server.py           # Main application
│   ├── requirements.txt    # Python dependencies
│   ├── models/             # Data models
│   └── routes/             # API routes
├── frontend/               # React frontend
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── tests/                  # Test files
└── README.md              # This file
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Documentation

### Core Documentation
- [README.md](README.md) - Main project documentation (this file)
- [CHANGELOG.md](CHANGELOG.md) - Complete version history and changes
- [VERSIONING.md](VERSIONING.md) - Release management and rollback procedures

### Quick Reference
- **Minimal Requirements**: 4GB RAM, 2GB storage, Node.js, Python, MongoDB
- **Quick Start**: Clone → Install dependencies → Start services → Open browser
- **Access Points**: Frontend (localhost:3000), Backend API (localhost:8000)
- **Management**: Use npm/yarn for frontend, pip for backend

### Version Information
- **Current Version**: v0.1.0 (Initial Release)
- **All Versions**: Available on [GitHub Releases](https://github.com/sethpizzaboy/FamilyFork/releases)
- **Rollback**: Any version can be downloaded and used
- **Support**: Check documentation or create GitHub issue

## 🤝 Contributing

We welcome contributions to Family Fork! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Test your changes**: Ensure all tests pass
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes clearly

### Development Guidelines

- **Code Style**: Follow PEP 8 for Python, ESLint for JavaScript
- **Documentation**: Update documentation for new features
- **Testing**: Add tests for new functionality
- **Commits**: Use clear, descriptive commit messages

### Reporting Issues

- **Bug Reports**: Use the GitHub issue tracker
- **Feature Requests**: Submit detailed feature requests
- **Security Issues**: Report security issues privately

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Issues**: Create an issue on GitHub
- **Documentation**: Check this README
- **API Docs**: Visit `http://localhost:8000/docs` when running

## 🎯 Roadmap

- [ ] Mobile app support
- [ ] Advanced nutritional analysis
- [ ] Integration with grocery delivery services
- [ ] Meal prep video guides
- [ ] Family calendar integration
- [ ] Advanced dietary restriction management

## 💝 Donations

If you find FamilyFork useful and would like to support its development, donations are greatly appreciated! Your support helps maintain and improve this family meal planning application.

### Supported Networks & Addresses

#### **Solana (Preferred)**
**Address:** `EhaMxyPNkkMRTugajdzcQ17M2XqCe16GH5UmX7JkmnEu`  
**Network:** Solana  
**Wallet:** Phantom (@Norelec)

```
EhaMxyPNkkMRTugajdzcQ17M2XqCe16GH5UmX7JkmnEu
```

#### **Ethereum**
**Address:** `0xa3dd9A28636eE085CDb9be5abfCDc752D149cfB5`  
**Network:** Ethereum

```
0xa3dd9A28636eE085CDb9be5abfCDc752D149cfB5
```

#### **Base**
**Address:** `0xa3dd9A28636eE085CDb9be5abfCDc752D149cfB5`  
**Network:** Base

```
0xa3dd9A28636eE085CDb9be5abfCDc752D149cfB5
```

#### **SUI**
**Address:** `0xba501875a46a0bbd81c9c0a2c0e40c7a3175ca2d4cee5692cd7da53f02be869a`  
**Network:** SUI

```
0xba501875a46a0bbd81c9c0a2c0e40c7a3175ca2d4cee5692cd7da53f02be869a
```

#### **Polygon**
**Address:** `0xa3dd9A28636eE085CDb9be5abfCDc752D149cfB5`  
**Network:** Polygon

```
0xa3dd9A28636eE085CDb9be5abfCDc752D149cfB5
```

#### **Bitcoin Taproot**
**Address:** `bc1p907p75h0yxr0nxd3kt826qvhraenq087w6s053q7rymcy3gzczlstl8yqg`  
**Network:** Bitcoin Taproot

```
bc1p907p75h0yxr0nxd3kt826qvhraenq087w6s053q7rymcy3gzczlstl8yqg
```

#### **Bitcoin Native Segwit**
**Address:** `bc1qxhfatj69l282fsejm0hcs95t4tsg7n3yksdksp`  
**Network:** Bitcoin Native Segwit

```
bc1qxhfatj69l282fsejm0hcs95t4tsg7n3yksdksp
```

### How to Donate

1. **Choose your preferred network**
2. **Copy the corresponding address above**
3. **Send tokens to the address**
4. **Any amount is appreciated!**

### Thank You! 🙏

Your donations help support:
- ✅ **Development time** for new meal planning features
- ✅ **Recipe database** expansion and AI improvements
- ✅ **Mobile app** development for iOS and Android
- ✅ **API improvements** and performance optimizations
- ✅ **Documentation** and user guides

Every donation, no matter the size, makes a difference and is deeply appreciated!

---

**Author:** Norelec  
**Version:** 0.1.0  
**Last Updated:** October 2025