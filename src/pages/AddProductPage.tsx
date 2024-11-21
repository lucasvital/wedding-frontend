import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse"; // Importando a biblioteca para processar CSV

const AddProductPage: React.FC = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null); // Estado para armazenar o arquivo CSV
  const navigate = useNavigate();

  // Estilos CSS inline minimalistas
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  };

  const errorStyle: React.CSSProperties = {
    color: "red",
    marginTop: "10px",
    textAlign: "center",
  };

  // Função para adicionar um produto individualmente
  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token de autenticação não encontrado.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        { name, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redireciona para a página de produtos após adicionar
      navigate("/products");
    } catch (error) {
      setError("Erro ao cadastrar produto. Tente novamente.");
      console.error(error);
    }
  };

  // Função para processar e importar os produtos do arquivo CSV
  const handleCsvUpload = async () => {
    if (!csvFile) {
      setError("Por favor, envie um arquivo CSV.");
      return;
    }

    // Lendo o arquivo CSV
    Papa.parse(csvFile, {
      complete: async (result) => {
        try {
          const products = result.data as string[][]; // Dados como array de arrays

          // Loop para enviar os produtos um por um
          for (let i = 0; i < products.length; i++) {
            const [name, image] = products[i]; // Coluna A (nome) e B (imagem)

            // Chama a API para criar o produto
            await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/products`,
              { name, image },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );
          }

          // Redireciona para a página de produtos após a importação em lote
          navigate("/products");
        } catch (error) {
          setError("Erro ao importar os produtos em lote.");
          console.error(error);
        }
      },
      header: false, // Indica que não há cabeçalho
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "#333" }}>Cadastrar Produto</h1>
      <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
        {/* Formulário de cadastro individual */}
        <div>
          <label style={{ fontWeight: "bold", marginBottom: "6px" }}>Nome do Produto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold", marginBottom: "6px" }}>Imagem (URL)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" onClick={handleAddProduct} style={buttonStyle}>
          Cadastrar Produto
        </button>

        {/* Formulário para upload de arquivo CSV */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontWeight: "bold", marginBottom: "6px" }}>
            Importar Produtos em Lote (CSV)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
            style={inputStyle}
          />
          <button type="button" onClick={handleCsvUpload} style={buttonStyle}>
            Importar CSV
          </button>
        </div>
      </form>

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

export default AddProductPage;