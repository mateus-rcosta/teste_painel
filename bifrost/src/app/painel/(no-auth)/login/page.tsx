'use client'
import Image from "next/image";
import logo from '../../../../../public/logo.svg';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/componentes/ui/Input";
import { Botao } from "@/componentes/ui/Botao";


export default function Page() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        router.push('/painel/urls');
      } else {
        const data = await res.json();
        setErro(data.error || 'Falha ao entrar');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErro('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col mx-auto items-center justify-center p-4 gap-4 shadow-lg rounded-lg hover:shadow-2xl bg-branco-background transition-shadow duration-200 border-2 border-gray-200">
        <Image src={logo} alt='Logo Londrinet' width={64} height={64} />
        <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 w-full h-full'>
          <Input
            type='text'
            name='email'
            placeholder='E-mail'
            variant='default'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type='password'
            name='senha'
            placeholder='Senha'
            variant='default'
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          {erro && <span className='text-sm font-medium text-vermelho self-center'>{erro}</span>}
          <Botao
            type='submit'
            disabled={loading}
            texto={loading ? 'Entrando...' : 'Entrar'}
            className='w-full'
          />
        </form>
    </main>
  );
}