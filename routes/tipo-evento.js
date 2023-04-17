const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { postTipos, putTipo, deleteTipo, getTipos } = require('../controllers/tipo-evento');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { existeTipoPorId } = require('../helpers/db-validators');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');



const router = Router();

//Manejo de rutas
router.get('/mostrar', getTipos);

router.post('/agregar/',[
    validarJWT,
    tieneRole("ROL_ADMINISTRATIVO"),
    check('tipo', 'El tipo es obligatorio'),
    validarCampos
], postTipos);

router.put('/editar/:id',[
    validarJWT,
    tieneRole("ROL_ADMINISTRATIVO"),
    check('id', 'El id del tipo es obligatorio').isMongoId(),
    check('id').custom( existeTipoPorId ),
    check('tipo', 'El tipo es obligatorio'),
    validarCampos
], putTipo);

router.delete('/eliminar/:id',[
    validarJWT,
    tieneRole("ROL_ADMINISTRATIVO"),
    check('id', 'El id del tipo es obligatorio').isMongoId(),
    check('id').custom( existeTipoPorId ),
    validarCampos
], deleteTipo);



module.exports = router;