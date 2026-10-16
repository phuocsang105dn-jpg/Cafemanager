/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';

// Screens
import { OverviewScreen } from './components/screens/OverviewScreen';
import { MenuBuilderScreen } from './components/screens/MenuBuilderScreen';
import { IngredientPricesScreen } from './components/screens/IngredientPricesScreen';
import { PosScreen } from './components/screens/PosScreen';

// Modals
import { QrPaymentModal } from './components/modals/QrPaymentModal';
import { CashPaymentModal } from './components/modals/CashPaymentModal';
import { CustomizationModal } from './components/modals/CustomizationModal';
import { NewMenuItemModal } from './components/modals/NewMenuItemModal';
import { PurchaseOrderModal } from './components/modals/PurchaseOrderModal';
import { OrderDetailsModal } from './components/modals/OrderDetailsModal';
import { TableSwitchModal } from './components/modals/TableSwitchModal';
import { RecipeModal } from './components/modals/RecipeModal';
import { CustomerCrmModal } from './components/modals/CustomerCrmModal';
import { NewsDetailsModal } from './components/modals/NewsDetailsModal';
import { Order, CartItem } from './types/cafe';

const CafeMain: React.FC = () => {
  const { activeTab, completeOrder, showToast } = useCafe();

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal states
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
  const [purchaseOrderDefaultIngId, setPurchaseOrderDefaultIngId] = useState<string | undefined>();
  const [isTableSwitchModalOpen, setIsTableSwitchModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  // Selected items for inspection
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customizingItem, setCustomizingItem] = useState<CartItem | null>(null);

  // Payment completion flows
  const handleQrPaymentSuccess = () => {
    setIsQrModalOpen(false);
    completeOrder('qr');
    showToast('Xác nhận nhận chuyển khoản thành công! Đã in hóa đơn.');
  };

  const handleCashPaymentSuccess = () => {
    setIsCashModalOpen(false);
    completeOrder('cash');
    showToast('Thanh toán tiền mặt thành công! Đã in hóa đơn.');
  };

  const handleOpenPurchaseOrder = (ingId?: string) => {
    setPurchaseOrderDefaultIngId(ingId);
    setIsPurchaseOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col w-full lg:pl-72 transition-all">
        {/* Top Header */}
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-10 max-w-7xl w-full mx-auto">
          {activeTab === 'tong-quan' && (
            <OverviewScreen
              onOpenOrderModal={(ord) => setSelectedOrder(ord)}
              onOpenRecipeModal={() => setIsRecipeModalOpen(true)}
              onOpenCrmModal={() => setIsCrmModalOpen(true)}
            />
          )}

          {activeTab === 'thuc-don' && (
            <MenuBuilderScreen
              onOpenNewItemModal={() => setIsNewItemModalOpen(true)}
              onEditItem={(item) => {
                showToast(`Đang mở chỉnh sửa cho ${item.name}`, 'info');
              }}
            />
          )}

          {activeTab === 'gia-nguyen-lieu' && (
            <IngredientPricesScreen
              onOpenPurchaseOrderModal={handleOpenPurchaseOrder}
              onOpenNewsModal={() => setIsNewsModalOpen(true)}
            />
          )}

          {activeTab === 'ban-hang-pos' && (
            <PosScreen
              onOpenCustomizationModal={(item) => setCustomizingItem(item)}
              onOpenQrModal={() => setIsQrModalOpen(true)}
              onOpenCashModal={() => setIsCashModalOpen(true)}
              onOpenTableSwitchModal={() => setIsTableSwitchModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <QrPaymentModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSuccess={handleQrPaymentSuccess}
      />

      <CashPaymentModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        onSuccess={handleCashPaymentSuccess}
      />

      <CustomizationModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
      />

      <NewMenuItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
      />

      <PurchaseOrderModal
        isOpen={isPurchaseOrderModalOpen}
        defaultIngredientId={purchaseOrderDefaultIngId}
        onClose={() => setIsPurchaseOrderModalOpen(false)}
      />

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <TableSwitchModal
        isOpen={isTableSwitchModalOpen}
        onClose={() => setIsTableSwitchModalOpen(false)}
      />

      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
      />

      <CustomerCrmModal
        isOpen={isCrmModalOpen}
        onClose={() => setIsCrmModalOpen(false)}
      />

      <NewsDetailsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CafeProvider>
      <CafeMain />
    </CafeProvider>
  );
}
