import React from 'react';
import { useCafe } from '../../context/CafeContext';

interface QrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QrPaymentModal: React.FC<QrPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { cartTotal, activeTable } = useCafe();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-200 border border-[#eae8e4]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#efeeea] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#ffdbc7] flex items-center justify-center text-[#311908] mb-4 shadow-2xs">
          <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
        </div>

        <h3 className="text-[20px] font-bold text-[#311908] mb-1">Quét Mã Thanh Toán QR</h3>
        <p className="text-[13px] text-[#50443e] mb-5">
          Sử dụng ứng dụng Ngân hàng (VietQR) hoặc Ví điện tử để quét mã
        </p>

        {/* Simulated QR Box */}
        <div className="w-60 h-60 bg-[#efeeea] p-4 rounded-2xl flex flex-col items-center justify-center mb-5 border-4 border-[#311908] shadow-inner relative group">
          <div className="w-full h-full bg-[#fbf9f5] rounded-xl flex items-center justify-center relative overflow-hidden">
            <span className="material-symbols-outlined text-[120px] text-[#311908]">qr_code_2</span>
            {/* Animated scan bar */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-[#ba1a1a] shadow-[0_0_8px_#ba1a1a] animate-[bounce_2s_infinite]"></div>
          </div>
        </div>

        {/* Bank transfer metadata */}
        <div className="flex flex-col gap-2 w-full bg-[#f5f3ef] p-4 rounded-xl mb-6 text-left border border-[#eae8e4]">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#82746d]">Ngân hàng:</span>
            <span className="font-semibold text-[#1b1c1a]">Techcombank (TCB)</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#82746d]">Số tài khoản:</span>
            <span className="font-bold text-[#1b1c1a] font-mono tracking-wider">1903 8888 9999</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#82746d]">Chủ tài khoản:</span>
            <span className="font-semibold text-[#1b1c1a]">CAFE MANAGER Q1</span>
          </div>
          <div className="flex justify-between text-[13px] pt-1 border-t border-[#eae8e4]">
            <span className="text-[#82746d]">Số tiền:</span>
            <span className="font-extrabold text-[#311908] text-[15px]">
              {cartTotal.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#82746d]">Nội dung CK:</span>
            <span className="font-semibold text-[#1b1c1a] font-mono">
              HD{Math.floor(1000 + Math.random() * 9000)} {activeTable.replace(/[^a-zA-Z0-9]/g, '')}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[14px] font-semibold transition-all shadow-md cursor-pointer active:scale-98"
          >
            Xác nhận đã nhận chuyển khoản
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-[13px] text-[#50443e] hover:text-[#1b1c1a] font-medium cursor-pointer"
          >
            Quay lại sửa đơn
          </button>
        </div>
      </div>
    </div>
  );
};
