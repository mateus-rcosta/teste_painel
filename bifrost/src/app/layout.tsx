import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const metadata: Metadata = {
  title: 'Redirecionando...',
  icons: [
    {
      rel: 'icon',
      url: '/logo.svg',
    },
  ],
};
const myFont = localFont({
  src:[
    {
      path:'../componentes/font/Shentox-Bold.otf',
      weight:'700',
      style:'normal'
    },
    {
      path:'../componentes/font/Shentox-SemiBold.otf',
      weight:'600',
      style:'normal'
    }
    ,
    {
      path:'../componentes/font/Shentox-Medium.otf',
      weight:'500',
      style:'normal'
    }
    ,
    {
      path:'../componentes/font/Shentox-Regular.otf',
      weight:'400',
      style:'normal'
    }
    ,
    {
      path:'../componentes/font/Shentox-Light.otf',
      weight:'300',
      style:'normal'
    }
    ,
    {
      path:'../componentes/font/Shentox-UltraLight.otf',
      weight:'200',
      style:'normal'
    },
    {
      path:'../componentes/font/Shentox-Thin.otf',
      weight:'100',
      style:'normal'
    }
  ]
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br' className={myFont.className}>
      <body className='w-screen h-screen bg-branco-background-darken flex items-center justify-center'>
      <div className='w-full h-full p-8 flex flex-col items-center justify-center overflow-x-auto'>
        {children}
      </div>
      </body>
    </html>
  );
}
