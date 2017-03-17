class SettingsPage {
  constructor() {
    this._url = '/#/settings/domain-manager';
    this._togglerDomainInputButton = $('.domain--input-toggler');
    this._confirmAddDomainButton = $('.domain--input-container button');
    this._domainInputContainer = $('.domain--input-container');
    this._domainsListItems = element.all(by.css('.domain--list-container table .column-records'));
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
}
exports.SettingsPage = SettingsPage;
