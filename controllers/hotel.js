const {response, request} = require('express');

const Hotel = require('../models/hotel');
const Usuario = require('../models/usuario');
const getHoteles = async (req = request, res = response) => {

    const query = { estado: true };

    const listaHoteles = await Promise.all([
        Hotel.countDocuments(query),
        Hotel.find(query).populate("habitaciones", "numero costo descripcion")
        .populate("eventos", "nombre precio")
        .populate("servicios", "nombre precio descripcion")
        .populate("administrador", "nombre identificacion")
        .populate("trabajadores", "nombre identificacion")
    ]);

    res.json({
        listaHoteles
    });

}

const getHotelesPorId = async (req = request, res = response) => {
    const { id } = req.params;
    const query = { _id: id, estado: true };

    const listaHoteles = await Promise.all([
        Hotel.countDocuments(query),
        Hotel.find(query).populate("habitaciones", "numero costo descripcion")
        .populate("eventos", "nombre precio")
        .populate("servicios", "nombre precio descripcion")
        .populate("administrador", "nombre identificacion")
        .populate("trabajadores", "nombre identificacion")
    ]);

    res.json({
        listaHoteles
    });

}

const getHotelesPorNombre = async (req = request, res = response) => {
    const { nombre } = req.params;
    const query = { nombre: nombre , estado:true };
    const listaHoteles = await Promise.all([
        Hotel.countDocuments(query),
        Hotel.find(query).populate("habitaciones", "numero costo descripcion")
        .populate("eventos", "nombre precio")
        .populate("servicios", "nombre precio descripcion")
        .populate("administrador", "nombre identificacion")
        .populate("trabajadores", "nombre identificacion")
    ]);

    res.json({
        listaHoteles
    });

}

const postHoteles = async (req = request, res = response) => {
    const id = req.usuario.id
    const administrador = req.usuario.id
    const { nombre, pais, direccion, ...resto} = req.body;
    const hotelGuardadoDB = new Hotel({ nombre,pais,direccion,administrador,...resto });

    await hotelGuardadoDB.save();
    res.status(201).json(hotelGuardadoDB)

}

const putHotel = async (req = request, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    const hotelEditado = await Hotel.findByIdAndUpdate(id, resto, {new: true});

    res.status(201).json(hotelEditado)

}

const agregarTrabajadores = async (req = request, res = response) => {
    const { id } = req.params;
    const { trabajadores } = req.body;

    const hotelEditado = await Hotel.findByIdAndUpdate(id, {$push:{trabajadores:[trabajadores]}}, {new: true});

    res.status(201).json(hotelEditado)

}

const deshabilitarHotel = async(req = request, res = response) => {
    const { id } = req.params;
  
    const hotelDeshabilitado = await Hotel.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.status(201).json(hotelDeshabilitado)
}

const eliminarHotel = async(req = request, res = response) => {
    const { id } = req.params;
  
    const hotelEliminado = await Hotel.findByIdAndDelete(id, {new: true});
    res.status(201).json(hotelEliminado)
}

module.exports = {
    getHoteles,
    getHotelesPorId,
    getHotelesPorNombre,
    postHoteles,
    putHotel,
    deshabilitarHotel,
    eliminarHotel,
    agregarTrabajadores
}