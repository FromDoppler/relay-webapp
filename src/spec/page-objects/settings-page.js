class SettingsPage {
  constructor() {
    this._url = '/#/settings/domain-manager';
    this._togglerDomainInputButton = $('.domain--input-toggler');
    this._confirmAddDomainButton = $('.domain--input-container button');
    this._domainInputContainer = $('.domain--input-container');
  }

  getUrl(){
    return this._url;
  }
  clickInputToggler(){
    return this._togglerDomainInputButton.click();
  }
  clickAddDomainButton(){
    return this._confirmAddDomainButton.click();
  }
  getDomainInputContainer(){
    return this._domainInputContainer;
  }

}
exports.SettingsPage = SettingsPage;
