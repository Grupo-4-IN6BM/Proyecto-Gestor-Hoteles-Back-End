//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, postEvento, putEvento, deleteEvento} = require('../controllers/evento');
const { validarCampos } = require('../middlewares/validar-campos');
//const { esTipoValido, emailExiste, existeEmpresaPorId } = require('../helpers/db-validators');
//const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
//const { tiene, esAlumnoRole, validarTamañoArray } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getEventos);

router.post('/registrarEvento', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('horaInicio', ' horaInicio es obligatorio').not().isEmpty(),
    check('horaFinal', ' horaFinal es obligatorio').not().isEmpty(),
    check('descripcion', ' descripcion es obligatorio').not().isEmpty(),
    check('disponibilidad', ' disponibilidad es obligatorio').not().isEmpty(),
    check('precio', ' precio es obligatorio').not().isEmpty(),
    //check('tipo').custom( esTipoValido ),
    validarCampos,
    validarJWT
] ,postEvento);


router.put('/editarEvento/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('horaInicio', ' horaInicio es obligatorio').not().isEmpty(),
    check('horaFinal', ' horaFinal es obligatorio').not().isEmpty(),
    check('descripcion', ' descripcion es obligatorio').not().isEmpty(),
    check('disponibilidad', ' disponibilidad es obligatorio').not().isEmpty(),
    check('precio', ' precio es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
] ,putEvento);

router.delete('/eliminarEvento/:id', [
     validarJWT,
     validarCampos,
    check('id', 'No es un ID válido').isMongoId(),
] ,deleteEvento);




module.exports = router;