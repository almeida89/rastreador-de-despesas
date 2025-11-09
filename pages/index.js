import { useState, useEffect } from 'react';
// 'Head' nos permite adicionar coisas ao <head> do HTML, como o título.
import Head from 'next/head';

export default function Home() {
  // ------------------------------------------
  // ESTADOS DO COMPONENTE (React Hooks)
  // ------------------------------------------

  // Estado para armazenar a lista de despesa que vem da API.
  const [expenses, setExpenses] = useState([]);

  // Estados para controlar os campos do formulário.
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(''); // O valor será uma string no início

  // Estado para feedback ao usuário (loading, erros, etc.)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ------------------------------------------
  // FUNÇÕES DE LÓGICA (Data Fetching & Handlers)
  // ------------------------------------------

  // Função para BUSCAR (READ) todas as despesas da nossa API.
  const fetchExpenses = async () => {
    setIsLoading(true); // Começa o carregamento
    setError(null); // Limpa erros antigos

    try {
      // Faz uma requisição GET para nossa API
      const response = await fetch('/api/expenses');

      if (!response.ok) {
        // Se a resposta não for 200 (OK), joga um erro.
        throw new Error('Falha ao buscra despesas.');
      }

      const data = await response.json();
      setExpenses(data); // Atualiza o estado com as despesas

    } catch (err) {
      setError(err.message); // Captura o erro

    } finally {
      setIsLoading(false); // Termina o carregamento (sucesso ou falha)
    }
  };

  // 'useEffect' é um Hook que roda quando o componente "monta" (carrega).
  // O array vazio [] no final significa "rode esta função apenas uma vez".
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Função para CRIAR (CREATE) uma nova despesa.
  const handleSubmit = async (e) => {
    // Previne o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();

    // Validação simples no frontend
    if (!description || !amount) {
      alert('Por favor, preenchar a descrição e o valor.');
      return;
    }

    setIsLoading(true);

    try {
      // Faz uma requisição POST para nossa API
      const response = await fetch('/api/expenses', {
        method: 'POST',
        // Headers informam à API que estamos enviando JSON
        headers: {
          'Content-Type': 'application/json',
        },
        // 'body' é o dado que queremos enviar, convertido para string JSON
        body: JSON.stringify({ description, amount }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar despesa.');
      }

      // Limpa o formulário
      setDescription('');
      setAmount('');

      // Re-busca as despesas para atualizar a lista (incluindo a nova)
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para DELETAR (DELETE) uma despesa.
  const handleDelete = async (id) => {
    // Confirmação simples
    if (!confirm('Tem certeza que deseja deletar esta despesa?')) {
      return;
    }

    setIsLoading(true);

    try {
      // Faz uma requisição DELETE para a API dinâmica
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar despesa.');
      }

      // Re-busca as despesas para atualizar a lista (sem a deletada)
      await fetchExpenses();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para formatar os centavos (Ex: 1050 -> "R$ 10,50")
  const formatCurrency = (valueInCents) => {
    // 'valueInCents' vem do DB (ex: 1050)
    // Dividimos por 100 para obter o valor em Reais (ex: 10.5)
    return (valueInCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // ------------------------------------------
  // FUNÇÕES DE LÓGICA (Data Fetching & Handlers)
  // ------------------------------------------
  return (
    <>
      <Head>
        <title>Rastreador de Despesas</title>
      </Head>

      {/* Container Principal */}
      <main className="container mx-auto max-w-2xl p-4 mt-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
          Rastreador de Despesas
        </h1>

        {/* --- Formulário de Criação (CREATE) --- */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Input: Descrição */}
            <div className="w-full md:flex-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Descrição
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Café da tarde"
                className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Input: Valor */}
            <div className="w-full md:w-1-3">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Valor (R$)
              </label>
              <input
                id="amount"
                type="number" // Usamos 'number' para o teclado numérico
                step="0.01" // Permite decimais
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 10.50"
                className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isLoading} // Desabilita o botão enquanto carrega
            className="mt-4 w-full px-4 py-2 bg-blue-600 rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isLoading ? 'Adicionando...' : 'Adicionar Despesa'}
          </button>
        </form>

        {/* --- Exibição de Erros --- */}
        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-md md-6 text-center">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {/* --- Lista de Despesas (READ & DELETE) --- */}
        <div className="bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold p-6 border-b border-gray-700">
            Histórico
          </h2>

          {/* Estado de Carregamento */}
          {isLoading && expenses.length === 0 && (
            <p className="p-6 text-center text-gray-400">Carregando...</p>
          )}

          {/* Estado Vazio */}
          {!isLoading && expenses.length === 0 && (
            <p className="p-6 text-center text-gray-400">Nenhuma despesa registrada</p>
          )}

          {/* A Lista */}
          <ul className="divide-y divide-gray-700">
            {expenses.map((expense) => (
              <li
                key={expense.id} // Chave única para o React (obrigátorio)
                className="flex items-center justify-between p-4 hover:bg-gray-700">
                <div>
                  <p className="text-lg font-medium">{expense.description}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(expense.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Valor Formatado */}
                  <span className="text-xl font-semibold text-red-400">
                    - {formatCurrency(expense.amount)}
                  </span>

                  {/* Botão de Deletar (DELETE) */}
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:online-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
