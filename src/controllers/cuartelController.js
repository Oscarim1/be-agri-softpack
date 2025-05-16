import { pool } from '../config/db.js';
import { generarPDFCuarteles } from '../services/pdfService.js';

export const crearCuartel = async (req, res) => {
  const { empresa_id, tipo_fruta, cantidad_fruta, fecha } = req.body;

  if (!empresa_id || !tipo_fruta || !fecha) {
    return res.status(400).json({ message: 'empresa_id, tipo_fruta y fecha son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO cuarteles (empresa_id, tipo_fruta, cantidad_fruta, fecha)
       VALUES (?, ?, ?, ?)`,
      [empresa_id, tipo_fruta, cantidad_fruta || 0, fecha]
    );

    res.status(201).json({ id: result.insertId, message: 'Cuartel creado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear cuartel' });
  }
};

export const listarCuarteles = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, e.contrato AS empresa_contrato
      FROM cuarteles c
      JOIN empresas e ON c.empresa_id = e.id
      ORDER BY c.fecha DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar cuarteles' });
  }
};

export const obtenerCuartel = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM cuarteles WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cuartel no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener cuartel' });
  }
};

export const actualizarCuartel = async (req, res) => {
  const { id } = req.params;
  const { empresa_id, tipo_fruta, cantidad_fruta, fecha } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE cuarteles SET empresa_id = ?, tipo_fruta = ?, cantidad_fruta = ?, fecha = ? WHERE id = ?`,
      [empresa_id, tipo_fruta, cantidad_fruta, fecha, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cuartel no encontrado' });
    }

    res.json({ message: 'Cuartel actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar cuartel' });
  }
};

export const eliminarCuartel = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM cuarteles WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cuartel no encontrado' });
    }

    res.json({ message: 'Cuartel eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar cuartel' });
  }
};

export const exportarCuartelesPDF = async (req, res) => {
  const { empresa_id, desde, hasta } = req.query;

  let query = `
    SELECT c.*, e.contrato AS empresa_contrato
    FROM cuarteles c
    JOIN empresas e ON c.empresa_id = e.id
    WHERE 1=1
  `;
  const params = [];

  if (empresa_id) {
    query += ' AND c.empresa_id = ?';
    params.push(empresa_id);
  }

  if (desde && hasta) {
    query += ' AND c.fecha BETWEEN ? AND ?';
    params.push(desde, hasta);
  }

  try {
    const [cuarteles] = await pool.query(query + ' ORDER BY c.fecha DESC', params);

    if (cuarteles.length === 0) {
      return res.status(404).json({ message: 'No se encontraron cuarteles con esos filtros' });
    }

    const titulo = empresa_id
      ? `Cuarteles de Empresa ID ${empresa_id}`
      : `Cuarteles entre ${desde} y ${hasta}`;

    const pdfBuffer = await generarPDFCuarteles(cuarteles, titulo);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte_cuarteles.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar PDF de cuarteles' });
  }
};
