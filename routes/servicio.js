//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { deleteServicio, postServicio, getServicio } = require('../controllers/servicio');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/mostrar', getServicio);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
] ,postServicio);

router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeServicioPorId ),
    validarCampos
] ,putUsuario);


router.delete('/eliminar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeServicioPorId ),
    validarCampos
] ,deleteServicio);


module.exports = router;