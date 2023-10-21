const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const { getHotelesPorId, getHotelesPorNombre, postHoteles, putHotel, eliminarHotel, deshabilitarHotel, getHoteles, postHotelesSuperAdmin, getHotelesPorAdmin, getHotelesPorPais } = require('../controllers/hotel');
const { existeHotelPorNombre, existeHotelPorId } = require('../helpers/db-validators');
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const { blacklistToken } = require('../blacklistToken');
const router = Router();
const CLIENT_ID= '1053486057798-g8616fs764lp64ov08qu49esmnnhplsm.apps.googleusercontent.com';
const CLIENT_SECRET= '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';
const CALLBACK_URL= 'https://proyecto-gestor-hoteles-back-end-gilt.vercel.app/api/social/google/callback';
router.get('/buscar', getHoteles);

router.get('/buscar/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom(existeHotelPorId),
    validarCampos
], getHotelesPorId);

router.get('/buscarNombre/:nombre'
    , getHotelesPorNombre);

router.get('/buscar/hoteles/pais/:nombre'
    , getHotelesPorPais);

router.get('/porAdmin/:id'
    , getHotelesPorAdmin);

router.post('/agregar/', [
    validarJWT,
    check('nombre', 'El nombre del hotel es obligatorio'),
    check('pais', 'El pais del hotel es obligatorio'),
    check('direccion', 'La direccion del hotel es obligatoria'),
    validarCampos
], postHoteles);

router.post('/agregarSuperAdmin', [
    validarJWT,
    check('nombre', 'El nombre del hotel es obligatorio'),
    check('pais', 'El pais del hotel es obligatorio'),
    check('direccion', 'La direccion del hotel es obligatoria'),
    validarCampos
], postHotelesSuperAdmin);

router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom(existeHotelPorId),
    check('nombre', 'El nombre del hotel es obligatorio'),
    check('pais', 'El pais del hotel es obligatorio'),
    check('direccion', 'La direccion del hotel es obligatoria'),
    validarCampos
], putHotel);

router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom(existeHotelPorId),
    validarCampos
], eliminarHotel);

router.delete('/deshabilitar/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom(existeHotelPorId),
    validarCampos
], deshabilitarHotel);


module.exports = router;