class DkimPage {
  constructor() {
    this._dKimPublicKey = $('.domain-public-key');
    this._dKimDomainSelected = $('#domain');
    this._dKimDomainSelector = $('.domain-selector');
    this._iconAlert = $('#alertIconDkim');
    this._iconOk = $('#okIconDkim');
    this._trackingIconOk = $('#okIconTracking');
    this._trackingIconWarning = $('#warningIconTracking');
    this._trackingIconAlert = $('#alertIconTracking');
    this._trackingName = $('.domain-tracking');
    this._cnameField = $('.domain-cname');
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

  isTrackingOkIconDisplayed(){
    return this._iconOk.isDisplayed();
  }
  isTrackingWarningIconDisplayed(){
    return this._trackingIconWarning.isDisplayed();
  }
  isTrackingAlertIconDisplayed(){
    return this._trackingIconAlert.isDisplayed();
  }
  getTrackingName(){
    return this._trackingName.getText();
  }
  getCnameDomain(){
    return this._cnameField.getText();
  }
}
exports.DkimPage = DkimPage;
