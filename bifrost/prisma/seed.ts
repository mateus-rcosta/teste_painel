import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seed rodando...');
    const senhaCriptografada = await bcrypt.hash('admin123', 10);

    const admin = await prisma.usuario.upsert({
        where: { email: 'admin@dominio.com' },
        update: {},
        create: {
            nome: 'Admin',
            email: 'admin@dominio.com',
            senha: senhaCriptografada,
            ehAdmin: true,
        },
    });

    console.log(`Admin criado: ${admin.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });