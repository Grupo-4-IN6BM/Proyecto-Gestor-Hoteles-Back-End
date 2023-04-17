const { Schema, model } = require('mongoose');

const ReservacionSchema = Schema({
    personaReserva: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cantidadPersonas: {
        type: Number,
        required: true,
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFinal: {
        type: Date,
        required: true
    },
    habitaciones: [{
        type: Schema.Types.ObjectId,
        ref: 'Habitacione',
        required: true
    }],
    dias_habitaciones:[{
        type: Number,
        required: true,
    }],
    servicios: [{
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
        required: true
    }],
    eventos: [{
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    }],
    hotel:{
        type: Schema.Types.ObjectId,
        ref: 'Hotele',
    },
    total:{
        type: Number
    }
});


module.exports = model('Reservacione', ReservacionSchema);