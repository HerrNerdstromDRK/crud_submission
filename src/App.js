import "./App.css";

// useState is used by React to update the DOM and interface based on changes
// useRef allow us to capture data from user input via the web interface
// useEffect is a hook that allows us to store data persistently
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import InventoryItems from "./pages/InventoryItems";
import InventoryItem, {
  inventoryItemButtonHandler,
  inventoryItemLoader,
} from "./pages/InventoryItem";
import { inventoryItemsLoader } from "./loaders/inventoryItemsLoader";
import { inventoryItemsByUserNameLoader } from "./loaders/inventoryItemsByUserNameLoader";
import CreateInventoryItem, {
  createInventoryItemAction,
} from "./pages/CreateInventoryItem";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

// Layouts
import RootLayout from "./layouts/RootLayout";
import InventoryItemsError from "./pages/InventoryItemError";
import RequireAuth from "./components/RequireAuth";
import useAuth from "./hooks/useAuth";

function App() {
  const { auth } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<RootLayout />}
        errorElement={<InventoryItemsError />}
      >
        {/* Route to retrieve items from all users */}
        <Route
          index
          element={<InventoryItems />}
          loader={inventoryItemsLoader}
        />
        <Route
          path="/inventoryitems"
          element={<InventoryItems />}
          loader={inventoryItemsLoader}
        />
        <Route
          path="/inventoryitems/:userName"
          element={<InventoryItems />}
          loader={inventoryItemsByUserNameLoader}
          errorElement={<InventoryItemsError />}
        />
        <Route
          path="/inventoryitem/:id"
          element={<InventoryItem />}
          loader={inventoryItemLoader}
          action={inventoryItemButtonHandler}
          errorElement={<InventoryItemsError />}
        />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route
            path="createinventoryitem"
            element={<CreateInventoryItem />}
            action={createInventoryItemAction({ auth })}
          />
          {/* Protected route for items for this user only */}
        </Route>
        {/* Catch all */}
        <Route
          path="*"
          element={<InventoryItems />}
          loader={inventoryItemsLoader}
        />{" "}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
