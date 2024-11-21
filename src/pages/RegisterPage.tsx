// pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");   
  const [email, setEmail] = useState<string>("");   
  const [password, setPassword] = useState<string>("");  
  const [phone, setPhone] = useState<string>("");    

  const handleRegister = async (email: string, password: string, name?: string, phone?: string) => {
    try {
      // Envia a requisição para o backend
      const response = await axios.post("http://localhost:3001/api/users/register", {
        email,
        password,
        name,
        phone,
      });

      // Caso o registro seja bem-sucedido, redireciona para o login
      if (response.status === 201) {
        navigate("/login");  // Redireciona para a página de login após registro
      }
    } catch (err: any) {
      // Se ocorrer um erro, exibe a mensagem de erro
      setError(err.response?.data?.message || "Erro ao se registrar");
    }
  };

  return (
    <div>
      <AuthForm
        title="Registrar"
        buttonText="Cadastrar"
        onSubmit={handleRegister}  // Passando a função com os parâmetros
        linkText="Já tem uma conta?"
        linkTo="/login"
        email={email}
        password={password}
        name={name}
        phone={phone}
        setEmail={setEmail}
        setPassword={setPassword}
        setName={setName}
        setPhone={setPhone}
      />
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
    </div>
  );
};

export default RegisterPage;