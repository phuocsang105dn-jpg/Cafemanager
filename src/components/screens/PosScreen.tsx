import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { CartItem } from '../../types/cafe';

interface PosScreenProps {
  onOpenCustomizationModal: (item: CartItem) => void;
  onOpenQrModal: () => void;
  onOpenCashModal: () => void;
  onOpenTableSwitchModal: () => void;
}

export const PosScreen: React.FC<PosScreenProps> = ({
  onOpenCustomizationModal,
  onOpenQrModal,
  onOpenCashModal,
  onOpenTableSwitchModal,
}) => {
  const {
    cart,
    addToCart,
    updateCartQty,
    removeCartItem,
    clearCart,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartTotal,
    appliedVoucher,
    applyVoucherCode,
    menuItems,
    activeTable,
    activeShift,
    cashierName,
    showToast,
    completeOrder,
  } = useCafe();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [voucherInput, setVoucherInput] = useState('');
  const [posSearch, setPosSearch] = useState('');

  // Handle voucher submission
  const handleApplyVoucher = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!voucherInput.trim()) {
      showToast('Vui lòng nhập mã voucher', 'info');
      return;
    }
    applyVoucherCode(voucherInput.trim());
    setVoucherInput('');
  };

  // Filter products by category and posSearch
  const filteredProducts = menuItems.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      (selectedCategory === 'coffee' && item.category === 'traditional') ||
      (selectedCategory === 'tea' && (item.category === 'tea' || item.categoryLabel.includes('Trà')));

    const matchesSearch =
      !posSearch ||
      item.name.toLowerCase().includes(posSearch.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(posSearch.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  const handleWalletPayment = () => {
    if (cart.length === 0) {
      showToast('Giỏ hàng đang trống!', 'error');
      return;
    }
    showToast('Đang kết nối tới cổng ví điện tử Momo / ZaloPay / VNPay...');
    setTimeout(() => {
      completeOrder('wallet');
      showToast('Thanh toán Ví Điện Tử thành công! Đang xuất hóa đơn điện tử...');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Bar Stats / Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Shift */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl flex items-center justify-between border border-[#eae8e4]">
          <div>
            <p className="text-[12px] text-[#50443e] uppercase tracking-wider font-medium">Ca làm việc</p>
            <p className="text-[22px] font-bold text-[#311908] mt-1">{activeShift}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#ffdbc7] flex items-center justify-center text-[#2d1605]">
            <span className="material-symbols-outlined text-[24px]">schedule</span>
          </div>
        </div>

        {/* Active Table */}
        <div
          onClick={onOpenTableSwitchModal}
          className="bg-[#f5f3ef] p-6 rounded-2xl flex items-center justify-between border border-[#eae8e4] cursor-pointer hover:border-[#311908] transition-all group"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[12px] text-[#50443e] uppercase tracking-wider font-medium">
                Đơn hàng hiện tại
              </p>
              <span className="material-symbols-outlined text-[14px] text-[#82746d] group-hover:text-[#311908]">
                edit
              </span>
            </div>
            <p className="text-[22px] font-bold text-[#311908] mt-1 truncate">{activeTable}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#ffdcc6] flex items-center justify-center text-[#2d1604] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">table_restaurant</span>
          </div>
        </div>

        {/* Total items */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl flex items-center justify-between border border-[#eae8e4]">
          <div>
            <p className="text-[12px] text-[#50443e] uppercase tracking-wider font-medium">Tổng sản phẩm</p>
            <p className="text-[22px] font-bold text-[#311908] mt-1" id="header-item-count">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} món
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a]">
            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          </div>
        </div>

        {/* Cashier */}
        <div className="bg-[#4a2e1b] p-6 rounded-2xl flex items-center justify-between text-white shadow-xs">
          <div>
            <p className="text-[12px] text-white/80 uppercase tracking-wider font-medium">Thu ngân</p>
            <p className="text-[22px] font-bold text-white mt-1">{cashierName}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#311908] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
        </div>
      </div>

      {/* Main POS Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Menu & Quick Selection (Cols 1-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Search & Category Filters */}
          <div className="bg-[#f5f3ef] p-4 rounded-2xl flex flex-col gap-4 border border-[#eae8e4]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#82746d] text-[20px]">
                search
              </span>
              <input
                className="w-full bg-[#e4e2de]/60 pl-12 pr-4 py-3 rounded-xl border-none outline-none text-[14px] text-[#1b1c1a] placeholder:text-[#82746d] transition-all focus:bg-white focus:ring-1 focus:ring-[#311908]"
                id="menu-search"
                placeholder="Tìm tên món, mã SKU..."
                type="text"
                value={posSearch}
                onChange={(e) => setPosSearch(e.target.value)}
              />
              {posSearch && (
                <button
                  onClick={() => setPosSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#82746d] hover:text-[#1b1c1a]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1" id="category-chips">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'coffee', label: 'Cà phê' },
                { id: 'tea', label: 'Trà sữa & Trà' },
                { id: 'bakery', label: 'Bánh ngọt' },
                { id: 'juice', label: 'Nước ép' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#311908] text-white shadow-xs'
                      : 'bg-[#e4e2de] text-[#50443e] hover:bg-[#eae8e4]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" id="product-grid">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  addToCart({
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    menuItemId: item.id,
                  })
                }
                className="product-card bg-[#f5f3ef] p-3.5 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group relative overflow-hidden border border-[#eae8e4] active:scale-98"
              >
                <div className="w-full h-28 rounded-xl bg-[#e4e2de] bg-cover bg-center mb-3 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#82746d] uppercase font-medium">
                    {item.categoryLabel}
                  </span>
                  <h4 className="text-[15px] font-semibold text-[#1b1c1a] line-clamp-1 mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-[17px] text-[#311908] font-bold mt-1">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      name: item.name,
                      price: item.price,
                      category: item.category,
                      menuItemId: item.id,
                    });
                  }}
                  className="absolute bottom-3.5 right-3.5 w-8 h-8 rounded-full bg-[#311908] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm cursor-pointer"
                  title="Thêm món"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-3 text-center py-12 text-[#82746d] bg-[#f5f3ef] rounded-2xl border border-dashed border-[#d4c3bb]">
                Không tìm thấy món nào với từ khóa "{posSearch}"
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Checkout (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col bg-[#f5f3ef] rounded-2xl p-6 justify-between min-h-[calc(100vh-14rem)] sticky top-28 border border-[#eae8e4] shadow-xs">
          {/* Order Header */}
          <div className="flex flex-col gap-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#311908] text-[22px]">
                  receipt_long
                </span>
                <h3 className="text-[18px] text-[#311908] font-bold">Hóa Đơn Tạm Tính</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[#ba1a1a] hover:bg-[#ffdad6]/50 px-2.5 py-1 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Xóa hết
                </button>
              )}
            </div>

            {/* Order Items Container */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[320px] pr-1" id="order-items-list">
              {cart.map((item) => {
                // Compose options text
                const optList: string[] = [];
                if (item.options?.sugar) optList.push(`Đường ${item.options.sugar}`);
                if (item.options?.ice) optList.push(`Đá ${item.options.ice}`);
                if (item.options?.toppings && item.options.toppings.length > 0) {
                  optList.push(item.options.toppings.join(', '));
                }
                if (item.options?.milk) optList.push(item.options.milk);
                if (item.options?.notes) optList.push(item.options.notes);
                const optionsString = optList.join(' • ');

                return (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white p-3.5 rounded-xl gap-2 border border-[#eae8e4]/80 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <h5 className="text-[14px] font-semibold text-[#1b1c1a]">{item.name}</h5>
                        {optionsString && (
                          <p className="text-[12px] text-[#82746d] mt-0.5 leading-snug">
                            {optionsString}
                          </p>
                        )}
                      </div>
                      <span className="text-[14px] font-bold text-[#311908] shrink-0">
                        {(item.finalPrice * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 bg-[#efeeea] px-2 py-1 rounded-lg">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#e4e2de] text-[#1b1c1a] transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="text-[13px] font-semibold w-6 text-center text-[#1b1c1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#e4e2de] text-[#1b1c1a] transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onOpenCustomizationModal(item)}
                          className="text-[12px] text-[#50443e] hover:text-[#311908] font-medium underline transition-colors cursor-pointer"
                        >
                          Tùy chỉnh
                        </button>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-[12px] text-[#ba1a1a] hover:opacity-80 cursor-pointer"
                          title="Xóa món"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {cart.length === 0 && (
                <div className="text-center py-10 text-[#82746d] text-[14px] bg-white/60 rounded-xl border border-dashed border-[#d4c3bb]">
                  <span className="material-symbols-outlined text-[36px] text-[#82746d]/60 mb-2">
                    shopping_basket
                  </span>
                  <p>Chưa có món nào trong hóa đơn</p>
                  <p className="text-[12px] text-[#82746d] mt-1">
                    Nhấp vào món bên trái để thêm vào đơn
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Voucher & Totals Section */}
          <div className="flex flex-col gap-3.5 pt-3 border-t border-[#eae8e4]">
            {/* Voucher Input */}
            <form onSubmit={handleApplyVoucher} className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#82746d] text-[18px]">
                  local_activity
                </span>
                <input
                  className="w-full bg-[#e4e2de]/60 pl-9 pr-3 py-2.5 rounded-xl border-none outline-none text-[13px] text-[#1b1c1a] placeholder:text-[#82746d] focus:bg-white"
                  placeholder="Nhập mã voucher (VD: CAFE20)"
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-[#e4e2de] hover:bg-[#dbdad6] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#1b1c1a] transition-all cursor-pointer whitespace-nowrap"
              >
                Áp dụng
              </button>
            </form>

            {appliedVoucher && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#ffd1b3]/40 rounded-lg text-[12px] text-[#7a5840]">
                <span>Đang áp dụng voucher: <strong>{appliedVoucher}</strong></span>
                <span className="font-semibold">(-{cartDiscount.toLocaleString('vi-VN')}đ)</span>
              </div>
            )}

            {/* Calculations Box */}
            <div className="flex flex-col gap-1.5 bg-white p-4 rounded-xl border border-[#eae8e4]">
              <div className="flex items-center justify-between text-[13px] text-[#50443e]">
                <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món)</span>
                <span id="subtotal-amount" className="font-medium text-[#1b1c1a]">
                  {cartSubtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-[#50443e]">
                <span>Giảm giá voucher</span>
                <span className="text-[#311908] font-semibold" id="discount-amount">
                  -{cartDiscount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-[#50443e]">
                <span>Thuế VAT (8%)</span>
                <span id="tax-amount" className="font-medium text-[#1b1c1a]">
                  {cartTax.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex items-center justify-between text-[18px] text-[#311908] font-bold pt-2.5 border-t border-[#efeeea]">
                <span>Tổng thanh toán</span>
                <span className="text-[#4a2e1b] font-black" id="total-amount">
                  {cartTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* 3 Prominent Payment Action Buttons */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Tiền mặt */}
              <button
                type="button"
                onClick={onOpenCashModal}
                disabled={cart.length === 0}
                className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#efeeea] rounded-xl text-[#1b1c1a] transition-all group shadow-2xs border border-[#eae8e4] disabled:opacity-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffdcc6] flex items-center justify-center text-[#2d1604] mb-1 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
                <span className="text-[12px] font-semibold">Tiền Mặt</span>
              </button>

              {/* QR chuyển khoản */}
              <button
                type="button"
                onClick={onOpenQrModal}
                disabled={cart.length === 0}
                className="flex flex-col items-center justify-center p-3 bg-[#311908] text-white hover:bg-[#4a2e1b] rounded-xl transition-all group shadow-md disabled:opacity-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffdbd1] text-[#753321] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                </div>
                <span className="text-[12px] font-semibold">QR Chuyển Khoản</span>
              </button>

              {/* Ví điện tử */}
              <button
                type="button"
                onClick={handleWalletPayment}
                disabled={cart.length === 0}
                className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#efeeea] rounded-xl text-[#1b1c1a] transition-all group shadow-2xs border border-[#eae8e4] disabled:opacity-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffd1b3] flex items-center justify-center text-[#7a5840] mb-1 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">
                    account_balance_wallet
                  </span>
                </div>
                <span className="text-[12px] font-semibold">Ví Điện Tử</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
