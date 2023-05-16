const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio' ],
    },
    estado: {
        type: Boolean,
        default: true
    },
    hotel:{
        type: Schema.Types.ObjectId,
        ref: 'Hotele',
    }, 
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    img:{
        type: String,
        default: 'Sin imagen'
    }
});


module.exports = model('Servicio', ServicioSchema);