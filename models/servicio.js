const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    precio: {
        type: String,
        required: [true, 'El precio es obligatorio' ],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});


module.exports = model('Servicio', ServicioSchema);