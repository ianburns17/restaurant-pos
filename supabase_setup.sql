-- Supabase Setup for Restaurant POS System
-- Created: 2025-12-23 22:43:22 UTC

-- Enable UUID and JSONB extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    available BOOLEAN DEFAULT true,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table with JSONB column for storing items
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    items JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Create JSONB index for faster queries on items column
CREATE INDEX idx_orders_items ON orders USING GIN (items);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for menu_items (anyone can read, authenticated users can modify)
CREATE POLICY "Allow public read on menu_items" ON menu_items
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert menu_items" ON menu_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update menu_items" ON menu_items
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete menu_items" ON menu_items
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for orders (anyone can create, authenticated users can view/modify)
CREATE POLICY "Allow anyone to insert orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update orders" ON orders
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete orders" ON orders
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for menu_items (optional)
INSERT INTO menu_items (name, description, price, category, available) VALUES
    ('Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 12.99, 'Pizza', true),
    ('Pepperoni Pizza', 'Pizza topped with pepperoni and cheese', 14.99, 'Pizza', true),
    ('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 8.99, 'Salads', true),
    ('Grilled Chicken Sandwich', 'Juicy grilled chicken on a fresh bun', 11.99, 'Sandwiches', true),
    ('Iced Tea', 'Refreshing iced tea', 2.99, 'Beverages', true),
    ('Tiramisu', 'Classic Italian dessert', 7.99, 'Desserts', true)
ON CONFLICT DO NOTHING;
