const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

// =======================
// Obtener productos
// =======================

app.get('/productos', verificaToken, (req, res) => {
    // 1-Traer todos los productos
    // 2-Cargar usuario y categoria con populate
    // 3-paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, productos) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: `Ha habido un error al listar los productos`,
                    error
                })
            }

            return res.json({
                ok: true,
                Productos: productos
            })
        });
});

// =======================
// Obtener producto por ID
// =======================

app.get('/productos/:id', verificaToken, (req, res) => {
    // 2-Cargar usuario y categoria con populate
    let body = req.body;
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, producto) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    message: `Ha habido un error al listar el producto`,
                    error
                })
            }

            return res.json({
                ok: true,
                producto
            })
        });
});
// =======================
// Buscar productos
// =======================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, producto) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            return res.json({
                ok: true,
                producto
            })
        });
});




// =======================
// Crear productos
// =======================

app.post('/productos', verificaToken, (req, res) => {
    // 1-Grabar usuario
    // 2-Grabar categoria

    let body = req.body;
    let usuario = req.usuario;

    Categoria.findOne({ descripcion: body.categoria }, (error, categoria) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: `Ha habido un error al buscar la categoría seleccionada`,
                error
            })
        }
        if (!categoria) {
            return res.status(412).json({
                ok: false,
                message: `No se ha encontrado ninguna categoria llamada ${body.categoria}`,
                error
            })
        } else {
            let producto = new Producto({
                nombre: body.nombre,
                precioUni: body.precioUni,
                descripcion: body.descripcion,
                disponible: body.disponible,
                categoria: categoria._id,
                usuario: usuario._id
            })

            producto.save((error, newProduct) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        message: `No se ha podido crear el nuevo producto`,
                        error
                    })
                }

                return res.status(201).json({
                    ok: true,
                    message: `El usuario ${usuario.nombre} ha creado el producto con ID ${newProduct._id} correctamente`,
                    Producto: newProduct
                })
            });
        }

    });


});

// =======================
// Actualizar producto
// =======================

app.put('/productos/:id', verificaToken, (req, res) => {
    // 1-Grabar usuario
    // 2-Grabar categoria
    let body = req.body;
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { categoria: body.categoria, usuario: body.usuario }, { new: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, newProduct) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    message: `No se ha podido modificar el producto con ID ${id}`,
                    error
                })
            }
            if (!newProduct) {
                return res.status(500).json({
                    ok: false,
                    message: `El producto con ID ${id} no existe`,
                    error
                })
            }
            return res.json({
                ok: true,
                producto: newProduct
            })
        })
});

// =======================
// Borrar producto
// =======================

app.delete('/productos/:id', (req, res) => {
    // 1-Disponible = false
    let body = req.body;
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, deletedProduct) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: `No se ha podido eliminar el producto con ID ${id}`,
                    error
                })
            }

            return res.json({
                ok: true,
                Producto: deletedProduct
            })
        });
});
























module.exports = app;