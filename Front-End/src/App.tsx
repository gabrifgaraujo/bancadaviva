import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { PublicRoute } from "./components/routes/PublicRoute";
import { LayoutHome } from "./layout/LayoutHome";
import { Login } from "./Pages/Login";
import { Board } from "./Pages/Board";
import { NovoServico } from "./Pages/NovoServico";
import { DetalheServico } from "./Pages/DetalheServico";
import { Painel } from "./Pages/Painel";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutHome />}>
              <Route path="/" element={<Board />} />
              <Route path="/painel" element={<Painel />} />
              <Route path="/servicos/novo" element={<NovoServico />} />
              <Route path="/servicos/:uuid" element={<DetalheServico />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
