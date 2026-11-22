export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discounted_price: number | null;
  brand: string | null;
  category_id: string | null;
  strap_material: string | null;
  case_material: string | null;
  movement: string | null;
  color: string | null;
  size: string | null;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  is_new_arrival: boolean;
  created_at: string;
  updated_at: string;
  categories?: { id: string; name: string; slug: string } | null;
  product_images?: ProductImage[];
};

export type Review = {
  id: string;
  product_id: string | null;
  customer_name: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  location: string | null;
  content: string;
  rating: number;
  approved: boolean;
  created_at: string;
};

export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'awaiting_payment' | 'paid' | 'refunded';

export type Order = {
  id: string;
  reference: string;
  customer_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  delivery_address: string;
  state: string;
  instructions: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type AdminRole = 'owner' | 'product_manager' | 'order_manager';

export type AdminRoleRow = {
  user_id: string;
  role: AdminRole;
  granted_at: string;
  profiles?: { full_name: string } | null;
};

export type AdminInvitation = {
  id: string;
  email: string;
  role: 'product_manager' | 'order_manager';
  token: string;
  accepted: boolean;
  expires_at: string;
  created_at: string;
};

export type InventoryMovement = {
  id: string;
  product_id: string;
  change: number;
  reason: string;
  order_id: string | null;
  created_at: string;
};

export type WebsiteSetting = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  maxQuantity: number;
};

export type HeroSetting = {
  heading: string;
  subheading: string;
  cta_primary: string;
  cta_secondary: string;
  background_image: string;
};

export type PromoBannerSetting = {
  enabled: boolean;
  message: string;
};

export type BusinessSetting = {
  name: string;
  tagline: string;
  whatsapp: string;
  whatsapp_display: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
};

export type DeliveryInfoSetting = {
  heading: string;
  items: { title: string; text: string }[];
};

export type ReturnsPolicySetting = {
  heading: string;
  content: string;
};

export type FaqSetting = {
  items: { q: string; a: string }[];
};
