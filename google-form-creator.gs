function createInfoguiaLeadForm() {
  const guideUrl = 'https://TU-DOMINIO.COM/ASSETS/infoguias/Infoguia-Mapa-del-Oceano-Azul-YouTube.pdf';

  const form = FormApp.create('Descarga gratuita - Mapa del Océano Azul para YouTube');

  form.setDescription(
    'Completa tus datos para recibir la infoguía gratuita y recursos estratégicos sobre YouTube para negocios.'
  );

  form.setCollectEmail(true);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(false);

  form.addTextItem()
    .setTitle('Nombre')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Apellido')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Nombre de tu canal o negocio')
    .setRequired(false);

  const stageItem = form.addMultipleChoiceItem();
  stageItem
    .setTitle('¿En qué etapa estás?')
    .setChoices([
      stageItem.createChoice('Todavía no he comenzado'),
      stageItem.createChoice('Canal nuevo / en crecimiento'),
      stageItem.createChoice('Canal establecido pero estancado'),
      stageItem.createChoice('Ya tengo negocio y quiero entrar en YouTube')
    ])
    .setRequired(true);

  const monetizationItem = form.addMultipleChoiceItem();
  monetizationItem
    .setTitle('¿Qué quieres monetizar principalmente?')
    .setChoices([
      monetizationItem.createChoice('Servicios / consultoría'),
      monetizationItem.createChoice('Producto / SaaS / ecommerce'),
      monetizationItem.createChoice('Curso / comunidad / educación'),
      monetizationItem.createChoice('Ads / patrocinios / afiliados'),
      monetizationItem.createChoice('Todavía no lo tengo claro')
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('¿Cuál es tu mayor bloqueo ahora mismo con YouTube?')
    .setRequired(false);

  form.setConfirmationMessage(
    'Gracias por completar el formulario.\n\n' +
    'Puedes descargar la infoguía aquí:\n' +
    guideUrl + '\n\n' +
    'También recibirás recursos estratégicos sobre YouTube, posicionamiento y monetización.'
  );

  const spreadsheet = SpreadsheetApp.create('Leads - Infoguía Océano Azul YouTube');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  Logger.log('Formulario público: ' + form.getPublishedUrl());
  Logger.log('Editar formulario: ' + form.getEditUrl());
  Logger.log('Hoja de respuestas: ' + spreadsheet.getUrl());
}
