class LoginPage {
  constructor() {
    this._waitTimeout = 8000;
    this._url = '/#/login';
    this._errorModalEl = $('.error-container');
    this._forgotLinkEl = $('.forgot--link');
    this._forgotEmailInputEl = $('#forgotEmail');
    this._forgotSubmitEl = $('#forgotForm input[type=submit]');
    this._forgotSubmitConfirmationEl = $('#forgotForm .green');
    this._switchLanguageMessageEl = $('.header--flags p');
    this._switchLanguageEnFlagEl = $('.header--flags .en_flag');
    this._switchLanguageEsFlagEl = $('.header--flags .es_flag');
  }

  get(params) {
    return browser.get(params ? this._url + '?' + params : this._url);
  }

  toggleForgotPassword() {
    return this._forgotLinkEl.click();
  }

  setForgotEmail(value) {
    return this._forgotEmailInputEl.sendKeys(value);
  }

  submitForgot() {
    return this._forgotSubmitEl.click();
  }

  isForgotSubmitConfirmationDisplayed() {
    return this._forgotSubmitConfirmationEl.isPresent().then(isPresent =>
      isPresent && this._forgotSubmitConfirmationEl.isDisplayed());
  }
  isForgotSubmitConfirmationDisplayedWithWait() {
    var confirmationContainer = this._forgotSubmitConfirmationEl;
    
       // the library `angular-ui/ui-select` creates  the HTML
       // but it takes a little bit to populate the values
       // so we have to wait until the text is present.
       browser.wait(function() {
         return confirmationContainer.isDisplayed() != false
       }, this._waitTimeout);
    
        return confirmationContainer.isDisplayed();
  }

  isErrorModalDisplayed() {
    return this._errorModalEl.isPresent().then(isPresent =>
      isPresent && this._errorModalEl.isDisplayed());
  }

  getSwitchLanguageMessage() {
    return this._switchLanguageMessageEl.getText();
  }

  clickEsFlag() {
    this._switchLanguageEsFlagEl.click();
  }

  clickEnFlag() {
    this._switchLanguageEnFlagEl.click();
  }
}

exports.LoginPage = LoginPage;
