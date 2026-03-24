
-- Storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Storage RLS policies
CREATE POLICY "Anyone can view post images" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');
CREATE POLICY "Authenticated users can upload post images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post-images');
CREATE POLICY "Users can delete their own post images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  actor_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('like', 'reply', 'follow', 'message')),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid()))
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid()))
);
CREATE POLICY "Users can update messages in their conversations" ON public.messages FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid()))
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
