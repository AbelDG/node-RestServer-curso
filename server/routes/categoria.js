const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ===========================
// Mostrar todas la categorias
// ===========================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion') //Te ordena segun la opcion que le pongas
        .populate('usuario', 'nombre email') //Filtra lo que quieres que se muestre en la respuesta
        .exec((error, categorias) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se ha podido listar las categorias',
                    error
                });
            }

            res.json({
                ok: true,
                message: `El usuario ${req.usuario.nombre} con ID ${req.usuario._id} ha solicitado ver todas las categorias`,
                categorias
            })

        });
});

// ===========================
// Mostrar una categoria por ID
// ===========================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (error, categoria) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                message: `No se ha podido listar la categoria con ID ${id} para el usuario ${req.usuario.nombre}`,
                error
            });
        }

        res.json({
            ok: true,
            message: `Categoría con ID ${id} solicitada por el usuario ${req.usuario.nombre}`,
            categoria
        })
    });
});

// ===========================
// Crear nueva categoria
// ===========================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let userID = req.usuario._id;


    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: userID
    });

    categoria.save((error, newCategory) => {
        if (error) {
            return res.status(400).json({
                OK: false,
                message: `No se ha podido guardar la nueva categoria para el usuario ${req.usuario.nombre}`,
                error
            });
        }
        if (!newCategory) {
            return res.status(400).json({
                ok: false,
                message: `La categoría con ID ${id} no existe`,
                error
            });
        } else {
            return res.json({
                OK: true,
                categoria: newCategory
            });
        }
    });
});

// ===========================
// Cambiar solo descripcion
// ===========================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let newDescription = req.body.descripcion;

    Categoria.findByIdAndUpdate(id, { descripcion: newDescription }, { new: true, useFindAndModify: false }, (error, categoryUpdated) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                message: `No se ha podido cambiar la descripción de la categoria ${id} por el usuario ${req.usuario.nombre}`,
                error
            });
        }

        return res.json({
            ok: true,
            message: `Se ha cambiado la descripción de la categoria ${id} por el usuario ${req.usuario.nombre}`,
            categoria: categoryUpdated
        })
    });
});


// ===========================
// Borrar categoria
// ===========================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Solo un administrador puede borrarla
    let usuario = req.usuario;
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (error, categoryRemoved) => {
        //Error 400
        if (error) {
            res.status(400).json({
                ok: false,
                message: `Ha habido un error al intentar eliminar la categoría con ID ${id}`,
                error
            })
        }
        //Tratamos error por si no existe la ID
        if (!categoryRemoved) {
            res.status(400).json({
                ok: false,
                message: `La categoría con ID ${id} no existe`,
                error
            })
        } else {
            return res.json({
                ok: true,
                message: `El usuario ${usuario.nombre} ha eliminado la categoría con ID ${id}`
            })
        }
    });


});





module.exports = app;