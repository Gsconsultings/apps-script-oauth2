var CLIENT_ID = '1054736669593-pf3qse3336rikohlerjvv1hdr50rbc08.apps.googleusercontent.com';  // Reemplaza con tu ID de cliente
var CLIENT_SECRET = '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';  // Reemplaza con tu Secreto de cliente
var REDIRECT_URI = 'https://script.google.com/macros/d/1yRWaCM7GkyNs3s06_ESm_8tajerVtqB1tJA774L42CZXp-gfwbJzIrgs/usercallback';  // Reemplaza con tu URI de redirección

// Función para obtener el servicio de OAuth2
function getOAuthService() {
  return OAuth2.createService('gmail')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setScope('https://www.googleapis.com/auth/gmail.send')
    .setCallbackFunction('authCallback');
}

// Función que maneja la respuesta de autorización de Google
function authCallback(request) {
  var oauthService = getOAuthService();
  var isAuthorized = oauthService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Autorización completada con éxito.');
  } else {
    return HtmlService.createHtmlOutput('No se pudo autorizar.');
  }
}

// Función para enviar un correo usando la API de Gmail
function sendEmail() {
  var oauthService = getOAuthService();
  
  // Verificar si el acceso es válido
  if (!oauthService.hasAccess()) {
    var authorizationUrl = oauthService.getAuthorizationUrl();
    Logger.log('Por favor, autoriza la aplicación: %s', authorizationUrl);
    return;
  }

  var accessToken = oauthService.getAccessToken();

  var mailOptions = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      raw: Utilities.base64Encode("To: destinatario@example.com\r\nSubject: Test email\r\n\r\nEste es un correo de prueba.")
    })
  };

  var response = UrlFetchApp.fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', mailOptions);
  Logger.log(response.getContentText());
}
