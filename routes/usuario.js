const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, deleteMiUsuario, getUsuarioPorToken, postUsuarioSuperAdmin, putUsuarioSuperAdmin, deleteUsuarios, postUserAdmin } = require('../controllers/usuario');
const { emailExiste, esRoleValido, existeUsuarioPorId, identificacionExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    // validarJWT,
    // validarCampos
], getUsuarios);

router.get('/mostrar/:token', getUsuarioPorToken);

router.post('/agregarAdmin', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('edad', 'La edad es Obligatoria').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste ),
    check('identificacion', 'La identificacion es obligatoria').not().isEmpty(),
    check('identificacion').custom(identificacionExiste),
    check('rol').default('ROL_ADMINISTRATIVO').custom(esRoleValido),
    validarCampos,
] ,postUsuario);


router.post('/agregarUsuario', [
    validarCampos,
] ,postUsuario);


router.post('/addAdmin', [
    validarCampos,
] ,postUserAdmin);

router.post('/agregarSuperAdmin', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('edad', 'La edad es Obligatoria').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste ),
    check('identificacion', 'La identificacion es obligatoria').not().isEmpty(),
    check('identificacion').custom(identificacionExiste),
    validarCampos,
] ,postUsuarioSuperAdmin);

router.put('/editarMiUsuario', [
    validarJWT,
    validarCampos
] ,putUsuario);

// router.put('/editar/:id', [
//     validarCampos
// ] ,putUsuario);
router.put('/editar/:id', [
    // validarJWT,
    // tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('edad', 'La edad es Obligatoria').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('identificacion', 'La identificacion es obligatoria').not().isEmpty(),
    validarCampos
] ,putUsuario);

router.put('/editarSuperAdmin/:id', [
    validarJWT,
    validarCampos
] ,putUsuarioSuperAdmin);

router.delete('/eliminar/:id', [
    // validarJWT,
    // tieneRole('ROL_ADMINISTRATIVO'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);

router.delete('/eliminarById/:id' ,deleteUsuarios);

router.delete('/eliminarMiCuenta', [
    validarJWT,
    validarCampos
] ,deleteMiUsuario);


module.exports = router;