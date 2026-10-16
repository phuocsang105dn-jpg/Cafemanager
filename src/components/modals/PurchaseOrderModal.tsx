import React, { useState, useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIngredientId?: string;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  defaultIngredientId,
}) => {
  const { ingredients, restockIngredient, showToast } = useCafe();

  const [selectedIngId, setSelectedIngId] = useState<string>(
    defaultIngredientId || ingredients[1]?.id || ingredients[0]?.id
  );
  const [orderQuantity, setOrderQuantity] = useState<number>(50);
  const [supplierName, setSupplierName] = useState('Nông trại Cầu Đất Farm');
  const [deliveryDate, setDeliveryDate] = useState('Trước Thứ Sáu tuần này');

  useEffect(() => {
    if (defaultIngredientId) {
      setSelectedIngId(defaultIngredientId);
    }
  }, [defaultIngredientId]);

  if (!isOpen) return null;

  const currentIng = ingredients.find((i) => i.id === selectedIngId) || ingredients[0];
  const unitPrice = currentIng?.currentPrice || 0;
  const totalCost = unitPrice * orderQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuantity <= 0) {
      showToast('Vui lòng nhập số lượng nhập hợp lệ!', 'error');
      return;
    }

    restockIngredient(currentIng.id, orderQuantity);
    showToast(
      `Đã tạo đơn nhập hàng: ${orderQuantity} ${currentIng.unit} ${currentIng.name} từ ${supplierName}!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200 border border-[#eae8e4]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#efeeea] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#4a2e1b] text-[#bd957c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#311908]">Tạo Đơn Đặt Hàng Nguyên Liệu</h3>
            <p className="text-[13px] text-[#50443e]">
              Đặt hàng trước biến động giá & đảm bảo dự trữ an toàn
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Select Ingredient */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">Chọn nguyên liệu</label>
            <select
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white cursor-pointer"
              value={selectedIngId}
              onChange={(e) => setSelectedIngId(e.target.value)}
            >
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} ({ing.unit}) - Đang có: {ing.stockAmount} {ing.stockUnit}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                Số lượng đặt ({currentIng.unit})
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[15px] font-bold text-[#311908] outline-none focus:border-[#311908] focus:bg-white"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Math.max(1, Number(e.target.value)))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">Đơn giá nhập hiện tại</label>
              <div className="w-full bg-[#efeeea] border border-[#d4c3bb]/40 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-[#1b1c1a]">
                {unitPrice.toLocaleString('vi-VN')}đ / {currentIng.unit}
              </div>
            </div>
          </div>

          {/* Supplier */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">Nhà cung cấp</label>
            <input
              type="text"
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>

          {/* Estimated Delivery */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">Thời gian giao hàng dự kiến</label>
            <input
              type="text"
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>

          {/* Cost preview card */}
          <div className="bg-[#f5f3ef] p-4 rounded-xl border border-[#eae8e4] flex items-center justify-between mt-2">
            <div>
              <span className="text-[12px] text-[#82746d]">Tổng giá trị đơn hàng dự kiến:</span>
              <p className="text-[20px] font-bold text-[#311908]">
                {totalCost.toLocaleString('vi-VN')} đ
              </p>
            </div>
            <span className="text-[11px] bg-[#ffd1b3] text-[#7a5840] font-semibold px-2.5 py-1 rounded-full">
              Khóa giá tuần này
            </span>
          </div>

          <div className="pt-4 border-t border-[#eae8e4] flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#efeeea] hover:bg-[#e4e2de] text-[#1b1c1a] rounded-xl text-[14px] font-semibold transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[14px] font-semibold transition-all shadow-md cursor-pointer active:scale-98"
            >
              Xác nhận chốt đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
