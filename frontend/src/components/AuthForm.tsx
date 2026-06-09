import React, { useState } from 'react';
import { api } from '../services/api';

interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const data = await api.login(email, password);
        localStorage.setItem('@UPStudent:token', data.token);
        onAuthSuccess(data.token);
      } else {
        await api.register(email, password, name);
        setIsLogin(true); 
        alert('Conta criada com sucesso! Faça seu login.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold text-blue-600 mb-6">
          {isLogin ? 'UPStudent 🎓' : 'Criar Conta'}
        </h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-600">Nome</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-lg focus:outline-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-600">E-mail</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Senha</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? 'Novo por aqui? ' : 'Já tem uma conta? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 font-semibold hover:underline"
          >
            {isLogin ? 'Crie uma conta' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
};