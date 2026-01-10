-- Seed: Insert default configuration values

INSERT OR IGNORE INTO configurations (key, value, group_name, description, data_type) 
VALUES 
('app.version', '1.0.0', 'app', 'Versión actual de la aplicación', 'string'),
('app.name', 'Farmacia Científica Malvinas', 'app', 'Nombre de la aplicación', 'string'),
('app.maintenance_mode', 'false', 'app', 'Modo mantenimiento activo', 'boolean');
