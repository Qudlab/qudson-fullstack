export const WHATSAPP_NUMBER = '2348168032686';
export const WHATSAPP_DISPLAY = '08168032686';

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function effectivePrice(product: { price: number; discounted_price: number | null }): number {
  return product.discounted_price != null && product.discounted_price < product.price
    ? product.discounted_price
    : product.price;
}

export function discountPercent(product: { price: number; discounted_price: number | null }): number | null {
  if (product.discounted_price == null || product.discounted_price >= product.price) return null;
  return Math.round(((product.price - product.discounted_price) / product.price) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildWhatsAppUrl(message: string, phone: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export type WhatsAppOrderData = {
  reference: string;
  fullName: string;
  phone: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  total: number;
  deliveryAddress: string;
  state: string;
  instructions?: string;
};

export function buildOrderMessage(data: WhatsAppOrderData): string {
  const lines: string[] = [
    'Hello Qudson Collection!',
    '',
    'I would like to place an order.',
    '',
    `Order Reference: ${data.reference}`,
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    '',
  ];

  for (const item of data.items) {
    lines.push(`Product: ${item.name}`);
    lines.push(`Quantity: ${item.quantity}`);
    lines.push(`Price: ${formatNaira(item.unitPrice)}`);
    lines.push('');
  }

  lines.push(`Total: ${formatNaira(data.total)}`);
  lines.push('');
  lines.push(`Delivery Address: ${data.deliveryAddress}, ${data.state}`);

  if (data.instructions) {
    lines.push(`Instructions: ${data.instructions}`);
  }

  lines.push('');
  lines.push('Please send me payment details. Thank you!');

  return lines.join('\n');
}
