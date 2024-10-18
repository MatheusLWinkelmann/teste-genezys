import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import usePasswordReset from '../hooks/usePasswordReset';

export default function PasswordReset({ onBackToLogin }) {
  const {
    email,
    emailSent,
    hasError,
    errorMessage,
    handleChange,
    handleSubmit,
  } = usePasswordReset();

  return (
    <div className="flex flex-col justify-center h-full max-h-[50vh] mt-10">
      <button
        onClick={onBackToLogin}
        className="flex items-center mb-4 text-[#888888] hover:text-white transition-colors duration-200"
      >
        <AiOutlineArrowLeft size={24} className="mr-2 hover:text-white transition-colors duration-200" />
        <span className="text-lg font-bold">Voltar</span>
      </button>

      {emailSent ? (
        <>
          <h2 className="text-3xl font-bold mb-2 text-white text-left">
            Email enviado! <span role="img" aria-label="check" className="text-green-500">✅</span>
          </h2>
          <p className="text-xl mb-6 text-gray-400 text-left">
            Verifique seu e-mail e abra o link que enviamos para continuar.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-2 text-white text-left">Recupere sua senha</h2>
          <p className="text-xl mb-6 text-gray-400 text-left">
            Insira seu e-mail para receber um link de recuperação
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <Input
              label="E-mail"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Insira seu email aqui"
              className="w-full bg-transparent text-[#888888] border-b border-[#888888] focus:outline-none focus:ring-0 mb-4"
            />
            <Button
              type="submit"
              className={`w-full py-2 font-bold ${hasError ? '!bg-[rgba(255,34,68,0.15)] !text-[rgb(255,34,68)]' : ''}`}
            >
              {hasError ? errorMessage : 'Enviar'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
