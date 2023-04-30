const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    tipo: {
        type: String,
        default: ""
    },
    fechaInicio: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    fechaFinal: {
        type: Date,
        required: [true, 'La fecha de final es obligatoria']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatorio']
    },
    disponibilidad:{
        type: Boolean,
        default: true
    },
    precio:{
        type: Number,
        required:[true, 'el precio es obligatorio']
    },
    img:{
        type: String,
        default: 'Sin imagen'
    },
});

module.exports = model('Evento', EventoSchema);