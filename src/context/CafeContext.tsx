import React, { createContext, useContext, useState, useMemo } from 'react';
import { ScreenTab, CartItem, CartItemOption, MenuItem, Order, Ingredient, MarketNews } from '../types/cafe';
import { INITIAL_MENU_ITEMS, INITIAL_INGREDIENTS, INITIAL_ORDERS, INITIAL_MARKET_NEWS } from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CafeContextType {
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cart: CartItem[];
  addToCart: (item: { name: string; price: number; category?: string; options?: CartItemOption; menuItemId?: string }) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeCartItem: (id: string) => void;
  updateCartItemOptions: (id: string, options: CartItemOption) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  cartTotal: number;
  appliedVoucher: string | null;
  applyVoucherCode: (code: string) => boolean;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  completeOrder: (paymentMethod: 'cash' | 'qr' | 'wallet') => Order;
  menuItems: MenuItem[];
  addNewMenuItem: (item: Omit<MenuItem, 'id' | 'soldCount'>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  ingredients: Ingredient[];
  updateIngredientPrice: (id: string, newPrice: number) => void;
  restockIngredient: (id: string, amount: number) => void;
  marketNews: MarketNews[];
  activeTable: string;
  setActiveTable: (t: string) => void;
  activeShift: string;
  setActiveShift: (s: string) => void;
  cashierName: string;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ScreenTab>('tong-quan');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initial cart with 3 items matching screenshot 4 (POS)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-1',
      name: 'Cà Phê Sữa Đá',
      basePrice: 35000,
      finalPrice: 35000,
      quantity: 1,
      category: 'coffee',
      options: {
        sugar: '70%',
        ice: 'Bình thường',
        toppings: ['Trân châu trắng']
      }
    },
    {
      id: 'cart-2',
      name: 'Trà Đào Cam Sả',
      basePrice: 45000,
      finalPrice: 45000,
      quantity: 1,
      category: 'tea',
      options: {
        sugar: '50%',
        ice: 'Ít đá',
        toppings: []
      }
    },
    {
      id: 'cart-3',
      name: 'Croissant Bơ Tỏi',
      basePrice: 32000,
      finalPrice: 32000,
      quantity: 1,
      category: 'bakery',
      options: {
        notes: 'Hâm nóng'
      }
    }
  ]);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [marketNews] = useState<MarketNews[]>(INITIAL_MARKET_NEWS);
  
  const [activeTable, setActiveTable] = useState('Bàn 04 (Mang đi)');
  const [activeShift, setActiveShift] = useState('Ca Sáng (#04)');
  const cashierName = 'Nguyễn Văn A';

  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [voucherDiscountRate, setVoucherDiscountRate] = useState<number>(0);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = ({
    name,
    price,
    category,
    options = {},
    menuItemId
  }: {
    name: string;
    price: number;
    category?: string;
    options?: CartItemOption;
    menuItemId?: string;
  }) => {
    // If exact same item with same options exists, bump qty
    const optionsKey = JSON.stringify(options);
    const existingIndex = cart.findIndex(
      (i) => i.name === name && JSON.stringify(i.options) === optionsKey
    );

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        menuItemId,
        name,
        basePrice: price,
        finalPrice: price,
        quantity: 1,
        options,
        category
      };
      setCart((prev) => [...prev, newItem]);
    }
    showToast(`Đã thêm ${name} vào đơn hàng`);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Đã xóa món khỏi đơn hàng', 'info');
  };

  const updateCartItemOptions = (id: string, options: CartItemOption) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, options } : item))
    );
    showToast('Đã cập nhật tùy chỉnh món');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    setVoucherDiscountRate(0);
    showToast('Đã làm trống hóa đơn', 'info');
  };

  const applyVoucherCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CAFE20') {
      setAppliedVoucher('CAFE20');
      setVoucherDiscountRate(0.2); // 20%
      showToast('Áp dụng thành công mã CAFE20 (-20%)!');
      return true;
    } else if (clean === 'BANVIP' || clean === 'VIP10') {
      setAppliedVoucher(clean);
      setVoucherDiscountRate(0.1); // 10%
      showToast(`Áp dụng thành công mã ${clean} (-10%)!`);
      return true;
    } else if (clean === 'FREESHIP') {
      setAppliedVoucher('FREESHIP');
      setVoucherDiscountRate(0.05); // 5%
      showToast('Áp dụng thành công mã FREESHIP (-5%)!');
      return true;
    } else {
      showToast('Mã voucher không hợp lệ hoặc đã hết hạn!', 'error');
      return false;
    }
  };

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    return Math.round(cartSubtotal * voucherDiscountRate);
  }, [cartSubtotal, voucherDiscountRate]);

  const cartTax = useMemo(() => {
    const taxable = Math.max(0, cartSubtotal - cartDiscount);
    return Math.round(taxable * 0.08); // 8% VAT
  }, [cartSubtotal, cartDiscount]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount + cartTax);
  }, [cartSubtotal, cartDiscount, cartTax]);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Đơn hàng ${orderId} chuyển sang "${status}"`);
  };

  const completeOrder = (paymentMethod: 'cash' | 'qr' | 'wallet'): Order => {
    const codeNum = 9822 + Math.floor(Math.random() * 80);
    const code = `#ORD-${codeNum}`;
    const desc = cart.map((i) => `${i.name} (x${i.quantity})`).join(', ');
    const newOrd: Order = {
      id: `ord-${Date.now()}`,
      code,
      customerName: 'Khách vãng lai (' + activeTable + ')',
      customerAvatarChar: 'K',
      avatarBgClass: 'bg-primary-container text-on-primary-container',
      itemsDescription: desc || 'Món gọi tại quầy',
      items: [...cart],
      totalAmount: cartTotal,
      orderType: activeTable.includes('Mang đi') ? 'Mang đi' : 'Tại quán',
      status: 'Đang pha chế',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      table: activeTable
    };

    setOrders((prev) => [newOrd, ...prev]);
    // clear cart
    setCart([]);
    setAppliedVoucher(null);
    setVoucherDiscountRate(0);

    return newOrd;
  };

  const addNewMenuItem = (item: Omit<MenuItem, 'id' | 'soldCount'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      soldCount: 0
    };
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`Đã thêm món "${item.name}" vào thực đơn!`);
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find((m) => m.id === id);
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    showToast(`Đã xóa món ${item?.name || ''}`, 'info');
  };

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
      )
    );
  };

  const updateIngredientPrice = (id: string, newPrice: number) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === id) {
          const prevP = ing.currentPrice;
          const pct = Number((((newPrice - prevP) / prevP) * 100).toFixed(1));
          return {
            ...ing,
            previousPrice: prevP,
            currentPrice: newPrice,
            changePercent: pct,
            history4Weeks: [...ing.history4Weeks.slice(1), newPrice]
          };
        }
        return ing;
      })
    );
    showToast('Đã cập nhật giá nguyên liệu thành công');
  };

  const restockIngredient = (id: string, amount: number) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === id) {
          const newStock = ing.stockAmount + amount;
          return {
            ...ing,
            stockAmount: newStock,
            stockSeverity: newStock > 20 ? 'normal' : 'warning',
            stockStatusText: `Đã nhập thêm ${amount} ${ing.stockUnit}`
          };
        }
        return ing;
      })
    );
    showToast(`Đã tạo phiếu nhập kho thành công!`);
  };

  return (
    <CafeContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQty,
        removeCartItem,
        updateCartItemOptions,
        clearCart,
        cartSubtotal,
        cartTax,
        cartDiscount,
        cartTotal,
        appliedVoucher,
        applyVoucherCode,
        orders,
        updateOrderStatus,
        completeOrder,
        menuItems,
        addNewMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        ingredients,
        updateIngredientPrice,
        restockIngredient,
        marketNews,
        activeTable,
        setActiveTable,
        activeShift,
        setActiveShift,
        cashierName,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
