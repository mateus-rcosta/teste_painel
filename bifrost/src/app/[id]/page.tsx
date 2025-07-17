'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import logo from '../../../public/logo.svg'

export default function RedirectPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const [erro, setErro] = useState(false)

    useEffect(() => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        fetch(`/api/redirect/${id}`, {
            headers: { 'x-timezone': timezone },
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('URL inválida');
            })
            .then(({ redirectUrl }) => {
                window.location.href = redirectUrl;
            })
            .catch(() => setErro(true));
    }, [id]);

    return (
        <main className="flex flex-col items-center justify-center w-full h-full">
            {erro && (
                <dialog className="flex flex-col items-center justify-center text-center rounded-lg bg-branco-background p-8 mx-auto max-w-[90%] md:max-w-[80%]">
                    <div className="flex flex-row w-full items-center align-sub justify-start">
                        <Image src={logo} alt="Logo Londrinet" width={32} height={32} />
                        <span className="text-azul text-lg font-semibold">LONDRINET</span>
                    </div>
                    <div className="p-6">

                        <div className="flex flex-col items-center justify-center gap-4">
                            <p className="text-vermelho font-medium text-lg">
                                Verificamos que o link não é válido ou não foi encontrado. Por
                                favor, verifique se o endereço está correto e tente novamente.
                            </p>
                        </div>

                    </div>
                </dialog>
            )}
        </main>
    )
}
