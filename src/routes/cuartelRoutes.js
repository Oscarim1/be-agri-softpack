import express from 'express';
import {
  crearCuartel,
  listarCuarteles,
  obtenerCuartel,
  actualizarCuartel,
  eliminarCuartel,
  exportarCuartelesPDF 
} from '../controllers/cuartelController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), crearCuartel);
router.get('/', listarCuarteles);
router.get('/:id', obtenerCuartel);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarCuartel);
router.delete('/:id', tieneRol('admin'), eliminarCuartel);
router.get('/exportar/pdf', exportarCuartelesPDF);

export default router;

// Swagger documentation for Cuartel routes
/**
 * @swagger
 * tags:
 *   name: Cuarteles
 *   description: Administración de cuarteles agrícolas
 */

/**
 * @swagger
 * /cuarteles:
 *   post:
 *     summary: Crear un nuevo cuartel
 *     tags: [Cuarteles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos para crear el cuartel
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empresa_id
 *               - tipo_fruta
 *               - fecha
 *             properties:
 *               empresa_id:
 *                 type: integer
 *                 example: 1
 *               tipo_fruta:
 *                 type: string
 *                 example: "Manzana"
 *               cantidad_fruta:
 *                 type: number
 *                 example: 123.45
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-21"
 *     responses:
 *       201:
 *         description: Cuartel creado exitosamente
 *       400:
 *         description: Faltan campos requeridos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /cuarteles:
 *   get:
 *     summary: Listar todos los cuarteles
 *     tags: [Cuarteles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cuarteles
 *       500:
 *         description: Error al listar cuarteles
 */

/**
 * @swagger
 * /cuarteles/{id}:
 *   get:
 *     summary: Obtener un cuartel por ID
 *     tags: [Cuarteles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Cuartel encontrado
 *       404:
 *         description: Cuartel no encontrado
 *       500:
 *         description: Error al obtener cuartel
 */

/**
 * @swagger
 * /cuarteles/{id}:
 *   put:
 *     summary: Actualizar un cuartel existente
 *     tags: [Cuarteles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados del cuartel
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empresa_id:
 *                 type: integer
 *                 example: 2
 *               tipo_fruta:
 *                 type: string
 *                 example: "Pera"
 *               cantidad_fruta:
 *                 type: number
 *                 example: 89.5
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *     responses:
 *       200:
 *         description: Cuartel actualizado correctamente
 *       404:
 *         description: Cuartel no encontrado
 *       500:
 *         description: Error al actualizar cuartel
 */

/**
 * @swagger
 * /cuarteles/{id}:
 *   delete:
 *     summary: Eliminar un cuartel por ID
 *     tags: [Cuarteles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 6
 *     responses:
 *       200:
 *         description: Cuartel eliminado correctamente
 *       404:
 *         description: Cuartel no encontrado
 *       500:
 *         description: Error al eliminar cuartel
 */

/**
 * @swagger
 * /cuarteles/exportar/pdf:
 *   get:
 *     summary: Exportar cuarteles a PDF (filtrable por empresa y fecha)
 *     tags: [Cuarteles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         schema:
 *           type: integer
 *         required: false
 *         example: 1
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         example: "2025-05-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         example: "2025-05-31"
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No se encontraron cuarteles con esos filtros
 *       500:
 *         description: Error al generar PDF
 */
