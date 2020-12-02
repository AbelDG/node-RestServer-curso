const user = require('./usuario');
const login = require('./login');
const categoria = require('./categoria');
const producto = require('./producto');

const express = require('express');

const app = express();

app.use(user);
app.use(login);
app.use(categoria);
app.use(producto);

module.exports = app;