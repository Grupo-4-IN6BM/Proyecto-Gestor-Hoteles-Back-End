const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    edad: {
        type: Number,
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        default: ""
       //no required: por el auth social con google y/o facebook
    },
    identificacion: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        default: true
    },
    reservacion:[{
        type: Schema.Types.ObjectId,
        ref: 'Reservacione',
    }],
    img:{
        type: String,
        default: 'Sin imagen'
    }
});


module.exports = model('Usuario', UsuarioSchema);