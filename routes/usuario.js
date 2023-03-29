const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuario');
const { emailExiste, esRoleValido } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();
router.get('/mostrar', getUsuarios);

router.post('/agregarUsuario', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('edad', 'La edad es Obligatoria').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste ),
    check('identificacion', 'La identificacion es obligatoria').not().isEmpty(),
    check('rol').default('CLIENT_ROLE').custom(esRoleValido),
    validarCampos,
] ,postUsuario);

module.exports = router;