const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, deleteAdmin, putAdmin } = require('../controllers/usuario');
const { emailExiste, esRoleValido, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/mostrar', getUsuarios);

router.post('/agregarAdmin', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('edad', 'La edad es Obligatoria').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste ),
    check('identificacion', 'La identificacion es obligatoria').not().isEmpty(),
    check('rol').default('ADMIN_ROLE').custom(esRoleValido),
    validarCampos,
] ,postUsuario);


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

router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom(  esRoleValido ),
    validarCampos
] ,putUsuario);

router.delete('/eliminar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);

router.put('/editarAdmin', [
    validarJWT,
    esAdminRole,
    validarCampos
] ,putAdmin);

router.delete('/eliminarAdmin', [
    validarJWT,
    validarCampos
] ,deleteAdmin);

module.exports = router;