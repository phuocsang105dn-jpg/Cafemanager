import React from 'react';
import { useCafe } from '../../context/CafeContext';

interface NewsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsDetailsModal: React.FC<NewsDetailsModalProps> = ({ isOpen, onClose }) => {
  const { marketNews } = useCafe();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200 border border-[#eae8e4] max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#efeeea] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdbd1] flex items-center justify-center text-[#753321]">
            <span className="material-symbols-outlined text-[24px]">newspaper</span>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#311908]">Bản Tin & Báo Cáo Thị Trường</h3>
            <p className="text-[13px] text-[#50443e]">
              Cập nhật biến động giá nguyên vật liệu ngành F&B Việt Nam
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto pr-1">
          {marketNews.map((news) => (
            <div
              key={news.id}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#f5f3ef] border border-[#eae8e4]"
            >
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0 border border-[#eae8e4]"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-[11px] text-[#82746d] font-semibold">{news.date}</span>
                <h4 className="text-[15px] font-bold text-[#1b1c1a] mt-0.5">{news.title}</h4>
                <p className="text-[13px] text-[#50443e] mt-1.5 leading-relaxed">{news.content}</p>
              </div>
            </div>
          ))}

          {/* Additional Advisory */}
          <div className="p-4 rounded-2xl bg-[#ffd1b3]/30 border border-[#ffd1b3] text-[13px] text-[#7a5840]">
            <strong className="block text-[14px] text-[#311908] mb-1">
              Khuyến nghị từ ban quản lý chuỗi:
            </strong>
            Do thời tiết sương muối và biến động tỷ giá ngoại tệ, chi phí nhóm bơ sữa và cà phê Arabica
            dự kiến còn tăng 3 - 5% trong 15 ngày tới. Các cửa hàng trưởng nên tối ưu hóa lượng hao hụt
            và duy trì tồn kho an toàn tối thiểu 10 ngày.
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[14px] font-semibold cursor-pointer"
        >
          Đóng bản tin
        </button>
      </div>
    </div>
  );
};
