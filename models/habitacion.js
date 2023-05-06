const { Schema, model } = require('mongoose');

const HabitacionSchema = Schema({
    tipo:{
        type: String,
        required: [true, 'El tipo de la habitacion es necesario']
    },
    numero: {
        type: Number,
        required: [true, 'El número de habitación es obligatorio']
    },
    disponibilidad: {
        type: Boolean,
        default: true,
    },
    costo: {
        type: Number,
        required: [true, 'El costo es obligatorio']
    },
    capacidad: {
        type: Number,
        required: [true, 'La capacidad es obligatoria']
    },
    hotel:{
        type: Schema.Types.ObjectId,
        ref: 'Hotele',
    },
    descripcion:{
        type: String,
        required: true
    },
    img:{
        type: String,
        default: 'Sin imagen'
    }
});
module.exports = model('Habitacione', HabitacionSchema);