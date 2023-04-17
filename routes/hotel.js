const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const { getHotelesPorId, getHotelesPorNombre, postHoteles, putHotel, eliminarHotel, deshabilitarHotel, getHoteles } = require('../controllers/hotel');
const { existeHotelPorNombre, existeHotelPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/buscar', getHoteles);

router.get('/buscar/:id',[
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeHotelPorId ),
    validarCampos
], getHotelesPorId);

router.get('/buscarNombre/:nombre'
, getHotelesPorNombre);

router.post('/agregar/',[
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('nombre', 'El nombre del hotel es obligatorio'),
    check('pais', 'El pais del hotel es obligatorio'),
    check('direccion', 'La direccion del hotel es obligatoria'),
    validarCampos
], postHoteles);

router.put('/editar/:id',[
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeHotelPorId ),
    check('nombre', 'El nombre del hotel es obligatorio'),
    check('pais', 'El pais del hotel es obligatorio'),
    check('direccion', 'La direccion del hotel es obligatoria'),
    validarCampos
], putHotel);

router.delete('/eliminar/:id',[
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeHotelPorId ),
    validarCampos
], eliminarHotel);

router.delete('/deshabilitar/:id',[
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeHotelPorId ),
    validarCampos
], deshabilitarHotel);


module.exports = router;