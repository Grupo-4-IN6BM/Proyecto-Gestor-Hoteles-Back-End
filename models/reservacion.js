const { Schema, model } = require('mongoose');

const ReservacionSchema = Schema({
    personaReserva: [{
        type: String,
        required: true
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaHora: {
        type: Date,
        required: true
    },
    habitacion: {
        type: Schema.Types.ObjectId,
        ref: 'Habitacion',
        required: true
    }
});


module.exports = model('Reservacion', ReservacionSchema);