import React from 'react';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          <div className="w-12 h-12 rounded-2xl bg-[#311908] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">menu_book</span>
          </div>
          <div>
            <h3 className="text-[19px] font-bold text-[#311908]">Công Thức Chuẩn (Top #1)</h3>
            <p className="text-[13px] text-[#50443e]">Cà Phê Sữa Đá Sài Gòn (Đã bán 56 ly/ngày)</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-[13px] text-[#1b1c1a]">
          <div className="bg-[#f5f3ef] p-4 rounded-xl border border-[#eae8e4] flex flex-col gap-2">
            <span className="font-semibold text-[#311908]">Thành phần định lượng tiêu chuẩn:</span>
            <ul className="list-disc list-inside space-y-1 text-[#50443e]">
              <li>25g Cà phê hạt Robusta Đắk Lắk (Xay mịn vừa)</li>
              <li>30ml Sữa đặc Ngôi Sao Phương Nam</li>
              <li>15ml Sữa tươi thanh trùng không đường</li>
              <li>Đá bi tinh khiết đầy ly 350ml</li>
            </ul>
          </div>

          <div className="bg-[#fbf9f5] p-4 rounded-xl border border-[#eae8e4] flex flex-col gap-2">
            <span className="font-semibold text-[#311908]">Quy trình pha chế (SOP):</span>
            <ol className="list-decimal list-inside space-y-1 text-[#50443e]">
              <li>Chiết xuất 50ml espresso đậm đà bằng máy hoặc phin ủ 4 phút.</li>
              <li>Khuấy đều sữa đặc với cốt cà phê nóng để dậy mùi thơm béo.</li>
              <li>Tạo bọt nhẹ bề mặt bằng cây khuấy lò xo.</li>
              <li>Đổ vào ly đá, rót nhẹ sữa tươi lên trên tạo tầng màu bắt mắt.</li>
            </ol>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[14px] font-semibold cursor-pointer"
        >
          Đã hiểu & Áp dụng
        </button>
      </div>
    </div>
  );
};
