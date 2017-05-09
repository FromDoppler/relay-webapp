class ConnectionSettingsPage {
  constructor() {
    this._url = '/#/settings/connection-settings';
    this._apiKeyContainer = $('.apiKeyContainer p');
    this._copyApiKeyButton = $('.apiKeyContainer button');
  }

  getApiKey() {
    return this._apiKeyContainer.getText();
  }

  clickCopyApiKey() {
    return this._copyApiKeyButton.click();
  }

  getApiKeyToCopy() {
    var apiKeyToCopy = $('.copyContainer .inputContainer input');
    return apiKeyToCopy.getAttribute('value');
  }
}
exports.ConnectionSettingsPage = ConnectionSettingsPage;
