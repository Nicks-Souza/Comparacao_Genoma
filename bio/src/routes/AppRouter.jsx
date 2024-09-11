// AppRouter.js
import { Route, Routes } from "react-router-dom";
import Erro from "../pages/Erro";
import Cadastro from "../pages/Cadastro";
import Comparação from "../pages/Comparação";
import Principal from "../pages/Principal";
import Sobre from "../pages/Sobre";
import Amostra from "../pages/Amostra";


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/comparacao" element={<Comparação />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/amostra/:id" element={<Amostra />} />
      <Route path="*" element={<Erro />} />
    </Routes>
  );
}

export default AppRouter;
