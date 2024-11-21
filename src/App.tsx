// App.tsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom"; // Não importa o Router aqui
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import Header from "./components/Header";
import GlobalStyle from "./styles/GlobalStyle";
import ProductPage from './pages/ProductPage'; // Importe o componente que criamos
import AddProductPage from "./pages/AddProductPage";  // Nova página de cadastro

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return (
    <>
      <GlobalStyle />
      {/* <Header /> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductPage />} />  {/* Corrigido */}
        <Route path="/add-product" element={isAuthenticated ? <AddProductPage /> : <Navigate to="/" />} /> {/* Rota de cadastrar produto */}

        {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
      </Routes>
    </>
  );
};

export default App;