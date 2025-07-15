import logo from '../../public/logo.svg';
import Image from 'next/image';

export default function NotFound() {
    return (
        <main className='flex flex-col items-center justify-center w-full h-full'>
            <dialog className='flex flex-col items-center justify-center text-center rounded-lg bg-branco-background p-4 mx-auto max-w-[90%] md:max-w-[80%] hover:shadow-sm shadow-2xl transition-shadow duration-200 border-2 border-gray-200'>
                <div className='flex flex-row w-full items-center align-sub justify-start'>
                    <Image src={logo} alt='Logo Londrinet' width={32} height={32} />
                    <span className='text-azul text-lg font-semibold'>LONDRINET</span>
                </div>
                <div className='p-6'>
                    <h1 className='font-bold text-vermelho text-2xl mb-2'>
                        <span>404</span>: página não encontrada
                    </h1>
                    <p className='text-azul text-lg font-medium'>
                        Por favor, verifique se o endereço está correto e tente novamente.
                    </p>
                </div>
            </dialog>
        </main>
    )
}