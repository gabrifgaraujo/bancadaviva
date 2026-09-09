import { Outlet } from "react-router-dom";
import { Nav } from "../components/navegation/Nav";

export function LayoutHome() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-5">
        <Outlet />
      </main>
    </div>
  );
}
