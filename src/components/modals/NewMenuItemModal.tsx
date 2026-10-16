import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';

interface NewMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewMenuItemModal: React.FC<NewMenuItemModalProps> = ({ isOpen, onClose }) => {
  const { addNewMenuItem, showToast } = useCafe();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(45000);
  const [category, setCategory] = useState<'traditional' | 'coldbrew' | 'tea' | 'bakery' | 'juice'>('traditional');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sku, setSku] = useState('');

  if (!isOpen) return null;

  const sampleImages: { [key: string]: string } = {
    traditional:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJgTL4g7MtA_NzFj9mJDL9zDpTOkcBp2mnwNpai4y9OxygeMPXCOGmXDihmZOZm-YFATTFvWShKZi48W25tvLEU_TNXg-bOLlh0dr47qvfL9Q-Cn3GMiT0w25LwnD8voCnOW_bfX5Xj46ybS_r1McFV540PKtHc_ErzyiJ7DogkLRECnYqi-3Ysn0b0MQRLc4R_CJ73gl5s9ABZ4OkV8hJlkP4Az3RFxgAl60qMRvQxMbr2SwjCB5mfg',
    coldbrew:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmQ8ruZ9uVwz1E0_Vnmu3cJE8KK4Hc0Lttm-5Zh-0w5XWrAUXoZizJ2C_mGkrK_hMow-jdYWan77XG9iCNhotZmw43Pe1XRuQ0z7LZt62zCbjUm1ssoMN9IosOISRUFNPIDvPd1j44RDXpzgSFbT28F99slm7Ry9uiP5J9Skd5gl6L4FlP-Tx1l2TMflgIHhMh-mncGnZrfd77sAQ58-zkvQcHPW0wCr7VT3jQ2iEeXWAJPGt0j-dsGg',
    tea:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBiMH7Rpu-vi1WHF7njqpzymz1gwPHxC1p-TNO4W6rJZRwiYOqVpCCzej2ba39k43zPsp_yx5HDcOkEF8LP8gMwKRSnFXI3RBuDWnWICQsMLjSUJ-Ssa7Rv20UQrSrKWtGYjHWTvgfmKxFErFjHffRY7yc1_qSANceOk4IQOlOEfl9eQ3KaMOi54UssLCIxuCQO0XOlU1RoEhQMMb5q22spKWkXzSjJ6vgdfsOqqqlZXvsfeIVjMYuOrg',
    bakery:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZyokoxsK6KwkUKF37AmtbYIwYN0MLKNWkpxEh3F7NFMcANlNSpknTofxwCaUY04pA5_-w1x4pC-SUxBwSmRzJlrsualM16lhA-RL2Hc-z4bEHqwC-6L3ThyX5WBGz9Jsgq6RpfEc3fOomqVPR01v57e-8uStLIv9hZhBRsV4WuKBoR5tjmPmdtvT-gZrpulSsA5as4EtEyQQUzL_giupNy4MKvjZotGrYeoDH4g2dIBfOcl7AuLG-gA',
    juice:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLt1VtAguZDGEFsrOdm2gleHj6m0_YXXjGu8ZwaQtncmaQvxTc6hum0DtG3AK9tFu_FlwMSv_l8mjyKKdH8Edx3xCKZeC-1PbYwub4pMPjafO_dmkKgQIP8a_4NikwUYiqqmm-c1-3xDnd_sPHbsumP1j0q6mm-hdlUtEgT2hRMzizLGjnBWouOxm9RjuXSiHziVcQVX0jyH0AAqh6MlJX-IBo4kwCEyu7HH9pf1Ty567p6J43XqV0ig',
  };

  const getCatLabel = (c: string) => {
    switch (c) {
      case 'traditional':
        return 'Truyền thống';
      case 'coldbrew':
        return 'Cold Brew';
      case 'tea':
        return 'Trà sữa & Trà';
      case 'bakery':
        return 'Bánh ngọt';
      case 'juice':
        return 'Nước ép';
      default:
        return 'Đặc biệt';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập tên món!', 'error');
      return;
    }

    addNewMenuItem({
      name: name.trim(),
      price: Number(price) || 35000,
      category,
      categoryLabel: getCatLabel(category),
      description: description.trim() || 'Hương vị đặc trưng, nguyên liệu chọn lọc cao cấp.',
      imageUrl: imageUrl.trim() || sampleImages[category] || sampleImages.traditional,
      isAvailable: true,
      sku: sku.trim() || `MN-${Math.floor(100 + Math.random() * 900)}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200 border border-[#eae8e4]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#efeeea] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#4a2e1b] text-[#bd957c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#311908]">Thêm Món Mới Vào Thực Đơn</h3>
            <p className="text-[13px] text-[#50443e]">Cập nhật menu phục vụ tại quầy và POS</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Item Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">
              Tên món <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Cà phê Muối Biển, Trà Mãng Cầu..."
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Price & SKU */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">Giá bán (VNĐ) *</label>
              <input
                type="number"
                step="1000"
                required
                className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1b1c1a] font-semibold outline-none focus:border-[#311908] focus:bg-white"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">Mã SKU (tùy chọn)</label>
              <input
                type="text"
                placeholder="CF-101"
                className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">Danh mục</label>
            <select
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="traditional">Cà phê truyền thống</option>
              <option value="coldbrew">Cold Brew</option>
              <option value="tea">Trà sữa & Trà</option>
              <option value="bakery">Bánh ngọt</option>
              <option value="juice">Nước ép / Sinh tố</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">Mô tả món</label>
            <textarea
              rows={2}
              placeholder="Mô tả hương vị, thành phần nguyên liệu..."
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2 text-[14px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image URL with preset preview */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">
              Đường dẫn hình ảnh (URL)
            </label>
            <input
              type="text"
              placeholder="Để trống sẽ tự động chọn ảnh chất lượng cao theo danh mục"
              className="w-full bg-[#f5f3ef] border border-[#d4c3bb] rounded-xl px-4 py-2.5 text-[13px] text-[#1b1c1a] outline-none focus:border-[#311908] focus:bg-white"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-[#eae8e4] flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#efeeea] hover:bg-[#e4e2de] text-[#1b1c1a] rounded-xl text-[14px] font-semibold transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#311908] hover:bg-[#4a2e1b] text-white rounded-xl text-[14px] font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              Lưu & Xuất menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
