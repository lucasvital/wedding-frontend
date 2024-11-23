import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import "./DashboardPage.css";

interface DashboardData {
  totalReserved: number;
  topUser: {
    userName: string;
    reservationCount: number;
  };
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
        // Verifica se o usuário é superadmin antes de buscar dados
        if (user.role !== "superadmin") {
          setError("Acesso negado: apenas superadmins podem acessar esta página.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Você não está autenticado. Redirecionando...");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        const response: AxiosResponse<DashboardData> = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDashboardData(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Erro ao carregar o dashboard.");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!dashboardData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="dashboard-data">
        <p><strong>Total de Produtos Reservados:</strong> {dashboardData.totalReserved}</p>
        <p>
          <strong>Usuário com mais Reservas:</strong> {dashboardData.topUser.userName} 
          ({dashboardData.topUser.reservationCount} reservas)
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;