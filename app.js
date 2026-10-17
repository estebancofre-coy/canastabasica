const API_URL = "https://script.google.com/macros/s/AKfycbwQ_6F_RuakoCYo0nAfbCSQI7p2L8dni1PwlqjK-MrG3-641_T9ArgZs-_QSx750FZkGQ/exec";
const OFFICIAL = 91220;
const DRAFT_KEY = "canasta_visit_v2";

const CATS = [
  { id: "pan", name: "1. Pan, cereales y pastas", items: [["Pan corriente (marraqueta o hallulla)",6,"kg"],["Arroz",1,"kg"],["Harina de trigo",0.7,"kg"],["Espaguetis",0.5,"kg"],["Otras pastas (corbatas, tallarines, etc.)",0.7,"kg"],["Galletas",1,"paquete"]] },
  { id: "carnes", name: "2. Carnes, pescados y fiambres", items: [["Carne de vacuno molida",0.15,"kg"],["Carne de vacuno (posta u otro corte)",0.5,"kg"],["Chuleta de cerdo",0.1,"kg"],["Pechuga de pollo",0.2,"kg"],["Trutro de pollo",0.5,"kg"],["Jamón u otro fiambre",0.2,"kg"],["Atún en conserva",1,"lata"],["Jurel en conserva",1,"lata"]] },
  { id: "lacteos", name: "3. Lácteos, huevos y grasas", items: [["Leche líquida entera",1,"L"],["Leche semi o descremada",0.35,"L"],["Yogur",4,"unidades"],["Queso gouda o mantecoso",0.3,"kg"],["Huevos",10,"unidades"],["Aceite vegetal",0.7,"L"],["Mantequilla o margarina",0.2,"kg"]] },
  { id: "frutas", name: "4. Frutas", items: [["Plátanos",0.5,"kg"],["Paltas",0.4,"kg"],["Manzanas",0.4,"kg"],["Limones",0.35,"kg"],["Naranjas",0.25,"kg"],["Fruta de estación (uva, durazno u otra)",0.3,"kg"]] },
  { id: "verduras", name: "5. Verduras y legumbres", items: [["Papas",3,"kg"],["Tomates",1,"kg"],["Cebollas",0.7,"kg"],["Zanahorias",0.5,"kg"],["Lechuga",1,"unidad"],["Zapallo",0.25,"kg"],["Choclo (fresco o congelado)",0.4,"kg"],["Pimentón",1,"unidad"],["Zapallo italiano",1,"unidad"],["Acelga o brócoli",1,"unidad"],["Ajo",1,"cabeza"],["Porotos secos",0.2,"kg"],["Lentejas",0.1,"kg"]] },
  { id: "abarrotes", name: "6. Abarrotes y bebidas", items: [["Azúcar",0.7,"kg"],["Sal",0.2,"kg"],["Salsa de tomate",1,"unidad (200 g)"],["Mayonesa",0.1,"kg"],["Té",1,"caja (20 bolsitas)"],["Café",1,"frasco (50 g)"],["Agua mineral",2.5,"L"],["Bebida o refresco",2,"L"]] }
];
CATS.forEach(category => {
  category.items = category.items.map((item, index) => ({ id: category.id + "_" + (index + 1), name: item[0], qty: item[1], unit: item[2] }));
});

const SLIDES = [
  {
    kicker: "01 · Propósito",
    title: "Observar precios para comprender el costo de vida",
    body: `<p class="lead">Este instrumento registra precios de alimentos en un supermercado y estima el costo de una canasta de referencia.</p><p>Es una observación acotada en un lugar y momento determinados: aporta evidencia para conversar sobre acceso a alimentos, presupuestos y diferencias territoriales. No reemplaza una encuesta de gasto familiar ni mide por sí solo la calidad nutricional.</p>`
  },
  {
    kicker: "02 · Estructura",
    title: "Una canasta organizada en seis categorías",
    body: `<p>El formulario propone productos y cantidades de referencia en:</p><div class="discipline-grid"><div>Pan, cereales y pastas</div><div>Carnes, pescados y fiambres</div><div>Lácteos, huevos y grasas</div><div>Frutas</div><div>Verduras y legumbres</div><div>Abarrotes y bebidas</div></div><p>Para cada producto se registra el precio por la unidad indicada. Si hay varias marcas comparables, se anota la más barata; si no está disponible, se marca como no encontrado.</p>`
  },
  {
    kicker: "03 · Trabajo de campo",
    title: "Un grupo, una visita y varias capturas simultáneas",
    body: `<ol><li>Una persona crea la visita e ingresa los datos del grupo y del supermercado.</li><li>Comparte el ID de visita con el equipo.</li><li>Desde otros celulares, cada integrante entra solo con ese ID y toma una o más categorías.</li><li>Guarda cada categoría; los precios quedan asociados al mismo instrumento y se sincronizan con la planilla.</li></ol><p class="note">Registren precios observados, unidad, fecha y lugar. No estimen valores cuando un producto no esté disponible.</p>`
  },
  {
    kicker: "04 · Valoración",
    title: "Cómo se construye el total",
    body: `<div class="formula">Subtotal del producto = precio por unidad × cantidad de referencia</div><p>Los subtotales se suman por categoría. La suma estima el costo para una persona; multiplicarla por cuatro ofrece una referencia sencilla para una familia de cuatro integrantes.</p><p>El resultado se compara con el valor de referencia configurado en el instrumento: <strong>$91.220 por persona (julio de 2026)</strong>. La comparación orienta preguntas; no demuestra por sí sola que dos canastas tengan exactamente la misma composición.</p>`
  },
  {
    kicker: "05 · Trabajo Social",
    title: "Leer condiciones de acceso, no responsabilizar a las familias",
    body: `<p>Desde Trabajo Social, el registro puede apoyar una conversación sobre seguridad alimentaria, costo de vida y recursos disponibles en un territorio.</p><ul><li>Relacionar precios con ingresos, tamaño del hogar, transporte y oferta local.</li><li>Identificar barreras de acceso y diferencias entre sectores.</li><li>Usar los hallazgos para orientar diagnóstico comunitario o preguntas de intervención.</li></ul><p class="note">Un precio alto o una compra restringida no explica por sí solo las decisiones de una familia. El análisis requiere contexto y escucha.</p>`
  },
  {
    kicker: "06 · Miradas disciplinares",
    title: "El mismo dato permite preguntas distintas",
    body: `<div class="discipline-grid"><section><h3>Ingeniería Comercial</h3><p>Comparar marcas, comercios y dispersión de precios; explorar presupuestos y estrategias de compra.</p></section><section><h3>Economía y políticas públicas</h3><p>Relacionar costo de vida, poder adquisitivo, inflación y pertinencia de referencias públicas.</p></section><section><h3>Nutrición</h3><p>Contrastar costo y disponibilidad con composición alimentaria; el instrumento no evalúa nutrientes.</p></section><section><h3>Estadística y geografía</h3><p>Diseñar comparaciones entre lugares y fechas, documentar el muestreo y reconocer sus límites.</p></section></div>`
  },
  {
    kicker: "07 · Trabajo en clases",
    title: "La captura termina en terreno; el análisis continúa en aula",
    body: `<p>Una visita observa un comercio en una fecha concreta. La muestra no representa automáticamente a toda una ciudad, y las cantidades de referencia no describen el consumo real de cada hogar.</p><h3>Preguntas para discutir en clases</h3><ul><li>¿Qué categoría aportó más al total y qué factores podrían explicarlo?</li><li>¿Qué diferencias habría entre supermercados, ferias y barrios?</li><li>¿Qué información adicional necesitaría cada disciplina para sostener sus conclusiones?</li><li>¿Qué aspectos de acceso o calidad no se pueden medir solo con precios?</li></ul><p class="note">Estas preguntas no se responden durante la salida a terreno ni se guardan como datos del instrumento.</p>`
  }
];

const fmt = value => "$" + Math.round(value).toLocaleString("es-CL");
const parsePrice = value => {
  const parsed = parseFloat(String(value ?? "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const emptyGroup = () => ({ m1: "", m2: "", m3: "", m4: "", curso: "", super: "", sector: "", fecha: localDateTime() });
const blankState = () => ({ screen: "manual", slide: 0, visitId: "", joinCode: "", group: emptyGroup(), prices: {}, missing: {}, dirty: {}, replacements: [{ original: "", replacement: "", price: "" }], replacementsDirty: false, status: "" });

function localDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    return saved && typeof saved === "object" ? { ...blankState(), ...saved } : blankState();
  } catch (_) {
    return blankState();
  }
}

let state = loadState();
const view = document.getElementById("view");
const toastNode = document.getElementById("toast");

function saveState() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); } catch (_) { }
}

function toast(message, bad = false) {
  toastNode.textContent = message;
  toastNode.className = bad ? "toast bad" : "toast";
  toastNode.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { toastNode.hidden = true; }, 4200);
}

function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "CB-" + Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function api(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  let result;
  try { result = await response.json(); }
  catch (_) { throw new Error("Respuesta inválida del servidor. Revisa que Apps Script esté actualizado."); }
  if (!response.ok || !result.ok) throw new Error(result.error || "No se pudo guardar la visita.");
  return result;
}

function getItemPrice(item) {
  return state.missing[item.id] ? 0 : (parsePrice(state.prices[item.id]) ?? 0);
}

function itemSubtotal(item) {
  return getItemPrice(item) * item.qty;
}

function categorySubtotal(category) {
  return category.items.reduce((sum, item) => sum + itemSubtotal(item), 0);
}

function total() {
  return CATS.reduce((sum, category) => sum + categorySubtotal(category), 0);
}

function pendingItems() {
  return CATS.flatMap(category => category.items.filter(item => !state.missing[item.id] && parsePrice(state.prices[item.id]) === null));
}

function registeredCount(category) {
  return category.items.filter(item => state.missing[item.id] || parsePrice(state.prices[item.id]) !== null).length;
}

function field(key, label, type = "text", required = false) {
  return `<label>${label}${required ? " *" : ""}<input type="${type}" data-group="${key}" value="${esc(state.group[key])}" ${required ? "required" : ""}></label>`;
}

function manualHtml() {
  const slide = SLIDES[state.slide];
  return `<section class="manual-shell" aria-label="Manual pedagógico">
    <div class="manual-top"><span>GUÍA PEDAGÓGICA</span><span>${slide.kicker}</span></div>
    <div class="manual-progress" role="progressbar" aria-valuemin="1" aria-valuemax="${SLIDES.length}" aria-valuenow="${state.slide + 1}"><div style="width:${((state.slide + 1) / SLIDES.length) * 100}%"></div></div>
    <article class="slide"><p class="eyebrow">INSTRUMENTO DE OBSERVACIÓN · ${String(state.slide + 1).padStart(2, "0")} / ${SLIDES.length}</p><h1>${slide.title}</h1>${slide.body}</article>
    <div class="slide-controls"><button class="button secondary" data-action="previous-slide" ${state.slide === 0 ? "disabled" : ""}>Anterior</button><div class="slide-dots">${SLIDES.map((_, index) => `<button class="dot ${index === state.slide ? "active" : ""}" aria-label="Diapositiva ${index + 1}" data-action="go-slide" data-slide="${index}"></button>`).join("")}</div><button class="button primary" data-action="next-slide" ${state.slide === SLIDES.length - 1 ? "disabled" : ""}>Siguiente</button></div>
    <div class="manual-actions"><button class="button primary" data-action="start">Iniciar actividad</button><button class="button secondary" data-action="join">Tengo un ID de visita</button>${state.visitId ? `<button class="button quiet" data-action="resume">Retomar visita ${esc(state.visitId)}</button>` : ""}</div>
  </section>`;
}

function startHtml() {
  return `<section class="panel narrow"><p class="eyebrow">REGISTRO DE TERRENO</p><h1>Una visita, un instrumento</h1><p>Crea el registro una sola vez para tu grupo o únete con el ID que compartió otra persona.</p><div class="action-stack"><button class="button primary" data-action="new-visit">Crear visita del grupo</button><button class="button secondary" data-action="join">Unirme con ID de visita</button><button class="button quiet" data-action="manual">Volver al manual</button></div></section>`;
}

function newVisitHtml() {
  return `<section class="panel narrow"><p class="eyebrow">NUEVA VISITA</p><h1>Identificación del grupo</h1><p>Estos datos se registran una vez y se asocian a un único instrumento de canasta básica.</p><div class="form-grid">
    ${field("m1", "Integrante 1", "text", true)}${field("m2", "Integrante 2", "text", true)}${field("m3", "Integrante 3", "text", true)}${field("m4", "Integrante 4 (opcional)")}
    ${field("curso", "Curso", "text", true)}${field("super", "Supermercado", "text", true)}${field("sector", "Dirección o sector", "text", true)}${field("fecha", "Fecha y hora", "datetime-local", true)}
  </div><div class="form-actions"><button class="button secondary" data-action="back-start">Atrás</button><button class="button primary" data-action="create-visit">Crear ID de visita</button></div></section>`;
}

function joinHtml() {
  const code = new URLSearchParams(location.search).get("visita") || state.joinCode;
  return `<section class="panel narrow"><p class="eyebrow">UNIRSE A UNA VISITA</p><h1>Ingresa el ID compartido</h1><p>No necesitas volver a identificar al grupo. El ID abre el mismo instrumento y sus categorías.</p><label>ID de visita<input class="code-input" data-join-code value="${esc(code)}" placeholder="CB-XXXXXXXXXXXX" autocomplete="off" autocapitalize="characters"></label><div class="form-actions"><button class="button secondary" data-action="back-start">Atrás</button><button class="button primary" data-action="join-visit">Abrir visita</button></div></section>`;
}

function categoryButton(category) {
  const done = registeredCount(category), count = category.items.length;
  return `<button class="category-link" data-action="open-category" data-category="${category.id}" ${state.status === "Finalizada" ? "disabled" : ""}><span class="category-name">${category.name}</span><span class="category-progress">${done} / ${count} productos registrados</span><span class="category-arrow" aria-hidden="true">›</span></button>`;
}

function menuHtml() {
  const done = CATS.reduce((sum, category) => sum + registeredCount(category), 0);
  return `<section class="visit-head"><div><p class="eyebrow">INSTRUMENTO COMPARTIDO</p><h1>Visita <span class="visit-code">${esc(state.visitId)}</span></h1><p>${esc(state.group.super)} · ${esc(state.group.sector)} · ${esc(state.group.curso)}</p></div><div class="visit-actions"><button class="button secondary" data-action="share">Compartir ID</button><button class="button quiet" data-action="refresh">Actualizar</button></div></section>
    <section class="workspace"><div class="section-heading"><div><p class="eyebrow">CAPTURA POR CATEGORÍA</p><h2>${done} / 48 productos registrados</h2></div><span class="status ${state.status === "Finalizada" ? "closed" : "open"}">${state.status || "En curso"}</span></div>
    <div class="category-list">${CATS.map(categoryButton).join("")}</div>
    <div class="workspace-actions"><button class="button secondary" data-action="replacements" ${state.status === "Finalizada" ? "disabled" : ""}>Reemplazos</button><button class="button primary" data-action="summary">Ver total y descargar PDF</button></div></section>`;
}

function categoryHtml(category) {
  const rows = category.items.map(item => {
    const missing = !!state.missing[item.id];
    const price = state.prices[item.id] ?? "";
    return `<article class="product-row ${missing ? "missing" : price !== "" ? "priced" : ""}" data-product="${item.id}">
      <div class="product-top"><div><h3>${esc(item.name)}</h3><p>Cantidad de referencia: ${String(item.qty).replace(".", ",")} ${esc(item.unit)}</p></div><label class="check-label"><input type="checkbox" data-missing="${item.id}" ${missing ? "checked" : ""}> No encontrado</label></div>
      <div class="price-line"><label>Precio por ${/^(kg|L)$/.test(item.unit) ? item.unit : "unidad"}<input inputmode="decimal" placeholder="0" data-price="${item.id}" value="${esc(price)}" ${missing || state.status === "Finalizada" ? "disabled" : ""}></label><strong id="subtotal-${item.id}">${missing ? "No disponible" : fmt(itemSubtotal(item))}</strong></div>
    </article>`;
  }).join("");
  return `<section class="panel"><button class="text-button" data-action="menu">← Categorías</button><p class="eyebrow">CAPTURA INDEPENDIENTE</p><h1>${category.name}</h1><p>Guarda los cambios para que queden disponibles en los demás celulares.</p><div class="product-list">${rows}</div><div class="category-total"><span>Subtotal registrado</span><strong id="category-total">${fmt(categorySubtotal(category))}</strong></div><div class="form-actions"><button class="button secondary" data-action="menu">Volver al menú</button><button class="button primary" data-action="save-category" ${state.status === "Finalizada" ? "disabled" : ""}>Guardar categoría</button></div></section>`;
}

function replacementsHtml() {
  const rows = state.replacements.map((replacement, index) => `<article class="replacement-row"><label>Producto original<input data-replacement="${index}" data-key="original" value="${esc(replacement.original)}"></label><label>Reemplazo y formato<input data-replacement="${index}" data-key="replacement" value="${esc(replacement.replacement)}"></label><label>Precio ($)<input inputmode="decimal" data-replacement="${index}" data-key="price" value="${esc(replacement.price)}"></label><button class="text-button danger" data-action="remove-replacement" data-index="${index}">Quitar</button></article>`).join("");
  return `<section class="panel"><button class="text-button" data-action="menu">← Categorías</button><p class="eyebrow">REGISTRO OPCIONAL</p><h1>Productos reemplazados</h1><p>Se guardan asociados a esta visita, pero no se suman al total de la canasta.</p>${rows}<button class="button secondary" data-action="add-replacement">Agregar reemplazo</button><div class="form-actions"><button class="button secondary" data-action="menu">Volver al menú</button><button class="button primary" data-action="save-replacements">Guardar reemplazos</button></div></section>`;
}

function summaryHtml() {
  const pending = pendingItems().length;
  const rows = CATS.map(category => `<tr><td>${esc(category.name)}</td><td class="number">${fmt(categorySubtotal(category))}</td></tr>`).join("");
  const unsaved = Object.keys(state.dirty).length > 0 || state.replacementsDirty;
  return `<section class="panel"><button class="text-button" data-action="menu">← Categorías</button><p class="eyebrow">RESULTADO DE LA VISITA</p><h1>Total de la canasta</h1>
    ${unsaved ? `<div class="notice warning">Hay cambios en este celular que todavía no se han sincronizado. Guarda su categoría antes de descargar o cerrar la visita.</div>` : ""}
    ${pending ? `<div class="notice warning">Faltan ${pending} productos por registrar o marcar como no encontrados. El total es parcial.</div>` : `<div class="notice">Registro completo: todos los productos tienen precio o estado de disponibilidad.</div>`}
    <div class="table-wrap"><table><thead><tr><th>Categoría</th><th class="number">Subtotal</th></tr></thead><tbody>${rows}<tr class="total-row"><td>Una persona (A)</td><td class="number">${fmt(total())}</td></tr><tr class="total-row"><td>Familia de cuatro (A × 4)</td><td class="number">${fmt(total() * 4)}</td></tr></tbody></table></div>
    <div class="benchmark"><strong>Referencia: ${fmt(OFFICIAL)} por persona (julio de 2026)</strong><span>Su total es ${total() >= OFFICIAL ? "mayor" : "menor"} y equivale al ${(total() / OFFICIAL * 100).toFixed(0)}% de esa referencia. La comparación no implica composiciones idénticas.</span></div>
    <div class="workspace-actions"><button class="button secondary" data-action="refresh">Actualizar desde otros celulares</button><button class="button secondary" data-action="pdf" ${unsaved ? "disabled" : ""}>Descargar datos en PDF</button>${state.status !== "Finalizada" ? `<button class="button primary" data-action="finalize" ${pending || unsaved ? "disabled" : ""}>Cerrar visita</button>` : `<span class="status closed">Visita finalizada</span>`}</div>
  </section>`;
}

function render() {
  const guideButton = document.getElementById("guide-button");
  guideButton.hidden = state.screen === "manual";
  if (state.screen === "manual") view.innerHTML = manualHtml();
  else if (state.screen === "start") view.innerHTML = startHtml();
  else if (state.screen === "new") view.innerHTML = newVisitHtml();
  else if (state.screen === "join") view.innerHTML = joinHtml();
  else if (state.screen === "menu") view.innerHTML = menuHtml();
  else if (state.screen === "category") {
    const category = CATS.find(entry => entry.id === state.activeCategory) || CATS[0];
    view.innerHTML = categoryHtml(category);
  } else if (state.screen === "replacements") view.innerHTML = replacementsHtml();
  else view.innerHTML = summaryHtml();
  saveState();
}

function mergeVisit(data) {
  state.group = data.group;
  state.status = data.status;
  CATS.forEach(category => category.items.forEach(item => {
    if (!state.dirty[item.id]) {
      state.prices[item.id] = "";
      state.missing[item.id] = false;
    }
  }));
  data.items.forEach(item => {
    if (!state.dirty[item.id]) {
      state.prices[item.id] = item.price === null ? "" : String(item.price);
      state.missing[item.id] = item.missing;
    }
  });
  if (!state.replacementsDirty) state.replacements = data.replacements.length ? data.replacements.map(item => ({ original: item.original, replacement: item.replacement, price: item.price ?? "" })) : [{ original: "", replacement: "", price: "" }];
}

async function refreshVisit() {
  const result = await api({ action: "getVisit", visitId: state.visitId });
  mergeVisit(result);
  return result;
}

function changeScreen(screen) {
  state.screen = screen;
  render();
  window.scrollTo(0, 0);
}

async function createVisit() {
  const group = state.group;
  if (Object.keys(state.dirty).length || state.replacementsDirty) {
    toast("Guarda los cambios pendientes antes de crear otra visita.", true);
    return;
  }
  if (![group.m1, group.m2, group.m3, group.curso, group.super, group.sector, group.fecha].every(value => String(value).trim())) {
    toast("Completa los tres integrantes, curso, supermercado, sector y fecha.", true);
    return;
  }
  const visitId = newId();
  await api({ action: "createVisit", visitId, group });
  state.visitId = visitId;
  state.prices = {};
  state.missing = {};
  state.dirty = {};
  state.replacements = [{ original: "", replacement: "", price: "" }];
  state.replacementsDirty = false;
  state.status = "En curso";
  await refreshVisit();
  changeScreen("menu");
  toast("Visita creada. Comparte el ID con el grupo.");
}

async function joinVisit() {
  const visitId = state.joinCode.trim().toUpperCase();
  if (!/^CB-[A-Z0-9]+$/.test(visitId)) {
    toast("Revisa el formato del ID de visita.", true);
    return;
  }
  const result = await api({ action: "getVisit", visitId });
  state.visitId = visitId;
  state.dirty = {};
  state.replacementsDirty = false;
  mergeVisit(result);
  changeScreen("menu");
  toast("Visita compartida cargada.");
}

async function saveCategory() {
  const category = CATS.find(entry => entry.id === state.activeCategory);
  const changed = category.items.filter(item => state.dirty[item.id]);
  if (!changed.length) {
    toast("No hay cambios para guardar.");
    return;
  }
  await api({ action: "saveCategory", visitId: state.visitId, category: category.name, items: changed.map(item => ({
    id: item.id, category: category.name, name: item.name, qty: item.qty, unit: item.unit,
    missing: !!state.missing[item.id], price: state.missing[item.id] ? null : parsePrice(state.prices[item.id])
  })) });
  changed.forEach(item => { delete state.dirty[item.id]; });
  await refreshVisit();
  changeScreen("menu");
  toast("Categoría sincronizada con la visita.");
}

async function saveReplacements() {
  await api({ action: "saveReplacements", visitId: state.visitId, replacements: state.replacements });
  state.replacementsDirty = false;
  await refreshVisit();
  changeScreen("menu");
  toast("Reemplazos guardados.");
}

async function shareVisit() {
  const url = new URL(location.href);
  url.searchParams.set("visita", state.visitId);
  const shareData = { title: "Visita de canasta básica", text: "Únete a la visita con el ID " + state.visitId, url: url.href };
  if (navigator.share) await navigator.share(shareData);
  else {
    await navigator.clipboard.writeText(shareData.text + "\n" + shareData.url);
    toast("ID y enlace copiados.");
  }
}

function logoDataUrl() {
  const image = document.getElementById("brand-logo");
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext("2d").drawImage(image, 0, 0);
  return canvas.toDataURL("image/png");
}

function downloadPdf() {
  const JsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!JsPDF) throw new Error("No se pudo cargar el generador de PDF. Comprueba la conexión e inténtalo de nuevo.");
  const pdf = new JsPDF({ unit: "mm", format: "a4" });
  const margin = 14;
  let y = 18;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const addLine = (text, options = {}) => {
    const fontSize = options.size || 10;
    pdf.setFont("helvetica", options.bold ? "bold" : "normal");
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(String(text), 182);
    const height = lines.length * (fontSize * 0.48) + 2;
    if (y + height > pageHeight - margin) { pdf.addPage(); y = margin; }
    pdf.text(lines, margin, y);
    y += height;
  };
  pdf.addImage(logoDataUrl(), "PNG", margin, y, 58, 27);
  y += 33;
  addLine("Instrumento de observación de la canasta básica", { size: 16, bold: true });
  addLine("ID de visita: " + state.visitId, { bold: true });
  addLine("Grupo: " + [state.group.m1, state.group.m2, state.group.m3, state.group.m4].filter(Boolean).join(", "));
  addLine("Curso: " + state.group.curso + " · Supermercado: " + state.group.super);
  addLine("Sector: " + state.group.sector + " · Fecha: " + state.group.fecha);
  y += 2;
  CATS.forEach(category => {
    addLine(category.name + " — " + fmt(categorySubtotal(category)), { size: 12, bold: true });
    category.items.forEach(item => {
      const stateText = state.missing[item.id] ? "No encontrado" : parsePrice(state.prices[item.id]) === null ? "Pendiente" : fmt(parsePrice(state.prices[item.id])) + " por " + item.unit + " · subtotal " + fmt(itemSubtotal(item));
      addLine("• " + item.name + " (" + item.qty + " " + item.unit + "): " + stateText);
    });
  });
  y += 2;
  addLine("Total por persona: " + fmt(total()), { size: 13, bold: true });
  addLine("Total familia de cuatro: " + fmt(total() * 4), { size: 13, bold: true });
  addLine("Referencia configurada: " + fmt(OFFICIAL) + " por persona (julio de 2026).");
  addLine("Documento de registro de terreno. Las preguntas de análisis se trabajan en clases.");
  pdf.save("canasta-basica-" + state.visitId.toLowerCase() + ".pdf");
}

view.addEventListener("input", event => {
  const data = event.target.dataset;
  if (data.group) {
    state.group[data.group] = event.target.value;
  } else if (data.joinCode !== undefined) {
    state.joinCode = event.target.value.toUpperCase();
  } else if (data.price) {
    state.prices[data.price] = event.target.value;
    state.dirty[data.price] = true;
    const item = CATS.flatMap(category => category.items).find(entry => entry.id === data.price);
    const subtotal = document.getElementById("subtotal-" + data.price);
    if (subtotal) subtotal.textContent = fmt(itemSubtotal(item));
    const categoryTotal = document.getElementById("category-total");
    if (categoryTotal) categoryTotal.textContent = fmt(categorySubtotal(CATS.find(category => category.id === state.activeCategory)));
  } else if (data.replacement !== undefined) {
    state.replacements[Number(data.replacement)][data.key] = event.target.value;
    state.replacementsDirty = true;
  }
  saveState();
});

view.addEventListener("change", event => {
  const productId = event.target.dataset.missing;
  if (!productId) return;
  state.missing[productId] = event.target.checked;
  state.dirty[productId] = true;
  if (event.target.checked) state.prices[productId] = "";
  render();
});

view.addEventListener("click", async event => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  const action = button.dataset.action;
  try {
    if (action === "next-slide") { state.slide = Math.min(state.slide + 1, SLIDES.length - 1); render(); }
    else if (action === "previous-slide") { state.slide = Math.max(state.slide - 1, 0); render(); }
    else if (action === "go-slide") { state.slide = Number(button.dataset.slide); render(); }
    else if (action === "start") changeScreen("start");
    else if (action === "new-visit") changeScreen("new");
    else if (action === "join") changeScreen("join");
    else if (action === "manual") changeScreen("manual");
    else if (action === "back-start") changeScreen("start");
    else if (action === "create-visit") await createVisit();
    else if (action === "join-visit") await joinVisit();
    else if (action === "resume") { await refreshVisit(); changeScreen("menu"); }
    else if (action === "menu") changeScreen("menu");
    else if (action === "open-category") { state.activeCategory = button.dataset.category; changeScreen("category"); }
    else if (action === "save-category") await saveCategory();
    else if (action === "refresh") { await refreshVisit(); render(); toast("Datos actualizados desde la visita compartida."); }
    else if (action === "share") await shareVisit();
    else if (action === "summary") { await refreshVisit(); changeScreen("summary"); }
    else if (action === "pdf") downloadPdf();
    else if (action === "replacements") changeScreen("replacements");
    else if (action === "add-replacement") { state.replacements.push({ original: "", replacement: "", price: "" }); state.replacementsDirty = true; render(); }
    else if (action === "remove-replacement") { state.replacements.splice(Number(button.dataset.index), 1); if (!state.replacements.length) state.replacements.push({ original: "", replacement: "", price: "" }); state.replacementsDirty = true; render(); }
    else if (action === "save-replacements") await saveReplacements();
    else if (action === "finalize") {
      if (pendingItems().length || Object.keys(state.dirty).length || state.replacementsDirty) return;
      if (!confirm("¿Cerrar esta visita? Después ya no se podrán editar las categorías.")) return;
      await api({ action: "finalizeVisit", visitId: state.visitId, clientTime: new Date().toISOString() });
      state.status = "Finalizada";
      await refreshVisit();
      render();
      toast("Visita cerrada y total guardado.");
    }
  } catch (error) {
    toast(error.message || "Ocurrió un error inesperado.", true);
  }
});

document.getElementById("guide-button").addEventListener("click", () => changeScreen("manual"));
window.addEventListener("keydown", event => {
  if (state.screen !== "manual" || event.target.matches("input, textarea, select")) return;
  if (event.key === "ArrowRight") { state.slide = Math.min(state.slide + 1, SLIDES.length - 1); render(); }
  if (event.key === "ArrowLeft") { state.slide = Math.max(state.slide - 1, 0); render(); }
});

const sharedId = new URLSearchParams(location.search).get("visita");
if (sharedId) {
  state.joinCode = sharedId.toUpperCase();
  state.screen = "join";
}
render();