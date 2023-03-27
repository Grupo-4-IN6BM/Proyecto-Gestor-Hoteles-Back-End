const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    tipo: {
        type: String,
        default: ""
        // // required: [true, 'El correo es obligatorio' ],
        // unique: true
    },
    horaInicio: {
        type: Date,
        required: [true, 'La hora de inicio es obligatoria']
    },
    horaFinal: {
        type: Date,
        required: [true, 'La hora de final es obligatoria']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatorio']
    },
    disponibilidad:{
        type: Boolean,
        required: [true, 'la disponibilidad es obligatoria']

    },
    precio:{
        type: Number,
        required:[true, 'el precio es obligatorio']
    }
});

module.exports = model('Evento', EventoSchema);