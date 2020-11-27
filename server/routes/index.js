const user = require('./usuario');
const login = require('./login');

const express = require('express');

const app = express();

app.use(user);
app.use(login);

module.exports = app;