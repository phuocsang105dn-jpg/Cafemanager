import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';

interface CashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CashPaymentModal: React.FC<CashPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { cartTotal } = useCafe();
  const [tenderAmount, setTenderAmount] = useState<number>(cartTotal);

  if (!isOpen) return null;

  const changeAmount = Math.max(0, tenderAmount - cartTotal);
  const isSufficient = tenderAmount >= cartTotal;

  const quickDenominations = [
    { label: 'Đúng số tiền', val: cartTotal },
    { label: '50.000đ', val: 50000 },
    { label: '100.000đ', val: 100000 },
    { label: '200.000đ', val: 200000 },
    { label: '500.000đ', val: 500000 },
  ].filter((d) => d.val >= cartTotal || d.label === 'Đúng số tiền');

  return (
    <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200 border border-[#eae8e4]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#efeeea] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdcc6] flex items-center justify-center text-[#2d1604]">
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#311908]">Thanh Toán Tiền Mặt</h3>
            <p className="text-[13px] text-[#50443e]">Nhập tiền khách đưa để tính tiền thối lại</p>
          </div>
        </div>

        {/* Amount due */}
        <div className="bg-[#f5f3ef] p-4 rounded-xl flex items-center justify-between mb-4 border border-[#eae8e4]">
          <span className="text-[14px] text-[#50443e] font-medium">Tổng hóa đơn phải thu:</span>
          <span className="text-[20px] font-extrabold text-[#311908]">
            {cartTotal.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Quick Denomination Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickDenominations.map((d, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTenderAmount(d.val)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                tenderAmount === d.val
                  ? 'bg-[#311908] text-white border-[#311908]'
                  : 'bg-[#efeeea] text-[#1b1c1a] border-[#d4c3bb]/40 hover:bg-[#e4e2de]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Tendered input */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[13px] font-semibold text-[#1b1c1a]">Tiền khách đưa (VNĐ):</label>
          <input
            type="number"
            step="1000"
            className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-3 text-[18px] font-bold text-[#311908] outline-none focus:border-[#311908] focus:bg-white"
            value={tenderAmount}
            onChange={(e) => setTenderAmount(Number(e.target.value) || 0)}
          />
        </div>

        {/* Change breakdown */}
        <div className="bg-[#fbf9f5] p-4 rounded-xl border border-[#eae8e4] mb-6 flex flex-col gap-1.5">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#82746d]">Khách thanh toán:</span>
            <span className="font-semibold text-[#1b1c1a]">
              {tenderAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="flex justify-between text-[15px] pt-1.5 border-t border-[#eae8e4]">
            <span className="font-semibold text-[#1b1c1a]">Tiền thừa thối lại:</span>
            <span
              className={`font-black text-[18px] ${
                isSufficient ? 'text-emerald-700' : 'text-[#ba1a1a]'
              }`}
            >
              {isSufficient
                ? `${changeAmount.toLocaleString('vi-VN')}đ`
                : `Còn thiếu ${(cartTotal - tenderAmount).toLocaleString('vi-VN')}đ`}
            </span>
          </div>
        </div>

        <button
          onClick={onSuccess}
          disabled={!isSufficient}
          className="w-full py-3.5 bg-[#311908] hover:bg-[#4a2e1b] disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold transition-all shadow-md cursor-pointer active:scale-98"
        >
          Hoàn tất thanh toán & In hóa đơn
        </button>
      </div>
    </div>
  );
};
