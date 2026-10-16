import React from 'react';
import { useCafe } from '../context/CafeContext';
import { ScreenTab } from '../types/cafe';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, cart } = useCafe();

  const navItems: { id: ScreenTab; label: string; icon: string; badge?: number }[] = [
    { id: 'tong-quan', label: 'Tổng Quan', icon: 'dashboard' },
    { id: 'thuc-don', label: 'Thực Đơn & Tự Phối Món', icon: 'restaurant_menu' },
    { id: 'gia-nguyen-lieu', label: 'Giá Nguyên Liệu', icon: 'inventory_2' },
    { id: 'ban-hang-pos', label: 'Bán Hàng POS', icon: 'point_of_sale', badge: cart.length > 0 ? cart.length : undefined },
  ];

  const handleNavClick = (tabId: ScreenTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#f5f3ef] z-50 flex flex-col justify-between py-8 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#eae8e4]`}
      >
        <div className="px-6">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between mb-8">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('tong-quan')}
            >
              <div className="w-10 h-10 rounded-xl bg-[#311908] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-white text-[22px]">coffee</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[20px] font-semibold text-[#311908] tracking-tight leading-none">
                  Café Manager
                </span>
                <span className="text-[11px] text-[#82746d] font-medium mt-1">Smart Coffee OS</span>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#50443e] hover:bg-[#eae8e4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium cursor-pointer ${
                    isActive
                      ? 'bg-[#4a2e1b] text-white shadow-sm'
                      : 'text-[#50443e] hover:bg-[#eae8e4] hover:text-[#1b1c1a]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-white' : 'text-[#82746d]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#ffd1b3] text-[#4a2e1b]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current User Profile Card */}
        <div className="px-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#e4e2de]/60 border border-[#d4c3bb]/40">
            <div className="w-9 h-9 rounded-full bg-[#311908] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[13px] font-semibold text-[#1b1c1a] truncate">Nguyễn Văn A</span>
              <span className="text-[11px] text-[#50443e] truncate">Quản lý cửa hàng</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
