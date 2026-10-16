import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Ingredient } from '../../types/cafe';

interface IngredientPricesScreenProps {
  onOpenPurchaseOrderModal: (defaultIngredientId?: string) => void;
  onOpenNewsModal?: () => void;
}

export const IngredientPricesScreen: React.FC<IngredientPricesScreenProps> = ({
  onOpenPurchaseOrderModal,
  onOpenNewsModal,
}) => {
  const { ingredients, marketNews, showToast, searchQuery } = useCafe();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIngredientForChart, setSelectedIngredientForChart] = useState<string>('ing-1');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter ingredients
  const filteredIngredients = ingredients.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const pageSize = 6;
  const totalPages = Math.ceil(filteredIngredients.length / pageSize) || 1;
  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Selected ingredient for trend chart
  const currentChartIngredient =
    ingredients.find((i) => i.id === selectedIngredientForChart) || ingredients[0];

  // Calculate SVG curve from history
  const history = currentChartIngredient.history4Weeks || [62000, 64000, 65000, 68500];
  const minPrice = Math.min(...history) * 0.95;
  const maxPrice = Math.max(...history) * 1.05;
  const range = maxPrice - minPrice || 1;

  const chartCoords = history.map((val, idx) => {
    const x = idx * 100;
    // inverted y between 20 (high) and 95 (low)
    const normalized = (val - minPrice) / range;
    const y = 95 - normalized * 75;
    return { x, y, val };
  });

  const svgPath = `M 0,${chartCoords[0].y} Q 75,${chartCoords[1].y} 150,${chartCoords[2].y} T 300,${chartCoords[3].y}`;
  const svgArea = `${svgPath} L 300,120 L 0,120 Z`;

  // Export CSV simulation
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Tên nguyên liệu,Đơn vị,Giá tuần trước,Giá hiện tại,Biến động %,Kho còn']
        .concat(
          ingredients.map(
            (i) =>
              `"${i.name}","${i.unit}",${i.previousPrice},${i.currentPrice},${i.changePercent}%,"${i.stockAmount} ${i.stockUnit}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_gia_nguyen_lieu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file báo cáo giá nguyên liệu CSV thành công!');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Stats Row / Bento Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Tổng nguyên liệu */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl flex flex-col justify-between shadow-xs relative overflow-hidden border border-[#eae8e4]">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#311908]/5 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] text-[#50443e] font-medium">Tổng nguyên liệu theo dõi</span>
            <div className="w-10 h-10 rounded-xl bg-[#4a2e1b] text-[#bd957c] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] text-[#1b1c1a] font-bold">24</span>
            <span className="text-[13px] text-[#50443e]">mặt hàng</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[#79573f]">
            <span className="material-symbols-outlined text-[16px]">trending_flat</span>
            <span>Cập nhật 2 giờ trước</span>
          </div>
        </div>

        {/* Card 2: Cảnh báo tăng giá */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl flex flex-col justify-between shadow-xs relative overflow-hidden border border-[#eae8e4]">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#ba1a1a]/5 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] text-[#50443e] font-medium">Cảnh báo tăng giá</span>
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] text-[#ba1a1a] font-bold">3</span>
            <span className="text-[13px] text-[#50443e]">mặt hàng tăng &gt;10%</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>Sữa tươi & Bơ lạt biến động mạnh</span>
          </div>
        </div>

        {/* Card 3: Xu hướng thị trường */}
        <div className="bg-[#f5f3ef] p-6 rounded-2xl flex flex-col justify-between shadow-xs relative overflow-hidden border border-[#eae8e4]">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#5d2111]/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] text-[#50443e] font-medium">Xu hướng thị trường</span>
            <div className="w-10 h-10 rounded-xl bg-[#ffdbd1] text-[#753321] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] text-[#1b1c1a] font-bold">+4.2%</span>
            <span className="text-[13px] text-[#50443e]">Trung bình tuần</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[#753321]">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Áp lực chi phí nhập khẩu</span>
          </div>
        </div>

        {/* Card 4: Hành động đề xuất */}
        <div className="bg-[#4a2e1b] p-6 rounded-2xl flex flex-col justify-between shadow-md text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] text-white/80 font-medium">Hành động đề xuất</span>
            <div className="w-10 h-10 rounded-xl bg-[#311908] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
          </div>
          <p className="text-[14px] text-white/95 mb-3 leading-relaxed">
            Nên chốt đơn Arabica Cầu Đất trước thứ 6 để tránh đợt tăng giá dự kiến.
          </p>
          <button
            onClick={() => onOpenPurchaseOrderModal('ing-2')}
            className="bg-[#311908] text-white px-4 py-2.5 rounded-xl text-[14px] font-semibold w-full flex items-center justify-center gap-2 hover:bg-[#251306] transition-colors cursor-pointer active:scale-98 shadow-xs"
          >
            <span>Tạo đơn đặt hàng</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Table & Filters (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Filter Chips & Actions */}
          <div className="bg-[#f5f3ef] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#eae8e4]">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {[
                { id: 'all', label: 'Tất cả (24)' },
                { id: 'coffee', label: 'Cà phê (6)' },
                { id: 'milk_butter', label: 'Sữa & Bơ (5)' },
                { id: 'tea_syrup', label: 'Trà & Syrups (8)' },
                { id: 'other', label: 'Khác (5)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedCategory(f.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-[14px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === f.id
                      ? 'bg-[#311908] text-white shadow-xs'
                      : 'bg-[#eae8e4] hover:bg-[#e4e2de] text-[#50443e]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() =>
                  showToast('Bộ lọc mở rộng: Đang hiển thị tất cả mặt hàng theo dõi', 'info')
                }
                className="p-2.5 rounded-xl bg-[#eae8e4] hover:bg-[#e4e2de] text-[#50443e] flex items-center justify-center cursor-pointer transition-colors"
                title="Bộ lọc nâng cao"
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="p-2.5 rounded-xl bg-[#eae8e4] hover:bg-[#e4e2de] text-[#50443e] flex items-center justify-center cursor-pointer transition-colors"
                title="Tải bảng giá CSV"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          </div>

          {/* Ingredient Price Table Card */}
          <div className="bg-[#f5f3ef] rounded-2xl overflow-hidden shadow-xs border border-[#eae8e4]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#efeeea]/70 text-[13px] font-medium text-[#50443e]">
                    <th className="py-4 px-6">Tên nguyên liệu</th>
                    <th className="py-4 px-4">Đơn vị</th>
                    <th className="py-4 px-4 text-right">Giá tuần trước</th>
                    <th className="py-4 px-4 text-right">Giá hiện tại</th>
                    <th className="py-4 px-4 text-center">Biến động</th>
                    <th className="py-4 px-6">Trạng thái kho & Cảnh báo</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-[#1b1c1a]">
                  {paginatedIngredients.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedIngredientForChart(item.id)}
                      className={`border-t border-[#eae8e4]/60 hover:bg-[#efeeea]/50 transition-colors cursor-pointer ${
                        selectedIngredientForChart === item.id ? 'bg-[#efeeea]/80' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl ${item.iconBgClass} flex items-center justify-center shrink-0 font-medium`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {item.icon}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-[#1b1c1a]">{item.name}</div>
                            <div className="text-[12px] text-[#82746d]">{item.subName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[#50443e] font-medium">{item.unit}</td>

                      <td className="py-4 px-4 text-right text-[#50443e]">
                        {item.previousPrice.toLocaleString('vi-VN')}đ
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-[#1b1c1a]">
                        {item.currentPrice.toLocaleString('vi-VN')}đ
                      </td>

                      <td className="py-4 px-4 text-center">
                        {item.changePercent > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#ffdad6] text-[#ba1a1a] gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>{' '}
                            +{item.changePercent}%
                          </span>
                        ) : item.changePercent < 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-100 text-emerald-700 gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              arrow_downward
                            </span>{' '}
                            {item.changePercent}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e4e2de] text-[#50443e] gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">remove</span> 0.0%
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-[13px] font-semibold ${
                              item.stockSeverity === 'critical'
                                ? 'text-[#ba1a1a] flex items-center gap-1.5'
                                : item.stockSeverity === 'warning'
                                ? 'text-[#ba1a1a]'
                                : 'text-[#79573f]'
                            }`}
                          >
                            {item.stockSeverity === 'critical' && (
                              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                            )}
                            {item.stockStatusText}
                          </span>
                          <span className="text-[12px] text-[#82746d]">
                            {item.recommendation || `Kho còn: ${item.stockAmount} ${item.stockUnit}`}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedIngredients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#82746d]">
                        Không tìm thấy nguyên liệu phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 bg-[#efeeea]/40 flex items-center justify-between text-[13px] text-[#50443e] border-t border-[#eae8e4]">
              <span>
                Hiển thị {paginatedIngredients.length} / {filteredIngredients.length} nguyên liệu
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-[#e4e2de] hover:bg-[#dbdad6] disabled:opacity-50 cursor-pointer font-medium"
                >
                  Trước
                </button>
                <span className="font-semibold text-[#1b1c1a]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-[#e4e2de] hover:bg-[#dbdad6] disabled:opacity-50 cursor-pointer font-medium"
                >
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Price Trend Charts (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Trend Chart Card */}
          <div className="bg-[#f5f3ef] p-6 rounded-2xl flex flex-col justify-between shadow-xs border border-[#eae8e4]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[18px] font-semibold text-[#1b1c1a]">Biểu đồ xu hướng giá</h3>
                <p className="text-[13px] text-[#50443e]">So sánh biến động 4 tuần qua</p>
              </div>
              <select
                className="bg-white px-3 py-1.5 rounded-xl text-[13px] text-[#1b1c1a] border border-[#d4c3bb]/50 outline-none cursor-pointer"
                value={selectedIngredientForChart}
                onChange={(e) => setSelectedIngredientForChart(e.target.value)}
              >
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Inline SVG Visualization */}
            <div className="w-full h-48 py-4 flex flex-col justify-end relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="w-full border-b border-[#d4c3bb]"></div>
                <div className="w-full border-b border-[#d4c3bb]"></div>
                <div className="w-full border-b border-[#d4c3bb]"></div>
                <div className="w-full border-b border-[#d4c3bb]"></div>
              </div>

              {/* SVG Graph */}
              <svg
                className="w-full h-36 overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 300 120"
              >
                <defs>
                  <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#311908" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#311908" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={svgArea} fill="url(#trendGrad)" />
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#311908"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {chartCoords.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    fill={idx === chartCoords.length - 1 ? '#ba1a1a' : '#311908'}
                    r={idx === chartCoords.length - 1 ? 5 : 4}
                    stroke={idx === chartCoords.length - 1 ? '#fff' : 'none'}
                    strokeWidth={idx === chartCoords.length - 1 ? 2 : 0}
                  />
                ))}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] text-[#82746d] mt-2 font-medium">
                <span>Tuần 1</span>
                <span>Tuần 2</span>
                <span>Tuần 3</span>
                <span className="text-[#ba1a1a] font-bold">Tuần này</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#efeeea]/60 rounded-xl flex items-center justify-between border border-[#eae8e4]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#311908] text-[20px]">
                  insights
                </span>
                <span className="text-[13px] text-[#1b1c1a] font-medium">
                  Dự báo tuần tới: Tiếp tục tăng nhẹ +1.5%
                </span>
              </div>
            </div>
          </div>

          {/* Market News / Quick Advisory Card */}
          <div className="bg-[#f5f3ef] p-6 rounded-2xl flex flex-col gap-4 shadow-xs border border-[#eae8e4]">
            <h3 className="text-[18px] font-semibold text-[#1b1c1a]">Bản tin thị trường</h3>

            <div className="flex flex-col gap-4">
              {marketNews.map((news) => (
                <div key={news.id} className="flex gap-4 items-start group cursor-pointer">
                  <div
                    className="w-14 h-14 rounded-xl bg-cover bg-center shrink-0 border border-[#eae8e4] group-hover:scale-105 transition-transform"
                    style={{ backgroundImage: `url('${news.imageUrl}')` }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#82746d] font-medium">{news.date}</span>
                    <h4 className="text-[13px] font-semibold text-[#1b1c1a] line-clamp-1 group-hover:text-[#311908] transition-colors">
                      {news.title}
                    </h4>
                    <p className="text-[12px] text-[#50443e] line-clamp-2 mt-0.5 leading-snug">
                      {news.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenNewsModal}
              className="w-full py-2.5 rounded-xl bg-[#eae8e4] hover:bg-[#e4e2de] text-[#1b1c1a] text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xem tất cả bản tin</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
