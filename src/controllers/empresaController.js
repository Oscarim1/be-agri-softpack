import { pool } from '../config/db.js';
import { generarPDFEmpresas } from '../services/pdfService.js';

export const crearEmpresa = async (req, res) => {
  const { contrato, fecha_adjudicacion, fecha_termino_faena, documentos } = req.body;

  if (!contrato || !fecha_adjudicacion) {
    return res.status(400).json({ message: 'Contrato y fecha de adjudicación son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO empresas (contrato, fecha_adjudicacion, fecha_termino_faena, documentos)
       VALUES (?, ?, ?, ?)`,
      [contrato, fecha_adjudicacion, fecha_termino_faena || null, documentos || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Empresa creada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear empresa' });
  }
};

export const listarEmpresas = async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM empresas ORDER BY id DESC`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar empresas' });
  }
};

export const obtenerEmpresa = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM empresas WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener empresa' });
  }
};

export const actualizarEmpresa = async (req, res) => {
  const { id } = req.params;
  const { contrato, fecha_adjudicacion, fecha_termino_faena, documentos } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE empresas
       SET contrato = ?, fecha_adjudicacion = ?, fecha_termino_faena = ?, documentos = ?
       WHERE id = ?`,
      [contrato, fecha_adjudicacion, fecha_termino_faena || null, documentos || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    res.json({ message: 'Empresa actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar empresa' });
  }
};

export const eliminarEmpresa = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM empresas WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    res.json({ message: 'Empresa eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar empresa' });
  }
};

export const exportarEmpresasPDF = async (_req, res) => {
  try {
    const [empresas] = await pool.query(`SELECT * FROM empresas ORDER BY id DESC`);

    if (empresas.length === 0) {
      return res.status(404).json({ message: 'No hay empresas registradas' });
    }

    const pdfBuffer = await generarPDFEmpresas(empresas);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="empresas.pdf"',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar PDF de empresas' });
  }
};
