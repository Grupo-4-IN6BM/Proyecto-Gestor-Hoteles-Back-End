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

module.exports = {
    getUsuarios,
    postUsuario,
}