
-- Customers table: only created when a purchase happens
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  payment_method TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- RLS: public insert (no auth required for storefront purchases)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on customers" ON public.customers FOR SELECT USING (true);

CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on order_items" ON public.order_items FOR SELECT USING (true);
