const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verficiar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (El correo no existe)'
            });
        }

        //Si el usuario esta activo (estado = false)
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        
        //Verificar la password
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (password incorrecta)'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.rol );
        res.json({
            msg: 'Login PATH',
            correo, password,
            token, rol: usuario.rol,
            nombre: usuario.nombre
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador (BackEnd)'
        });
    }



}


module.exports = {
    login
}