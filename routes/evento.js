//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, postEvento, putEvento, deleteEvento, getEventosId} = require('../controllers/evento');
const { esTipoValido, esFecha } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getEventos);

router.get('/mostrar/:id', getEventosId);

router.post('/registrarEvento', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fechaInicio', 'La fecha inicial es obligatoria').not().isEmpty(),
    check('fechaInicio', ' Ingresa una fecha inicial valida').custom(esFecha),
    check('fechaFinal', ' La fecha final es obligatoria').not().isEmpty(),
    check('fechaFinal', ' Ingresa una fecha final valida').custom(esFecha),
    check('descripcion', ' descripcion es obligatorio').not().isEmpty(),
    check('precio', ' precio es obligatorio').not().isEmpty(),
    check('tipo').custom(esTipoValido),
    validarCampos,

] ,postEvento);


router.put('/editarEvento/:id', [
    validarJWT,
    tieneRole('ROL_ADMINISTRATIVO'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fechaInicio', 'La fecha inicial es obligatoria').not().isEmpty(),
    check('fechaInicio', ' Ingresa una fecha inicial valida').custom(esFecha),
    check('fechaFinal', ' La fecha final es obligatoria').not().isEmpty(),
    check('fechaFinal', ' Ingresa una fecha final valida').custom(esFecha),
    check('descripcion', ' descripcion es obligatorio').not().isEmpty(),
    check('precio', ' precio es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('tipo').custom(esTipoValido),
    validarCampos,
] ,putEvento);

router.delete('/eliminarEvento/:id', [
     validarJWT,
     tieneRole('ROL_ADMINISTRATIVO'),
     check('id', 'No es un ID válido').isMongoId(),
     validarCampos,
] ,deleteEvento);




module.exports = router;