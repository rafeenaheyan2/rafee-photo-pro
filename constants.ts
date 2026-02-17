
import { ClothingOption } from './types';

export const CLOTHING_OPTIONS: ClothingOption[] = [
  // Male Options
  {
    id: 'm1',
    name: 'Blue Suit',
    thumbnail: 'https://images.unsplash.com/photo-1594932224010-72019460953a?q=80&w=200&auto=format&fit=crop',
    prompt: 'professional and sharp formal navy blue suit for a man, high quality, realistic fabric',
    gender: 'male'
  },
  {
    id: 'm2',
    name: 'Black Suit',
    thumbnail: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=200&auto=format&fit=crop',
    prompt: 'sophisticated formal black tuxedo or charcoal black business suit, high quality',
    gender: 'male'
  },
  {
    id: 'm8',
    name: 'White Panjabi',
    thumbnail: 'https://images.unsplash.com/photo-1621252110599-43c220f18838?q=80&w=200&auto=format&fit=crop',
    prompt: 'traditional formal elegant white cotton Panjabi with subtle embroidery, high quality',
    gender: 'male'
  },
  {
    id: 'm11',
    name: 'Red Panjabi',
    thumbnail: 'https://images.unsplash.com/photo-1599032906816-f894ee11c88d?q=80&w=200&auto=format&fit=crop',
    prompt: 'premium vibrant red silk Panjabi with elegant gold buttons, traditional formal attire',
    gender: 'male'
  },
  {
    id: 'm3',
    name: 'White Shirt',
    thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=200&auto=format&fit=crop',
    prompt: 'crisp, clean formal white dress shirt, well-ironed, realistic business look',
    gender: 'male'
  },

  // Female Options
  {
    id: 'f1',
    name: 'Grey Suit',
    thumbnail: 'https://images.unsplash.com/photo-1485231183945-3dec43551286?q=80&w=200&auto=format&fit=crop',
    prompt: 'tailored professional women\'s charcoal grey business suit with formal silk blouse',
    gender: 'female'
  },
  {
    id: 'f5',
    name: 'Jamdani Saree',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop',
    prompt: 'elegant traditional formal jamdani saree with sophisticated patterns, professional look',
    gender: 'female'
  },
  {
    id: 'f11',
    name: 'Blue Hijab',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    prompt: 'elegant professional royal blue hijab with modest formal corporate attire',
    gender: 'female'
  },
  {
    id: 'f8',
    name: 'Red Saree',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop',
    prompt: 'stunning red traditional silk saree with gold borders, formal professional attire',
    gender: 'female'
  },
  {
    id: 'f6',
    name: 'White Blazer',
    thumbnail: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop',
    prompt: 'crisp tailored white blazer for women, modern high-end professional appearance',
    gender: 'female'
  }
];

export const FILTER_OPTIONS = [
  { id: 'vintage', name: 'Vintage', icon: 'fa-camera-retro', prompt: 'warm vintage 70s film look' },
  { id: 'bw', name: 'B & W', icon: 'fa-mountain-sun', prompt: 'high-contrast professional black and white' },
  { id: 'cinematic', name: 'Cinematic', icon: 'fa-film', prompt: 'modern cinematic color grade, rich contrast' }
];

export const APP_TITLE = "RAFEE PHOTO AI";

export const LOADING_IMAGE_URL = "https://scontent.fspd3-1.fna.fbcdn.net/v/t39.30808-6/481825892_1193101545797632_6618011597576005780_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_eNJjssa5lQQ7kNvwFnAYMZ&_nc_oc=Adn4uj5PNMDq73SR2LVIZ9iT_t7t4zFOr0oL74o3fnFHhROPcNcX_SRAAz1IHcTd02s&_nc_zt=23&_nc_ht=scontent.fspd3-1.fna&_nc_gid=YcQiApikfVYU3HkXhuJuIg&oh=00_Afs1hO6dzrvgLU4juyslRUrPThsacMl0fwjuBxdtlNvrtA&oe=6998C4FC";
