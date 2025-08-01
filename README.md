# E-Shop Backend

## Overview

This is the backend server for the E-Shop project, built with Node.js, Express, and MongoDB. It manages product data and cart operations via a RESTful API.

## Version Information

- **Version**: 1.0.0
- **Last Updated**: Tuesday, July 08, 2025, 09:38 PM +06
- **Author**: [Your Name]
- **Status**: In Development

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- MongoDB (installed and running locally)

## Installation

1. Navigate to the `server` directory:
   ```bash
   cd server
   npm install
   npm run dev
   ```

Features

- Product data seeding with MongoDB.
- CRUD operations for cart management.
- Error handling for API requests.
- CORS support for frontend integration.

API Endpoints

- GET /api/products - Retrieve all products.
- GET /api/products/:id - Retrieve a specific product.
- GET /api/cart - Retrieve cart items.
- POST /api/cart - Add an item to the cart.
- PUT /api/cart/:id - Update item quantity.
- DELETE /api/cart/:id - Remove an item from the cart.
- DELETE /api/cart - Clear the cart.

Dependencies

- express
- mongoose
- cors
