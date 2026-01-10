import * as configService from '../services/configService.js';

export async function getConfigurations(req, res) {
  try {
    const configs = await configService.getAllConfigurations();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getConfiguration(req, res) {
  try {
    const { key } = req.params;
    const config = await configService.getConfigurationByKey(key);
    
    if (!config) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateConfiguration(req, res) {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: 'Valor requerido' });
    }

    const config = await configService.updateConfiguration(key, value);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
