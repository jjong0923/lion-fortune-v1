import { Outlet } from "react-router";

function Layout() {
  return (
    <div className="bg-[linear-gradient(333.05deg,#1F3175_35.7%,#0A1136_83.15%)]">
      <main className="flex min-h-dvh items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
