CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    location VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    mfg_date DATE,
    expiry_date DATE NOT NULL,
    batch_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);