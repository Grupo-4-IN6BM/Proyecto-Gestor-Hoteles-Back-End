const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Usuario = require('../models/usuario');
const Habitacion = require('../models/habitacion');
const Evento = require('../models/evento');
const Servicio = require('../models/servicio');

const coleccionesPermitidas = [
    'usuarios',
    'eventos',
    'habitaciones',
    'servicios',
];


const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE
    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( usuario ) ? [ usuario ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
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

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const eventos = await Evento.find({
        $or: [ { nombre: regex }],
        $and: [ { estado: true } ]
    });

    res.json({
        results: eventos
    })

}

const buscarHabitaciones = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const habitacion = await Habitacion.findById(termino);
        return res.json({

            results: ( habitacion ) ? [ habitacion ] : [] 
        });
    } 
    const regex = new RegExp( termino, 'i');

    const habitaciones = await Producto.find({
        $or: [ { numero: regex } ],
        $and: [ { estado: true } ]
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

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const servicios = await Servicio.find({
        $or: [ { nombre: regex }],
        $and: [ { estado: true } ]
    });

    res.json({
        results: servicios
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
        default:
            res.status(500).json({
                msg: 'No encontrado.'
            });
        break;
    }

}


module.exports = {
    buscar
}