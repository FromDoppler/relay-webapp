class LoginPage {
  constructor() {
    this._waitTimeout = 5000;
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

  waitAndToggleForgotPassword() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._forgotLinkEl), 5000, 'Element taking too long to appear in the DOM');
    return this._forgotLinkEl.click();
  }

  waitAndSetForgotEmail(value) {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._forgotEmailInputEl), 5000, 'Element taking too long to appear in the DOM');
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
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._forgotSubmitConfirmationEl), 5000, 'Element taking too long to appear in the DOM');
    return this._forgotSubmitConfirmationEl.isDisplayed();
  }

  waitAndIsErrorModalVisible() {
    var until = protractor.ExpectedConditions;
    return browser.wait(until.visibilityOf(this._errorModalEl), 5000, 'Element taking too long to appear in the DOM');
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
