const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Usuario = require('../models/usuario');
const Habitacion = require('../models/habitacion');
const Evento = require('../models/evento');
const Servicio = require('../models/servicio');
const Hotel = require('../models/hotel');

const coleccionesPermitidas = [
    'usuarios',
    'eventos',
    'habitaciones',
    'servicios',
    'hoteles',
];

const buscarUsuarios = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );
    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] 
        });
    } 
    const regex = new RegExp( termino, 'i');
    const usuarios = await Usuario.find({
        $or: [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]
    });
    res.json({
        results: usuarios
    })
}

const buscarEventos = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );
    if ( esMongoID ) {
        const evento = await Evento.findById(termino);
        return res.json({
            results: ( evento ) ? [ evento ] : [] 
        });
    } 
    const regex = new RegExp( termino, 'i');
    const eventos = await Evento.find({
        $or: [ { nombre: regex }],
        $and: [ { disponibilidad: true } ]
    });
    res.json({
        results: eventos
    })
}

const buscarUsuariosEnHotel = async (req = request, res = response) => {
    const { termino, id } = req.params;
    const esMongoID = ObjectId.isValid(termino);
  
    if (esMongoID) {
      const usuario = await Usuario.findById(termino);
      return res.json({
        results: usuario && usuario.existeEnHotel ? [usuario] : [],
      });
    }
  
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }],
    });
  
    const busquedaHotel = await Hotel.findOne({ _id: id, clientes: { $in: usuarios.map(u => u._id) } });
  
    const usuariosEnHotel = usuarios.filter(usuario =>
      busquedaHotel && busquedaHotel.clientes.includes(usuario._id)
    );
  
    res.json({ results: usuariosEnHotel });
  };
const buscarHabitaciones = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );
    if ( esMongoID ) {
        const habitacion = await Habitacion.findById(termino);
        return res.json({
            results: ( habitacion ) ? [ habitacion ] : [] 
        });
    } 
    const regex = new RegExp( termino, 'i');
    const habitaciones = await Habitacion.find({
        $or: [ { descripcion: regex } ],
        $and: [ { disponibilidad: true } ]
    });
    res.json({
        results: habitaciones
    })
}

const buscarServicios = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );
    if ( esMongoID ) {
        const servicio = await Servicio.findById(termino);
        return res.json({
            results: ( servicio ) ? [ servicio ] : [] 
        });
    } 
    const regex = new RegExp( termino, 'i');
    const servicios = await Servicio.find({
        $or: [ { nombre: regex }],
        $and: [ { estado: true } ]
    });
    res.json({
        results: servicios
    })
}

const buscarHoteles = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );
    if ( esMongoID ) {
        const hotel = await Hotel.findById(termino);
        return res.json({
            results: ( hotel ) ? [ hotel ] : [] 
        });
    }
    const regex = new RegExp( termino, 'i');
    const hoteles = await Hotel.find({
        $or: [ { nombre: regex }, { pais: regex }, {direccion: regex} ],
        $and: [ { estado: true } ]
    });
    res.json({
        results: hoteles
    })
} 

const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
                  Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'eventos':
            buscarEventos(termino, res);
        break;
        case 'habitaciones':
            buscarHabitaciones(termino, res);
        break;
        case 'servicios':
            buscarServicios(termino, res);
        break;
        case 'hoteles':
            buscarHoteles(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'No encontrado.'
            });
        break;
    }
}


module.exports = {
    buscar,
    buscarUsuariosEnHotel
}