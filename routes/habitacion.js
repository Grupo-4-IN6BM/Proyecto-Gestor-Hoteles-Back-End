<<<<<<< Updated upstream
=======
const { Router } = require('express');
const { check } = require('express-validator');
const { getHabitaciones, postHabitacion, putHabitacion, deleteHabitacion } = require('../controllers/habitacion');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/mostrar', getHabitaciones);
router.post('/agregar', [
    validarJWT,
    esAdminRole,
    check('numero', 'El numero de habitacion es obligatorio').not().isEmpty(),
    check('disponibilidad').default(true),
    check('costo', 'El correo no es valido').not().isEmpty(),
    validarCampos,
] ,postHabitacion);


router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,putHabitacion);

router.delete('/eliminar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,deleteHabitacion);

module.exports = router;
>>>>>>> Stashed changes
