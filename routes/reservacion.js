const { Router } = require('express');
const { check } = require('express-validator');
const { getReservaciones, getReservacionPorId, postReservacion, putReservacion, deleteReservacion } = require('../controllers/reservacion');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const { existeReservacionPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', getReservaciones);

router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeReservacionPorId ),
    validarCampos
], getReservacionPorId);

router.post('/agregar', [
    validarJWT,
    check('personaReserva', 'La persona es obligatoria').not().isEmpty(),
    validarCampos
], postReservacion);

router.put('/:id/editar', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('personaReserva', 'La persona es obligatoria').not().isEmpty(),
    check('id').custom( existeReservacionPorId ),
    validarCampos
], putReservacion);

router.put('/agregarP/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeReservacionPorId),
    validarUsuarios,
    validarCampos
], putAgregarCurso);

router.delete('/:id/eliminar', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeReservacionPorId ),
    validarCampos
], deleteReservacion);


module.exports = router;