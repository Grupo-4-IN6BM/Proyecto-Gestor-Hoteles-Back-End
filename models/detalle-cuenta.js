const { Schema, model } = require('mongoose');

const Detalle_cuentaSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    habitaciones: [{
         type: Schema.Types.ObjectId,
        ref: 'Habitacion',

     }],
    eventos: [{
        type: Schema.Types.ObjectId,
        ref: 'Evento'
    }],
    total: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true
    }
});


module.exports = model('Detalle_cuenta', Detalle_cuentaSchema);