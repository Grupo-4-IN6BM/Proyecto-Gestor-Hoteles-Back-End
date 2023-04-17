const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    usuario: { 
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    reservacion: {
        type: Schema.Types.ObjectId,
        ref: 'Reservacione',
    },
    fecha: {
        type: Date,
    },
    estado: {
        type: Boolean,
        default: true
    }
});
module.exports = model('Factura', FacturaSchema);