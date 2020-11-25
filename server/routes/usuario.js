const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/usuario');

const app = express();

//Funcion de error

function getError(error, statusCode) {
    if (error) {
        return res.status(statusCode).json({
            ok: false,
            error
        })
    }
}

app.get('/usuario', function(req, res) {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            getError(err, 400);
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    UsuariosTotales: conteo
                })
            })
        });
})
app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => { //funcion de mongoose
        getError(err, 400);

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id; ///usuario/:ID -> req.params.ID <--> Es decir, esas ID deben coincidir en nombre
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado']); //Para filtrar que elementos del objeto quiero que se puedan modificar

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        getError(err, 400);
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let deshabilitado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, deshabilitado, { new: true }, (err, usuarioBorrado) => {
        getError(err, 400);

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})

module.exports = app;