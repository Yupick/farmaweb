import express from 'express';
import * as searchController from '../controllers/searchController.js';

const router = express.Router();

// Buscar productos
router.get('/products', searchController.searchProducts);

// Obtener producto por ID
router.get('/products/:id', searchController.getProductById);

// Obtener productos por categoría
router.get('/category/:category', searchController.getProductsByCategory);

// Obtener productos destacados
router.get('/featured', searchController.getFeaturedProducts);

// Buscar por marca
router.get('/brand', searchController.searchByBrand);

// Obtener categorías
router.get('/categories', searchController.getProductCategories);

// Obtener sugerencias de productos relacionados
router.get('/suggestions/:id', searchController.getProductSuggestions);

export default router;
