import { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function usePasswordReset() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encryptedUserData = localStorage.getItem('userData');
    let users = [];

    if (encryptedUserData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUserData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
        users = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        setHasError(true);
        setErrorMessage('Erro ao acessar os dados dos usuários');
        return;
      }
    }

    const userExists = users.find((user) => user.email === email);

    if (!userExists) {
      setHasError(true);
      setErrorMessage('E-mail não cadastrado');
      return;
    }

    setHasError(false);
    setEmailSent(true);
  };

  return {
    email,
    emailSent,
    hasError,
    errorMessage,
    handleChange,
    handleSubmit,
  };
}
