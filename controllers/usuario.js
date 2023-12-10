const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const Reservacion = require('../models/reservacion');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');

const getUsuarios = async (req = request, res = response) => {
    // const id = req.usuario.id;
    // const listaUsuarios = await Usuario.find({ _id: { $ne: id }, estado: true });
    const listaUsuarios = await Usuario.find();
    res.status(200).json(listaUsuarios);
  };

const getUsuarioPorToken = async (req = request, res = response) => {
    const { token } = req.params;
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
    const listaUsuarios = await Usuario.findById(uid);
    res.status(201).json(listaUsuarios);
}

const postUsuarioRegistro = async (req = request, res = response) => {
    let rol = "ROL_CLIENTE"
    const { nombre, edad, correo, password, identificacion,img} = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre: nombre.nombre,
         edad: nombre.edad,
         correo: nombre.correo, 
         password: nombre.password, 
         identificacion: nombre.identificacion, 
         rol: rol,
         img: nombre.img});
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(nombre.password, salt);
    const reservacionAuto = new Reservacion({ usuario: usuarioGuardadoDB._id })
    await reservacionAuto.save();
    await usuarioGuardadoDB.save();
    res.status(201).json({
        usuarioGuardadoDB
    });
}


const postUserAdmin = async (req = request, res = response) => {
    let rol = "ROL_ADMINISTRATIVO"
    const { nombre, edad, correo, password, identificacion,img} = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre: nombre,
         edad: edad,
         correo: correo, 
         password: password, 
         identificacion: identificacion, 
         rol: rol,
         img: img});
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);
    const reservacionAuto = new Reservacion({ usuario: usuarioGuardadoDB._id })
    await reservacionAuto.save();
    await usuarioGuardadoDB.save();
    res.status(201).json({
        usuarioGuardadoDB
    });
}

const postUsuarioSuperAdmin = async (req = request, res = response) => {
    const { nombre, edad, correo, password, identificacion, img } = req.body;

    const usuarioGuardadoDB = new Usuario({ nombre, edad, correo, password, identificacion, img });
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);
    const reservacionAuto = new Reservacion({ usuario: usuarioGuardadoDB._id })
    await reservacionAuto.save();
    await usuarioGuardadoDB.save();
    res.status(201).json({
        usuarioGuardadoDB
    });
}

const putMiUsuario = async (req = request, res = response) => {
    const id = req.usuario.id;
    const {nombre, correo, identificacion, edad, img} = req.body;
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, {
        nombre: nombre,
        correo: correo,
        identificacion: identificacion,
        edad: edad,
        img: img  
    }, { new: true });
    res.status(201).json(usuarioEditado);

}

const putUsuarioSuperAdmin = async (req = request, res = response) => {
    const { _id, estado, ...resto } = req.body;
    if (resto.password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }
    const usuarioEditado = await Usuario.findByIdAndUpdate(resto.id, resto, { new: true });
    res.json({
        usuarioEditado
    });
}

const deleteMiUsuario = async (req = request, res = response) => {
    const id = req.usuario.id;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id, { new: true });
    res.status(201).json(usuarioEliminado);
}

const deleteUsuariosSuperAdmin = async (req = request, res = response) => {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findById(id);
    const eliminado = await Usuario.findByIdAndDelete(id, { new: true });
    res.status(201).json(eliminado);
}

const deleteUsuarios = async (req = request, res = response) => {
    const { id } = req.params;
    const { uid } = jwt.verify(id, process.env.SECRET_KEY_FOR_TOKEN);
    const usuarioEliminado = await Usuario.findById(uid);
    const eliminado = await Usuario.findByIdAndDelete(uid, { new: true });
    res.status(201).json(eliminado);
}

const roles = async (req, res) => {
    try {
        let role = new Role();
        let role2 = new Role();
        let role3 = new Role();
        role.rol = "ROL_ADMINISTRATIVO";
        role2.rol = "ROL_CLIENTE"
        role3.rol = "ROL_SUPERADMIN"
        const rolBusca = await Role.findOne({ rol: role.rol })
        if (rolBusca != null) {
            return console.log("LOS ROLES ESTAN LISTOS");
        } else {
            rol1 = await role.save();
            rol2 = await role2.save();
            rol3 = await role3.save();
            if (!rol1 && !rol2 && !rol3) return console.log("LOS ROLES NO ESTAN LISTOS");
            return console.log("LOS ROLES ESTAN LISTOS");
        }
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    getUsuarios,
    postUsuario: postUsuarioRegistro,
    putUsuario: putMiUsuario,
    deleteUsuario: deleteUsuariosSuperAdmin,
    deleteMiUsuario,
    roles,
    deleteUsuarios,
    getUsuarioPorToken,
    postUsuarioSuperAdmin,
    putUsuarioSuperAdmin,
    postUserAdmin
}