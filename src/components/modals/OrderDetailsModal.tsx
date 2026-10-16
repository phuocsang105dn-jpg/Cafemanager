import React from 'react';
import { Order } from '../../types/cafe';
import { useCafe } from '../../context/CafeContext';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { updateOrderStatus, showToast } = useCafe();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    showToast(`Đang in hóa đơn cho ${order.code}...`);
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdbc7] flex items-center justify-center text-[#2d1605]">
            <span className="material-symbols-outlined text-[24px]">receipt</span>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#311908]">Chi Tiết Đơn {order.code}</h3>
            <p className="text-[13px] text-[#50443e]">
              Khách hàng: <strong>{order.customerName}</strong> • {order.createdAt}
            </p>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#f5f3ef] p-4 rounded-xl border border-[#eae8e4] flex flex-col gap-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#82746d]">Hình thức phục vụ:</span>
              <span className="font-semibold text-[#1b1c1a]">{order.orderType}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#82746d]">Trạng thái hiện tại:</span>
              <span
                className={`font-semibold px-2.5 py-0.5 rounded-full text-[12px] ${
                  order.status === 'Đã xong'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.status === 'Đang pha chế'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-[13px] pt-2 border-t border-[#eae8e4]">
              <span className="text-[#82746d]">Tổng thanh toán:</span>
              <span className="font-bold text-[#311908] text-[16px]">
                {order.totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-[#1b1c1a]">Danh sách món:</span>
            <div className="p-3 bg-[#fbf9f5] rounded-xl border border-[#eae8e4] text-[13px] text-[#50443e]">
              {order.itemsDescription}
            </div>
          </div>

          {/* Quick status change */}
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[13px] font-semibold text-[#1b1c1a]">Chuyển trạng thái đơn:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(order.id, 'Đã xong');
                  onClose();
                }}
                className={`py-2 px-3 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                  order.status === 'Đã xong'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                ✓ Đã hoàn thành
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(order.id, 'Đang pha chế');
                  onClose();
                }}
                className={`py-2 px-3 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                  order.status === 'Đang pha chế'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                ⏳ Đang pha chế
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#eae8e4] flex gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 bg-[#efeeea] hover:bg-[#e4e2de] text-[#1b1c1a] rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              In Bill
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[13px] font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
