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
process.env.CADUCIDAD_TOKEN = '24h';



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


console.log(`Conectado a la base de datos ${color.yellow(urlDB)}`);
process.env.URLDB = urlDB;


// ========================================
// GOOGLE Client ID
// ========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '486159167123-mruu05av2mqmi4stqg7hgonf6u7910lk.apps.googleusercontent.com';