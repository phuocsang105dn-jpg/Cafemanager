import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { searchQuery, setSearchQuery, setActiveTab } = useCafe();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Cảnh báo tăng giá nguyên liệu',
      desc: 'Sữa tươi nguyên kem tăng 15% so với tuần trước.',
      time: '10 phút trước',
      type: 'warning',
      actionTab: 'gia-nguyen-lieu' as const,
    },
    {
      id: 'n2',
      title: 'Kho sắp hết hạt Arabica',
      desc: 'Kho chỉ còn 8 kg hạt Arabica Cầu Đất. Đề xuất nhập thêm.',
      time: '25 phút trước',
      type: 'alert',
      actionTab: 'gia-nguyen-lieu' as const,
    },
    {
      id: 'n3',
      title: 'Đơn hàng mới #ORD-9821',
      desc: 'Bàn 04 vừa gọi 2 món đang chờ pha chế.',
      time: '1 giờ trước',
      type: 'info',
      actionTab: 'tong-quan' as const,
    },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-[#fbf9f5]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-10 border-b border-[#eae8e4]/60">
      {/* Left zone: mobile hamburger & search bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#50443e] hover:bg-[#efeeea] transition-colors"
          aria-label="Mở menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-3 w-full max-w-md bg-[#f5f3ef] px-4 py-2.5 rounded-xl border border-[#d4c3bb]/40 focus-within:border-[#311908] focus-within:bg-white transition-all">
          <span className="material-symbols-outlined text-[#82746d] text-[20px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-[14px] text-[#1b1c1a] placeholder:text-[#82746d] w-full"
            placeholder="Tìm kiếm nhanh món, nguyên liệu, đơn hàng..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#82746d] hover:text-[#1b1c1a]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right zone: branch & notifications */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Branch pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#efeeea] text-[#50443e] text-[12px] font-medium border border-[#d4c3bb]/30">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>CN Quận 1, TP.HCM</span>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full hover:bg-[#e4e2de] flex items-center justify-center text-[#50443e] hover:text-[#1b1c1a] transition-colors relative cursor-pointer"
            aria-label="Thông báo"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#eae8e4] p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#eae8e4]">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#1b1c1a]">Thông báo quán</span>
                    <span className="text-[11px] bg-[#ffdad6] text-[#ba1a1a] font-medium px-2 py-0.5 rounded-full">
                      3 mới
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[12px] text-[#82746d] hover:text-[#1b1c1a]"
                  >
                    Đóng
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 mt-3 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setActiveTab(n.actionTab);
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-[#fbf9f5] hover:bg-[#f5f3ef] border border-[#eae8e4]/80 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#1b1c1a]">{n.title}</span>
                        <span className="text-[11px] text-[#82746d]">{n.time}</span>
                      </div>
                      <p className="text-[12px] text-[#50443e] mt-1 line-clamp-2">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-[#eae8e4] text-center">
                  <button
                    onClick={() => {
                      setActiveTab('gia-nguyen-lieu');
                      setShowNotifications(false);
                    }}
                    className="text-[12px] font-medium text-[#311908] hover:underline"
                  >
                    Xem tất cả cảnh báo & xu hướng →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
