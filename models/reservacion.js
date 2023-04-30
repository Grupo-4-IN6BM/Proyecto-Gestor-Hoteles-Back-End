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
    },
    fechaInicio: {
        type: Date,
    },
    fechaFinal: {
        type: Date,
    },
    habitaciones: [{
        type: Schema.Types.ObjectId,
        ref: 'Habitacione',
    }],
    dias_habitaciones:{
        type: Number,
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
        type: Number
    }
});


module.exports = model('Reservacione', ReservacionSchema);