import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import "./DashboardPage.css";

interface DashboardData {
  totalReserved: number;
  totalNotReserved: number;
  reservationsByUser: Array<{
    userName: string;
    reservationCount: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  // Dados para o gráfico de pizza
  const productData = [
    { name: "Reservados", value: dashboardData.totalReserved },
    { name: "Não Reservados", value: dashboardData.totalNotReserved },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  // Dados para o gráfico de barras
  const barChartData = dashboardData.reservationsByUser?.map(user => ({
    name: user.userName.trim() || "Desconhecido",
    reservations: user.reservationCount,
  }));

  // Identifica o usuário com mais reservas
  const topUser =
    dashboardData.reservationsByUser?.[0] || { userName: "Nenhum", reservationCount: 0 };

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="dashboard-data">
        <p>
          <strong>Total de Produtos Reservados:</strong> {dashboardData.totalReserved}
        </p>
        <p>
          <strong>Usuário com mais Reservas:</strong> {topUser.userName} 
          ({topUser.reservationCount} reservas)
        </p>
      </div>

      {/* Gráfico de barras */}
      <h2>Reservas por Usuário</h2>
      {barChartData?.length ? (
        <BarChart
          width={600}
          height={300}
          data={barChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="reservations" fill="#8884d8" />
        </BarChart>
      ) : (
        <p>Sem dados de reservas por usuário.</p>
      )}

      {/* Gráfico de pizza */}
      <h2>Status dos Produtos</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={productData}
          cx="50%"
          cy="50%"
          label
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {productData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default DashboardPage;