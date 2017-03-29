class SettingsPage {
  constructor() {
    this._url = '/#/settings/domain-manager';
    this._togglerDomainInputButton = $('.domain--title-container .domain--input-toggler');
    this._confirmAddDomainButton = $('.domain--input-container button');
    this._domainInputContainer = $('.domain--input-container');
    this._domainsListItems = element.all(by.css('.domain--list-container table .column-records'));
    this._domainInput = $('.domain--default-container input');
    this._domainInputButton = $('.domain--default-container button');
    this._domainsSetDefaultButtonList = element.all(by.css('.domain--default-action'));
    this._defaultDomain = $('.domain--default-container .default-domain');

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
  getDefaultDomain(){
    return this._defaultDomain.getText();
  }
  clickSetAsDefault(){
    return this._domainsSetDefaultButtonList.then(function(val){
      return val[0].click();
    });
  }
}
exports.SettingsPage = SettingsPage;
