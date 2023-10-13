const { Router } = require('express');
const { check } = require('express-validator');
//Controllers
const { login } = require('../controllers/auth');
// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//Manejo de rutas
router.post('/login', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos,
] ,login);

router.get('/success', (req, res) => {
    res.send('Autenticación exitosa');
});

// Ruta para manejar la respuesta fallida de la autenticación
router.get('/failure', (req, res) => {
    res.send('Autenticación fallida');
});
module.exports = router;