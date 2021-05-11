class MyBillingInformationPage {
  constructor() {
    this._url = '/#/settings/my-billing-information';
    this._waitTimeout = 6000;

    this._myBillingInformationPageContainer = $('.my-billing-information--container');
    this._creditCardContainer = $('.credit-card');

    this._changeCardButton = $('.button--container .check-button');
    this._saveButton = $('.button--container .save-button');

    this._cardHolderLabel = $('.credit-card--container #cardHolderInformation');
    this._creditCardNumberLabel = $('.credit-card--container #creditCardNumberInformation');
    this._expiryDateLabel = $('.credit-card--container #expiryDateInformation');
    this._verificationCodeLabel = $('.credit-card--container #verificationCodeInformation');
    this._subtitleMessage = $('#subtitleMessage');
    this._freePlanMessage = $('#freePlanMessage');
    this._transferMessage = $('#transferMessage');
    this._cardHolderErrorContainer = $('.card-holder-container .validation-error-fluid');
    this._creditCardErrorContainer = $('.credit-card-container .validation-error-fluid');
    this._expDateErrorContainer = $('.expDate-container .validation-error-fluid');
    this._secCodeErrorContainer = $('.secCode-container .validation-error-fluid');
    this._cardHolderInput = $('.credit-card--container #cardHolder');
    this._expDateInput = $('.credit-card--container #expDate');
    this._secCodeInput = $('.credit-card--container #secCode');
    this._creditCardNumberInput = $('.credit-card--container #creditCardNumber');  
  }

  waitAndGetCardHolder() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._cardHolderLabel), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._cardHolderLabel.getText();
  }

  waitAndGetCreditCardNumber() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._creditCardNumberLabel), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._creditCardNumberLabel.getText();
  }

  waitAndGetExpiryDate() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._expiryDateLabel), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._expiryDateLabel.getText();
  }

  waitAndGetVerificationCode() {
    var until = protractor.ExpectedConditions;
    browser.wait(until.visibilityOf(this._verificationCodeLabel), this._waitTimeout, 'Element taking too long to appear in the DOM');
    return this._verificationCodeLabel.getText();
  }
  
  isCcIconVisaDisplayed() {
    return this.hasCreditCardActiveClass('visa');
  }

  isCcIconMastercardDisplayed() {
    return this.hasCreditCardActiveClass('mastercard');
  }

  isCcIconAmexDisplayed() {
    return this.hasCreditCardActiveClass('amex');
  }

  hasCreditCardActiveClass(name) {
    var hasClass = this._creditCardContainer
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf(name) >= 0;
      });

    return hasClass;
  }

  clickChangeCard() {
    return this._changeCardButton.click();
  }
  
  clickSave() {
    return this._saveButton.click();
  }

  isFreePlanMessageDisplayed() {    
    return this._freePlanMessage.isDisplayed();
  }

  isTransferMessageDisplayed() {    
    return this._transferMessage.isDisplayed();
  }
  
  isSubtitleMessageDisplayed() {    
    return this._subtitleMessage.isDisplayed();
  }

  isChangeCardButtonDisabled(){
    var hasClass = this._changeCardButton
    .getAttribute('class')
    .then(function(className) {
      return className.indexOf('disabled') >= 0;
    });

    return hasClass;
  }

  setCardHolder(cardHolder) {
    return this._cardHolderInput.sendKeys(cardHolder);
  }

  setCreditCardNumber(creditCardNumber) {
    return this._creditCardNumberInput.sendKeys(creditCardNumber);
  }

  setExpDate(expDate) {
    return this._expDateInput.sendKeys(expDate);
  }

  setSecCode(secCode) {
    return this._secCodeInput.sendKeys(secCode);
  }

  isInvalidCardHolderErrorDisplayed() {
    var hasClass = this._cardHolderErrorContainer
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('show') >= 0;
      });

    return hasClass;
  }

  isInvalidCCnumberErrorDisplayed() {
    var hasClass = this._creditCardErrorContainer
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('show') >= 0;
      });

    return hasClass;
  }

  isInvalidExpirationDateErrorDisplayed() {
    var hasClass = this._expDateErrorContainer
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('show') >= 0;
      });

    return hasClass;
  }

  isInvalidVerificationCodeErrorDisplayed() {
    var hasClass = this._secCodeErrorContainer
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('show') >= 0;
      });

    return hasClass;
  }
}
exports.MyBillingInformationPage = MyBillingInformationPage;
