import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import CryptoJS from 'crypto-js';

export default function useRegister() {
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
      zip: '',
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

    const encryptedPassword = CryptoJS.AES.encrypt(formData.password, process.env.NEXT_PUBLIC_CRYPTO_KEY).toString();
    const newUser = { ...formData, password: encryptedPassword, block: false };

    setIsLoading(true);
    setHasError(false);

    setTimeout(() => {
      const result = registerUser(newUser);

      if (result.error) {
        setHasError(true);
        setErrorMessage(result.error);
        setIsLoading(false);
      } else {
        setSuccessMessage('Usuário criado, faça seu login.');
        setIsLoading(false);

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
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

  return {
    formData,
    isLoading,
    hasError,
    errorMessage,
    successMessage,
    manualAddress,
    handleChange,
    handleSubmit,
    handleCepChange,
    handleManualAddressToggle,
  };
}
