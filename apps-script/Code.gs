// Backend de la canasta básica. Despliegue: Web App, ejecutar como "Yo", acceso "Cualquiera".
// Propiedad de script opcional: SPREADSHEET_ID (si no existe, usa la planilla vinculada al proyecto).

const SHEETS = {
  Visitas: ['ID visita','Creada','Integrante 1','Integrante 2','Integrante 3','Integrante 4','Curso','Supermercado','Sector','Fecha visita','Estado'],
  Envios: ['ID envío','Recibido','Hora cliente','Integrante 1','Integrante 2','Integrante 3','Integrante 4','Curso','Supermercado','Sector','Fecha visita',
    'Pan y cereales ($)','Carnes ($)','Lácteos ($)','Frutas ($)','Verduras ($)','Abarrotes ($)','Total 1 persona ($)','Total familia 4 ($)',
    'Productos sin precio','Pregunta 1','Pregunta 2','Pregunta 3','Pregunta 4'],
  Precios: ['ID envío','Supermercado','Categoría','Producto','Cantidad','Unidad','No encontrado','Precio unitario ($)','Subtotal ($)','ID producto'],
  Reemplazos: ['ID envío','Producto original','Reemplazo','Precio ($)']
};
const CATS = ['1. Pan, cereales y pastas','2. Carnes, pescados y fiambres','3. Lácteos, huevos y grasas','4. Frutas','5. Verduras y legumbres','6. Abarrotes y bebidas'];
const CAT_IDS = ['pan','carnes','lacteos','frutas','verduras','abarrotes'];
const ITEM_COUNTS = [6,8,7,6,13,8];
const MAX_ITEMS = 80;

function doGet() {
  return json_({ ok: true, message: 'API activa' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const data = JSON.parse(e.postData.contents);
    switch (data.action) {
      case 'createVisit': return json_(createVisit_(data));
      case 'getVisit': return json_(getVisit_(data));
      case 'saveCategory': return json_(saveCategory_(data));
      case 'saveReplacements': return json_(saveReplacements_(data));
      case 'finalizeVisit': return json_(finalizeVisit_(data));
      case 'saveBasket': return json_(saveBasket_(data));
      default: throw new Error('Acción no válida.');
    }
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function createVisit_(d) {
  const id = clean_(d.visitId, 40);
  if (!/^CB-[A-Z0-9]+$/.test(id)) throw new Error('ID de visita inválido.');
  const group = validateGroup_(d.group || {});
  const sh = ensureSheets_(spreadsheet_());
  const existing = findVisit_(sh.Visitas, id);
  if (existing) return { ok: true, duplicate: true, visitId: id, group: group, status: existing.values[10] };
  sh.Visitas.appendRow([id, new Date(), group.m1, group.m2, group.m3, group.m4,
    group.curso, group.super, group.sector, group.fecha, 'En curso']);
  return { ok: true, visitId: id, group: group, status: 'En curso' };
}

function getVisit_(d) {
  const id = clean_(d.visitId, 40);
  if (!/^CB-[A-Z0-9]+$/.test(id)) throw new Error('ID de visita inválido.');
  const sh = ensureSheets_(spreadsheet_());
  const visit = findVisit_(sh.Visitas, id);
  if (!visit) throw new Error('No existe una visita con ese ID.');
  const pricesLast = sh.Precios.getLastRow();
  const items = pricesLast < 2 ? [] : sh.Precios.getRange(2, 1, pricesLast - 1, 10).getValues()
    .filter(row => row[0] === id && row[9])
    .map(row => ({ id: row[9], category: row[2], name: row[3], qty: row[4], unit: row[5],
      missing: row[6] === 'Sí', price: row[7] === '' || row[7] === null ? null : row[7] }));
  const replacementsLast = sh.Reemplazos.getLastRow();
  const replacements = replacementsLast < 2 ? [] : sh.Reemplazos.getRange(2, 1, replacementsLast - 1, 4).getValues()
    .filter(row => row[0] === id)
    .map(row => ({ original: row[1], replacement: row[2], price: row[3] === '' ? null : row[3] }));
  const row = visit.values;
  return { ok: true, visitId: id, status: row[10] || 'En curso',
    group: { m1: row[2], m2: row[3], m3: row[4], m4: row[5], curso: row[6], super: row[7], sector: row[8], fecha: row[9] },
    items: items, replacements: replacements };
}

function saveCategory_(d) {
  const id = clean_(d.visitId, 40);
  if (!/^CB-[A-Z0-9]+$/.test(id)) throw new Error('ID de visita inválido.');
  const category = clean_(d.category, 100);
  const categoryIndex = CATS.indexOf(category);
  if (categoryIndex < 0) throw new Error('Categoría inválida.');
  if (!Array.isArray(d.items) || !d.items.length || d.items.length > MAX_ITEMS) throw new Error('Lista de productos inválida.');
  const sh = ensureSheets_(spreadsheet_());
  const visit = findVisit_(sh.Visitas, id);
  if (!visit) throw new Error('No existe una visita con ese ID.');
  if (visit.values[10] === 'Finalizada') throw new Error('La visita ya está finalizada.');

  const last = sh.Precios.getLastRow();
  const existing = {};
  if (last > 1) sh.Precios.getRange(2, 1, last - 1, 10).getValues().forEach((row, index) => {
    if (row[0] === id && row[9]) existing[row[9]] = index + 2;
  });
  const seen = {};
  d.items.forEach(item => {
    const productId = clean_(item.id, 40);
    const match = productId.match(/^([a-z]+)_(\d+)$/);
    if (!match || match[1] !== CAT_IDS[categoryIndex] || Number(match[2]) < 1 || Number(match[2]) > ITEM_COUNTS[categoryIndex] || seen[productId]) {
      throw new Error('Producto inválido para la categoría seleccionada.');
    }
    seen[productId] = true;
    const qty = Number(item.qty), missing = item.missing === true;
    const price = item.price === null || item.price === undefined || item.price === '' ? null : Number(item.price);
    if (!isFinite(qty) || qty <= 0 || (price !== null && (!isFinite(price) || price < 0))) throw new Error('Cantidad o precio inválido.');
    const subtotal = missing || price === null ? '' : Math.round(price * qty * 100) / 100;
    const row = [id, visit.values[7], category, clean_(item.name, 120), qty, clean_(item.unit, 30), missing ? 'Sí' : 'No', missing || price === null ? '' : price, subtotal, productId];
    if (existing[productId]) sh.Precios.getRange(existing[productId], 1, 1, 10).setValues([row]);
    else {
      sh.Precios.appendRow(row);
      existing[productId] = sh.Precios.getLastRow();
    }
  });
  return { ok: true, visitId: id, saved: d.items.length };
}

function saveReplacements_(d) {
  const id = clean_(d.visitId, 40);
  if (!/^CB-[A-Z0-9]+$/.test(id)) throw new Error('ID de visita inválido.');
  const sh = ensureSheets_(spreadsheet_());
  if (!findVisit_(sh.Visitas, id)) throw new Error('No existe una visita con ese ID.');
  const rows = (Array.isArray(d.replacements) ? d.replacements : []).slice(0, 20)
    .filter(row => row.original || row.replacement || row.price !== null && row.price !== undefined && row.price !== '')
    .map(row => {
      const price = row.price === null || row.price === undefined || row.price === '' ? '' : Number(row.price);
      if (price !== '' && (!isFinite(price) || price < 0)) throw new Error('Precio de reemplazo inválido.');
      return [id, clean_(row.original, 120), clean_(row.replacement, 160), price];
    });
  for (let index = sh.Reemplazos.getLastRow(); index >= 2; index--) {
    if (sh.Reemplazos.getRange(index, 1).getValue() === id) sh.Reemplazos.deleteRow(index);
  }
  if (rows.length) sh.Reemplazos.getRange(sh.Reemplazos.getLastRow() + 1, 1, rows.length, 4).setValues(rows);
  return { ok: true, visitId: id, saved: rows.length };
}

function finalizeVisit_(d) {
  const id = clean_(d.visitId, 40);
  if (!/^CB-[A-Z0-9]+$/.test(id)) throw new Error('ID de visita inválido.');
  const sh = ensureSheets_(spreadsheet_());
  const visit = findVisit_(sh.Visitas, id);
  if (!visit) throw new Error('No existe una visita con ese ID.');
  const envios = sh.Envios;
  const lastSubmission = envios.getLastRow();
  if (lastSubmission > 1 && envios.getRange(2, 1, lastSubmission - 1, 1).getValues().some(row => row[0] === id)) {
    return { ok: true, duplicate: true, visitId: id };
  }
  const priceRows = sh.Precios.getLastRow() < 2 ? [] : sh.Precios.getRange(2, 1, sh.Precios.getLastRow() - 1, 10).getValues()
    .filter(row => row[0] === id && row[9]);
  const byId = {};
  priceRows.forEach(row => { byId[row[9]] = row; });
  const catTotals = CATS.map(() => 0);
  let missingCount = 0, pending = 0;
  CAT_IDS.forEach((categoryId, categoryIndex) => {
    for (let itemNumber = 1; itemNumber <= ITEM_COUNTS[categoryIndex]; itemNumber++) {
      const row = byId[categoryId + '_' + itemNumber];
      if (!row || (row[6] !== 'Sí' && (row[7] === '' || row[7] === null))) { pending++; continue; }
      if (row[6] === 'Sí') { missingCount++; continue; }
      catTotals[categoryIndex] += Number(row[8]);
    }
  });
  if (pending) throw new Error('Faltan ' + pending + ' productos por registrar o marcar como no encontrados.');
  const row = visit.values;
  const person = catTotals.reduce((sum, value) => sum + value, 0);
  const members = [row[2], row[3], row[4], row[5]];
  envios.appendRow([id, new Date(), clean_(d.clientTime, 40)].concat(members, [row[6], row[7], row[8], row[9]],
    catTotals, [person, person * 4, missingCount, '', '', '', '']));
  sh.Visitas.getRange(visit.row, 11).setValue('Finalizada');
  return { ok: true, visitId: id, totalPerson: person, totalFamily: person * 4 };
}

function validateGroup_(g) {
  const group = {
    m1: clean_(g.m1, 80), m2: clean_(g.m2, 80), m3: clean_(g.m3, 80), m4: clean_(g.m4, 80),
    curso: clean_(g.curso, 60), super: clean_(g.super, 100), sector: clean_(g.sector, 120), fecha: clean_(g.fecha, 30)
  };
  if (!group.m1 || !group.m2 || !group.m3 || !group.curso || !group.super || !group.sector || !group.fecha) {
    throw new Error('Completa los integrantes, curso, supermercado, sector y fecha de visita.');
  }
  return group;
}

function findVisit_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const rows = sheet.getRange(2, 1, last - 1, 11).getValues();
  for (let index = 0; index < rows.length; index++) {
    if (rows[index][0] === id) return { row: index + 2, values: rows[index] };
  }
  return null;
}

function saveBasket_(d) {
  const id = clean_(d.submissionId, 40);
  if (!/^CB-[A-Z0-9]+$/.test(id)) throw new Error('ID de envío inválido.');
  const g = d.group || {};
  const members = [g.m1, g.m2, g.m3, g.m4].map(v => clean_(v, 80));
  if (!members[0] || !members[1] || !members[2]) throw new Error('Se requieren al menos 3 integrantes.');
  if (!clean_(g.curso, 60) || !clean_(g.super, 100) || !clean_(g.sector, 120) || !clean_(g.fecha, 30)) throw new Error('Datos del grupo incompletos.');
  if (!Array.isArray(d.items) || !d.items.length || d.items.length > MAX_ITEMS) throw new Error('Lista de productos inválida.');

  const ss = spreadsheet_();
  const sh = ensureSheets_(ss);
  const envios = sh.Envios;

  // Idempotencia: un reintento con el mismo ID no duplica filas.
  const last = envios.getLastRow();
  if (last > 1 && envios.getRange(2, 1, last - 1, 1).getValues().some(r => r[0] === id)) {
    return { ok: true, duplicate: true, submissionId: id };
  }

  const catTotals = CATS.map(() => 0);
  let pending = 0;
  const priceRows = d.items.map(it => {
    const ci = CATS.indexOf(it.category);
    if (ci < 0) throw new Error('Categoría inválida.');
    const qty = Number(it.qty), missing = it.missing === true;
    const price = it.price === null || it.price === undefined || it.price === '' ? null : Number(it.price);
    if (!isFinite(qty) || qty <= 0) throw new Error('Cantidad inválida.');
    if (price !== null && (!isFinite(price) || price < 0)) throw new Error('Precio inválido.');
    if (!missing && price === null) pending++;
    const sub = missing || price === null ? 0 : Math.round(price * qty * 100) / 100;
    catTotals[ci] += sub;
    return [id, clean_(g.super, 100), CATS[ci], clean_(it.name, 120), qty, clean_(it.unit, 30), missing ? 'Sí' : 'No', missing ? '' : price, missing ? '' : sub];
  });
  if (pending) throw new Error('Hay ' + pending + ' productos sin precio ni marca de no encontrado.');

  const person = catTotals.reduce((a, b) => a + b, 0);
  const ana = (Array.isArray(d.analysis) ? d.analysis : []).concat(['', '', '', '']).slice(0, 4).map(v => clean_(v, 2000));

  // Los totales se recalculan en el servidor; los del cliente se ignoran.
  envios.appendRow([id, new Date(), clean_(d.clientTime, 40)].concat(members, [clean_(g.curso, 60), clean_(g.super, 100), clean_(g.sector, 120), clean_(g.fecha, 30)],
    catTotals, [person, person * 4, d.items.filter(i => i.missing === true).length], ana));
  sh.Precios.getRange(sh.Precios.getLastRow() + 1, 1, priceRows.length, priceRows[0].length).setValues(priceRows);

  const repl = (Array.isArray(d.replacements) ? d.replacements : []).slice(0, 20)
    .map(r => [id, clean_(r.original, 120), clean_(r.replacement, 160), r.price === null || r.price === undefined ? '' : Number(r.price) || 0]);
  if (repl.length) sh.Reemplazos.getRange(sh.Reemplazos.getLastRow() + 1, 1, repl.length, 4).setValues(repl);

  return { ok: true, submissionId: id, totalPerson: person, totalFamily: person * 4 };
}

function setupDatabase() {
  ensureSheets_(spreadsheet_());
}

function ensureSheets_(ss) {
  const out = {};
  Object.keys(SHEETS).forEach(name => {
    let s = ss.getSheetByName(name) || ss.insertSheet(name);
    const headers = SHEETS[name];
    if (s.getLastRow() === 0) {
      s.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#003a8c').setFontColor('#ffffff');
      s.setFrozenRows(1);
    } else if (s.getLastColumn() < headers.length) {
      const columns = s.getLastColumn();
      s.getRange(1, columns + 1, 1, headers.length - columns).setValues([headers.slice(columns)]);
    }
    out[name] = s;
  });
  return out;
}

function spreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Sin planilla: vincula el script a una hoja o define SPREADSHEET_ID.');
  return ss;
}

// Evita inyección de fórmulas al abrir en Sheets.
function clean_(v, max) {
  let s = String(v === null || v === undefined ? '' : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
