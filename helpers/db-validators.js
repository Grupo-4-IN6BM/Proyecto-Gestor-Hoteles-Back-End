const Tipo = require('../models/tipo-evento');
const Usuario = require('../models/usuario');
const Rol = require('../models/role');
const Hotel = require('../models/hotel');
const moment = require('moment');

const esTipoValido = async( tipo = '' ) => {
    const existeTipo = await Tipo.findOne( { tipo } );
    if ( !existeTipo ) {
        throw new Error(`El tipo ${ tipo } no está registrado en la DB`);
    }
}
const esRoleValido = async( rol = '' ) => {
    const existeRol = await Rol.findOne( { rol } );
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }
}
const emailExiste = async( correo = '' ) => {
    const existeEmail = await Usuario.findOne( { correo } );
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }
}
const existeUsuarioPorId = async(id) => {
    const existeUser = await Usuario.findById(id);
    if ( !existeUser ) {
        throw new Error(`El usuario con el id ${ id }, no existe en la DB`);
    }
}
const existeReservacionPorId = async(id) => {
    const existeReservacion = await Reservacion.findById(id);
    if ( !existeReservacion ) {
        throw new Error(`La reservacion con el id ${ id }, no existe en la DB`);
    }
}
const existeServicioPorId = async(id) => {
    const existeServicio = await Servicio.findById(id);
    if ( !existeServicio ) {
        throw new Error(`El servicio con el id ${ id }, no existe en la DB`);
    }
}
const existeHotelPorId = async(id) => {
    const existeHotel = await Hotel.findById(id);
    if ( !existeHotel ) {
        throw new Error(`El hotel con el id ${ id }, no existe en la DB`);
    }
}
const existeHotelPorNombre = async(nombre) => {
    const existeHotelNombre = await Hotel.findOne({nombre: nombre});
    if ( !existeHotelNombre ) {
        throw new Error(`El hotel con el nombre ${ nombre }, no existe en la DB`);
    }
}
const existeTipoPorId = async (id) => {
    const existeTipo = await Tipo.findById(id);
    if(!existeTipo) {
        throw new Error(`El tipo con el id ${id}, no existe en la DB`);
    }
}
const identificacionExiste = async(identificacion = '')=>{
    const existeIdentificacion = await Usuario.findOne({identificacion: identificacion})
    if(existeIdentificacion) {
        throw new Error(`La identificacion ingresada ya se encuentra en la base de datos y le pertenece a ${existeIdentificacion.nombre}`);
    }
}




const esFecha = (value, { req, location, path  }) => {

    if( !value ) {
        return false;
    }

    const fecha = moment( value );
    if( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }

}


module.exports = {
    esTipoValido,
    emailExiste,
    existeUsuarioPorId,
    esRoleValido,
    existeReservacionPorId,
    existeServicioPorId,
    existeHotelPorNombre,
    existeHotelPorId,
    existeTipoPorId,
    identificacionExiste,
    esFecha
}