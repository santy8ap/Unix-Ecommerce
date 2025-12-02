const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();
dotenv.config({ path: '.env.local' });

async function checkEmailConfig() {
    console.log('🔍 Verificando configuración de email...');

    const config = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? '********' : undefined,
        from: process.env.SMTP_FROM
    };

    console.log('Configuración detectada:', config);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ ERROR: Faltan credenciales SMTP (SMTP_USER o SMTP_PASS)');
        console.log('Por favor verifica tu archivo .env o .env.local');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('📡 Intentando conectar con el servidor SMTP...');
        await transporter.verify();
        console.log('✅ Conexión SMTP exitosa!');
        console.log('Tus credenciales son correctas.');
    } catch (error) {
        console.error('❌ Error de conexión SMTP:', error.message);
        if (error.code === 'EAUTH') {
            console.error('💡 Tip: Verifica tu usuario y contraseña.');
            console.error('   Si usas Gmail, necesitas una "App Password", no tu contraseña normal.');
            console.error('   Crea una aquí: https://myaccount.google.com/apppasswords');
        }
    }
}

checkEmailConfig();
