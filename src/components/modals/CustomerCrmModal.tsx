import React from 'react';

interface CustomerCrmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerCrmModal: React.FC<CustomerCrmModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const vipMembers = [
    { name: 'Anh Hoàng (0903***888)', points: 480, tier: 'Kim Cương', visits: 24 },
    { name: 'Chị Mai (0918***234)', points: 350, tier: 'Vàng', visits: 18 },
    { name: 'Anh Tuấn (0982***678)', points: 290, tier: 'Bạc', visits: 12 },
    { name: 'Bạn Lan (0934***112)', points: 140, tier: 'Thân thiết', visits: 7 },
  ];

  return (
    <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200 border border-[#eae8e4]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#efeeea] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdbd1] flex items-center justify-center text-[#753321]">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#311908]">Quản Lý Khách Hàng (CRM)</h3>
            <p className="text-[13px] text-[#50443e]">Hôm nay có 34 thành viên mới đăng ký tích điểm</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#f5f3ef] p-3.5 rounded-xl border border-[#eae8e4]">
            <span className="text-[11px] text-[#82746d] font-semibold uppercase">Điểm tích lũy hôm nay</span>
            <p className="text-[22px] font-bold text-[#311908] mt-1">+128 điểm</p>
          </div>
          <div className="bg-[#f5f3ef] p-3.5 rounded-xl border border-[#eae8e4]">
            <span className="text-[11px] text-[#82746d] font-semibold uppercase">Tỷ lệ quay lại</span>
            <p className="text-[22px] font-bold text-emerald-700 mt-1">68.5%</p>
          </div>
        </div>

        <span className="text-[13px] font-semibold text-[#1b1c1a] mb-2">Thành viên thân thiết tích cực:</span>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 mb-6">
          {vipMembers.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9f5] border border-[#eae8e4]"
            >
              <div>
                <span className="text-[13px] font-semibold text-[#1b1c1a]">{m.name}</span>
                <p className="text-[11px] text-[#82746d]">Đã ghé quán {m.visits} lần</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-[#311908]">{m.points} điểm</span>
                <span className="text-[11px] font-semibold bg-[#ffdcc6] text-[#2d1604] px-2 py-0.5 rounded-full">
                  {m.tier}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[14px] font-semibold cursor-pointer"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
