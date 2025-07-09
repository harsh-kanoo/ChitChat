import React from "react";
import { Outlet } from "react-router-dom";
import ChatProvider from "./context/ChatProvider";

function Layout() {
  return (
    <>
      <ChatProvider>
        <Outlet />
      </ChatProvider>
    </>
  );
}

export default Layout;
