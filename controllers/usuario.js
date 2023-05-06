const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const Reservacion = require('../models/reservacion');
const jwt = require('jsonwebtoken');
const getUsuarios = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}
const getUsuarioPorToken = async (req = request, res = response) => {

    const {token} = req.params;

    const { uid } = jwt.verify( token, process.env.SECRET_KEY_FOR_TOKEN);

    const listaUsuarios = await Usuario.findById(uid);
    console.log(listaUsuarios)
    res.status(201).json(listaUsuarios);

}

const postUsuario = async (req = request, res = response) => {
    const { nombre, edad, correo, password, identificacion, rol, ...resto } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, edad, correo, password, identificacion, rol, ...resto });

    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);
    const reservacionAuto = new Reservacion( {usuario: usuarioGuardadoDB._id})
    await reservacionAuto.save();
    await usuarioGuardadoDB.save();
    res.status(201).json({
        usuarioGuardadoDB
    });

}

const putMiUsuario = async (req = request, res = response) => {
    const {id} = req.params;
    const { _id, estado, ...resto } = req.body;

    if ( resto.password ) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const putUsuario = async (req = request, res = response) => {
    const id = req.usuario.id;
    const { _id, estado, ...resto } = req.body;

    if ( resto.password ) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const deleteMiUsuario = async(req = request, res = response) => {
    const id = req.usuario.id;
  
    const usuarioEliminado = await Usuario.findByIdAndDelete( id, {new: true});
        res.status(201).json(usuarioEliminado);
}

const deleteUsuario = async(req = request, res = response) => {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findById(id);
    if(usuarioEliminado.rol != "ROL_ADMINISTRATIVO"){
        const eliminado = await Usuario.findByIdAndDelete( id, {new: true});
        res.status(201).json(eliminado); 
    }else{
        res.status(401).json({
            msg: "Un administrador no puede eliminar a otro"
        })
    }
}

// const putAdmin = async (req = request, res = response) => {
//     const idAdmin = req.usuario.id;
//     const { _id, img, estado, google, ...resto } = req.body;

//     if ( resto.password ) {
//         //Encriptar password
//         const salt = bcrypt.genSaltSync();
//         resto.password = bcrypt.hashSync(resto.password, salt);
//     }

//     const usuarioEditado = await Usuario.findByIdAndUpdate(idAdmin, resto, {new: true});

//     res.json({
//         msg: 'PUT editar user',
//         usuarioEditado
//     });

// }

// const deleteAdmin = async(req = request, res = response) => {
//     const idAdmin = req.usuario.id;
    
//     //Eliminar cambiando el estado a false
//     const usuarioEliminado = await Usuario.findByIdAndUpdate(idAdmin, { estado: false });

//     res.json({
//         msg: 'DELETE eliminar user',
//         usuarioEliminado
//     });
// }

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    deleteMiUsuario,
    getUsuarioPorToken
}