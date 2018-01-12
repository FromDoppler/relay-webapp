class DkimPage {
  constructor() {
    this._dKimPublicKey = $('.domain-public-key');
    this._dKimDomainSelected = $('#domain');
    this._dKimDomainSelector = $('.domain-selector');
    this._iconAlert = $('#alertIconDkim');
    this._iconOk = $('#okIconDkim');
  }

  getdKimDomainSelected(){
    return this._dKimDomainSelected.getText();
  }
  getdKimDomainSelector(){
    return this._dKimDomainSelector.getText();
  }
  getDkimPublicKey(){
    return this._dKimPublicKey.getText();
  }
  switchToNewTab(){
    return browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];
          browser.switchTo().window(newWindowHandle);
      });
  }

  isAlertIconDisplayed(){
    return this._iconAlert.isDisplayed();
  }

  isOkIconDisplayed(){
    return this._iconOk.isDisplayed();
  }

}
exports.DkimPage = DkimPage;
