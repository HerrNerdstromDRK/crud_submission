import { Outlet } from "react-router-dom";

export default function InventoryItemsLayout() {
  return (
    <div className="inventoryitems-layout">
      <Outlet />
    </div>
  );
}
