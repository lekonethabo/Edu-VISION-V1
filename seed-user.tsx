import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Parse DATABASE_URL to establish connection options
const dbUrl = new URL(process.env.DATABASE_URL || "");

const dbAdapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1),
    connectTimeout: 10000, // Increase connection timeout to 10 seconds
    ssl: {
        rejectUnauthorized: false
    }
});

const prisma = new PrismaClient({ adapter: dbAdapter });

async function main() {
    const regID = 'E5/7/29';
    const plainPassword = 'password321'; // Replace with your desired password

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create the user
    const user = await prisma.user.create({
        data: {
            regID: regID,
            password: hashedPassword,
        },
    });

    console.log('Created user:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });