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
    this._adminEmailAccountInput = $('.admin .email-account--container input');
    this._adminTitle = $('.admin h1');
    this._loginAdminButton = $('.admin .section--wrapper-button .button');
    this._loginAdminEmail = $('.admin .email input');
    this._loginAdminPass = $('.admin .password--container input');
    this._customIconEl = $('.header .company-icon');
    this._relayTitleText = $('#header-login');
    this._defaultFooterIconEl = $('.footer #defaultFooter');
    this._customFooterIconEl = $('.footer #customIcon');
  }

  get(params) {
    return browser.get(params ? this._url + '?' + params : this._url);
  }

  waitAndToggleForgotPassword() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._forgotLinkEl), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._forgotLinkEl.click();
  }

  waitAndSetForgotEmail(value) {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._forgotEmailInputEl), this._waitTimeout, 'Element taking too long to appear in the DOM');
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
    browser.wait(until.visibilityOf(this._forgotSubmitConfirmationEl), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._forgotSubmitConfirmationEl.isDisplayed();
  }

  waitAndIsErrorModalVisible() {
    var until = protractor.ExpectedConditions;
    return browser.wait(until.visibilityOf(this._errorModalEl), this._waitTimeout, 'Element taking too long to appear in the DOM');
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
  isAdminEmailAccountInputVisible() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._adminEmailAccountInput), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._adminEmailAccountInput.isDisplayed();
  }
  isAdminTitleVisible() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._adminTitle), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._adminTitle.isDisplayed();
  }
  setAdminEmail(username) {
    return this._loginAdminEmail.sendKeys(username);
  }
  setAdminPassword(pass) {
    return this._loginAdminPass.sendKeys(pass);
  }
  setClientEmail(username) {
    return this._adminEmailAccountInput.sendKeys(username);
  }
  clickAdminLoginButton() {
    this._loginAdminButton.click();
  }
  isHeaderIconCustom() {
    var hasClass = this._customIconEl
    .getAttribute('class')
    .then(function(className) {
      return className.indexOf('big-icon') >= 0;
    });

    return hasClass;
  }
  isDefaultFooterDisplayed() {
    return this._defaultFooterIconEl.isDisplayed();
  }
  isCustomFooterDisplayed() {
    return this._customFooterIconEl.isDisplayed();
  }
  getRelayTextDisplayed() {
    return this._relayTitleText.getText();
  }
}

exports.LoginPage = LoginPage;
