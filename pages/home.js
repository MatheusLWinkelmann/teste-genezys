import React from 'react';
import { AiOutlineLock, AiFillLock, AiOutlineDelete } from 'react-icons/ai';
import Footer from '../components/Footer';
import useHome from '../hooks/useHome';

export default function Home() {
  const { users, isAdmin, isLoading, handleBlockToggle, handleDelete } = useHome();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

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
                    title={user.email === 'admin@admin.com' ? 'Esse usuário não pode ser bloqueado' : (user.block ? 'Desbloquear usuário' : 'Bloquear usuário')}
                    disabled={user.email === 'admin@admin.com'}
                    style={{ cursor: user.email === 'admin@admin.com' ? 'not-allowed' : 'pointer', opacity: user.email === 'admin@admin.com' ? 0.5 : 1 }}
                  >
                    {user.block ? <AiFillLock size={20} /> : <AiOutlineLock size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="text-gray-500 hover:text-red-700 transition-colors duration-300"
                    title={user.email === 'admin@admin.com' ? 'Esse usuário não pode ser excluído' : 'Excluir usuário'}
                    disabled={user.email === 'admin@admin.com'}
                    style={{ cursor: user.email === 'admin@admin.com' ? 'not-allowed' : 'pointer', opacity: user.email === 'admin@admin.com' ? 0.5 : 1 }}
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
