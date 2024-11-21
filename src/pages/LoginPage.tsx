import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Não precisa mais importar ToastPosition
import "react-toastify/dist/ReactToastify.css"; // Estilos do toastify

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (email: string, password: string) => {
    try {
      // Envia a requisição para o backend
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`, // Usa a variável de ambiente para a URL
        { email, password }
      );
  
      // Se a resposta contiver um token e os dados do usuário, armazene-os no localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token); // Armazena o token
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Armazena os dados do usuário, incluindo o ID
        // Mostra uma notificação de sucesso
        toast.success("Login realizado com sucesso!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Redireciona para a página de produtos após o login bem-sucedido
        navigate("/products");
  
        
      }
    } catch (err: any) {
      // Se ocorrer um erro, exibe a mensagem de erro
      setError(err.response?.data?.message || "Erro ao fazer login");
  
      // Mostra uma notificação de erro
      toast.error("Senha incorreta ou usuário não encontrado.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <AuthForm
        title="Login"
        buttonText="Entrar"
        onSubmit={handleLogin}
        linkText="Criar Conta"
        linkTo="/register"
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
      />
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

      {/* Container de notificações */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;