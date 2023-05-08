//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { deleteServicio, postServicio, getServicio, putServicio, getServicioId } = require('../controllers/servicio');
const { existeServicioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getServicio);

router.get('/mostrar/:id', getServicioId);

router.post('/agregar', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
] ,postServicio);

router.put('/editar/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un ID válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    validarCampos
] ,putServicio);


router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,deleteServicio);


module.exports = router;