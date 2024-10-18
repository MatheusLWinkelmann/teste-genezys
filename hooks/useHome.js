import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CryptoJS from 'crypto-js';

export default function useHome() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const encryptedSessionData = localStorage.getItem('sessionData');
    
    if (!encryptedSessionData) {
      router.push('/login');
      return;
    }

    try {
      const sessionBytes = CryptoJS.AES.decrypt(encryptedSessionData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
      const decryptedSession = JSON.parse(sessionBytes.toString(CryptoJS.enc.Utf8));

      const encryptedUserData = localStorage.getItem('userData');
      let storedUsers = [];
      
      if (encryptedUserData) {
        const userBytes = CryptoJS.AES.decrypt(encryptedUserData, process.env.NEXT_PUBLIC_CRYPTO_KEY);
        storedUsers = JSON.parse(userBytes.toString(CryptoJS.enc.Utf8));
      }
      
      setUsers(storedUsers);

      if (decryptedSession.email === 'admin@admin.com') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão ou usuários:", error);
      router.push('/login');
    }
  }, [router]);

  const handleBlockToggle = (email) => {
    if (email !== 'admin@admin.com') {
      const updatedUsers = users.map(user => {
        if (user.email === email) {
          return { ...user, block: !user.block };
        }
        return user;
      });
      setUsers(updatedUsers);
      const encryptedUpdatedUsers = CryptoJS.AES.encrypt(JSON.stringify(updatedUsers), process.env.NEXT_PUBLIC_CRYPTO_KEY).toString();
      localStorage.setItem('userData', encryptedUpdatedUsers);
    }
  };

  const handleDelete = (email) => {
    if (email !== 'admin@admin.com') {
      const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
      if (confirmDelete) {
        const updatedUsers = users.filter(user => user.email !== email);
        setUsers(updatedUsers);
        const encryptedUpdatedUsers = CryptoJS.AES.encrypt(JSON.stringify(updatedUsers), process.env.NEXT_PUBLIC_CRYPTO_KEY).toString();
        localStorage.setItem('userData', encryptedUpdatedUsers);
      }
    }
  };

  return {
    users,
    isAdmin,
    handleBlockToggle,
    handleDelete,
  };
}
