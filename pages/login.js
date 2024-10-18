import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Link from 'next/link';
import PasswordReset from './password-reset';
import useLogin from '../hooks/useLogin';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Login() {
  const {
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
  } = useLogin();

  return (
    <div className="min-h-screen grid grid-cols-5" style={{ background: 'linear-gradient(to top right, #1a1a1a 30%, #3b5b78 60%, #e6e6e6 90%)' }}>
      <div className="col-span-3 text-white p-4 mt-12 rounded-xl shadow-lg max-w-xl max-h-96 mx-auto grid grid-cols-1 gap-4 relative" style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>
        <div className="flex flex-col justify-center text-center relative z-10">
          <h1 className="text-2xl font-bold mb-10 font-satoshi text-gray-100">
            Construa sua independência financeira, investindo com segurança e estratégia.
          </h1>
          <p className="text-lg font-satoshi mb-10 text-gray-300">
            Invista de forma consciente e estratégica. Acesse as melhores oportunidades com a nossa plataforma.
          </p>
          <div className="w-96 bg-white rounded-xl"></div>
        </div>
      </div>

      <div className="col-span-2 flex" style={{ background: '#1a1a1a', padding: '2.5rem' }}>
        <div className="w-full max-w-md">
          {isPasswordReset ? (
            <div className="h-full flex flex-col">
              <PasswordReset onBackToLogin={handleBackToLogin} />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2 text-white">Olá, seja bem-vindo(a) 👋</h2>
              <p className="mb-6 text-gray-400">Faça o login para entrar na sua conta</p>

              <form onSubmit={handleSubmit}>
                <Input
                  label="E-mail"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="Insira seu email aqui"
                  className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 mb-4"
                />
                <div className="relative w-full mb-4">
                  <Input
                    label="Senha"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0"
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 bottom-3 text-gray-500">
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center text-gray-400">
                    <input type="checkbox" className="mr-2" checked={rememberMe} onChange={handleRememberMe} />
                    Lembrar das informações
                  </label>
                  <Link href="#" onClick={handlePasswordReset} className="text-blue-500">
                    Esqueci a senha
                  </Link>
                </div>

                <Button type="submit" hasError={hasError} className="w-full py-2 font-bold">
                  {hasError ? errorMessage : 'Entrar'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-gray-400">
                  É novo por aqui?{' '}
                  <Link href="/register" className="text-blue-500">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
