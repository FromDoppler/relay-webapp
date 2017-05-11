class ConnectionSettingsPage {
  constructor() {
    this._url = '/#/settings/connection-settings';
    this._apiKeyContainer = $('.api-key--container p');
    this._copyApiKeyButton = $('.api-key--container button');
    this._apiKeyToCopy = $('.copy--container .input--container input');
  }

  getApiKey() {
    return this._apiKeyContainer.getText();
  }

  clickCopyApiKey() {
    return this._copyApiKeyButton.click();
  }

  getApiKeyToCopy() {
    return this._apiKeyToCopy.getAttribute('value');
  }
}
exports.ConnectionSettingsPage = ConnectionSettingsPage;
