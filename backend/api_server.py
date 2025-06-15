#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JSON Database API Server
Pure REST API for frontend developers - No HTML interface
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

# Create Flask application
app = Flask(__name__)
CORS(app)  # Enable cross-origin requests for frontend

# Configuration
JSON_FILE = 'database.json'
API_VERSION = '1.0.0'
SERVER_NAME = 'JSON Database API'

def load_json_data():
    """Load JSON file data"""
    try:
        if os.path.exists(JSON_FILE):
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            print(f"Warning: {JSON_FILE} file does not exist")
            return []
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return []
    except Exception as e:
        print(f"File reading error: {e}")
        return []

def save_json_data(data):
    """Save data to JSON file"""
    try:
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"File saving error: {e}")
        return False

def create_response(success=True, data=None, message=None, count=None, status_code=200):
    """Create standard API response"""
    response_data = {
        'success': success,
        'timestamp': datetime.now().isoformat(),
        'server': SERVER_NAME,
        'version': API_VERSION
    }
    
    if data is not None:
        response_data['data'] = data
    if message:
        response_data['message'] = message
    if count is not None:
        response_data['count'] = count
    
    return jsonify(response_data), status_code



# ============= API Routes =============

@app.route('/raw')
def get_raw_json():
    """Get raw JSON file content"""
    data = load_json_data()
    return jsonify(data)

@app.route('/')
def root():
    """API info endpoint"""
    return create_response(
        success=True,
        data={
            "api_name": SERVER_NAME,
            "version": API_VERSION,
            "endpoints": {
                "GET /api/products": "Get all products (supports pagination, search, filtering)",
                "GET /api/products/{id}": "Get product by ID", 
                "POST /api/products": "Create new product",
                "PUT /api/products/{id}": "Update product by ID",
                "DELETE /api/products/{id}": "Delete product by ID",
                "GET /api/categories": "Get all categories",
                "GET /api/brands": "Get all brands",
                "GET /api/stats": "Get database statistics"
            },
            "query_parameters": {
                "page": "Page number for pagination (default: 1)",
                "limit": "Items per page (default: 10, max: 100)",
                "search": "Search in name, description, tags",
                "category": "Filter by category",
                "brand": "Filter by brand"
            }
        }
    )

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get products with optional filtering, search, and pagination"""
    data = load_json_data()
    
    # Get query parameters
    page = int(request.args.get('page', 1))
    limit = min(int(request.args.get('limit', 10)), 100)  # Max 100 items per page
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    brand = request.args.get('brand', '').strip()
    
    # Apply filters
    filtered_data = data
    
    if search:
        search_lower = search.lower()
        filtered_data = [
            item for item in filtered_data
            if search_lower in item.get('name', '').lower()
            or search_lower in item.get('description', '').lower()
            or search_lower in str(item.get('tags', [])).lower()
        ]
    
    if category:
        filtered_data = [
            item for item in filtered_data
            if item.get('category', '').lower() == category.lower()
        ]
    
    if brand:
        filtered_data = [
            item for item in filtered_data
            if item.get('brand', '').lower() == brand.lower()
        ]
    
    # Pagination
    total = len(filtered_data)
    start = (page - 1) * limit
    end = start + limit
    paginated_data = filtered_data[start:end]
    
    return create_response(
        success=True,
        data={
            'products': paginated_data,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'total_pages': (total + limit - 1) // limit if total > 0 else 0,
                'has_next': end < total,
                'has_prev': page > 1
            },
            'filters_applied': {
                'search': search if search else None,
                'category': category if category else None,
                'brand': brand if brand else None
            }
        },
        count=len(paginated_data)
    )

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    data = load_json_data()
    product = next((item for item in data if item.get('id') == product_id), None)
    
    if product:
        return create_response(success=True, data=product)
    else:
        return create_response(
            success=False,
            message=f"Product with ID {product_id} not found",
            status_code=404
        )

@app.route('/api/products', methods=['POST'])
def create_product():
    """Create new product"""
    try:
        data = load_json_data()
        new_product = request.get_json()
        
        if not new_product:
            return create_response(
                success=False,
                message="Request body must contain JSON data",
                status_code=400
            )
        
        # Validate required fields
        required_fields = ['name', 'price']
        missing_fields = [field for field in required_fields if field not in new_product]
        if missing_fields:
            return create_response(
                success=False,
                message=f"Missing required fields: {', '.join(missing_fields)}",
                status_code=400
            )
        
        # Generate new ID
        if data:
            new_id = max(item.get('id', 0) for item in data) + 1
        else:
            new_id = 1
        
        # Set default values
        new_product['id'] = new_id
        new_product['created_at'] = datetime.now().isoformat()
        new_product.setdefault('stock', 0)
        new_product.setdefault('tags', [])
        
        data.append(new_product)
        
        if save_json_data(data):
            return create_response(
                success=True,
                data=new_product,
                message="Product created successfully",
                status_code=201
            )
        else:
            return create_response(
                success=False,
                message="Failed to save product to database",
                status_code=500
            )
    
    except Exception as e:
        return create_response(
            success=False,
            message=f"Error creating product: {str(e)}",
            status_code=500
        )

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update existing product"""
    try:
        data = load_json_data()
        product_index = next((i for i, item in enumerate(data) if item.get('id') == product_id), None)
        
        if product_index is None:
            return create_response(
                success=False,
                message=f"Product with ID {product_id} not found",
                status_code=404
            )
        
        update_data = request.get_json()
        if not update_data:
            return create_response(
                success=False,
                message="Request body must contain JSON data",
                status_code=400
            )
        
        # Update product (preserve ID and created_at)
        current_product = data[product_index]
        update_data['id'] = product_id
        update_data['created_at'] = current_product.get('created_at')
        update_data['updated_at'] = datetime.now().isoformat()
        
        data[product_index] = update_data
        
        if save_json_data(data):
            return create_response(
                success=True,
                data=update_data,
                message="Product updated successfully"
            )
        else:
            return create_response(
                success=False,
                message="Failed to save updated product",
                status_code=500
            )
    
    except Exception as e:
        return create_response(
            success=False,
            message=f"Error updating product: {str(e)}",
            status_code=500
        )

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete product by ID"""
    try:
        data = load_json_data()
        product_index = next((i for i, item in enumerate(data) if item.get('id') == product_id), None)
        
        if product_index is None:
            return create_response(
                success=False,
                message=f"Product with ID {product_id} not found",
                status_code=404
            )
        
        deleted_product = data.pop(product_index)
        
        if save_json_data(data):
            return create_response(
                success=True,
                data=deleted_product,
                message="Product deleted successfully"
            )
        else:
            return create_response(
                success=False,
                message="Failed to save changes after deletion",
                status_code=500
            )
    
    except Exception as e:
        return create_response(
            success=False,
            message=f"Error deleting product: {str(e)}",
            status_code=500
        )

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all unique categories with counts"""
    data = load_json_data()
    categories = {}
    
    for item in data:
        category = item.get('category', 'uncategorized')
        categories[category] = categories.get(category, 0) + 1
    
    category_list = [
        {'name': name, 'count': count} 
        for name, count in sorted(categories.items())
    ]
    
    return create_response(
        success=True,
        data=category_list,
        count=len(category_list)
    )

@app.route('/api/brands', methods=['GET'])
def get_brands():
    """Get all unique brands with counts"""
    data = load_json_data()
    brands = {}
    
    for item in data:
        brand = item.get('brand', 'unknown')
        brands[brand] = brands.get(brand, 0) + 1
    
    brand_list = [
        {'name': name, 'count': count} 
        for name, count in sorted(brands.items())
    ]
    
    return create_response(
        success=True,
        data=brand_list,
        count=len(brand_list)
    )

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    data = load_json_data()
    
    if not data:
        return create_response(
            success=True,
            data={
                'total_products': 0,
                'categories': 0,
                'brands': 0,
                'in_stock': 0,
                'out_of_stock': 0,
                'total_value': 0,
                'average_price': 0
            }
        )
    
    categories = set(item.get('category', 'uncategorized') for item in data)
    brands = set(item.get('brand', 'unknown') for item in data)
    in_stock = [item for item in data if item.get('stock', 0) > 0]
    out_of_stock = [item for item in data if item.get('stock', 0) == 0]
    
    total_value = sum(item.get('price', 0) * item.get('stock', 0) for item in data)
    average_price = sum(item.get('price', 0) for item in data) / len(data)
    
    stats = {
        'total_products': len(data),
        'categories': len(categories),
        'brands': len(brands),
        'in_stock': len(in_stock),
        'out_of_stock': len(out_of_stock),
        'total_inventory_value': round(total_value, 2),
        'average_price': round(average_price, 2),
        'price_range': {
            'min': min(item.get('price', 0) for item in data),
            'max': max(item.get('price', 0) for item in data)
        }
    }
    
    return create_response(success=True, data=stats)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return create_response(
        success=False,
        message="Endpoint not found",
        status_code=404
    )

@app.errorhandler(405)
def method_not_allowed(error):
    return create_response(
        success=False,
        message="Method not allowed for this endpoint",
        status_code=405
    )

@app.errorhandler(500)
def internal_error(error):
    return create_response(
        success=False,
        message="Internal server error",
        status_code=500
    )

if __name__ == '__main__':
    print(f"🚀 Starting {SERVER_NAME} v{API_VERSION}")
    print(f"📁 JSON data file: {JSON_FILE}")
    
    # Check if JSON file exists
    if not os.path.exists(JSON_FILE):
        print(f"⚠️  Warning: {JSON_FILE} not found. Please ensure the JSON file is in the same directory.")
        print(f"📝 The API will return empty results until you add the JSON file.")
    else:
        data_count = len(load_json_data())
        print(f"✅ Loaded {JSON_FILE} with {data_count} items")
    
    print(f"🌐 API Base URL: http://127.0.0.1:5000")
    print("📋 Available endpoints:")
    print("   GET  /                     - API info")
    print("   GET  /api/products         - Get all products")
    print("   GET  /api/products/{id}    - Get product by ID")
    print("   POST /api/products         - Create product")
    print("   PUT  /api/products/{id}    - Update product")
    print("   DELETE /api/products/{id}  - Delete product")
    print("   GET  /api/categories       - Get categories")
    print("   GET  /api/brands           - Get brands")
    print("   GET  /api/stats            - Get statistics")
    print("=" * 60)
    
    try:
        app.run(
            debug=False,
            host='127.0.0.1',
            port=5000,
            threaded=True
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Try running on a different port")