import { pool } from '../config/db.js';
import { generarPDFResumenCuadrilla } from '../services/pdfService.js';

export const resumenCuadrillaPorFecha = async (req, res) => {
  const { cuadrilla_id } = req.params;
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ message: 'Debe proporcionar la fecha (?fecha=YYYY-MM-DD)' });
  }

  try {
    // 1. Obtener trabajos asignados a la cuadrilla ese día
    const [trabajos] = await pool.query(
      `SELECT t.id, t.nombre, t.tipo, t.valor
       FROM cuadrilla_trabajo ct
       JOIN trabajos t ON ct.trabajo_id = t.id
       WHERE ct.cuadrilla_id = ? AND ct.fecha = ?`,
      [cuadrilla_id, fecha]
    );

    // 2. Obtener trabajadores (via pulsera) asignados a la cuadrilla
    const [trabajadores] = await pool.query(
      `SELECT ct.id AS relacion_id,
              tr.id AS trabajador_id,
              tr.nombres,
              tr.rol,
              ct.pulsera_uuid,
              ct.cantidad_fruta
       FROM cuadrilla_trabajador ct
       JOIN trabajadores tr ON tr.pulsera_uuid = ct.pulsera_uuid
       WHERE ct.cuadrilla_id = ?`,
      [cuadrilla_id]
    );

    res.json({
      cuadrilla_id: parseInt(cuadrilla_id),
      fecha,
      trabajos,
      trabajadores,
      resumen: {
        total_trabajadores: trabajadores.length,
        total_fruta: trabajadores.reduce((sum, t) => sum + Number(t.cantidad_fruta || 0),0).toFixed(2)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar el resumen de la cuadrilla' });
  }
};

export const exportarResumenCuadrillaPDF = async (req, res) => {
  const { cuadrilla_id } = req.params;
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ message: 'Debe proporcionar la fecha (?fecha=YYYY-MM-DD)' });
  }

  try {
    const [trabajos] = await pool.query(
      `SELECT t.id, t.nombre, t.tipo, t.valor
       FROM cuadrilla_trabajo ct
       JOIN trabajos t ON ct.trabajo_id = t.id
       WHERE ct.cuadrilla_id = ? AND ct.fecha = ?`,
      [cuadrilla_id, fecha]
    );

    const [trabajadores] = await pool.query(
      `SELECT ct.id AS relacion_id,
              tr.id AS trabajador_id,
              tr.nombres,
              tr.rol,
              ct.pulsera_uuid,
              ct.cantidad_fruta
       FROM cuadrilla_trabajador ct
       JOIN trabajadores tr ON tr.pulsera_uuid = ct.pulsera_uuid
       WHERE ct.cuadrilla_id = ?`,
      [cuadrilla_id]
    );

    const resumen = {
      cuadrilla_id,
      fecha,
      trabajos,
      trabajadores,
      resumen: {
        total_trabajadores: trabajadores.length,
        total_fruta: trabajadores.reduce((sum, t) => sum + Number(t.cantidad_fruta || 0),0).toFixed(2)
      }
    };

    const pdfBuffer = await generarPDFResumenCuadrilla(resumen);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resumen_cuadrilla_${cuadrilla_id}_${fecha}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar PDF del resumen de cuadrilla' });
  }
};
