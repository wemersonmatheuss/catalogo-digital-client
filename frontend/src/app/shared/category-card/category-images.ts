import { Gender } from '../../core/models/catalog.models';

const covers: Record<string, string> = {
  'female-bermuda': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=640&h=800&fit=crop&auto=format',
  'female-calca': 'https://images.pexels.com/photos/3701283/pexels-photo-3701283.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop',
  'female-blusa': 'https://images.unsplash.com/photo-1752825609278-f9696bc9d7bd?w=640&h=800&fit=crop&auto=format',
  'female-intima': 'https://images.pexels.com/photos/27816791/pexels-photo-27816791.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop',
  'female-meia-calca': 'https://images.pexels.com/photos/17350420/pexels-photo-17350420.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop',
  'female-pijama': 'https://images.unsplash.com/photo-1770294758981-484ef12c1815?w=640&h=800&fit=crop&auto=format',
  'male-intimo': 'https://images.pexels.com/photos/17885546/pexels-photo-17885546.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop',
  'male-meia': 'https://images.pexels.com/photos/5746091/pexels-photo-5746091.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop',
  'male-pijama': 'https://images.pexels.com/photos/20364756/pexels-photo-20364756.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop',
  'male-gravata': 'https://images.pexels.com/photos/13593505/pexels-photo-13593505.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop',
  'male-cinto': 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=640&h=800&fit=crop&auto=format',
  'male-bermuda': 'https://images.unsplash.com/photo-1697319452360-ee47502e39f6?w=640&h=800&fit=crop&auto=format',
  'male-calca': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=640&h=800&fit=crop&auto=format',
  'male-camiseta': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=640&h=800&fit=crop&auto=format',
  'male-roupa': 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=640&h=800&fit=crop&auto=format',
  'male-esportiva': 'https://images.unsplash.com/photo-1591741543032-bf439b4fd46c?w=640&h=800&fit=crop&auto=format',
  'male-chapeu': 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=640&h=800&fit=crop&auto=format',
  'male-terno': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=640&h=800&fit=crop&auto=format',
  'male-camisa-social': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=640&h=800&fit=crop&auto=format',
};

const fallback = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=640&h=800&fit=crop&auto=format';

export function categoryCover(gender: Gender, slug: string): string {
  return covers[`${gender}-${slug}`] ?? fallback;
}
