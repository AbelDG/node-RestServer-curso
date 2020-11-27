const jwt = require('jsonwebtoken');


// ====================
// Verificar TOKEN
// ====================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //req.get para conseguir los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ //401 = No autorizado
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario; //Decoded es la información que lleva el token
        next(); //Si no utilizamos next al final del middleware, jamás se ejecutará el resto de código de la petición get, post, put etc...
    })
};

// ====================
// Verificar AdminRole
// ====================

let verificaAdminRole = (req, res, next) => {
    let rol = req.usuario.role;

    if (rol != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: `El usuario ${req.usuario.nombre} no tiene permisos de administrador`
            }
        })
    } else {
        next();
    }


}






module.exports = {
    verificaToken,
    verificaAdminRole
}