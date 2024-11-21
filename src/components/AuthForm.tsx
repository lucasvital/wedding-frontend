// components/AuthForm.tsx
import React from "react";
import styled from "styled-components";

interface AuthFormProps {
  title: string;
  buttonText: string;
  onSubmit: (email: string, password: string, name?: string, phone?: string) => void;  // Parâmetros opcionais
  linkText: string;
  linkTo: string;
  email: string;
  password: string;
  name?: string;  // Torne 'name' e 'phone' opcionais
  phone?: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setName?: React.Dispatch<React.SetStateAction<string>>;  // Torne 'setName' opcional
  setPhone?: React.Dispatch<React.SetStateAction<string>>;  // Torne 'setPhone' opcional
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  buttonText,
  onSubmit,
  linkText,
  linkTo,
  email,
  password,
  name,
  phone,
  setEmail,
  setPassword,
  setName,
  setPhone,
}) => {
  return (
    <Container>
      <Form onSubmit={(e) => { e.preventDefault(); onSubmit(email, password, name, phone); }}>
        <h2>{title}</h2>
        {setName && setPhone && (
          <>
            <Input
              type="text"
              placeholder="Nome"
              value={name || ""}
              onChange={(e) => setName && setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Telefone"
              value={phone || ""}
              onChange={(e) => setPhone && setPhone(e.target.value)}
            />
          </>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">{buttonText}</Button>
        <Link href={linkTo}>{linkText}</Link>
      </Form>
    </Container>
  );
};

export default AuthForm;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e9ecef;
`;

const Form = styled.form`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Link = styled.a`
  display: block;
  margin-top: 10px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #0056b3;
  }
`;