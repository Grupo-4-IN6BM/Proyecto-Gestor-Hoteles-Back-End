const { Router } = require('express');
const { check } = require('express-validator');
const { getReservaciones, getReservacionPorId, postReservacion, putReservacion, deleteReservacion, putAgregarPersona, deleteMiReservacion, putMiReservacion, agregarHabitacion, agregarServicio, agregarEvento, getMiReservacion, postReservacionUsuario } = require('../controllers/reservacion');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { existeReservacionPorId, esFecha } = require('../helpers/db-validators');

const router = Router();

router.get('/', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    validarCampos
], getReservaciones);

router.get('/miReservacion', [
    validarJWT,
    validarCampos
], getMiReservacion);

router.get('/reservacion/:nombre', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    validarCampos
], getReservacionPorId);

router.post('/agregarHabitacion/:id',[
    validarJWT,
    validarCampos
],agregarHabitacion);

router.post('/agregarServicios/:id',[
    validarJWT,
    validarCampos
],agregarServicio);

router.post('/agregarEventos/:id',[
    validarJWT,
    validarCampos
],agregarEvento);

router.post('/editarReserva',[
    validarJWT,
    validarCampos
],postReservacionUsuario);

router.post('/agregar', [
    validarJWT,
    check('personaReserva', 'La persona es obligatoria').not().isEmpty(),
    check('cantidadPersonas', 'La cantidad de personas es obligatoria').not().isEmpty(),
    check('fechaInicio', 'La fecha inicial es obligatoria').not().isEmpty(),
    check('fechaInicio', ' Ingresa una fecha inicial valida').custom(esFecha),
    check('fechaFinal', ' La fecha final es obligatoria').not().isEmpty(),
    check('fechaFinal', ' Ingresa una fecha final valida').custom(esFecha),
    check('habitaciones', 'Las habitaciones son obligatorias').not().isEmpty(),
    validarCampos
], postReservacion);

router.put('/editarMiReservacion', [
    validarJWT,
    check('personaReserva', 'La persona es obligatoria').not().isEmpty(),
    check('cantidadPersonas', 'La cantidad de personas es obligatoria').not().isEmpty(),
    check('fechaInicio', 'La fecha inicial es obligatoria').not().isEmpty(),
    check('fechaInicio', ' Ingresa una fecha inicial valida').custom(esFecha),
    check('fechaFinal', ' La fecha final es obligatoria').not().isEmpty(),
    check('fechaFinal', ' Ingresa una fecha final valida').custom(esFecha),
    check('habitaciones', 'Las habitaciones son obligatorias').not().isEmpty(),
    validarCampos
], putMiReservacion);

router.put('/editar/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('personaReserva', 'La persona es obligatoria').not().isEmpty(),
    check('cantidadPersonas', 'La cantidad de personas es obligatoria').not().isEmpty(),
    check('fechaInicio', 'La fecha inicial es obligatoria').not().isEmpty(),
    check('fechaInicio', ' Ingresa una fecha inicial valida').custom(esFecha),
    check('fechaFinal', ' La fecha final es obligatoria').not().isEmpty(),
    check('fechaFinal', ' Ingresa una fecha final valida').custom(esFecha),
    check('habitaciones', 'Las habitaciones son obligatorias').not().isEmpty(),
    check('dias_habitaciones', 'Los dias de las habitaciones son obligatorios').not().isEmpty(),
    validarCampos
], putReservacion);

router.delete('/eliminarMiReservacion', [
    validarJWT,
], deleteMiReservacion);

router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeReservacionPorId ),
    validarCampos
], deleteReservacion);


module.exports = router;