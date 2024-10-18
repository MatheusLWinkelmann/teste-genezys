import React, { useState, useEffect } from 'react';
import { AiOutlineLock, AiFillLock, AiOutlineDelete } from 'react-icons/ai';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { loggedInUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não houver usuário logado, redirecionar para o login
    if (!loggedInUser) {
      router.push('/login');
      return;
    }

    // Carregar usuários do localStorage
    const storedUsers = JSON.parse(localStorage.getItem('userData')) || [];
    setUsers(storedUsers);

    // Verificar se o usuário logado é o administrador
    if (loggedInUser.email === 'admin@admin.com') {
      setIsAdmin(true);
    }
  }, [loggedInUser, router]);

  const handleLogout = () => {
    logout(); // Chamar a função de logout do AuthContext
  };

  const handleBlockToggle = (email) => {
    const updatedUsers = users.map(user => {
      if (user.email === email) {
        return { ...user, block: !user.block }; // Alterna o bloqueio/desbloqueio
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem('userData', JSON.stringify(updatedUsers));
  };

  const handleDelete = (email) => {
    const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmDelete) {
      const updatedUsers = users.filter(user => user.email !== email);
      setUsers(updatedUsers);
      localStorage.setItem('userData', JSON.stringify(updatedUsers));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'linear-gradient(to top right, #1a1a1a 30%, #3b5b78 60%, #e6e6e6 90%)' }}>
      <h1 className="text-4xl satoshi mt-10 mb-10 text-center text-white">
        Usuários
      </h1>

      <table className="table-auto w-full max-w-5xl mb-4 mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white">
            <th className="p-4 font-semibold">Nome</th>
            <th className="p-4 font-semibold">Endereço</th>
            <th className="p-4 font-semibold">E-mail</th>
            {isAdmin && <th className="p-4 font-semibold">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.email} className="text-center border-b border-gray-300 hover:bg-gray-100 transition-colors duration-300">
              <td className="p-4 text-gray-700">{user.fullName}</td>
              <td className="p-4 text-gray-600">{`${user.address.street}, ${user.address.city}, ${user.address.state}`}</td>
              <td className="p-4 text-gray-600">{user.email}</td>
              {isAdmin && (
                <td className="p-4">
                  <button
                    onClick={() => handleBlockToggle(user.email)}
                    className={`mr-4 ${user.block ? 'text-red-500' : 'text-gray-500'} hover:text-red-700 transition-colors duration-300`}
                    title={user.block ? 'Desbloquear usuário' : 'Bloquear usuário'}
                  >
                    {user.block ? <AiFillLock size={20} /> : <AiOutlineLock size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="text-gray-500 hover:text-red-700 transition-colors duration-300"
                    title="Excluir usuário"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <Footer></Footer>
    </div>
  );
}
