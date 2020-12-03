const user = require('./usuario');
const login = require('./login');
const categoria = require('./categoria');
const producto = require('./producto');
const upload = require('./upload');
const imagenes = require('./imagenes');

const express = require('express');

const app = express();

app.use(user);
app.use(login);
app.use(categoria);
app.use(producto);
app.use(upload);
app.use(imagenes);

module.exports = app;