import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ProductPage.css";

interface Product {
  id: number;
  name: string;
  image: string;
  reserved: boolean;
  reservedBy?: {
    id: number;
    name: string;
  };
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reservedItems, setReservedItems] = useState<Product[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); 

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role === "superadmin") {
      setIsSuperAdmin(true);
    }

    if (user.name) {
      setUserName(user.name);
    }

    const fetchProducts = async () => {
      try {
        // Busca todos os produtos disponíveis
        const response: AxiosResponse<Product[]> = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
        const availableProducts = response.data.filter(product => !product.reserved);
        setProducts(availableProducts);

        // Agora, busca as reservas do usuário diretamente do backend
        const token = localStorage.getItem("authToken");
        if (token && user.id) {
          const reservedResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/products/reserved/${user.id}`, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReservedItems(reservedResponse.data);  // Atualiza o estado com os produtos reservados
        }

      } catch (error) {
        console.error("Erro ao buscar produtos ou reservas:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleReserveProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user || !user.id) {
        console.error("Usuário não autenticado ou sem ID");
        return;
      }

      console.log("Enviando requisição para reservar produto...");
      console.log("Product ID:", productId, "User ID:", user.id); 

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/reserve`,
        { productId, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualizando os estados após a reserva
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId) // Remove o produto da lista de disponíveis
      );
      setReservedItems((prevReservedItems) => [
        ...prevReservedItems,
        response.data.product, // Adiciona o produto reservado
      ]);
      
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao reservar produto:", error.response ? error.response.data : error.message);
      } else {
        console.error("Erro desconhecido:", error);
      }
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
  
    if (!user || !user.id) {
      console.error('Usuário não autenticado ou sem ID.');
      return;
    }
  
    try {
      if (!productId) {
        throw new Error('Faltando parâmetros necessários.');
      }
  
      // Envia a requisição para remover a reserva
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/products/unreserve`, {
        productId: productId,
        userId: user.id, // Passa o userId corretamente
      });
  
      console.log('Produto removido com sucesso:', response.data);
  
      // Atualiza os estados após remover a reserva
      setReservedItems((prevReservedItems) =>
        prevReservedItems.filter((item) => item.id !== productId) // Remove o produto da lista de itens reservados
      );
  
      // Re-adiciona o produto à lista de produtos disponíveis
      setProducts((prevProducts) => [
        ...prevProducts,
        response.data.product, // Produto removido da reserva
      ]);
    } catch (error: any) {
      console.error('Erro ao remover produto do carrinho:', error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="product-page">
      <header className="header">
        <div className="header-items">
          <button onClick={handleLogout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
            Sair
          </button>
          <div className="cart" onClick={() => setIsCartOpen(!isCartOpen)}>
            <FontAwesomeIcon icon={faShoppingCart} className="icon" />
            <span>{reservedItems.length} itens reservados</span>
          </div>
        </div>
      </header>

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-modal-header">
            <h2>Itens Reservados</h2>
            <button
              className="close-cart"
              onClick={() => setIsCartOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="icon" />
            </button>
          </div>
          <div className="reserved-items-list">
            {reservedItems.length === 0 ? (
              <p>Não há itens reservados.</p>
            ) : (
              reservedItems.map((item) => (
                <div key={item.id} className="reserved-item">
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <button onClick={() => handleRemoveFromCart(item.id)}>
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <h1>Produtos</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <button onClick={() => handleReserveProduct(product.id)}>
              Reservar
            </button>
          </div>
        ))}
      </div>

      {isSuperAdmin && (
        <button onClick={handleAddProduct} style={{ marginTop: "20px" }}>
          Cadastrar Produto
        </button>
      )}
    </div>
  );
};

export default ProductPage;