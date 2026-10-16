import React from 'react';
import { useCafe } from '../../context/CafeContext';

interface TableSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableSwitchModal: React.FC<TableSwitchModalProps> = ({ isOpen, onClose }) => {
  const { activeTable, setActiveTable, showToast } = useCafe();

  if (!isOpen) return null;

  const tables = [
    'Bàn 01',
    'Bàn 02',
    'Bàn 03',
    'Bàn 04 (Mang đi)',
    'Bàn 05',
    'Bàn 06',
    'Bàn 07 (VIP)',
    'Bàn 08',
    'Bàn 09',
    'Bàn 10',
    'Bàn 11',
    'Mang đi (Take-away)',
    'Giao hàng (Grab/Shopee)',
  ];

  const handleSelect = (tbl: string) => {
    setActiveTable(tbl);
    showToast(`Đã chuyển đơn hàng sang ${tbl}`);
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

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdcc6] flex items-center justify-center text-[#2d1604]">
            <span className="material-symbols-outlined text-[24px]">table_restaurant</span>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#311908]">Chọn Bàn & Đơn Hàng</h3>
            <p className="text-[13px] text-[#50443e]">Chuyển bàn phục vụ tại chỗ hoặc mang đi</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1 mb-5">
          {tables.map((t) => {
            const isSelected = activeTable === t;
            return (
              <button
                key={t}
                onClick={() => handleSelect(t)}
                className={`p-3 rounded-xl text-[13px] font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#311908] text-white border-[#311908] shadow-xs'
                    : 'bg-[#f5f3ef] text-[#1b1c1a] border-[#eae8e4] hover:bg-[#efeeea]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {t.includes('Mang đi') || t.includes('Take-away')
                    ? 'shopping_bag'
                    : t.includes('Giao hàng')
                    ? 'delivery_dining'
                    : 'chair'}
                </span>
                <span className="text-center">{t}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#efeeea] hover:bg-[#e4e2de] text-[#1b1c1a] rounded-xl text-[14px] font-semibold cursor-pointer"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
