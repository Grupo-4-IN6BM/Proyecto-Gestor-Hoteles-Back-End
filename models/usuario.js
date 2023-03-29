const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
    },
    identificacion: {
        type: String,
        required: [true, 'La identificacion es obligatoria' ]
    },
    rol: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        default: true
    },
});

module.exports = model('Usuario', UsuarioSchema);