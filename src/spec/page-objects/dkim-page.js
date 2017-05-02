class DkimPage {
  constructor() {
    this._dKimPublicKey = $('.domain-public-key');
    this._dKimDomainSelected = $('.domain-selected');
    this._dKimDomainSelector = $('.domain-selector');
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

}
exports.DkimPage = DkimPage;
