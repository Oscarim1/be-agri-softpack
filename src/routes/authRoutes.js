import express from 'express';
import {
  login,
  register,
  refreshToken,
  logout,
  sendRecoveryCode,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', sendRecoveryCode);
router.post('/reset-password', resetPassword);

export default router;


// Swagger documentation for Auth routes

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       description: Credenciales del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@correo.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token de sesión
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     rol:
 *                       type: string
 *       401:
 *         description: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       description: Datos del nuevo usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - password
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Oscar Reyes
 *               correo:
 *                 type: string
 *                 example: oscar@correo.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               rol:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Faltan campos obligatorios
 *       409:
 *         description: El correo ya está registrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar código de recuperación
 *     tags: [Auth]
 *     requestBody:
 *       description: Correo registrado del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Correo enviado con el código de recuperación
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Restablecer la contraseña con código
 *     tags: [Auth]
 *     requestBody:
 *       description: Datos para restablecer la contraseña
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - codigo
 *               - nuevaPassword
 *             properties:
 *               correo:
 *                 type: string
 *               codigo:
 *                 type: integer
 *                 example: 123456
 *               nuevaPassword:
 *                 type: string
 *                 example: nueva123
 *     responses:
 *       200:
 *         description: Contraseña restablecida
 *       400:
 *         description: Código inválido o faltan datos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
