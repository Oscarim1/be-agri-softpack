import { pool } from '../config/db.js';

export const crearAsignacionTrabajo = async (req, res) => {
  const { cuadrilla_id, trabajo_id, fecha } = req.body;

  if (!cuadrilla_id || !trabajo_id || !fecha) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO cuadrilla_trabajo (cuadrilla_id, trabajo_id, fecha)
       VALUES (?, ?, ?)`,
      [cuadrilla_id, trabajo_id, fecha]
    );

    res.status(201).json({ id: result.insertId, message: 'Trabajo asignado a cuadrilla' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la asignación' });
  }
};

export const listarAsignacionesTrabajo = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ct.id, ct.fecha, 
             c.id AS cuadrilla_id, t.id AS trabajo_id, t.nombre, t.tipo
      FROM cuadrilla_trabajo ct
      JOIN cuadrillas c ON ct.cuadrilla_id = c.id
      JOIN trabajos t ON ct.trabajo_id = t.id
      ORDER BY ct.fecha DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar asignaciones' });
  }
};

export const obtenerAsignacionTrabajo = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM cuadrilla_trabajo WHERE id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'Asignación no encontrada' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar asignación' });
  }
};

export const actualizarAsignacionTrabajo = async (req, res) => {
  const { id } = req.params;
  const { cuadrilla_id, trabajo_id, fecha } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE cuadrilla_trabajo
       SET cuadrilla_id = ?, trabajo_id = ?, fecha = ?
       WHERE id = ?`,
      [cuadrilla_id, trabajo_id, fecha, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Asignación no encontrada' });

    res.json({ message: 'Asignación actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar asignación' });
  }
};

export const eliminarAsignacionTrabajo = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM cuadrilla_trabajo WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Asignación no encontrada' });

    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar asignación' });
  }
};
