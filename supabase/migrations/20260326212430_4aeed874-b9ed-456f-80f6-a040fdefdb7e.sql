
-- Marketplace listings (usernames & posts for sale)
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('username', 'post')),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  username_for_sale TEXT,
  price_sol NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Completed transactions
CREATE TABLE public.marketplace_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  type TEXT NOT NULL,
  amount_sol NUMERIC NOT NULL,
  tx_signature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tips on posts
CREATE TABLE public.tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  tipper_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  amount_sol NUMERIC NOT NULL,
  tx_signature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

-- Listings: anyone can view active, sellers can manage
CREATE POLICY "Anyone can view listings" ON public.marketplace_listings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Sellers can create listings" ON public.marketplace_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings" ON public.marketplace_listings FOR UPDATE TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own listings" ON public.marketplace_listings FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- Transactions: participants can view
CREATE POLICY "Users can view own transactions" ON public.marketplace_transactions FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create transactions" ON public.marketplace_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- Tips: anyone can view, tippers can create
CREATE POLICY "Anyone can view tips" ON public.tips FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can tip" ON public.tips FOR INSERT TO authenticated WITH CHECK (auth.uid() = tipper_id);

-- Add wallet_address to profiles for receiving payments
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT DEFAULT NULL;
