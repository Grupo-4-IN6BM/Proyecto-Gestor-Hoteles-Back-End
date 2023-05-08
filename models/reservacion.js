const { Schema, model } = require('mongoose');

const ReservacionSchema = Schema({
    personaReserva: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cantidadPersonas: {
        type: Number,
        default: 0
    },
    fechaInicio: {
        type: Date,
        default: Date.now()
    },
    fechaFinal: {
        type: Date,
        default: Date.now()
    },
    habitaciones: [{
        type: Schema.Types.ObjectId,
        ref: 'Habitacione',
    }],
    dias_habitaciones:{
        type: Number,
        default: 0
    },
    servicios: [{
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
    }],
    eventos: [{
        type: Schema.Types.ObjectId,
        ref: 'Evento',
    }],
    hotel:{
        type: Schema.Types.ObjectId,
        ref: 'Hotele',
    },
    total:{
        type: Number,
        default: 0
    }
});


module.exports = model('Reservacione', ReservacionSchema);