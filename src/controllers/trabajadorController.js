import { pool } from '../config/db.js';

export const crearTrabajador = async (req, res) => {
  const { nombres, direccion, contacto, rol, pulsera_uuid } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO trabajadores (nombres, direccion, contacto, rol, pulsera_uuid)
       VALUES (?, ?, ?, ?, ?)`,
      [nombres, direccion, contacto, rol, pulsera_uuid]
    );

    res.status(201).json({ id: result.insertId, message: 'Trabajador creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear trabajador' });
  }
};

export const listarTrabajadores = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, p.estado AS estado_pulsera
      FROM trabajadores t
      LEFT JOIN pulseras p ON t.pulsera_uuid = p.uuid
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener trabajadores' });
  }
};

export const obtenerTrabajador = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM trabajadores WHERE id = ?`, [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Trabajador no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar trabajador' });
  }
};

export const actualizarTrabajador = async (req, res) => {
  const { id } = req.params;
  const { nombres, direccion, contacto, rol, pulsera_uuid } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE trabajadores
       SET nombres = ?, direccion = ?, contacto = ?, rol = ?, pulsera_uuid = ?
       WHERE id = ?`,
      [nombres, direccion, contacto, rol, pulsera_uuid, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Trabajador no encontrado' });

    res.json({ message: 'Trabajador actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar trabajador' });
  }
};

export const eliminarTrabajador = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM trabajadores WHERE id = ?`, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Trabajador no encontrado' });

    res.json({ message: 'Trabajador eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar trabajador' });
  }
};

export const buscarPorPulsera = async (req, res) => {
  const { uuid } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT t.*, p.estado AS estado_pulsera
       FROM trabajadores t
       LEFT JOIN pulseras p ON t.pulsera_uuid = p.uuid
       WHERE t.pulsera_uuid = ?`,
      [uuid]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'No hay trabajador asociado a esta pulsera' });

    const trabajador = rows[0];

    if (trabajador.estado_pulsera !== 'activa') {
      return res.status(403).json({ message: 'Pulsera inactiva. No se puede registrar actividad.' });
    }

    res.json(trabajador);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar trabajador por pulsera' });
  }
};
