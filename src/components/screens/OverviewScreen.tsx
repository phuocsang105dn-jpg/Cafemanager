import React, { useState, useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Order } from '../../types/cafe';

interface OverviewScreenProps {
  onOpenOrderModal: (order: Order) => void;
  onOpenRecipeModal: () => void;
  onOpenCrmModal: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onOpenOrderModal,
  onOpenRecipeModal,
  onOpenCrmModal,
}) => {
  const { setActiveTab, orders, searchQuery } = useCafe();
  const [chartView, setChartView] = useState<'day' | 'week'>('day');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Đã xong' | 'Đang pha chế'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; value: string; x: number; y: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Live clock
  const [timeStr, setTimeStr] = useState('14:30 - Hôm nay');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes} - Hôm nay`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderFilter === 'all' || ord.status === orderFilter;
    const matchesSearch =
      !searchQuery ||
      ord.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.itemsDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Chart data
  const dayPoints = [
    { label: 'Thứ Hai', val: '3.200.000 đ', cx: 0, cy: 160 },
    { label: 'Thứ Ba', val: '3.800.000 đ', cx: 116, cy: 115 },
    { label: 'Thứ Tư', val: '4.100.000 đ', cx: 233, cy: 90 },
    { label: 'Thứ Năm', val: '4.300.000 đ', cx: 350, cy: 75 },
    { label: 'Thứ Sáu', val: '4.600.000 đ', cx: 466, cy: 60 },
    { label: 'Thứ Bảy', val: '5.100.000 đ', cx: 583, cy: 45 },
    { label: 'Chủ Nhật (Hôm nay)', val: '4.850.000 đ', cx: 700, cy: 30 },
  ];

  const weekPoints = [
    { label: 'Tuần 1', val: '28.400.000 đ', cx: 0, cy: 150 },
    { label: 'Tuần 2', val: '30.100.000 đ', cx: 233, cy: 110 },
    { label: 'Tuần 3', val: '29.800.000 đ', cx: 466, cy: 80 },
    { label: 'Tuần này', val: '32.400.000 đ', cx: 700, cy: 35 },
  ];

  const currentPoints = chartView === 'day' ? dayPoints : weekPoints;

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Top Banner / Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f5f3ef] p-6 rounded-2xl shadow-xs relative overflow-hidden border border-[#eae8e4]">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#311908]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#4a2e1b] text-[#bd957c] rounded-full text-[11px] font-semibold uppercase tracking-wider">
              Trực tuyến
            </span>
            <span className="text-[#50443e] text-[13px]">• Chi nhánh Quận 1, TP.HCM</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#311908] tracking-tight">
            Xin chào, Nguyễn Văn A!
          </h1>
          <p className="text-[#50443e] text-[14px]">
            Hôm nay quán hoạt động rất tốt. Dưới đây là tóm tắt nhanh tình hình kinh doanh.
          </p>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[11px] text-[#82746d] font-medium">Thời gian cập nhật</span>
            <span className="text-[14px] font-semibold text-[#1b1c1a]">{timeStr}</span>
          </div>
          <button
            onClick={() => setActiveTab('ban-hang-pos')}
            className="bg-[#311908] hover:bg-[#4a2e1b] text-white px-5 py-3 rounded-full text-[14px] font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Tạo Đơn Hàng Mới
          </button>
        </div>
      </div>

      {/* KPI Quick Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Doanh thu */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all border border-[#eae8e4]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#311908]/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#4a2e1b] text-[#bd957c] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-[#82746d] uppercase tracking-wider mb-1 font-medium">
              Doanh thu hôm nay
            </span>
            <span className="text-[26px] text-[#311908] font-bold tracking-tight">4,850,000 đ</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eae8e4] flex items-center justify-between text-[13px] text-[#50443e]">
            <span>Hôm qua: 4,320,000 đ</span>
            <button
              onClick={() => setActiveTab('ban-hang-pos')}
              className="text-[#311908] font-semibold hover:underline cursor-pointer"
            >
              Chi tiết →
            </button>
          </div>
        </div>

        {/* Card 2: Số đơn hàng */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all border border-[#eae8e4]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#311908]/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffd1b3] text-[#7a5840] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +8%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-[#82746d] uppercase tracking-wider mb-1 font-medium">
              Số đơn hàng
            </span>
            <span className="text-[26px] text-[#311908] font-bold tracking-tight">128 đơn</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eae8e4] flex items-center justify-between text-[13px] text-[#50443e]">
            <span>Đang chờ: 4 đơn</span>
            <button
              onClick={() => setActiveTab('ban-hang-pos')}
              className="text-[#311908] font-semibold hover:underline cursor-pointer"
            >
              Xem POS →
            </button>
          </div>
        </div>

        {/* Card 3: Khách hàng mới */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all border border-[#eae8e4]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#311908]/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffdbd1] text-[#753321] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">group</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#311908] bg-[#e4e2de] px-2.5 py-0.5 rounded-full">
              Thành viên mới
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-[#82746d] uppercase tracking-wider mb-1 font-medium">
              Khách hàng mới
            </span>
            <span className="text-[26px] text-[#311908] font-bold tracking-tight">34</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eae8e4] flex items-center justify-between text-[13px] text-[#50443e]">
            <span>Tích lũy điểm: 128</span>
            <button
              onClick={onOpenCrmModal}
              className="text-[#311908] font-semibold hover:underline cursor-pointer"
            >
              CRM →
            </button>
          </div>
        </div>

        {/* Card 4: Món bán chạy nhất */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all border border-[#eae8e4]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#311908]/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#311908] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">local_cafe</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#dd866f] bg-[#ffdbd1]/50 px-2.5 py-0.5 rounded-full">
              Top #1
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-[#82746d] uppercase tracking-wider mb-1 font-medium">
              Món bán chạy nhất
            </span>
            <span
              className="text-[20px] text-[#311908] font-bold truncate"
              title="Cà phê sữa đá Sài Gòn"
            >
              Cà phê sữa đá Sài Gòn
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eae8e4] flex items-center justify-between text-[13px] text-[#50443e]">
            <span>Đã bán: 56 ly</span>
            <button
              onClick={onOpenRecipeModal}
              className="text-[#311908] font-semibold hover:underline cursor-pointer"
            >
              Công thức →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Chart & Inventory Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-[#f5f3ef] p-6 rounded-2xl shadow-xs flex flex-col justify-between border border-[#eae8e4]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[22px] font-semibold text-[#311908]">Biểu Đồ Doanh Thu Tuần</h2>
              <p className="text-[13px] text-[#50443e]">
                {chartView === 'day' ? 'So sánh doanh thu trong 7 ngày qua' : 'So sánh doanh thu theo 4 tuần gần nhất'}
              </p>
            </div>
            <div className="flex items-center bg-[#e4e2de] p-1 rounded-xl">
              <button
                onClick={() => setChartView('day')}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  chartView === 'day'
                    ? 'bg-white text-[#311908] shadow-xs'
                    : 'text-[#50443e] hover:text-[#1b1c1a]'
                }`}
              >
                Theo Ngày
              </button>
              <button
                onClick={() => setChartView('week')}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  chartView === 'week'
                    ? 'bg-white text-[#311908] shadow-xs'
                    : 'text-[#50443e] hover:text-[#1b1c1a]'
                }`}
              >
                Theo Tuần
              </button>
            </div>
          </div>

          {/* SVG Chart Visualization */}
          <div className="w-full h-64 flex flex-col justify-end relative my-4">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
              <div className="w-full border-b border-[#82746d] border-dashed"></div>
              <div className="w-full border-b border-[#82746d] border-dashed"></div>
              <div className="w-full border-b border-[#82746d] border-dashed"></div>
              <div className="w-full border-b border-[#82746d] border-dashed"></div>
            </div>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-20 -top-2 bg-[#311908] text-white text-[12px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none transition-all transform -translate-x-1/2"
                style={{ left: `${(hoveredPoint.x / 700) * 100}%` }}
              >
                <div className="font-semibold">{hoveredPoint.day}</div>
                <div className="text-[#ffdcc6] font-mono">{hoveredPoint.value}</div>
              </div>
            )}

            <svg
              className="w-full h-48 overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 700 200"
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4a2e1b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4a2e1b" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path
                d={
                  chartView === 'day'
                    ? 'M 0,160 Q 100,120 200,90 T 400,60 T 600,40 L 700,30 L 700,200 L 0,200 Z'
                    : 'M 0,150 Q 200,120 350,100 T 550,60 L 700,35 L 700,200 L 0,200 Z'
                }
                fill="url(#chartGrad)"
              />

              {/* Line path */}
              <path
                d={
                  chartView === 'day'
                    ? 'M 0,160 Q 100,120 200,90 T 400,60 T 600,40 L 700,30'
                    : 'M 0,150 Q 200,120 350,100 T 550,60 L 700,35'
                }
                fill="none"
                stroke="#4a2e1b"
                strokeLinecap="round"
                strokeWidth="3.5"
              />

              {/* Data Points */}
              <g className="cursor-pointer">
                {currentPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    fill={idx === currentPoints.length - 1 ? '#4a2e1b' : '#fbf9f5'}
                    r={hoveredPoint?.day === pt.label ? 7 : 5}
                    stroke="#4a2e1b"
                    strokeWidth="3"
                    onMouseEnter={() =>
                      setHoveredPoint({ day: pt.label, value: pt.val, x: pt.cx, y: pt.cy })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </g>
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[12px] text-[#82746d] mt-3 px-1">
              {currentPoints.map((pt, idx) => (
                <span
                  key={idx}
                  className={
                    idx === currentPoints.length - 1
                      ? 'text-[#311908] font-bold'
                      : 'hover:text-[#311908] cursor-pointer'
                  }
                  onMouseEnter={() =>
                    setHoveredPoint({ day: pt.label, value: pt.val, x: pt.cx, y: pt.cy })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {pt.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#eae8e4]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#311908]"></span>
              <span className="text-[13px] text-[#50443e]">Doanh thu thực tế</span>
            </div>
            <span className="text-[14px] font-semibold text-[#311908]">
              Tổng tuần: 32,400,000 đ (+14.5%)
            </span>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl shadow-xs flex flex-col justify-between border border-[#eae8e4]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[22px] font-semibold text-[#311908]">Tóm Tắt Kho</h2>
              <span
                onClick={() => setActiveTab('gia-nguyen-lieu')}
                className="material-symbols-outlined text-[#82746d] cursor-pointer hover:text-[#311908]"
                title="Đến trang quản lý nguyên liệu"
              >
                inventory_2
              </span>
            </div>
            <p className="text-[13px] text-[#50443e] mb-6">Nguyên liệu sắp hết cần nhập thêm</p>

            {/* Progress Items */}
            <div className="flex flex-col gap-4">
              {/* Item 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-medium text-[#1b1c1a]">Hạt Arabica Đà Lạt</span>
                  <span className="text-amber-800 font-medium">12 kg (Sắp hết)</span>
                </div>
                <div className="w-full bg-[#e4e2de] h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-medium text-[#1b1c1a]">Sữa đặc nguyên kem</span>
                  <span className="text-emerald-700 font-medium">45 lon (Ổn định)</span>
                </div>
                <div className="w-full bg-[#e4e2de] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4a2e1b] h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-medium text-[#1b1c1a]">Hạt Robusta Buôn Ma Thuột</span>
                  <span className="text-[#ba1a1a] font-medium">3 kg (Cần nhập gấp)</span>
                </div>
                <div className="w-full bg-[#e4e2de] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-medium text-[#1b1c1a]">Ly giấy take-away 350ml</span>
                  <span className="text-emerald-700 font-medium">320 cái (Ổn định)</span>
                </div>
                <div className="w-full bg-[#e4e2de] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4a2e1b] h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('gia-nguyen-lieu')}
            className="w-full mt-6 bg-[#e4e2de] hover:bg-[#dbdad6] text-[#1b1c1a] py-3 rounded-xl text-[14px] font-semibold transition-all text-center cursor-pointer"
          >
            Quản lý kho nguyên liệu →
          </button>
        </div>
      </div>

      {/* Recent Orders Table Section */}
      <div className="bg-[#f5f3ef] p-6 rounded-2xl shadow-xs border border-[#eae8e4]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-semibold text-[#311908]">Đơn Hàng Gần Đây</h2>
            <p className="text-[13px] text-[#50443e]">
              Danh sách các đơn hàng mới nhất trong ca làm việc hiện tại
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#d4c3bb]/50">
              <span className="material-symbols-outlined text-[#82746d] text-[18px]">
                filter_list
              </span>
              <select
                className="bg-transparent border-none text-[13px] text-[#1b1c1a] outline-none cursor-pointer"
                value={orderFilter}
                onChange={(e) => {
                  setOrderFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đã xong">Đã xong</option>
                <option value="Đang pha chế">Đang pha chế</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('ban-hang-pos')}
              className="bg-white border border-[#d4c3bb]/50 text-[#1b1c1a] px-4 py-2 rounded-xl text-[13px] font-medium hover:bg-[#eae8e4] transition-all cursor-pointer"
            >
              Xem tất cả tại POS
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eae8e4] text-[13px] font-medium text-[#82746d]">
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Món Đặt</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Hình Thức</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#1b1c1a]">
              {paginatedOrders.map((ord) => (
                <tr
                  key={ord.id}
                  className="border-b border-[#eae8e4]/60 hover:bg-[#efeeea]/60 transition-colors"
                >
                  <td className="py-4 px-4 font-semibold text-[#311908]">{ord.code}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full ${ord.avatarBgClass} flex items-center justify-center text-[13px] font-bold`}
                      >
                        {ord.customerAvatarChar}
                      </div>
                      <span className="font-medium">{ord.customerName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#50443e] max-w-xs truncate" title={ord.itemsDescription}>
                    {ord.itemsDescription}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#311908]">
                    {ord.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[12px] bg-[#e4e2de] text-[#1b1c1a] px-2.5 py-1 rounded-md font-medium">
                      {ord.orderType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {ord.status === 'Đang pha chế' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-amber-100 text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        Đang pha chế
                      </span>
                    ) : ord.status === 'Đã xong' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Đã xong
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-rose-100 text-rose-800">
                        Đã hủy
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onOpenOrderModal(ord)}
                      className="w-8 h-8 rounded-full hover:bg-[#e4e2de] inline-flex items-center justify-center text-[#50443e] hover:text-[#1b1c1a] transition-colors cursor-pointer"
                      title="Xem chi tiết đơn"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#82746d]">
                    Không tìm thấy đơn hàng nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#eae8e4] text-[13px] text-[#50443e]">
          <span>
            Hiển thị {paginatedOrders.length} trên tổng số {filteredOrders.length} đơn hàng
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-[#e4e2de] text-[#1b1c1a] disabled:opacity-50 cursor-pointer font-medium"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-[13px] font-medium cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#311908] text-white'
                    : 'hover:bg-[#e4e2de] text-[#50443e]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-[#e4e2de] text-[#1b1c1a] disabled:opacity-50 cursor-pointer font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
