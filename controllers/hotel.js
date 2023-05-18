const { response, request } = require('express');

const Hotel = require('../models/hotel');
const Usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');
const getHoteles = async (req = request, res = response) => {
    ;
    const listaHoteles = await Hotel.find({ estado: true }).populate("habitaciones", "numero costo descripcion")
        .populate("eventos", "nombre precio")
        .populate("servicios", "nombre precio descripcion")
        .populate("administrador", "nombre identificacion")
        .populate("trabajadores", "nombre identificacion")
    console.log(listaHoteles)
    res.json({
        listaHoteles
    });
}

const getHotelesPorId = async (req = request, res = response) => {
    const { id } = req.params;
    const query = { _id: id, estado: true };
    const listaHoteles = await Hotel.findOne(query).populate("habitaciones", "img numero costo capacidad descripcion disponibilidad")
            .populate("eventos", "img nombre precio fechaInicio fechaFinal")
            .populate("servicios", "img nombre precio descripcion")
            .populate("administrador", "img nombre identificacion")
            .populate("trabajadores", "img nombre identificacion")

    res.json({
        listaHoteles
    });

}

const getHotelesPorAdmin = async (req = request, res = response) => {
    const { id } = req.params;
    const { uid } = jwt.verify(id, process.env.SECRET_KEY_FOR_TOKEN);
    const listaUsuarios = await Usuario.findById(uid);
    const listaHoteles = await Hotel.findOne(
        { administrador: listaUsuarios._id }
    ).populate("habitaciones", "numero costo descripcion disponibilidad")
        .populate("eventos", "nombre precio")
        .populate("servicios", "nombre precio descripcion")
        .populate("administrador", "nombre identificacion")
    res.json({
        listaHoteles
    });
}

const getHotelesPorNombre = async (req = request, res = response) => {
    const { nombre } = req.params;
    const query = { nombre: nombre, estado: true };
    const listaHoteles = await Promise.all([
        Hotel.countDocuments(query),
        Hotel.find(query).populate("habitaciones", "numero costo descripcion disponibilidad")
            .populate("eventos", "nombre precio")
            .populate("servicios", "nombre precio descripcion")
            .populate("administrador", "nombre identificacion")
            .populate("trabajadores", "nombre identificacion")
    ]);

    res.json({
        listaHoteles
    });

}

const postHotelesAdmin = async (req = request, res = response) => {
    const administrador = req.usuario.id
    const { nombre, pais, direccion, longitud, latitud, ...resto } = req.body;
    const buscarAdmin = await Hotel.findOne({ administrador: administrador })
    if (buscarAdmin) {
        res.status(400).json({
            msg: `El administrador ${buscarAdmin.administrador}, ya es administrador de un hotel`
        })
    } else {
        const hotelGuardadoDB = new Hotel({ nombre, pais, direccion, administrador, longitud, latitud, ...resto });
        await hotelGuardadoDB.save();
        res.status(201).json(hotelGuardadoDB)
    }
}

const postHotelesSuperAdmin = async (req = request, res = response) => {
    const { nombre, pais, direccion, longitud, latitud, img, administrador, ...resto } = req.body;
    const buscarAdmin = await Hotel.findOne({ administrador: administrador })
    if (buscarAdmin) {
        res.status(400).json({
            msg: `El administrador ${buscarAdmin.administrador}, ya es administrador de un hotel`
        })
    } else {
        const hotelGuardadoDB = new Hotel({ nombre, pais, direccion, administrador, longitud, latitud, ...resto });
        await hotelGuardadoDB.save();
        res.status(201).json(hotelGuardadoDB)
    }
}

const putHotel = async (req = request, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;
    const hotelEditado = await Hotel.findByIdAndUpdate(id, resto, { new: true });
    res.status(201).json(hotelEditado)
}


const agregarTrabajadores = async (req = request, res = response) => {
    const { id } = req.params;
    const { trabajadores } = req.body;
    const hotelEditado = await Hotel.findByIdAndUpdate(id, { $push: { trabajadores: [trabajadores] } }, { new: true });
    res.status(201).json(hotelEditado)
}

const deshabilitarHotel = async (req = request, res = response) => {
    const { id } = req.params;
    const hotelDeshabilitado = await Hotel.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.status(201).json(hotelDeshabilitado)
}

const eliminarHotel = async (req = request, res = response) => {
    const { id } = req.params;
    const hotelEliminado = await Hotel.findByIdAndDelete(id, { new: true });
    res.status(201).json(hotelEliminado)
}

module.exports = {
    getHoteles,
    getHotelesPorId,
    getHotelesPorNombre,
    postHoteles: postHotelesAdmin,
    postHotelesSuperAdmin,
    putHotel,
    deshabilitarHotel,
    eliminarHotel,
    agregarTrabajadores,
    getHotelesPorAdmin
}