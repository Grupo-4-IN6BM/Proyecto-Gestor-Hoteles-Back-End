const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Factura = require('../models/factura');
const Habitacion = require('../models/habitacion');
const Usuario = require('../models/usuario');
const Reservacion = require('../models/reservacion');

const getMiFactura = async (req = request, res = response) => {
    const id = req.usuario.id
    const query = { usuario: id, estado:true}
    const listaFactura = await Factura.find(query).populate('usuario', 'nombre')
        .populate({
          path: 'reservacion',
          populate: [
              { path: 'hotel', select: 'nombre direccion' },
              { path: 'habitaciones', select: 'numero costo' },
              { path: 'servicios', select: 'nombre precio' },
              { path: 'eventos', select: 'nombre descripcion precio' }
          ]
        });
    
    res.status(201).json(listaFactura);
}

const getFacturas = async (req = request, res = response) => {
    const listaFactura = await Factura.find().populate('usuario', 'nombre')
        .populate({
          path: 'reservacion',
          populate: [
              { path: 'hotel', select: 'nombre direccion' },
              { path: 'habitaciones', select: 'numero costo' },
              { path: 'servicios', select: 'nombre precio' },
              { path: 'eventos', select: 'nombre descripcion precio' }
          ]
        });
    res.status(201).json(listaFactura);
}

const postFactura = async (req, res) => {
    const id = req.usuario._id
    const today = new Date();
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'America/New_York'
    };
    const date = today.toLocaleDateString('en-US', options);
    const buscaCuenta = await Reservacion.findOne({usuario: id});
    const data = {
        usuario: id,
        fecha: date,
        reservacion: buscaCuenta._id 
    }
    for(let i= 0; i< buscaCuenta.habitaciones.length; i++){
        const cambioDisponibilidad = await Habitacion.findByIdAndUpdate(buscaCuenta.habitaciones[i]._id, {disponibilidad: true})
    }
    const factura = await Factura(data);
        await factura.save();
        res.status(201).json(factura)
}


module.exports = {
    getFacturas,
    getMiFactura,
    postFactura
}