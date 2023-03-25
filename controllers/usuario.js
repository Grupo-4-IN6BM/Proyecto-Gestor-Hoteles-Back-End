const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

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

const postUsuario = async (req = request, res = response) => {
    const { nombre, edad, correo, password, identificacion, rol } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, edad, correo, password, identificacion, rol });

    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

}

const putUsuario = async (req = request, res = response) => {
    const { id } = req.params;
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

const deleteUsuario = async(req = request, res = response) => {
    const { id } = req.params;
  
    const usuarioEliminado = await Usuario.findByIdAndDelete( id);
    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

const putAdmin = async (req = request, res = response) => {
    const idAdmin = req.usuario.id;
    const { _id, img, estado, google, ...resto } = req.body;

    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(idAdmin, resto, {new: true});

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const deleteAdmin = async(req = request, res = response) => {
    const idAdmin = req.usuario.id;
    const { id } = req.params;
    
    //Eliminar cambiando el estado a false
    const usuarioEliminado = await Usuario.findByIdAndUpdate(idAdmin, { estado: false });

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    putAdmin,
    deleteAdmin
}