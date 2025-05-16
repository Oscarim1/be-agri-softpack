import puppeteer from 'puppeteer';

export const generarPDFReporteAsistencia = async (resumen, detalles) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1, h2 { color: #2c3e50; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Reporte Mensual de Asistencia</h1>
        <h2>${resumen.trabajador.nombres} (${resumen.trabajador.rol})</h2>
        <p><strong>Mes:</strong> ${resumen.mes}</p>
        <p><strong>Días trabajados:</strong> ${resumen.resumen.dias_trabajados}</p>
        <p><strong>Horas trabajadas:</strong> ${resumen.resumen.horas_trabajadas} h</p>
        <p><strong>Horas colación:</strong> ${resumen.resumen.horas_colacion} h</p>
        <p><strong>Horas brutas:</strong> ${resumen.resumen.horas_brutas} h</p>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida Colación</th>
              <th>Entrada Colación</th>
              <th>Salida</th>
              <th>Horas Trabajadas</th>
            </tr>
          </thead>
          <tbody>
            ${resumen.detalles.map(d => `
              <tr>
                <td>${d.fecha}</td>
                <td>${d.entrada || '-'}</td>
                <td>${d.salida_colacion || '-'}</td>
                <td>${d.entrada_colacion || '-'}</td>
                <td>${d.salida || '-'}</td>
                <td>${d.horas_trabajadas}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
};

export const generarPDFResumenCuadrilla = async (data) => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1, h2 { color: #2c3e50; margin-bottom: 0; }
          p { margin: 5px 0; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Resumen Diario de Cuadrilla</h1>
        <h2>Cuadrilla ID: ${data.cuadrilla_id}</h2>
        <p><strong>Fecha:</strong> ${data.fecha}</p>
        <p><strong>Total Trabajadores:</strong> ${data.resumen.total_trabajadores}</p>
        <p><strong>Total Fruta:</strong> ${data.resumen.total_fruta}</p>

        <h3>Trabajos del Día</h3>
        <ul>
          ${data.trabajos.map(t => `<li>${t.nombre} (${t.tipo}) - $${t.valor}</li>`).join('')}
        </ul>

        <h3>Trabajadores</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Fruta Recolectada</th>
            </tr>
          </thead>
          <tbody>
            ${data.trabajadores.map(t => `
              <tr>
                <td>${t.nombres}</td>
                <td>${t.rol || ''}</td>
                <td>${t.cantidad_fruta || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
};

export const generarPDFCuarteles = async (cuarteles, titulo = 'Reporte de Cuarteles') => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; color: #2c3e50; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Empresa</th>
              <th>Tipo Fruta</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${cuarteles.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.empresa_contrato}</td>
                <td>${c.tipo_fruta}</td>
                <td>${c.cantidad_fruta}</td>
                <td>${c.fecha}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
};

export const generarPDFEmpresas = async (empresas, titulo = 'Listado de Empresas') => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; color: #2c3e50; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Contrato</th>
              <th>Adjudicación</th>
              <th>Término Faena</th>
              <th>Documentos</th>
            </tr>
          </thead>
          <tbody>
            ${empresas.map(e => `
              <tr>
                <td>${e.id}</td>
                <td>${e.contrato}</td>
                <td>${e.fecha_adjudicacion}</td>
                <td>${e.fecha_termino_faena || '-'}</td>
                <td>${e.documentos || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
};

export const generarPDFContratistas = async (contratistas, titulo = 'Listado de Contratistas') => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; color: #2c3e50; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Razón Social</th>
              <th>Empresa</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            ${contratistas.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.razon_social}</td>
                <td>${c.empresa_contrato}</td>
                <td>${c.nombre_usuario}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
};

export const generarPDFContratos = async (contratos, titulo = 'Listado de Contratos') => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; color: #2c3e50; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 12px; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Documento</th>
              <th>Fecha</th>
              <th>Contratista</th>
              <th>Documentación</th>
            </tr>
          </thead>
          <tbody>
            ${contratos.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.documento}</td>
                <td>${c.fecha}</td>
                <td>${c.contratista}</td>
                <td>${c.documentacion || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
};

export const generarPDFContratoTrabajador = async (asignaciones, titulo = 'Asignaciones de Contratos') => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Contrato</th>
              <th>Trabajador</th>
              <th>Inicio</th>
              <th>Término</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${asignaciones.map(a => `
              <tr>
                <td>${a.id}</td>
                <td>${a.contrato}</td>
                <td>${a.trabajador}</td>
                <td>${a.fecha_inicio}</td>
                <td>${a.fecha_termino || '-'}</td>
                <td>${a.estado}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdf;
};

export const generarPDFLiquidacion = async (datos) => {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const formato = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n || 0);

  const html = `
    <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; font-size: 13px; }
        h1 { font-size: 18px; margin-bottom: 10px; }
        h2 { font-size: 16px; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        .section-title { margin-top: 20px; font-weight: bold; }
        .resumen { background-color: #e7f3ff; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Liquidación de Sueldo</h1>
      <p><strong>Empleador:</strong> ${datos.empresa_contrato}</p>
      <p><strong>Mes:</strong> ${new Date(datos.fecha_liquidacion).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</p>

      <table>
        <tr>
          <td><strong>Sr(a):</strong> ${datos.trabajador_nombre}</td>
          <td><strong>RUT:</strong> ${datos.trabajador_rut || 'N/A'}</td>
          <td><strong>Cargo:</strong> ${datos.trabajador_rol || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Tipo Contrato:</strong> ${datos.tipo_contrato || 'Indefinido'}</td>
          <td><strong>Inicio:</strong> ${datos.fecha_inicio}</td>
          <td><strong>Término:</strong> ${datos.fecha_termino || '-'}</td>
        </tr>
        <tr>
          <td><strong>Días trabajados:</strong> ${datos.dias_trabajados}</td>
          <td><strong>Previsión:</strong> ${datos.afp_nombre}</td>
          <td><strong>Salud:</strong> ${datos.salud_nombre}</td>
        </tr>
      </table>

      <h2>Haberes Imponibles</h2>
      <table>
        <tr><td>Sueldo Base</td><td>${formato(datos.sueldo_base)}</td></tr>
        <tr><td>Gratificación</td><td>${formato(datos.gratificacion)}</td></tr>
      </table>

      <h2>Haberes No Imponibles</h2>
      <table>
        <tr><td>Colación</td><td>${formato(datos.colacion)}</td></tr>
        <tr><td>Asignación por Gastos Básicos</td><td>${formato(datos.asignacion_gastos)}</td></tr>
      </table>

      <table class="resumen">
        <tr><td>Total Haberes</td><td>${formato(datos.total_haberes)}</td></tr>
      </table>

      <h2>Descuentos Legales</h2>
      <table>
        <tr><td>Cotiz. Previ. Obligatoria</td><td>${formato(datos.cotizacion_prevision)}</td></tr>
        <tr><td>Cotiz. Salud Obligatoria</td><td>${formato(datos.cotizacion_salud)}</td></tr>
        <tr><td>Seguro Cesantía</td><td>${formato(datos.seguro_cesantia)}</td></tr>
        <tr><td>Impuesto Único</td><td>${formato(datos.impuesto_unico)}</td></tr>
      </table>

      <h2>Otros Descuentos</h2>
      <table>
        <tr><td>Otros</td><td>${formato(datos.otros_descuentos)}</td></tr>
      </table>

      <table class="resumen">
        <tr><td>Total Descuentos</td><td>${formato(datos.total_descuentos)}</td></tr>
        <tr><td>Líquido a Recibir</td><td>${formato(datos.liquido_final)}</td></tr>
      </table>

      <p style="margin-top: 40px;">
        Certifico que he recibido de ${datos.empresa_contrato} el saldo indicado en esta liquidación y no tengo cargos pendientes.
      </p>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdf;
};

export const generarLiquidacionHTML = async (datos) => {
  const formato = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n || 0);

  return `
    <div style="font-family: Arial; font-size: 13px; padding: 20px;">
      <h1>Liquidación de Sueldo</h1>
      <p><strong>Empresa:</strong> ${datos.empresa_contrato}</p>
      <p><strong>Mes:</strong> ${new Date(datos.fecha_liquidacion).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 15px; font-size: 12px;">
        <tr><td><strong>Trabajador:</strong> ${datos.trabajador_nombre}</td><td><strong>RUT:</strong> ${datos.trabajador_rut}</td><td><strong>Cargo:</strong> ${datos.trabajador_rol}</td></tr>
        <tr><td><strong>Días trabajados:</strong> ${datos.dias_trabajados}</td><td><strong>Previsión:</strong> ${datos.afp_nombre}</td><td><strong>Salud:</strong> ${datos.salud_nombre}</td></tr>
      </table>
      <p><strong>Sueldo Base:</strong> ${formato(datos.sueldo_base)} | <strong>Gratificación:</strong> ${formato(datos.gratificacion)}</p>
      <p><strong>Colación:</strong> ${formato(datos.colacion)} | <strong>Asignación Gastos:</strong> ${formato(datos.asignacion_gastos)}</p>
      <p><strong>Total Haberes:</strong> ${formato(datos.total_haberes)} | <strong>Total Descuentos:</strong> ${formato(datos.total_descuentos)}</p>
      <p style="font-weight: bold;">Líquido a Recibir: ${formato(datos.liquido_final)}</p>
    </div>
  `;
};
