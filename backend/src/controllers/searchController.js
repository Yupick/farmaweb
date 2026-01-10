import * as searchService from '../services/searchService.js';

export async function searchProducts(req, res) {
  try {
    const { q } = req.query;
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      available: req.query.available === 'true',
      sort: req.query.sort,
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 20
    };

    const results = await searchService.searchProducts(q, filters);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await searchService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Incrementar popularidad
    await searchService.incrementProductPopularity(id);

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const limit = req.query.limit || 20;

    const products = await searchService.getProductsByCategory(category, limit);

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getFeaturedProducts(req, res) {
  try {
    const limit = req.query.limit || 6;

    const products = await searchService.getFeaturedProducts(limit);

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function searchByBrand(req, res) {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({ error: 'Marca requerida' });
    }

    const products = await searchService.searchByBrand(brand);

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProductCategories(req, res) {
  try {
    const categories = await searchService.getProductCategories();

    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProductSuggestions(req, res) {
  try {
    const { id } = req.params;
    const limit = req.query.limit || 5;

    const suggestions = await searchService.getProductSuggestions(id, limit);

    res.json({ data: suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
