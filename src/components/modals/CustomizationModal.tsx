import React, { useState, useEffect } from 'react';
import { CartItem } from '../../types/cafe';
import { useCafe } from '../../context/CafeContext';

interface CustomizationModalProps {
  item: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { updateCartItemOptions } = useCafe();

  const [selectedSugar, setSelectedSugar] = useState('70%');
  const [selectedIce, setSelectedIce] = useState('Bình thường');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setSelectedSugar(item.options?.sugar || '70%');
      setSelectedIce(item.options?.ice || 'Bình thường');
      setSelectedToppings(item.options?.toppings || []);
      setNotes(item.options?.notes || '');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const toppingList = [
    { name: 'Trân châu trắng (+10.000đ)', value: 'Trân châu trắng' },
    { name: 'Thạch cà phê (+8.000đ)', value: 'Thạch cà phê' },
    { name: 'Kem trứng macchiato (+15.000đ)', value: 'Kem trứng macchiato' },
  ];

  const handleToggleTopping = (val: string) => {
    if (selectedToppings.includes(val)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== val));
    } else {
      setSelectedToppings([...selectedToppings, val]);
    }
  };

  const handleSave = () => {
    updateCartItemOptions(item.id, {
      ...item.options,
      sugar: selectedSugar,
      ice: selectedIce,
      toppings: selectedToppings,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200 border border-[#eae8e4]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#efeeea] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdbc7] flex items-center justify-center text-[#311908]">
            <span className="material-symbols-outlined text-[24px]">tune</span>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#311908]">Tùy chỉnh: {item.name}</h3>
            <p className="text-[13px] text-[#50443e]">Chọn mức đường, đá và topping theo yêu cầu</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-h-[420px] overflow-y-auto pr-1">
          {/* Sugar Option */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[#1b1c1a]">Lượng Đường</label>
            <div className="grid grid-cols-4 gap-2">
              {['100%', '70%', '50%', '30%'].map((sugar) => (
                <button
                  key={sugar}
                  type="button"
                  onClick={() => setSelectedSugar(sugar)}
                  className={`py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                    selectedSugar === sugar
                      ? 'bg-[#311908] text-white shadow-xs'
                      : 'bg-[#efeeea] text-[#50443e] hover:bg-[#e4e2de]'
                  }`}
                >
                  {sugar}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Option */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[#1b1c1a]">Lượng Đá</label>
            <div className="grid grid-cols-3 gap-2">
              {['Bình thường', 'Ít đá', 'Không đá'].map((ice) => (
                <button
                  key={ice}
                  type="button"
                  onClick={() => setSelectedIce(ice)}
                  className={`py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                    selectedIce === ice
                      ? 'bg-[#311908] text-white shadow-xs'
                      : 'bg-[#efeeea] text-[#50443e] hover:bg-[#e4e2de]'
                  }`}
                >
                  {ice}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[#1b1c1a]">Topping Thêm</label>
            <div className="flex flex-col gap-2">
              {toppingList.map((top) => {
                const isChecked = selectedToppings.includes(top.value);
                return (
                  <label
                    key={top.value}
                    onClick={() => handleToggleTopping(top.value)}
                    className="flex items-center justify-between p-3 bg-[#f5f3ef] rounded-xl cursor-pointer hover:bg-[#efeeea] transition-all border border-[#eae8e4]"
                  >
                    <span className="text-[13px] font-medium text-[#1b1c1a]">{top.name}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-5 h-5 rounded text-[#311908] accent-[#311908] cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Notes (e.g. bakery warm up) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">Ghi chú cho Barista / Bếp</label>
            <input
              type="text"
              placeholder="VD: Hâm nóng bánh, ít ngọt..."
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-3.5 py-2 text-[13px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-5 mt-4 border-t border-[#eae8e4] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-[#efeeea] hover:bg-[#e4e2de] text-[#1b1c1a] rounded-xl text-[14px] font-semibold transition-all cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[14px] font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            Lưu tùy chỉnh
          </button>
        </div>
      </div>
    </div>
  );
};
