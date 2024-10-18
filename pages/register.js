import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Form from '../components/Form';
import { useRouter } from 'next/router';
import Alert from '../components/Alert';
import CryptoJS from 'crypto-js';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      neighborhood: '',
      number: '',
      city: '',
      state: '',
      zip: ''
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [manualAddress, setManualAddress] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address')) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name.split('.')[1]]: value.slice(0, 50),
        },
      });
    } else {
      setFormData({ ...formData, [name]: value.slice(0, 50) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cepRegex = /^\d{5}-\d{3}$/;

    if (!formData.fullName || !formData.email || !emailRegex.test(formData.email) ||
        !formData.password || !formData.confirmPassword ||
        (!manualAddress && (!formData.address.zip || !cepRegex.test(formData.address.zip))) ||
        (!manualAddress && !formData.address.street)) {
      setHasError(true);
      setErrorMessage('Preencha seus dados');
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('E-mail inválido');
      } else if (!cepRegex.test(formData.address.zip) && formData.address.zip !== '00000-000') {
        setErrorMessage('Cheque o CEP');
      } else if (!formData.address.street && !manualAddress) {
        setErrorMessage('Cheque o CEP');
      }
      return;
    }

    if (manualAddress && (
      !formData.address.street || !formData.address.neighborhood ||
      !formData.address.city || !formData.address.state || !formData.address.number)) {
      setHasError(true);
      setErrorMessage('Cheque o endereço');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setHasError(true);
      setErrorMessage('Senhas não coincidem');
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(formData.password, 'my-secret-key').toString();
    const newUser = { ...formData, password: encryptedPassword, block: false };

    setHasError(false);
    setIsLoading(true);

    setTimeout(() => {
      registerUser(newUser);
      setIsLoading(false);
      setSuccessMessage('Usuário criado, faça seu login.');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000); 
    }, 2000);
  };

  const handleCepChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 5) {
      input = `${input.slice(0, 5)}-${input.slice(5, 8)}`;
    }
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        zip: input,
      },
    });
    if (input.length === 9) {
      fetchAddress(input.replace('-', ''));
    }
  };

  const fetchAddress = async (zip) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prevData) => ({
          ...prevData,
          address: {
            ...prevData.address,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          address: {
            ...prevData.address,
            zip: '',
          },
        }));
      }
    } catch (error) {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          zip: '',
        },
      }));
    }
  };

  const handleManualAddressToggle = () => {
    setManualAddress(!manualAddress);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'linear-gradient(to top right, #1a1a1a 30%, #3b5b78 60%, #e6e6e6 90%)' }}>
      <div
        className="bg-black text-white p-10 rounded-3xl shadow-lg max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 mt-10 mb-4"
        style={{ backgroundImage: "url('/images/background.avif')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6 font-satoshi">Cadastre-se na tarefa de processo da Genezys</h1>
          <p className="text-lg font-satoshi">
            Complete o formulário ao lado para finalizar o seu cadastro.
          </p>
        </div>

        <div>
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ex: João Pedro"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
              />
              <Input
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
              />
              <Input
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Senha"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
              />
              <Input
                label="Confirmar Senha"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar Senha"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
              />
              <div className="mb-4">
                <label className="block text-[#888888] text-sm mb-2 font-satoshi" htmlFor="cep">
                  CEP
                </label>
                <input
                  id="cep"
                  name="address.zip"
                  type="text"
                  value={formData.address.zip}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full bg-transparent text-[#888888] placeholder-[#888888] border border-[#888888] rounded-md p-2 focus:outline-none focus:bg-[rgba(255,255,255,0.13)] font-satoshi"
                />
              </div>
              <Input
                label="Rua"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Rua"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
                disabled={!manualAddress}
              />
              <Input
                label="Bairro"
                name="address.neighborhood"
                value={formData.address.neighborhood}
                onChange={handleChange}
                placeholder="Bairro"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
                disabled={!manualAddress}
              />
              <Input
                label="Número e complemento"
                name="address.number"
                value={formData.address.number}
                onChange={handleChange}
                placeholder="Número e complemento"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
              />
              <Input
                label="Cidade"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Cidade"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
                disabled={!manualAddress}
              />
              <Input
                label="Estado"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="Estado"
                className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 font-satoshi"
                disabled={!manualAddress}
              />
            </div>

            <div className="flex items-center my-4">
              <input
                type="checkbox"
                id="manualAddress"
                checked={manualAddress}
                onChange={handleManualAddressToggle}
                className="mr-2"
              />
              <label htmlFor="manualAddress" className="text-[#888888]">Não tenho CEP específico</label>
            </div>

            {successMessage ? (
              <Alert type="success" message={successMessage} />
            ) : (
              <Button
                type="submit"
                className={`mt-6 w-full font-bold ${hasError ? '!bg-[rgba(255,34,68,0.15)] !text-[rgb(255,34,68)]' : ''}`}
              >
                {isLoading ? (
                  <div className="spinner mx-auto" style={{ width: '28px', height: '28px' }}></div>
                ) : hasError ? (
                  errorMessage
                ) : (
                  'Cadastrar'
                )}
              </Button>
            )}
          </Form>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
