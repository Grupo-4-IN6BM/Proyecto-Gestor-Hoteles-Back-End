<<<<<<< Updated upstream
=======
const { Schema, model } = require('mongoose');

const HabitacionSchema = Schema({
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
    }
});
module.exports = model('Habitacion', HabitacionSchema);
>>>>>>> Stashed changes
