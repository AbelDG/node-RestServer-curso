const color = require('colors/safe');
// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
// Entorno
// ========================================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ========================================
// Vencimiento token
// ========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';



// ========================================
// SEED de autenticación
// ========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';





// ========================================
// Base de datos
// ========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

console.log(process.env.NODE_ENV);
console.log(`Conectado a la base de datos ${color.yellow(urlDB)}`);
process.env.URLDB = urlDB;


// ========================================
// GOOGLE Client ID
// ========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '486159167123-j1n4dalhqq1jp3vh8dd76a9cjl6c5bq8.apps.googleusercontent.com';