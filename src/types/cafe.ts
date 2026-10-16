export type ScreenTab = 'tong-quan' | 'thuc-don' | 'gia-nguyen-lieu' | 'ban-hang-pos';

export interface CartItemOption {
  sugar?: string;
  ice?: string;
  toppings?: string[];
  milk?: string;
  isCustomDrink?: boolean;
  notes?: string;
}

export interface CartItem {
  id: string; // unique id per cart entry
  menuItemId?: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  options: CartItemOption;
  category?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'traditional' | 'coldbrew' | 'tea' | 'bakery' | 'juice';
  categoryLabel: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  soldCount: number;
  sku?: string;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  customerAvatarChar: string;
  avatarBgClass: string;
  itemsDescription: string;
  items: CartItem[];
  totalAmount: number;
  orderType: 'Tại quán' | 'Mang đi' | 'Giao hàng';
  status: 'Đã xong' | 'Đang pha chế' | 'Đã hủy';
  createdAt: string;
  table?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  subName: string;
  category: 'coffee' | 'milk_butter' | 'tea_syrup' | 'other';
  unit: string;
  previousPrice: number;
  currentPrice: number;
  changePercent: number; // e.g. 5.4 or -2.1
  stockAmount: number;
  stockUnit: string;
  stockStatusText: string;
  stockSeverity: 'normal' | 'warning' | 'critical';
  recommendation?: string;
  icon: string;
  iconBgClass: string;
  history4Weeks: number[]; // 4 weeks price history
}

export interface MarketNews {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
}
