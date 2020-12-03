const express = require('express');

const fs = require('fs');
const path = require('path');
const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion');


const app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let ImagePath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/noImage.png');

    if (fs.existsSync(ImagePath)) {
        res.sendFile(ImagePath);
    } else {
        res.sendFile(noImagePath);
    }


});






























module.exports = app;