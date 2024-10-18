import React from 'react';
import Button from './Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const router = useRouter();
  const { loggedInUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isHomePage = router.pathname === '/home';
  const isRegisterPage = router.pathname === '/register';

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-gray-300 bg-opacity-60 backdrop-blur-lg z-50">
      <Link href={isHomePage ? '/home' : '/login'}>
        <img src="/images/logo.png" alt="Logo" className="h-12 cursor-pointer" />
      </Link>
      <div className="flex items-center">
        {isHomePage && loggedInUser && (
          <div className="mr-4 text-right">
            <p className="text-[#333333]">Olá, {loggedInUser?.fullName}</p>
            <p className="text-[#888888]">{loggedInUser?.email}</p>
          </div>
        )}
        {isHomePage && (
          <Button
            onClick={handleLogout}
            className="!text-white !bg-black px-4 py-2 font-bold"
          >
            Sair
          </Button>
        )}
        {isRegisterPage && (
          <Button
            onClick={() => router.push('/login')}
            className="!text-white !bg-black px-4 py-2 font-bold"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
