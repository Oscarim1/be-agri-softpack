import { pool } from '../config/db.js';
import { generarPDFContratistas } from '../services/pdfService.js';

export const crearContratista = async (req, res) => {
  const { razon_social, empresa_id, usuario_id } = req.body;

  if (!razon_social || !empresa_id || !usuario_id) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO contratistas (razon_social, empresa_id, usuario_id)
       VALUES (?, ?, ?)`,
      [razon_social, empresa_id, usuario_id]
    );

    res.status(201).json({ id: result.insertId, message: 'Contratista creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear contratista' });
  }
};

export const listarContratistas = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ct.*, e.contrato AS empresa_contrato, u.nombre AS nombre_usuario
      FROM contratistas ct
      JOIN empresas e ON ct.empresa_id = e.id
      JOIN usuarios u ON ct.usuario_id = u.id
      ORDER BY ct.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar contratistas' });
  }
};

export const obtenerContratista = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM contratistas WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Contratista no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener contratista' });
  }
};

export const actualizarContratista = async (req, res) => {
  const { id } = req.params;
  const { razon_social, empresa_id, usuario_id } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE contratistas
       SET razon_social = ?, empresa_id = ?, usuario_id = ?
       WHERE id = ?`,
      [razon_social, empresa_id, usuario_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contratista no encontrado' });
    }

    res.json({ message: 'Contratista actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar contratista' });
  }
};

export const eliminarContratista = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM contratistas WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contratista no encontrado' });
    }

    res.json({ message: 'Contratista eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar contratista' });
  }
};

export const exportarContratistasPDF = async (_req, res) => {
  try {
    const [contratistas] = await pool.query(`
      SELECT ct.*, e.contrato AS empresa_contrato, u.nombre AS nombre_usuario
      FROM contratistas ct
      JOIN empresas e ON ct.empresa_id = e.id
      JOIN usuarios u ON ct.usuario_id = u.id
      ORDER BY ct.id DESC
    `);

    if (contratistas.length === 0) {
      return res.status(404).json({ message: 'No hay contratistas registrados' });
    }

    const pdfBuffer = await generarPDFContratistas(contratistas);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="contratistas.pdf"',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar PDF de contratistas' });
  }
};