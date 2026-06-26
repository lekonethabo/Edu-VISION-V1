import bcrypt from 'bcryptjs';
import { prisma } from './lib/db';

async function main() {
    const emisRegID = process.env.EMIS_ADMIN_REGID ?? 'EMIS-ADMIN';
    const emisPassword = process.env.EMIS_ADMIN_PASSWORD ?? 'emisPassword123!';
    const schoolRegID = process.env.SCHOOL_ADMIN_REGID ?? 'E5/7/29';
    const schoolPassword = process.env.SCHOOL_ADMIN_PASSWORD ?? 'schoolPassword123!';

    const hashedEmisPassword = await bcrypt.hash(emisPassword, 10);
    const hashedSchoolPassword = await bcrypt.hash(schoolPassword, 10);

    const emisUser = await prisma.user.upsert({
        where: { regID: emisRegID },
        update: {
            password: hashedEmisPassword,
            role: 'EMIS',
            firstLogin: false,
            passwordResetRequired: false,
            isActive: true,
        },
        create: {
            regID: emisRegID,
            password: hashedEmisPassword,
            role: 'EMIS',
            firstLogin: false,
            passwordResetRequired: false,
            isActive: true,
        },
    });

    const school = await prisma.school.upsert({
        where: { id: schoolRegID },
        update: {
            name: 'Example Primary School',
            toolType: 'PRIMARY',
            createdById: emisUser.regID,
        },
        create: {
            id: schoolRegID,
            name: 'Example Primary School',
            toolType: 'PRIMARY',
            createdById: emisUser.regID,
            users: {
                create: {
                    regID: schoolRegID,
                    password: hashedSchoolPassword,
                    role: 'PRIMARY',
                    firstLogin: true,
                    passwordResetRequired: true,
                    isActive: true,
                },
            },
        },
    });

    console.log('EMIS user:', emisUser.regID);
    console.log('School record:', school.id);
    console.log('Use these credentials to log in:');
    console.log(`  EMIS admin: ${emisRegID} / ${emisPassword}`);
    console.log(`  School admin: ${schoolRegID} / ${schoolPassword}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });