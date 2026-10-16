import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { MenuItem } from '../../types/cafe';

interface MenuBuilderScreenProps {
  onOpenNewItemModal: () => void;
  onEditItem?: (item: MenuItem) => void;
}

export const MenuBuilderScreen: React.FC<MenuBuilderScreenProps> = ({
  onOpenNewItemModal,
  onEditItem,
}) => {
  const {
    menuItems,
    deleteMenuItem,
    toggleMenuItemAvailability,
    addToCart,
    setActiveTab,
    showToast,
    searchQuery,
  } = useCafe();

  // Category filter for left section
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Custom Drink Builder State
  const [builderBase, setBuilderBase] = useState({ name: 'Espresso', price: 35000 });
  const [builderMilk, setBuilderMilk] = useState({ name: 'Sữa tươi', price: 0 });
  const [builderToppings, setBuilderToppings] = useState<{ name: string; price: number }[]>([]);
  const [builderSugar, setBuilderSugar] = useState('100%');
  const [builderIce, setBuilderIce] = useState('Vừa');

  const baseOptions = [
    { name: 'Espresso', price: 35000, icon: 'coffee' },
    { name: 'Cold Brew', price: 40000, icon: 'water' },
    { name: 'Trà Ô Long', price: 30000, icon: 'eco' },
  ];

  const milkOptions = [
    { name: 'Sữa tươi', price: 0, icon: 'water_drop', labelPrice: 'Miễn phí' },
    { name: 'Sữa yến mạch', price: 12000, icon: 'grain', labelPrice: '+12.000đ' },
    { name: 'Sữa hạnh nhân', price: 15000, icon: 'nutrition', labelPrice: '+15.000đ' },
  ];

  const toppingOptions = [
    { name: 'Trân châu', price: 10000, icon: 'radio_button_checked' },
    { name: 'Thạch cà phê', price: 8000, icon: 'dashboard' },
    { name: 'Kem trứng', price: 15000, icon: 'icecream' },
  ];

  const sugarOptions = ['0%', '30%', '50%', '70%', '100%'];
  const iceOptions = ['Ít đá', 'Vừa', 'Nhiều đá'];

  // Toggle topping
  const handleToggleTopping = (topping: { name: string; price: number }) => {
    if (builderToppings.some((t) => t.name === topping.name)) {
      setBuilderToppings(builderToppings.filter((t) => t.name !== topping.name));
    } else {
      setBuilderToppings([...builderToppings, topping]);
    }
  };

  // Reset builder
  const handleResetBuilder = () => {
    setBuilderBase({ name: 'Espresso', price: 35000 });
    setBuilderMilk({ name: 'Sữa tươi', price: 0 });
    setBuilderToppings([]);
    setBuilderSugar('100%');
    setBuilderIce('Vừa');
    showToast('Đã làm mới công thức pha chế', 'info');
  };

  // Calculate builder total price
  const builderTotal =
    builderBase.price +
    builderMilk.price +
    builderToppings.reduce((acc, t) => acc + t.price, 0);

  // Add custom drink to cart
  const handleAddCustomDrinkToCart = () => {
    const toppingNames = builderToppings.map((t) => t.name).join(', ');
    const customName = `${builderBase.name} Tùy Phối (${builderMilk.name})`;
    
    addToCart({
      name: customName,
      price: builderTotal,
      category: 'custom',
      options: {
        sugar: builderSugar,
        ice: builderIce,
        toppings: builderToppings.map((t) => t.name),
        milk: builderMilk.name,
        isCustomDrink: true,
        notes: `Cốt: ${builderBase.name} | Sữa: ${builderMilk.name} ${
          toppingNames ? `| Topping: ${toppingNames}` : ''
        }`,
      },
    });

    showToast('Đã thêm món tự phối thành công vào Giỏ Hàng POS!');
  };

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Header / Sub-banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#311908] tracking-tight">
            Quản Lý Thực Đơn & Tự Phối Món
          </h1>
          <p className="text-[14px] text-[#50443e] mt-1">
            Quản lý danh mục sản phẩm hiện có và công cụ phối món theo yêu cầu khách hàng.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewItemModal}
            className="flex items-center gap-2 bg-[#311908] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#4a2e1b] transition-all shadow-sm cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thêm Món Mới
          </button>
        </div>
      </div>

      {/* Main Grid: Left (Catalog), Right (Custom Drink Builder) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Section: Catalog (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-[22px] font-semibold text-[#311908]">Danh Mục Sản Phẩm</h2>
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'traditional', label: 'Cà phê truyền thống' },
                { id: 'coldbrew', label: 'Cold Brew' },
                { id: 'tea', label: 'Trà sữa' },
                { id: 'bakery', label: 'Bánh ngọt' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#311908] text-white shadow-xs'
                      : 'bg-[#eae8e4] text-[#50443e] hover:bg-[#e4e2de]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#f5f3ef] rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-md border border-[#eae8e4] group"
              >
                <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-[#eae8e4]">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback gracefully if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-[#311908]/85 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                    {item.categoryLabel}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-[17px] font-semibold text-[#1b1c1a]">{item.name}</h3>
                    <span className="text-[17px] font-bold text-[#311908]">
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <p className="text-[13px] text-[#50443e] line-clamp-2">{item.description}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#eae8e4]">
                  <button
                    onClick={() => toggleMenuItemAvailability(item.id)}
                    className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      item.isAvailable
                        ? 'text-[#dd866f] bg-[#ffdbd1]/60 hover:bg-[#ffdbd1]'
                        : 'text-[#82746d] bg-[#e4e2de] hover:bg-[#dbdad6]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {item.isAvailable ? 'check_circle' : 'do_not_disturb_on'}
                    </span>
                    {item.isAvailable ? 'Sẵn sàng' : 'Tạm hết'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        addToCart({
                          name: item.name,
                          price: item.price,
                          category: item.category,
                          menuItemId: item.id,
                        })
                      }
                      className="h-8 px-2.5 rounded-lg bg-[#311908] text-white flex items-center justify-center text-[12px] font-medium hover:bg-[#4a2e1b] transition-colors cursor-pointer"
                      title="Thêm vào giỏ POS"
                    >
                      <span className="material-symbols-outlined text-[16px] mr-1">add_shopping_cart</span>
                      Bán món
                    </button>

                    {onEditItem && (
                      <button
                        onClick={() => onEditItem(item)}
                        className="w-8 h-8 rounded-full bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] hover:bg-[#311908] hover:text-white transition-colors cursor-pointer"
                        title="Chỉnh sửa món"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="w-8 h-8 rounded-full bg-[#e4e2de] flex items-center justify-center text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white transition-colors cursor-pointer"
                      title="Xóa món"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredMenuItems.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-[#f5f3ef] rounded-2xl border border-dashed border-[#d4c3bb]">
                <p className="text-[#82746d] text-[14px]">Chưa có món nào trong danh mục này</p>
                <button
                  onClick={onOpenNewItemModal}
                  className="mt-3 px-4 py-2 bg-[#311908] text-white rounded-xl text-[13px] font-medium"
                >
                  Thêm món ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Custom Drink Builder (5 cols) */}
        <div className="xl:col-span-5 bg-[#f5f3ef] rounded-3xl p-6 flex flex-col gap-6 sticky top-28 shadow-xs border border-[#eae8e4]">
          <div className="flex items-center justify-between border-b border-[#eae8e4] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4a2e1b] text-[#bd957c] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[22px]">coffee_maker</span>
              </div>
              <div>
                <h2 className="text-[20px] font-semibold text-[#311908]">Tự Phối Món (Builder)</h2>
                <p className="text-[13px] text-[#50443e]">Tạo công thức tùy chỉnh theo ý khách</p>
              </div>
            </div>
            <button
              onClick={handleResetBuilder}
              className="text-[12px] font-medium text-[#82746d] hover:text-[#311908] cursor-pointer"
            >
              Làm mới
            </button>
          </div>

          {/* Builder Options Form */}
          <div className="flex flex-col gap-5 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
            {/* 1. Chọn Cốt Đồ Uống */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center justify-between">
                <span>
                  1. Chọn Cốt Đồ Uống <span className="text-[#ba1a1a]">*</span>
                </span>
                <span className="text-[12px] text-[#311908] font-medium">
                  {builderBase.name} ({builderBase.price / 1000}k)
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {baseOptions.map((opt) => {
                  const isSelected = builderBase.name === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setBuilderBase({ name: opt.name, price: opt.price })}
                      className={`p-3 rounded-xl border text-[13px] flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4a2e1b] text-white border-[#4a2e1b] shadow-xs'
                          : 'bg-white text-[#1b1c1a] border-[#d4c3bb]/50 hover:bg-[#efeeea]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          isSelected ? 'text-white' : 'text-[#311908]'
                        }`}
                      >
                        {opt.icon}
                      </span>
                      <span className="font-medium">{opt.name}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#82746d]'}`}>
                        {opt.price.toLocaleString('vi-VN')}đ
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Chọn Loại Sữa */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center justify-between">
                <span>2. Chọn Loại Sữa</span>
                <span className="text-[12px] text-[#311908] font-medium">
                  {builderMilk.name} ({builderMilk.price > 0 ? `+${builderMilk.price / 1000}k` : 'Miễn phí'})
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {milkOptions.map((opt) => {
                  const isSelected = builderMilk.name === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setBuilderMilk({ name: opt.name, price: opt.price })}
                      className={`p-3 rounded-xl border text-[13px] flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4a2e1b] text-white border-[#4a2e1b] shadow-xs'
                          : 'bg-white text-[#1b1c1a] border-[#d4c3bb]/50 hover:bg-[#efeeea]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          isSelected ? 'text-white' : 'text-[#311908]'
                        }`}
                      >
                        {opt.icon}
                      </span>
                      <span className="font-medium">{opt.name}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#82746d]'}`}>
                        {opt.labelPrice}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Chọn Topping */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center justify-between">
                <span>3. Chọn Topping (Có thể chọn nhiều)</span>
                <span className="text-[12px] text-[#311908] font-medium">
                  {builderToppings.length} đã chọn
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {toppingOptions.map((opt) => {
                  const isSelected = builderToppings.some((t) => t.name === opt.name);
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => handleToggleTopping({ name: opt.name, price: opt.price })}
                      className={`p-3 rounded-xl border text-[13px] flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4a2e1b] text-white border-[#4a2e1b] shadow-xs'
                          : 'bg-white text-[#1b1c1a] border-[#d4c3bb]/50 hover:bg-[#efeeea]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          isSelected ? 'text-white' : 'text-[#311908]'
                        }`}
                      >
                        {opt.icon}
                      </span>
                      <span className="font-medium">{opt.name}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#82746d]'}`}>
                        +{opt.price.toLocaleString('vi-VN')}đ
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Mức Đường */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#1b1c1a]">4. Mức Đường</label>
              <div className="grid grid-cols-5 gap-1.5">
                {sugarOptions.map((sugar) => {
                  const isSelected = builderSugar === sugar;
                  return (
                    <button
                      key={sugar}
                      type="button"
                      onClick={() => setBuilderSugar(sugar)}
                      className={`py-2 px-1 rounded-xl border text-[13px] text-center font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#311908] text-white border-[#311908]'
                          : 'bg-white text-[#1b1c1a] border-[#d4c3bb]/50 hover:bg-[#efeeea]'
                      }`}
                    >
                      {sugar}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Mức Đá */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#1b1c1a]">5. Mức Đá</label>
              <div className="grid grid-cols-3 gap-2">
                {iceOptions.map((ice) => {
                  const isSelected = builderIce === ice;
                  return (
                    <button
                      key={ice}
                      type="button"
                      onClick={() => setBuilderIce(ice)}
                      className={`py-2 px-2 rounded-xl border text-[13px] text-center font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#311908] text-white border-[#311908]'
                          : 'bg-white text-[#1b1c1a] border-[#d4c3bb]/50 hover:bg-[#efeeea]'
                      }`}
                    >
                      {ice}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer total & POS Add Action */}
          <div className="pt-4 border-t border-[#eae8e4] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#50443e]">Tổng thành tiền:</span>
              <span className="text-[26px] font-bold text-[#311908]">
                {builderTotal.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleAddCustomDrinkToCart}
                className="w-full flex items-center justify-center gap-2 bg-[#311908] text-white py-3.5 rounded-full text-[14px] font-semibold hover:bg-[#4a2e1b] transition-all shadow-md cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                Thêm Vào Giỏ Hàng POS
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAddCustomDrinkToCart();
                  setActiveTab('ban-hang-pos');
                }}
                className="w-full text-center text-[12px] text-[#50443e] hover:text-[#311908] font-medium cursor-pointer"
              >
                Thêm và chuyển sang màn hình POS →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
