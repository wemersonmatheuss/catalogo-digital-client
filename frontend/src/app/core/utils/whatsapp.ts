import { environment } from '../../../environments/environment';

export function storeWhatsappPhone(): string {
  return environment.whatsapp.phone.replace(/\D/g, '');
}

export function whatsappUrl(productName?: string, note?: string): string | null {
  const phone = storeWhatsappPhone();
  if (!phone) {
    return null;
  }

  const detail = note ? ` ${note}` : '';
  const text = productName
    ? `Olá! Tenho interesse na peça ${productName}.${detail} Gostaria de saber mais informações.`
    : 'Olá! Gostaria de conhecer as peças disponíveis na Sempre-Viva.';

  return messageUrl(text);
}

export function whatsappMessageUrl(text: string): string | null {
  return storeWhatsappPhone() ? messageUrl(text) : null;
}

function messageUrl(text: string): string {
  return `https://wa.me/${storeWhatsappPhone()}?text=${encodeURIComponent(text)}`;
}

export function formatCartMessage(
  cart: { id: string; items: { productId: string; name: string; price: number; size: string | null; color: string | null }[] },
  customerName?: string,
  paymentMethod?: string,
): string {
  const greeting = customerName ? `Olá, meu nome é *${customerName}*!` : 'Olá!';
  const lines = cart.items.map((item, index) => {
    const options = [item.size, item.color].filter(Boolean).join(' · ');
    const price = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return `${index + 1}. *${item.name}*\n   ID: ${item.productId}${options ? `\n   ${options}` : ''}\n   ${price}`;
  });
  const total = cart.items.reduce((s, i) => s + i.price, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const extras: string[] = [];
  if (paymentMethod) extras.push(`💳 Pagamento preferido: *${paymentMethod}*`);
  extras.push(`💰 Total: *${total}*`);
  return [
    `${greeting} Quero falar sobre o carrinho *${cart.id}*.\n`,
    lines.join('\n\n'),
    '',
    ...extras,
  ].join('\n');
}
