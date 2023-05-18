const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
// const { getFacturas, postFactura, getMiFactura } = require('../controllers/factura');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { getFacturas, getMiFactura, postFactura, postFacturaId } = require('../controllers/factura');

const router = Router();

//Manejo de rutas

router.get('/mostrar',[
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    validarCampos
], getFacturas)

router.get('/miFactura',[
    validarJWT,
    validarCampos
], getMiFactura)

router.post('/agregar',[
    validarJWT,
    validarCampos
], postFactura)

router.post('/agregar/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], postFacturaId)


module.exports = router;