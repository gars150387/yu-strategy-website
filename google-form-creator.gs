/**
 * Backend para el formulario de infoguías de YT Business Studio.
 *
 * Flujo:
 * 1. El usuario llena el formulario HTML en el modal del sitio.
 * 2. El sitio envía los datos vía fetch() a este Web App.
 * 3. doPost() escribe la fila en la pestaña "Evaluación" del spreadsheet.
 * 4. Devuelve { ok: true } para habilitar la sección de descargas.
 *
 * Despliegue:
 * 1. Ejecutar createYouTubeProspectSystem() UNA SOLA VEZ.
 * 2. Implementar como Web App (Ejecutar: Yo / Acceso: Cualquiera).
 * 3. Copiar la URL /exec y pegarla en APPS_SCRIPT_URL del sitio.
 */

const PROSPECT_SHEET_ID = '1P8gU4pI8BkQ8HSebdoItLH7tb_igYa6Z6m4rXuWVUm4';
const TAB = 'Evaluación';

const CONFIG_SHEET = 'Configuración';
const EVALUATION_SHEET = 'Evaluación';
const DASHBOARD_SHEET = 'Dashboard';

function createYouTubeProspectSystem() {
  const spreadsheet = SpreadsheetApp.create('Prospectos — Diagnóstico YouTube');
  const form = FormApp.create('Diagnóstico inicial de tu canal de YouTube');

  form
    .setDescription(
      'Este cuestionario nos permite entender tu negocio, tu audiencia y el punto de partida de tu canal antes de una primera conversación. Toma aproximadamente 8–10 minutos.'
    )
    .setConfirmationMessage(
      'Gracias. Revisaremos tu información antes de contactarte. Si tu caso encaja con el servicio, recibirás los próximos pasos por email.'
    )
    .setCollectEmail(true)
    .setProgressBar(true);

  form.addSectionHeaderItem().setTitle('A. Identificación y contacto');
  form.addTextItem().setTitle('Nombre y apellido').setRequired(true);
  form.addTextItem().setTitle('Empresa, marca o nombre del proyecto').setRequired(true);
  form.addTextItem().setTitle('Teléfono o WhatsApp').setRequired(true);
  form.addTextItem().setTitle('Sitio web, Instagram, LinkedIn u otra red principal');
  form.addTextItem().setTitle('Enlace a tu canal de YouTube (si ya existe)');
  const classification = form.addMultipleChoiceItem()
    .setTitle('¿En qué situación está tu proyecto?')
    .setRequired(true);

  const existingPage = form.addPageBreakItem().setTitle('D. Canal existente');
  form.addTextItem().setTitle('¿Cuál es la frecuencia actual de publicación? (videos largos, Shorts y directos)');
  form.addTextItem().setTitle('Comparte enlaces de hasta tres videos que consideres tus mejores resultados');
  form.addCheckboxItem()
    .setTitle('¿Qué crees que está frenando el canal?')
    .setChoiceValues([
      'Nicho o posicionamiento poco claro',
      'Temas sin suficiente demanda',
      'Títulos o miniaturas',
      'Retención y estructura de los videos',
      'Falta de consistencia',
      'CTA, oferta o conversión',
      'No lo sé todavía'
    ]);
  form.addParagraphTextItem().setTitle('Comparte los datos disponibles de YouTube Studio: CTR, duración media, audiencia nueva/casual/recurrente y fuentes de tráfico. Puedes pegar un enlace a capturas de Drive.');
  form.addParagraphTextItem().setTitle('¿Qué CTA utilizas hoy y qué consultas, leads o ventas ha generado?');

  const newPage = form.addPageBreakItem().setTitle('D. Canal nuevo');
  form.addMultipleChoiceItem()
    .setTitle('¿Tienes definida la oferta, marca e identidad visual?')
    .setChoiceValues(['Sí, todo está definido', 'Parcialmente', 'Aún no']);
  form.addParagraphTextItem().setTitle('¿Con qué audiencia, comunidad o base de contactos partes actualmente?');
  form.addParagraphTextItem().setTitle('¿Cuáles serían tus tres primeros temas o videos?');
  form.addTextItem().setTitle('¿Qué resultado considerarías éxito durante los primeros 90 días?');
  form.addParagraphTextItem().setTitle('¿Qué podría impedirte mantener una publicación consistente?');

  const brandPage = form.addPageBreakItem().setTitle('D. Negocio o marca entrando en YouTube');
  form.addParagraphTextItem().setTitle('¿Qué canales de captación o marketing utilizas actualmente y qué resultado generan?');
  form.addParagraphTextItem().setTitle('¿Qué conocimiento, casos o expertos de tu negocio podrían convertirse en contenido?');
  form.addMultipleChoiceItem()
    .setTitle('¿Quién será la cara o voz principal del canal?')
    .setChoiceValues(['Fundador/a o experto/a interno/a', 'Equipo rotativo', 'Aún por definir']);

  const sharedPage = form.addPageBreakItem().setTitle('B. Negocio, audiencia y oportunidad');
  form.addParagraphTextItem().setTitle('¿Qué vendes actualmente? Describe productos, servicios o modelos de ingreso.').setRequired(true);
  form.addTextItem().setTitle('¿Cuál es tu oferta principal y cuál es su rango de precio?').setRequired(true);
  form.addParagraphTextItem().setTitle('¿Qué problema importante resuelves y para quién?').setRequired(true);
  form.addCheckboxItem()
    .setTitle('¿Cuál es tu objetivo principal en YouTube durante los próximos 6–12 meses?')
    .setChoiceValues(['Autoridad y marca personal', 'Leads o consultas', 'Ventas', 'Audiencia y comunidad', 'Monetización del canal']);
  form.addTextItem().setTitle('¿Qué acción quieres que realice una persona después de ver tus videos?').setRequired(true);
  form.addParagraphTextItem().setTitle('Describe a tu cliente ideal: situación, país o mercado y nivel de experiencia.').setRequired(true);
  form.addParagraphTextItem().setTitle('¿Qué desea conseguir, qué le preocupa y qué le impide avanzar?').setRequired(true);
  form.addParagraphTextItem().setTitle('¿Qué preguntas te hacen con mayor frecuencia clientes o seguidores?');
  form.addParagraphTextItem().setTitle('¿Qué tema, enfoque, experiencia o historia te diferencia de otros creadores?').setRequired(true);
  form.addTextItem().setTitle('Completa: Ayudo a [persona] a conseguir [resultado] mediante [enfoque], sin [obstáculo].').setRequired(true);
  form.addParagraphTextItem().setTitle('Comparte de 2 a 5 canales, marcas o creadores de referencia.');

  form.addSectionHeaderItem().setTitle('C. Autoridad y capacidad de ejecución');
  form.addParagraphTextItem().setTitle('¿Qué pruebas de autoridad puedes aportar? Incluye experiencia, resultados, casos o credenciales.');
  form.addParagraphTextItem().setTitle('¿Qué temas podrías desarrollar durante años sin agotarte?').setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('¿Cuánto tiempo real puedes dedicar cada semana a investigación, grabación y revisión?')
    .setChoiceValues(['Menos de 3 horas', '3–5 horas', '6–10 horas', 'Más de 10 horas'])
    .setRequired(true);
  form.addCheckboxItem()
    .setTitle('¿Con qué recursos cuentas hoy?')
    .setChoiceValues(['Cámara o móvil', 'Micrófono', 'Editor/a', 'Diseñador/a', 'Equipo comercial', 'Presupuesto de producción', 'Ninguno de los anteriores']);
  form.addMultipleChoiceItem()
    .setTitle('¿En qué plazo te gustaría comenzar?')
    .setChoiceValues(['Esta semana', 'Este mes', 'En los próximos 3 meses', 'Solo estoy explorando'])
    .setRequired(true);
  form.addParagraphTextItem().setTitle('¿Hay alguna restricción de marca, legal o de contenido que debamos conocer?');

  existingPage.setGoToPage(sharedPage);
  newPage.setGoToPage(sharedPage);
  brandPage.setGoToPage(sharedPage);
  classification
    .setChoices([
      classification.createChoice('Quiero crear un canal desde cero', newPage),
      classification.createChoice('Tengo un canal que está creciendo, pero sin una fórmula repetible', existingPage),
      classification.createChoice('Tengo un canal estancado o desaprovechado', existingPage),
      classification.createChoice('Tengo un negocio o marca que quiere entrar en YouTube', brandPage)
    ])
    .setRequired(true);

  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  createOperationalSheets_(spreadsheet, form);
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(spreadsheet).onFormSubmit().create();

  Logger.log('Formulario (editar): ' + form.getEditUrl());
  Logger.log('Formulario (compartir): ' + form.getPublishedUrl());
  Logger.log('Base de respuestas: ' + spreadsheet.getUrl());
}

function createOperationalSheets_(spreadsheet, form) {
  const config = spreadsheet.getSheets()[0];
  config.setName(CONFIG_SHEET);
  config.getRange('A1:B5').setValues([
    ['Elemento', 'Enlace / valor'],
    ['Formulario público', form.getPublishedUrl()],
    ['Formulario de edición', form.getEditUrl()],
    ['Uso', 'No editar la pestaña de respuestas. Cualificar leads en Evaluación.'],
    ['Estados sugeridos', 'Nuevo | Formulario recibido | Llamada | Diagnóstico | Propuesta | Ganado | No apto | Perdido']
  ]);
  config.autoResizeColumns(1, 2);

  const evaluation = spreadsheet.insertSheet(EVALUATION_SHEET);
  evaluation.getRange(1, 1, 1, 14).setValues([[
    'Fecha de envío', 'Prospecto', 'Email', 'Marca / proyecto', 'Tipo de cuenta',
    'Estado', 'Potencial de negocio', 'Claridad de nicho', 'Preparación operativa',
    'Objetivo dominante', 'Siguiente acción', 'Fecha de seguimiento', 'Notas de la agencia', 'Respuesta completa'
  ]]);
  evaluation.setFrozenRows(1);
  evaluation.getRange('A1:N1').setFontWeight('bold').setBackground('#0B1F3A').setFontColor('#FFFFFF');
  evaluation.setColumnWidths(1, 14, 150);
  evaluation.setColumnWidth(14, 420);

  const dashboard = spreadsheet.insertSheet(DASHBOARD_SHEET);
  dashboard.getRange('A1:B8').setValues([
    ['Dashboard de prospectos', ''],
    ['Total de formularios', '=COUNTA(Evaluación!A2:A)'],
    ['Pendientes de revisar', '=COUNTIF(Evaluación!F2:F,"Formulario recibido")'],
    ['En llamada / diagnóstico', '=COUNTIF(Evaluación!F2:F,"Llamada")+COUNTIF(Evaluación!F2:F,"Diagnóstico")'],
    ['Propuestas enviadas', '=COUNTIF(Evaluación!F2:F,"Propuesta")'],
    ['Clientes ganados', '=COUNTIF(Evaluación!F2:F,"Ganado")'],
    ['Alta prioridad', '=COUNTIF(Evaluación!G2:G,"Alto")'],
    ['Seguimientos vencidos', '=COUNTIFS(Evaluación!L2:L,"<"&TODAY(),Evaluación!F2:F,"<>Ganado",Evaluación!F2:F,"<>Perdido")']
  ]);
  dashboard.getRange('A1:B1').setFontWeight('bold').setBackground('#DFF3E4');
  dashboard.autoResizeColumns(1, 2);
}

function onFormSubmit(e) {
  const data = e.namedValues;
  const get = (label) => (data[label] || [''])[0];
  const evaluation = e.source.getSheetByName(EVALUATION_SHEET);
  const type = get('¿En qué situación está tu proyecto?');
  const objective = get('¿Cuál es tu objetivo principal en YouTube durante los próximos 6–12 meses?');

  evaluation.appendRow([
    new Date(),
    get('Nombre y apellido'),
    get('Email Address'),
    get('Empresa, marca o nombre del proyecto'),
    type,
    'Formulario recibido',
    '', '', '',
    objective,
    'Revisar formulario y clasificar',
    '', '',
    JSON.stringify(data)
  ]);
}

/**
 * Endpoint para el formulario de infoguías del sitio web.
 * Recibe POST con: firstName, lastName, email, business, stage, monetization, blocker.
 * Escribe una fila en "Evaluación" con la estructura operativa.
 */
function doPost(e) {
  const data = e.parameter || {};
  const ss = SpreadsheetApp.openById(PROSPECT_SHEET_ID);
  const sheet = ss.getSheetByName(TAB);

  const firstName = String(data.firstName || '').trim();
  const lastName = String(data.lastName || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const business = String(data.business || '').trim();
  const stage = String(data.stage || '').trim();
  const monetization = String(data.monetization || '').trim();
  const blocker = String(data.blocker || '').trim();

  if (!firstName || !email || !stage || !monetization) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'Missing required fields' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  sheet.appendRow([
    new Date(),                    // Fecha de envío
    fullName,                      // Prospecto
    email,                         // Email
    business,                      // Marca / proyecto
    'Infoguía descargable',        // Tipo de cuenta
    'Formulario recibido',         // Estado
    '',                            // Potencial de negocio
    '',                            // Claridad de nicho
    '',                            // Preparación operativa
    monetization,                  // Objetivo dominante
    'Enviar recursos / seguimiento', // Siguiente acción
    '',                            // Fecha de seguimiento
    blocker,                       // Notas de la agencia
    JSON.stringify({               // Respuesta completa
      source: 'website-infoguia',
      firstName: firstName,
      lastName: lastName,
      email: email,
      business: business,
      stage: stage,
      monetization: monetization,
      blocker: blocker
    })
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
