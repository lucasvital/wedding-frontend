import React from "react";
import { Route, Routes, Navigate } from "react-router-dom"; // Não importa o Router aqui
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GlobalStyle from "./styles/GlobalStyle";
import ProductPage from './pages/ProductPage'; // Importe o componente que criamos
import DashboardPage from "./components/DashboardPage";
import AddProductPage from "./pages/AddProductPage";  // Nova página de cadastro

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <>
      <GlobalStyle />
      <Routes>
        {/* Rota inicial, redireciona para login se não estiver autenticado */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/products" /> : <Navigate to="/login" />} />
        
        {/* Rota de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rota de registro */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rota de produtos */}
        <Route path="/products" element={<ProductPage />} /> 
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Rota de cadastro de produto, protegida por autenticação */}
        <Route path="/add-product" element={isAuthenticated ? <AddProductPage /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
