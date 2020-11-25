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
// Base de datos
// ========================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://abdogon95:506OfAzwM9TFpECx@cluster0.yn0ja.mongodb.net/cafe?retryWrites=true&w=majority';
}

console.log(`Conectado a la base de datos ${color.yellow(urlDB)}`);
process.env.URLDB = urlDB;