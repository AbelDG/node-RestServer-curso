const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.use(fileUpload({ useTempFiles: true })) //Todo lo que se suba recae sobre req.files



app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }


    let archivo = req.files.archivo; //Este "archivo" vendrá del postman como body en formato "form-data"

    //Extensiones permitidas
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg', 'JPG'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesPermitidas.join(', ')
            }
        })
    }

    //Cambiar nombre al archivo (para que no se repita)
    //Ej: 5kn547kj54l7k457l-23445.jpg
    nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    if (tiposValidos.includes(tipo)) {
        switch (tipo) {
            case 'usuarios':
                subirArchivo(Usuario, id, res, tipo, archivo, nombreArchivo)
                break;

            case 'productos':
                subirArchivo(Producto, id, res, tipo, archivo, nombreArchivo)
                break;

            default:
                res.json({
                    ok: false,
                    err: {
                        message: 'Tipo no válido'
                    }
                })
        }
    }


});



function subirArchivo(modelo, id, res, tipo, archivo, nombreArchivo) {
    modelo.findById(id, (err, modeloDB) => {
        let modeloString = tipo.slice(0, -1); //coge el tipo y le quita la "s" del final, para pasarlo a singular
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!modeloDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El ${modeloString} no existe`
                }
            })
        }

        borrarArchivo(modeloDB.img, tipo);

        archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        })
        modeloDB.img = nombreArchivo;
        modeloDB.save((err, modelSaved) => {
            let obj = {
                ok: true,
            };
            obj[modeloString] = modelSaved;
            obj['img'] = nombreArchivo;
            return res.json(obj);
        })

    })
}




function borrarArchivo(nombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;