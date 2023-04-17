const { Schema, model } = require('mongoose');

const HotelSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del hotel es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
    },
    calificacion:{
        type: Number,
        default: 4.5,
    },
    pais: {
        type: String,
        required: [true, 'El pais del hotel es obligatorio']
    },
    direccion: {
        type: String,
        required: [true, 'La direccion del hotel es obligatoria']
    },
    servicios :[{
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
    }],
    administrador:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
    },
    trabajadores :[{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }],
    habitaciones: [{
        type: Schema.Types.ObjectId,
        ref: 'Habitacione',
    }],
    eventos: [{
       type: Schema.Types.ObjectId,
       ref: 'Evento'
    }],
    reservaciones:{
        type: Number, //Asignar automaticamente cuando se complete la reservacion en el detalle de cuenta buscandolo como sucursal en empresas
        default: 0
    },
    img:{
        type: String,
        default: 'Sin imagen'
    },
    location: {
        lat: Number,
        lng: Number
    }
});
module.exports = model('Hotele', HotelSchema);