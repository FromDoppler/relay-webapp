class SettingsPage {
  constructor() {
    this._url = '/#/settings/domain-manager';
    this._togglerDomainInputButton = $('.domain--title-container .domain--input-toggler');
    this._confirmAddDomainButton = $('.domain--input-container button');
    this._domainInputContainer = $('.domain--input-container');
    this._domainsListItems = element.all(by.css('.domain--list-container table .column-records'));
    this._domainInput = $('.domain--default-container input');
    this._domainInputButton = $('.domain--default-container button');
    this._domainDeleteButtons = element.all(by.css('.domain--erase-button.default'));
    this._defaultDomain = $('.domain--default-container .default-domain');
    this._dKimInformationButtons = element.all(by.css('.domain--dkim-info-action'));
    this._openDomainStatusDropdown = element.all(by.css('.dropdown--container .selectize-control'));
    this._domainActions = element.all(by.css('.dropdown--container .selectize-control .ui-select-choices-row'));
    this._disableDomains = element.all(by.css('.domain--list-container .column-records.disabled'));
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
  isDomainInputVisible(){
    var hasActiveClass = this.getDomainInputContainer()
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('active') >= 0;
      });
    var hasZeroHeight = this.getDomainInputContainer()
      .getCssValue('height')
      .then(function(heightSize) {
        return heightSize != '0px';
      });
    return Promise.all([hasActiveClass, hasZeroHeight])
      .then(function(results) {
        return results[0] && results[1];
      });
  }
  countDomainListItems(){
    return this._domainsListItems.count();
  }
  setDomain(domain){
    return this._domainInput.sendKeys(domain);
  }
  submitAddDomain(){
    return this._domainInputButton.click();
  }
  clickFirstDeleteButton(){
    return this._domainDeleteButtons.then(function(val){
      return val[0].click();
    });
  }
  getDefaultDomain(){
    return this._defaultDomain.getText();
  }
  openEnabledNotDefaultDropdown(){
    this._openDomainStatusDropdown.then(function(val){
      return val[1].click();
    });
  }
  openDisabledDropDown(){
    this._openDomainStatusDropdown.then(function(val){
      return val[3].click();
    });
  }
  clickSetAsDefault(){
    this._domainActions.then(function(val){
      return val[0].click();
    });
  }
  clickActivateButton(){
    return this._domainActions.then(function(val){
      return val[1].click();
    });
  }
  clickDisableButton(){
    return this._domainActions.then(function(val){
      return val[2].click();
    });
  }
  countDisableDomains(){
    return this._disableDomains.count();
  }
  isDkimInformationButtonDisplayed(){
    return this._dKimInformationButtons.isDisplayed();
  }
  clickFirstDkimInformationButton(){
    return this._dKimInformationButtons.then(function(val){
      return val[0].click();
    });
  }
}
exports.SettingsPage = SettingsPage;
