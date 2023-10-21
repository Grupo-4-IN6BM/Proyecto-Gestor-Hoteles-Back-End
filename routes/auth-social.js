const { Router } = require('express');
const passport = require('passport');
const express = require('express');
const { google, postUsuarioGoogle } = require('../controllers/authGoogle');
const { generarJWT } = require('../helpers/generar-jwt');
const app = express();
const router = Router();

router.post('/googleLogin', postUsuarioGoogle);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/success', failureRedirect: '/auth/failure' }));

module.exports = router;
