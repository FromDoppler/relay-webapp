class BillingPage {
  constructor() {
    this._url = '/#/settings/billing';
    this._waitTimeout = 3000;
    this._planName = $('.billing--plan-name-container .plan-name');
    this._planPrice = $('.billing--plan-name-container .plan-price');
    this._ccNumber = element(by.id('cc.number'));
    this._nameInput = $('.billing--first-container #name');
    this._companyInput = $('.billing--first-container #company');
    this._addressInput = $('.billing--first-container #address');
    this._cityInput = $('.billing--first-container #city');
    this._zCodeInput = $('.billing--first-container #zCode');
    this._countryInput = $('.billing--first-container #country');
    this._cardHolderInput = $('.billing--first-container #cardHolder');
    this._expDateInput = $('.billing--first-container #expDate');
    this._secCodeInput = $('.billing--first-container #secCode');
    this._checkOrderButton = $('.button--container .check-button');
    this._buyButton = $('.button--container .buy-button');
    this._confirmationContainer = $('.billing--plan-confirmation');
    this._billingPageContainer = $('.billing--first-container');
    this._nameConfirmationLabel = $('.billing--plan-confirmation #nameConfirmation');
    this._companyConfirmationLabel = $('.billing--plan-confirmation #companyConfirmation');
    this._addressConfirmationLabel = $('.billing--plan-confirmation #addressConfirmation');
    this._cityConfirmationLabel = $('.billing--plan-confirmation #cityConfirmation');
    this._zCodeConfirmationLabel = $('.billing--plan-confirmation #zCodeConfirmation');
    this._countryConfirmationLabel = $('.billing--plan-confirmation #countryConfirmation');
    this._cardHolderConfirmationLabel = $('.billing--plan-confirmation #cardHolderConfirmation');
    this._ccNumberConfirmationLabel = $('.billing--plan-confirmation #ccNumberConfirmation');
    this._expDateConfirmationLabel = $('.billing--plan-confirmation #expDateConfirmation');
    this._secCodeConfirmationLabel = $('.billing--plan-confirmation #secCodeConfirmation');
    this._modifyButton = $('.billing--plan-confirmation .modify-button');
    this._countrySelect =  element(by.id('country'));
    this._creditCardContainer = $('.credit-card');
    this._creditCardErrorContainer = $('.credit-card .animate-error-container');
    this._detachedError = $('.billing--plan-confirmation .detached--error-container');
  }

  getPlanName() {
    return this._planName.getText();
  }
  getPrice() {
    return this._planPrice.getText();
  }
  setCreditCardNumber(ccNumber) {
      return this._ccNumber.sendKeys(ccNumber);
  }
  setName(name) {
    return this._nameInput.sendKeys(name);
  }
  setCompany(company) {
    return this._companyInput.sendKeys(company);
  }
  setAddress(address) {
    return this._addressInput.sendKeys(address);
  }
  setCity(city) {
    return this._cityInput.sendKeys(city);
  }
  setZCode(zCode) {
    return this._zCodeInput.sendKeys(zCode);
  }
  setCountry(country) {
    return this.clickFirstSelectOptionText(this._countrySelect);
  }
  setCardHolder(cardHolder) {
    return this._cardHolderInput.sendKeys(cardHolder);
  }
  setExpDate(expDate) {
    return this._expDateInput.sendKeys(expDate);
  }
  setSecCode(secCode) {
    return this._secCodeInput.sendKeys(secCode);
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
  clickCheckOrder() {
    return this._checkOrderButton.click();
  }
  clickBuy() {
    return this._buyButton.click();
  }
  getFirstCountryName() {
    return this.getFirstSelectOptionText(this._countrySelect);
  }
  isConfirmationDisplayed() {
   var confirmationContainer = this._confirmationContainer;

   // the library `angular-ui/ui-select` creates  the HTML
   // but it takes a little bit to populate the values
   // so we have to wait until the text is present.
   browser.wait(function() {
     return confirmationContainer.isDisplayed() != false
   }, this._waitTimeout);

    return this._confirmationContainer.isDisplayed();
  }
  isNameDisplayed() {
    return this._nameConfirmationLabel.getText();
  }
  getFirstSelectOptionText(parentElem) {
    parentElem.click();

    var firstOption = parentElem.all(by.css('span.select-option')).first();

    // the library `angular-ui/ui-select` creates  the HTML
    // but it takes a little bit to populate the values
    // so we have to wait until the text is present.
    browser.wait(function() {
      return firstOption.getText() != ''
    }, this._waitTimeout);

    return firstOption.getText();
  }
  clickFirstSelectOptionText(parentElem)
  {
    parentElem.click();
    var firstOption = parentElem.all(by.css('span.select-option')).first();
    return firstOption.click();

  }
  isCompanyDisplayed() {
    return this._companyConfirmationLabel.getText();
  }
  isAddressDisplayed() {
    return this._addressConfirmationLabel.getText();
  }
  isCityDisplayed() {
    return this._cityConfirmationLabel.getText();
  }
  isZCodeDisplayed() {
    return this._zCodeConfirmationLabel.getText();
  }
  isCountryDisplayed() {
    return this._countryConfirmationLabel.getText();
  }
  isCardHolderDisplayed() {
    return this._cardHolderConfirmationLabel.getText();
  }
  isCcNumberDisplayed() {
    return this._ccNumberConfirmationLabel.getText();
  }
  isExpDateDisplayed() {
    return this._expDateConfirmationLabel.getText();
  }
  isSecCodeDisplayed() {
    return this._secCodeConfirmationLabel.getText();
  }
  isBillingPageDisplayed() {
    var billingContainer = this._billingPageContainer;

    // the library `angular-ui/ui-select` creates  the HTML
    // but it takes a little bit to populate the values
    // so we have to wait until the text is present.
    browser.wait(function() {
      return billingContainer.isDisplayed() != false
    }, this._waitTimeout);

     return this._billingPageContainer.isDisplayed();
  }
  isDetachedErrorDisplayed() {
    var hasClass = this._detachedError
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('show') >= 0;
      });

    return hasClass;
  }

  clickModifyInformation() {
    return this._modifyButton.click();
  }
  isInvalidCCnumberErrorDisplayed() {
    var hasClass = this._creditCardErrorContainer
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('show') >= 0;
      });

    return hasClass;
  }
}
exports.BillingPage = BillingPage;
