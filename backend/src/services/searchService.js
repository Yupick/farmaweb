import { getDatabase } from '../config/database.js';

export async function searchProducts(query, filters = {}) {
  try {
    const db = await getDatabase();

    let sql = `SELECT * FROM products WHERE 1=1`;
    const params = [];

    // Búsqueda por nombre o descripción
    if (query) {
      sql += ` AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)`;
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filtrar por categoría
    if (filters.category) {
      sql += ` AND category = ?`;
      params.push(filters.category);
    }

    // Filtrar por rango de precio
    if (filters.minPrice !== undefined) {
      sql += ` AND price >= ?`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      sql += ` AND price <= ?`;
      params.push(filters.maxPrice);
    }

    // Filtrar solo disponibles
    if (filters.available) {
      sql += ` AND stock > 0`;
    }

    // Ordenamiento
    const validSorts = ['price_asc', 'price_desc', 'name', 'newest', 'popular'];
    const sort = filters.sort || 'newest';

    if (sort === 'price_asc') {
      sql += ` ORDER BY price ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY price DESC`;
    } else if (sort === 'name') {
      sql += ` ORDER BY name ASC`;
    } else if (sort === 'popular') {
      sql += ` ORDER BY popularity DESC`;
    } else {
      sql += ` ORDER BY created_at DESC`;
    }

    // Paginación
    const limit = Math.min(filters.limit || 20, 100);
    const offset = ((filters.page || 1) - 1) * limit;

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const results = await db.all(sql, params);

    // Obtener total
    let countSql = `SELECT COUNT(*) as total FROM products WHERE 1=1`;
    const countParams = [];

    if (query) {
      countSql += ` AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)`;
      const searchTerm = `%${query}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.category) {
      countSql += ` AND category = ?`;
      countParams.push(filters.category);
    }

    if (filters.minPrice !== undefined) {
      countSql += ` AND price >= ?`;
      countParams.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      countSql += ` AND price <= ?`;
      countParams.push(filters.maxPrice);
    }

    if (filters.available) {
      countSql += ` AND stock > 0`;
    }

    const countResult = await db.get(countSql, countParams);

    return {
      results: results || [],
      total: countResult?.total || 0,
      page: filters.page || 1,
      limit
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return { results: [], total: 0, error: error.message };
  }
}

export async function getProductById(productId) {
  try {
    const db = await getDatabase();

    const product = await db.get(
      `SELECT * FROM products WHERE id = ?`,
      [productId]
    );

    return product;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function getProductsByCategory(category, limit = 20) {
  try {
    const db = await getDatabase();

    const products = await db.all(
      `SELECT * FROM products WHERE category = ? ORDER BY popularity DESC LIMIT ?`,
      [category, limit]
    );

    return products || [];
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    const db = await getDatabase();

    const products = await db.all(
      `SELECT * FROM products WHERE featured = 1 ORDER BY popularity DESC LIMIT ?`,
      [limit]
    );

    return products || [];
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
}

export async function searchByBrand(brand, limit = 20) {
  try {
    const db = await getDatabase();

    const products = await db.all(
      `SELECT * FROM products WHERE brand LIKE ? ORDER BY name ASC LIMIT ?`,
      [`%${brand}%`, limit]
    );

    return products || [];
  } catch (error) {
    console.error('Error searching by brand:', error);
    return [];
  }
}

export async function getProductCategories() {
  try {
    const db = await getDatabase();

    const categories = await db.all(
      `SELECT DISTINCT category FROM products ORDER BY category ASC`
    );

    return categories.map(c => c.category) || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function incrementProductPopularity(productId) {
  try {
    const db = await getDatabase();

    await db.run(
      `UPDATE products SET popularity = popularity + 1 WHERE id = ?`,
      [productId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error incrementing popularity:', error);
    return { error: error.message };
  }
}

export async function getProductSuggestions(productId, limit = 5) {
  try {
    const db = await getDatabase();

    // Obtener el producto
    const product = await getProductById(productId);
    if (!product) return [];

    // Buscar productos similares (misma categoría, similar precio)
    const suggestions = await db.all(
      `SELECT * FROM products 
       WHERE category = ? AND id != ?
       AND price BETWEEN ? AND ?
       ORDER BY popularity DESC LIMIT ?`,
      [product.category, productId, product.price * 0.5, product.price * 1.5, limit]
    );

    return suggestions || [];
  } catch (error) {
    console.error('Error getting product suggestions:', error);
    return [];
  }
}
