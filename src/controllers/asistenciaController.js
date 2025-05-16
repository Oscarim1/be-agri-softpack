import { pool } from '../config/db.js';
import { generarPDFReporteAsistencia } from '../services/pdfService.js';

const obtenerAsistenciaActual = async (pulsera_uuid) => {
  const [rows] = await pool.query(
    `SELECT * FROM asistencias WHERE pulsera_uuid = ? AND DATE(horario_entrada) = CURDATE()`,
    [pulsera_uuid]
  );
  return rows[0];
};

export const marcarAsistencia = async (req, res) => {
  const { pulsera_uuid, tipo } = req.body;

  if (!pulsera_uuid || !tipo)
    return res.status(400).json({ message: 'Pulsera y tipo de marca requeridos' });

  const campos = {
    entrada: 'horario_entrada',
    salida_colacion: 'horario_salida_colacion',
    entrada_colacion: 'horario_entrada_colacion',
    salida: 'horario_salida'
  };

  const campo = campos[tipo];
  if (!campo) return res.status(400).json({ message: 'Tipo de marca inválido' });

  try {
    // 1. Verifica que la pulsera esté activa
    const [pulseraRows] = await pool.query(
      `SELECT estado FROM pulseras WHERE uuid = ?`,
      [pulsera_uuid]
    );

    if (pulseraRows.length === 0)
      return res.status(404).json({ message: 'Pulsera no registrada en el sistema' });

    if (pulseraRows[0].estado !== 'activa')
      return res.status(403).json({ message: 'Pulsera inactiva. No se puede registrar asistencia.' });

    // 2. Busca asistencia existente
    const asistencia = await obtenerAsistenciaActual(pulsera_uuid);

    if (!asistencia && tipo !== 'entrada') {
      return res.status(404).json({ message: 'No se puede registrar esta marca sin haber marcado entrada primero' });
    }

    if (!asistencia && tipo === 'entrada') {
      await pool.query(
        `INSERT INTO asistencias (pulsera_uuid, ${campo}) VALUES (?, NOW())`,
        [pulsera_uuid]
      );
      return res.status(201).json({ message: 'Entrada registrada correctamente' });
    }

    if (asistencia[campo]) {
      return res.status(409).json({ message: `Ya existe una marca de tipo '${tipo}' para hoy` });
    }

    await pool.query(
      `UPDATE asistencias SET ${campo} = NOW() WHERE id = ?`,
      [asistencia.id]
    );

    res.json({ message: `Marca de '${tipo}' registrada correctamente` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar asistencia' });
  }
};

export const reporteMensualAsistencia = async (req, res) => {
  const { pulsera_uuid } = req.params;
  const { anio, mes } = req.query;

  if (!anio || !mes) {
    return res.status(400).json({ message: 'Debe proporcionar año y mes (ej: ?anio=2025&mes=05)' });
  }

  try {
    // Obtener datos del trabajador
    const [trabajadorRows] = await pool.query(
      `SELECT id, nombres, rol, contacto, direccion
       FROM trabajadores
       WHERE pulsera_uuid = ?`,
      [pulsera_uuid]
    );

    if (trabajadorRows.length === 0) {
      return res.status(404).json({ message: 'Trabajador no encontrado para esta pulsera' });
    }

    const trabajador = trabajadorRows[0];

    // Obtener asistencias del mes
    const [asistencias] = await pool.query(
      `SELECT *,
              DATE(horario_entrada) AS fecha,
              TIMESTAMPDIFF(MINUTE, horario_entrada, horario_salida) AS minutos_brutos,
              TIMESTAMPDIFF(MINUTE, horario_salida_colacion, horario_entrada_colacion) AS minutos_colacion
       FROM asistencias
       WHERE pulsera_uuid = ?
         AND YEAR(horario_entrada) = ?
         AND MONTH(horario_entrada) = ?`,
      [pulsera_uuid, anio, mes]
    );

    const dias_trabajados = asistencias.length;
    let total_brutos = 0;
    let total_colacion = 0;

    const detalles = asistencias.map(a => {
      const brutos = a.minutos_brutos || 0;
      const colacion = a.minutos_colacion || 0;
      const netos = brutos - colacion;

      total_brutos += brutos;
      total_colacion += colacion;

      return {
        fecha: a.fecha,
        entrada: a.horario_entrada,
        salida_colacion: a.horario_salida_colacion,
        entrada_colacion: a.horario_entrada_colacion,
        salida: a.horario_salida,
        horas_brutas: (brutos / 60).toFixed(2),
        horas_colacion: (colacion / 60).toFixed(2),
        horas_trabajadas: (netos / 60).toFixed(2)
      };
    });

    res.json({
      mes: `${anio}-${mes.padStart(2, '0')}`,
      trabajador: {
        nombres: trabajador.nombres,
        rol: trabajador.rol,
        contacto: trabajador.contacto,
        direccion: trabajador.direccion,
        pulsera_uuid
      },
      resumen: {
        dias_trabajados,
        horas_brutas: (total_brutos / 60).toFixed(2),
        horas_colacion: (total_colacion / 60).toFixed(2),
        horas_trabajadas: ((total_brutos - total_colacion) / 60).toFixed(2)
      },
      detalles
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar reporte mensual' });
  }
};

export const exportarPDFReporteMensual = async (req, res) => {
  const { pulsera_uuid } = req.params;
  const { anio, mes } = req.query;

  if (!anio || !mes) {
    return res.status(400).json({ message: 'Debe proporcionar año y mes (ej: ?anio=2025&mes=05)' });
  }

  try {
    // Buscar trabajador
    const [trabajadorRows] = await pool.query(
      `SELECT id, nombres, rol, contacto, direccion
       FROM trabajadores
       WHERE pulsera_uuid = ?`,
      [pulsera_uuid]
    );

    if (trabajadorRows.length === 0) {
      return res.status(404).json({ message: 'Trabajador no encontrado para esta pulsera' });
    }

    const trabajador = trabajadorRows[0];

    // Obtener asistencias
    const [asistencias] = await pool.query(
      `SELECT *,
              DATE(horario_entrada) AS fecha,
              TIMESTAMPDIFF(MINUTE, horario_entrada, horario_salida) AS minutos_brutos,
              TIMESTAMPDIFF(MINUTE, horario_salida_colacion, horario_entrada_colacion) AS minutos_colacion
       FROM asistencias
       WHERE pulsera_uuid = ?
         AND YEAR(horario_entrada) = ?
         AND MONTH(horario_entrada) = ?`,
      [pulsera_uuid, anio, mes]
    );

    const dias_trabajados = asistencias.length;
    let total_brutos = 0;
    let total_colacion = 0;

    const detalles = asistencias.map(a => {
      const brutos = a.minutos_brutos || 0;
      const colacion = a.minutos_colacion || 0;
      const netos = brutos - colacion;

      total_brutos += brutos;
      total_colacion += colacion;

      return {
        fecha: a.fecha,
        entrada: a.horario_entrada,
        entrada_colacion: a.horario_entrada_colacion,
        salida_colacion: a.horario_salida_colacion,
        salida: a.horario_salida,
        horas_brutas: (brutos / 60).toFixed(2),
        horas_colacion: (colacion / 60).toFixed(2),
        horas_trabajadas: (netos / 60).toFixed(2)
      };
    });

    const resumen = {
      mes: `${anio}-${mes.padStart(2, '0')}`,
      trabajador,
      resumen: {
        dias_trabajados,
        horas_brutas: (total_brutos / 60).toFixed(2),
        horas_colacion: (total_colacion / 60).toFixed(2),
        horas_trabajadas: ((total_brutos - total_colacion) / 60).toFixed(2)
      },
      detalles
    };

    // Generar PDF
    const pdfBuffer = await generarPDFReporteAsistencia(resumen, detalles);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte_asistencia_${resumen.mes}_${trabajador.nombres.replace(/\s+/g, '_')}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar el PDF del reporte mensual' });
  }
};
