import * as contentService from '../services/contentService.js';

export async function getPublicContent(req, res) {
  try {
    const content = await contentService.getPublicContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getContentById(req, res) {
  try {
    const { id } = req.params;
    const content = await contentService.getContentById(id);
    res.json(content);
  } catch (error) {
    if (error.message === 'Contenido no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function getContentByType(req, res) {
  try {
    const { type } = req.params;
    const content = await contentService.getContentByType(type);
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPageBySlug(req, res) {
  try {
    const { slug } = req.params;
    const page = await contentService.getPageBySlug(slug);
    res.json(page);
  } catch (error) {
    if (error.message === 'Página no encontrada') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function createContent(req, res) {
  try {
    const { type, title, description, imageUrl, data, position } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Tipo de contenido requerido' });
    }

    const content = await contentService.createContent(type, title, description, imageUrl, data, position);
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateContent(req, res) {
  try {
    const { id } = req.params;
    const content = await contentService.updateContent(id, req.body);
    res.json(content);
  } catch (error) {
    if (error.message === 'Contenido no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function deleteContent(req, res) {
  try {
    const { id } = req.params;
    await contentService.deleteContent(id);
    res.json({ message: 'Contenido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
