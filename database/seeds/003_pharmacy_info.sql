-- Seed: Insert default pharmacy information

INSERT OR IGNORE INTO configurations (key, value, group_name, description, data_type)
VALUES
('pharmacy.opening_hours', '{"monday":"08:00-20:00","tuesday":"08:00-20:00","wednesday":"08:00-20:00","thursday":"08:00-20:00","friday":"08:00-20:00","saturday":"09:00-19:00","sunday":"closed"}', 'pharmacy', 'Horarios de funcionamiento', 'json'),
('pharmacy.emergency_phone', '', 'pharmacy', 'Teléfono de emergencia', 'string'),
('pharmacy.whatsapp_number', '', 'pharmacy', 'Número de WhatsApp', 'string'),
('pharmacy.coordinates', '{"lat":-34.6037,"lng":-58.3816}', 'pharmacy', 'Coordenadas GPS', 'json');
