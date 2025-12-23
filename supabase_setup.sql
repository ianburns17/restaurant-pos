CREATE TABLE menu (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu (name, price, category, image_url) VALUES
('Wings', 15.00, 'Food', NULL),
('Fingers', 15.00, 'Food', NULL),
('Peppers', 3.00, 'Food', NULL),
('Guinness', 6.00, 'Beer', NULL),
('Smirnoff', 7.00, 'Spirits', NULL),
('Landshark', 6.00, 'Beer', NULL),
('Lighthouse', 5.00, 'Beer', NULL),
('Beer', 5.00, 'Beer', NULL),
('Heineken', 7.00, 'Beer', NULL),
('Stout', 5.00, 'Beer', NULL),
('Shot', 10.00, 'Spirits', NULL),
('Margarita', 12.00, 'Cocktails', NULL),
('Rum & Coke', 5.00, 'Cocktails', NULL),
('Vodka', 8.00, 'Spirits', NULL);