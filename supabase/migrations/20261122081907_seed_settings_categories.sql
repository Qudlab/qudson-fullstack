/*
# Seed categories, website settings and demo testimonials

1. Data
- Inserts the full watch category list from the business plan (men, women, luxury, casual, sports, digital,
  smartwatches, classic, automatic, mechanical, leather, stainless steel, gold, couple, unisex, others).
- Inserts default website settings: hero banner content, promotional messages, business contact details
  (WhatsApp 08168032686), delivery/returns info defaults and newsletter copy.
- Inserts two approved sample testimonials so the homepage section is not empty on launch.

2. Notes
- All inserts are idempotent (ON CONFLICT DO NOTHING). Category slugs are stable identifiers used by the app.
- No demo products are seeded: the owner adds real products through the admin dashboard.
- The `owner_setup_token` is intentionally NOT set here; the /admin setup page triggers the edge function that
  creates a short-lived token, so it never lives in source code.
*/

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Men''s Watches', 'mens', 'Timepieces crafted for the modern gentleman', 10),
  ('Women''s Watches', 'womens', 'Elegant watches designed for her', 20),
  ('Luxury Watches', 'luxury', 'Exceptional timepieces for extraordinary moments', 30),
  ('Casual Watches', 'casual', 'Effortless everyday style', 40),
  ('Sports Watches', 'sports', 'Built for performance and endurance', 50),
  ('Digital Watches', 'digital', 'Precise digital timekeeping', 60),
  ('Smartwatches', 'smartwatches', 'Connected watches for modern life', 70),
  ('Classic Watches', 'classic', 'Timeless designs that never go out of style', 80),
  ('Automatic Watches', 'automatic', 'Self-winding mechanical precision', 90),
  ('Mechanical Watches', 'mechanical', 'Handcrafted mechanical movements', 100),
  ('Leather Strap Watches', 'leather-strap', 'Genuine leather straps, refined comfort', 110),
  ('Stainless Steel Watches', 'stainless-steel', 'Durable, polished stainless steel', 120),
  ('Gold Watches', 'gold', 'The warmth and prestige of gold', 130),
  ('Couple Watches', 'couple', 'Matching pairs for two', 140),
  ('Unisex Watches', 'unisex', 'Designed for everyone', 150),
  ('Other Watches', 'other', 'Unique timepieces beyond category', 160)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO website_settings (key, value) VALUES
  ('hero', '{"heading": "TIMELESS ELEGANCE. DEFINING STYLE.", "subheading": "Discover curated luxury timepieces that define who you are. Authentic watches, honest prices, delivered across Nigeria.", "cta_primary": "Shop Now", "cta_secondary": "Explore Collections", "background_image": ""}'),
  ('promo_banner', '{"enabled": true, "message": "Complimentary nationwide delivery on orders above ₦150,000"}'),
  ('business', '{"name": "QU[D]SON COLLECTION", "tagline": "TIMELESS ELEGANCE. DEFINING STYLE.", "whatsapp": "2348168032686", "whatsapp_display": "08168032686", "email": "orders@qudsoncollection.com", "address": "Lagos, Nigeria", "instagram": "", "facebook": "", "twitter": "", "tiktok": ""}'),
  ('delivery_info', '{"heading": "Delivery Information", "items": [{"title": "Nationwide Delivery", "text": "We deliver to every state in Nigeria through trusted courier partners."}, {"title": "Delivery Time", "text": "Lagos: 1-2 business days. Other states: 2-5 business days."}, {"title": "Delivery Fee", "text": "Fees depend on your location and are confirmed on WhatsApp before payment."}, {"title": "Order Tracking", "text": "Your order reference lets us track your delivery at any time."}]}'),
  ('returns_policy', '{"heading": "Returns & Exchange Policy", "content": "We accept returns within 7 days of delivery if the watch is unused, in its original packaging and with all tags attached. To request a return or exchange, contact us on WhatsApp with your order reference. Faulty items are replaced free of charge. Custom-engraved and final-sale items cannot be returned."}'),
  ('faq', '{"items": [{"q": "Are your watches authentic?", "a": "Yes. Every watch we sell is sourced from trusted suppliers and verified by our team before it reaches you."}, {"q": "How do I place an order?", "a": "Add watches to your cart, proceed to checkout and confirm on WhatsApp. Our team sends payment instructions and confirms your order."}, {"q": "How do I pay?", "a": "We send secure bank transfer or mobile payment details on WhatsApp after you place your order. We never ask for card details online."}, {"q": "Can I change my order?", "a": "Yes, as long as it has not shipped. Message us on WhatsApp with your order reference and we will help."}, {"q": "Do you offer warranty?", "a": "All watches carry a 6-month warranty covering manufacturing defects."}, {"q": "Do watches come with a box?", "a": "Yes, every watch ships in its branded presentation box."}]}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO testimonials (customer_name, location, content, rating, approved)
VALUES
  ('Adebayo O.', 'Lagos', 'The watch arrived in beautiful packaging and looks even better in person. Qudson Collection treated me like a VIP from order to delivery.', 5, true),
  ('Chiamaka N.', 'Abuja', 'I was worried about buying a watch online, but the team sent photos on WhatsApp before delivery. Genuine product, smooth process. Highly recommended.', 5, true);