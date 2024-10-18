import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import CryptoJS from 'crypto-js';

export default function useLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const encryptedData = localStorage.getItem('loginData') || localStorage.getItem('sessionData');
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setFormData({ email: decryptedData.email, password: decryptedData.password });
        setRememberMe(!!localStorage.getItem('loginData')); 
      } catch (error) {
        console.error("Erro ao descriptografar os dados de login:", error);
        localStorage.removeItem('loginData');
        localStorage.removeItem('sessionData');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setHasError(true);
      setErrorMessage('Preencha os dados');
      return;
    }

    const result = await login(formData.email, formData.password, rememberMe);

    if (result.error) {
      setHasError(true);
      setErrorMessage(result.error);
    } else if (result.success) {
      setHasError(false);
      router.push('/home');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handlePasswordReset = () => {
    setIsPasswordReset(true);
  };

  const handleBackToLogin = () => {
    setIsPasswordReset(false);
  };

  return {
    formData,
    rememberMe,
    showPassword,
    hasError,
    errorMessage,
    isPasswordReset,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    handleRememberMe,
    handlePasswordReset,
    handleBackToLogin,
  };
}
