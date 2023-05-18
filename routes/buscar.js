const { Router } = require('express');
const { buscar, buscarUsuariosEnHotel } = require('../controllers/buscar');

const router = Router();

//Manejo de rutas
router.get('/:coleccion/:termino/' ,buscar);

router.get('/hotelUsuario/:termino/:id' ,buscarUsuariosEnHotel);
module.exports = router;