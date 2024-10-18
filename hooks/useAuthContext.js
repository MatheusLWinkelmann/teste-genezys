import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/router';

export default function useAuthContext() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const encryptedUserData = localStorage.getItem('userData');
    let storedUsers = [];
  
    if (encryptedUserData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUserData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
        storedUsers = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUsers(storedUsers);
      } catch (error) {
        localStorage.removeItem('userData');
      }
    } else {
      setUsers([]);
    }
  
    const adminUser = storedUsers.find(user => user.email === 'admin@admin.com');
    if (!adminUser) {
      const encryptedAdminPassword = CryptoJS.AES.encrypt('admin', process.env.NEXT_PUBLIC_CRYPTO_KEY).toString();
      const admin = {
        fullName: 'Admin',
        email: 'admin@admin.com',
        password: encryptedAdminPassword,
        block: false,
        address: {
          street: 'Rua da Administração',
          neighborhood: 'Centro',
          number: '123',
          city: 'AdminCity',
          state: 'AdminState',
          zip: '00000-000',
        },
      };
      storedUsers.push(admin);
      const encryptedAdminData = CryptoJS.AES.encrypt(JSON.stringify(storedUsers), process.env.NEXT_PUBLIC_CRYPTO_KEY).toString();
      localStorage.setItem('userData', encryptedAdminData);
      setUsers(storedUsers);
    }
  
    const sessionData = localStorage.getItem('sessionData');
    const loginData = localStorage.getItem('loginData');
  
    if (sessionData || loginData) {
      const encryptedData = sessionData || loginData;
      const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setLoggedInUser(decryptedData);
      setRememberMe(!!loginData);
    } else {
      if (router.pathname === '/home') {
        router.push('/login');
      }
    }
  }, [router]);
  

  const login = (email, password, rememberMeValue) => {
    const encryptedUserData = localStorage.getItem('userData');
    let storedUsers = [];
  
    if (encryptedUserData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUserData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
        storedUsers = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        return { error: 'Erro ao acessar os dados dos usuários' };
      }
    }
  
    const userExists = storedUsers.find((user) => user.email === email);
  
    if (!userExists) {
      return { error: 'E-mail não cadastrado' };
    }
  
    if (userExists.block) {
      return { error: 'Conta bloqueada. Cheque seu e-mail.' };
    }
  
    const decryptedPassword = CryptoJS.AES.decrypt(userExists.password, process.env.NEXT_PUBLIC_CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
      return { error: 'Senha incorreta' };
    }
  
    setLoggedInUser({ fullName: userExists.fullName, email: userExists.email });
    setRememberMe(rememberMeValue);
  
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({ email, password }),
      process.env.NEXT_PUBLIC_CRYPTO_KEY
    ).toString();
  
    localStorage.setItem('sessionData', encryptedData);
  
    if (rememberMeValue) {
      localStorage.setItem('loginData', encryptedData);
    } else {
      localStorage.removeItem('loginData');
    }
  
    return { success: true };
  };  

  const registerUser = (newUser) => {
    const encryptedUserData = localStorage.getItem('userData');
    let storedUsers = [];
  
    if (encryptedUserData) {
      const bytes = CryptoJS.AES.decrypt(encryptedUserData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
      storedUsers = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  
    const userExists = storedUsers.find((user) => user.email === newUser.email);
    if (userExists) {
      return { error: 'E-mail já cadastrado' };
    }
  
    const updatedUsers = [...storedUsers, newUser];
    const encryptedUpdatedUsers = CryptoJS.AES.encrypt(JSON.stringify(updatedUsers), process.env.NEXT_PUBLIC_CRYPTO_KEY).toString();
    localStorage.setItem('userData', encryptedUpdatedUsers);
    setUsers(updatedUsers);
  
    return { success: true };
  };

  const blockUser = (email) => {
    const encryptedUserData = localStorage.getItem('userData');
    let storedUsers = [];

    if (encryptedUserData) {
      const bytes = CryptoJS.AES.decrypt(encryptedUserData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
      storedUsers = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    const updatedUsers = storedUsers.map(user => {
      if (user.email === email) {
        return { ...user, block: !user.block };
      }
      return user;
    });

    const encryptedUpdatedUsers = CryptoJS.AES.encrypt(JSON.stringify(updatedUsers), process.env.NEXT_PUBLIC_CRYPTO_KEY).toString();
    localStorage.setItem('userData', encryptedUpdatedUsers);
    setUsers(updatedUsers);
    return updatedUsers;
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('sessionData');
    if (!rememberMe) {
      localStorage.removeItem('loginData');
    }
    router.push('/login');
  };

  return {
    loggedInUser,
    login,
    registerUser,
    blockUser,
    logout,
  };
}
