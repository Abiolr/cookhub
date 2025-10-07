# CookHub

**Your solution for "What should I cook tonight?"**  
Turn random ingredients into culinary masterpieces.

---

## Table of Contents
- [Overview](#overview)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

---

## Overview

CookHub is a full-stack web application that helps users discover recipes based on the ingredients they have on hand. By integrating the Spoonacular API, we provide personalized recipe recommendations that minimize food waste and inspire creativity in the kitchen.

**Live Demo:** [https://cookhub-psi.vercel.app](https://cookhub-psi.vercel.app)

---

## The Problem

Every day, millions of people face the same question: *"What should I cook with what I have?"*

- **Food Waste:** Americans throw away ~$1,600 worth of food per year
- **Decision Fatigue:** Meal planning is time-consuming and overwhelming
- **Limited Creativity:** People cook the same 5-10 meals repeatedly
- **Ingredient Mismatch:** Recipes often require ingredients you don't have

---

## Our Solution

CookHub bridges the gap between your pantry and your plate by:

1. **Smart Search:** Input your available ingredients and get instant recipe matches
2. **Personalized Dashboard:** Save favorite recipes and build your culinary collection
3. **Priority Ranking:** Recipes are ranked by ingredient match percentage
4. **Zero Waste Cooking:** Maximize ingredient usage and minimize waste

---

## Key Features

### Intelligent Recipe Search
- Input multiple ingredients at once
- Get 3 randomized recipe suggestions from 50+ matches
- See exactly how many ingredients match and what's missing
- One-click access to full recipe details

### User Dashboard
- Secure authentication with bcrypt password hashing
- Personal recipe collection
- Track saved recipes with beautiful card layouts
- Quick access to create new recipes or use AI assistant

### Detailed Recipe View
- Complete ingredient lists with interactive checkboxes
- Step-by-step cooking instructions
- High-quality recipe images
- Save recipes directly to your dashboard
- Print and share functionality (coming soon)

### Security & Data Management
- MySQL database with proper foreign key relationships
- Prevents duplicate recipe saves per user
- Session persistence with localStorage
- Protected routes with React Router

---

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router v6** - Client-side routing
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom responsive styling

### Backend
- **Flask** - Lightweight Python web framework
- **MySQL** - Relational database management
- **Gunicorn** - WSGI HTTP server
- **Flask-CORS** - Cross-origin resource sharing

### External APIs
- **Spoonacular API** - Recipe data and ingredient matching
- Rate limit: 150 requests/day (free tier)

### DevOps & Hosting
- **Railway** - Backend deployment
- **MySQL (Railway)** - Managed database hosting
- **Git/GitHub** - Version control

---

## Architecture

```
┌─────────────────┐
│   React Client  │
│   (Vite + React │
│     Router)     │
└────────┬────────┘
         │
         │ HTTP/JSON
         │
┌────────▼────────┐      ┌──────────────────┐
│  Flask REST API │◄─────┤  Spoonacular API │
│   (Railway)     │      └──────────────────┘
└────────┬────────┘
         │
         │ mysql-connector
         │
┌────────▼────────┐
│  MySQL Database │
│   (Railway)     │
└─────────────────┘
```

### Request Flow Example

```
User enters "chicken, rice" → React Search Component
    ↓
POST /search_recipes → Flask Backend
    ↓
GET Spoonacular API → Recipe matches returned
    ↓
User clicks recipe → Fetch full details
    ↓
GET /recipes/:id → Flask Backend → Spoonacular API
    ↓
User clicks "Save" → POST /save_recipe
    ↓
MySQL INSERT → Recipes table (user_id, recipe_id)
```

---

## API Documentation

### Authentication Endpoints

#### `POST /register`
Register a new user.

**Request Body:**
- `username` (string, required)
- `email` (string, required)
- `password` (string, required)

**Success Response:** `201 Created`
- Returns user ID and success message

**Error Response:** `400 Bad Request`
- Returns error message if username/email already exists

---

#### `POST /login`
Authenticate existing user.

**Request Body:**
- `username` (string, required)
- `password` (string, required)

**Success Response:** `200 OK`
- Returns user object with id, username, email

**Error Response:** `401 Unauthorized`
- Returns error message for invalid credentials

---

### Recipe Endpoints

#### `POST /search_recipes`
Find recipes by ingredients.

**Request Body:**
- `ingredients` (array of strings, required)

**Success Response:** `200 OK`
- Returns array of 3 recipe matches with:
  - `id` - Recipe ID
  - `title` - Recipe name
  - `image` - Recipe image URL
  - `usedIngredientCount` - Number of matching ingredients
  - `missedIngredientCount` - Number of missing ingredients

**Error Response:** `400 Bad Request`
- Returns error if ingredients list is invalid

---

#### `GET /recipes/:id`
Get full recipe details including ingredients and instructions.

**URL Parameters:**
- `id` (integer, required) - Recipe ID

**Success Response:** `200 OK`
- Returns recipe object with:
  - `id` - Recipe ID
  - `title` - Recipe name
  - `image` - Recipe image URL
  - `ingredients` - Array of ingredient strings
  - `steps` - Array of instruction strings

**Error Response:** `500 Internal Server Error`
- Returns error if API request fails

---

#### `POST /save_recipe`
Save a recipe to user's dashboard.

**Request Body:**
- `user_id` (integer, required)
- `id` (integer, required) - Recipe ID
- `title` (string, required)
- `ingredients` (array, required)
- `steps` (array, required)
- `image` (string, required)

**Success Response:** `201 Created`
- Returns success message

**Error Response:** `400 Bad Request`
- Returns error if duplicate or missing fields

---

#### `GET /user/:user_id/recipes`
Get all saved recipes for a user.

**URL Parameters:**
- `user_id` (integer, required)

**Success Response:** `200 OK`
- Returns array of saved recipes with full details

**Error Response:** `500 Internal Server Error`
- Returns error message if query fails

---

## Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(255) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Recipes Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| recipe_id | INT | NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| image_url | VARCHAR(255) | |
| ingredients | JSON | NOT NULL |
| instructions | JSON | NOT NULL |
| user_id | INT | FOREIGN KEY → Users(id), CASCADE DELETE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Composite Unique Key:** `(user_id, recipe_id)` - Prevents duplicate saves per user

**Key Design Decisions:**
- JSON columns for flexible ingredient/instruction storage
- Composite unique key prevents duplicate saves
- Foreign key cascade ensures data integrity
- Timestamps for sorting and analytics
