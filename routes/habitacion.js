const { Router } = require('express');
const { check } = require('express-validator');
const { getHabitaciones, postHabitacion, putHabitacion, deleteHabitacion, getHabitacionesPorId } = require('../controllers/habitacion');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getHabitaciones);

router.get('/mostrar/:id',[
    check('id', 'No es un ID válido').isMongoId(),
], getHabitacionesPorId);

router.post('/agregar', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('numero', 'El numero de habitacion es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('capacidad', 'La capacidad de la habitacion es obligatoria').not().isEmpty(),
    check('costo', 'El costo es necesario').not().isEmpty(),
    validarCampos,
] ,postHabitacion);


router.put('/editar/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un ID válido').isMongoId(),
    check('numero', 'El numero de habitacion es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('capacidad', 'La capacidad de la habitacion es obligatoria').not().isEmpty(),
    check('costo', 'El costo es necesario').not().isEmpty(),
    validarCampos
] ,putHabitacion);

router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,deleteHabitacion);

module.exports = router;