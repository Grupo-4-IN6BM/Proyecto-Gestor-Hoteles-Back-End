<<<<<<< Updated upstream
=======
const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    detalle_cuenta: [{
        type: Schema.Types.ObjectId,
        ref: 'Detalle_cuenta',
        required: true
    }],
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true
    }
});
module.exports = model('factura', FacturaSchema);
>>>>>>> Stashed changes
