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
    this._creditCardErrorContainer = $('.credit-card .validation-error-fluid');
    this._detachedError = $('.billing--plan-confirmation .detached--error-container');
    this._basicPlanDisplayedButton = $(".plan--box-container .basic a.show");
    this._proPlanDisplayedButton = $(".plan--box-container .pro a.show");
    //My Plan section
    this._myPlanPricingChartDisplayButton = $('.my-plan--info-container .button');
    this._pricingChartContainer = $('.pricing-chart--container');
    this._sliderContainerElements = element.all(by.css('.plan--slider-container div'));
    this._myPlanPrice = $('.plan--price-big');
    this._ticksElements = element.all(by.css('.plan--slider-container .rz-tick'));
    this._monthConsumption = $('.month-consumption');
    this._extraEmails = $('.extra-emails');
    this._renewalDate = $('.renewal-date');
    this._emailsAmount = $('.emails-amount');
    this._myPlanPriceFreeTrial = $('.my-plan-price');
    this._rightPlanBox = $('.plan--box-container .pro');
    this._currentPlanEmailPrice = element(by.css('.email-price p:nth-child(3)'));
    this._currentPlanPrice = element(by.css('.price p:nth-child(3)'));
    this._sliderEmailsPerMonth = $('.plan--slider-container p span.special');
    this._downgradeMessage = $('.scheduled--plan-message');
  }

  getCurrentPlanEmailPrice() {
    return this._currentPlanEmailPrice.getText();
  }
  getCurrentPlanPrice() {
    return this._currentPlanPrice.getText();
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
  getName() {
    return this._nameInput.getAttribute('value')
  }
  setCompany(company) {
    return this._companyInput.sendKeys(company);
  }
  getCompany() {
    return this._companyInput.getAttribute('value')
  }
  setAddress(address) {
    return this._addressInput.sendKeys(address);
  }
  getAddress() {
    return this._addressInput.getAttribute('value')
  }
  setCity(city) {
    return this._cityInput.sendKeys(city);
  }
  getCity() {
    return this._cityInput.getAttribute('value')
  }
  setZCode(zCode) {
    return this._zCodeInput.sendKeys(zCode);
  }
  getZCode() {
    return this._zCodeInput.getAttribute('value')
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

  //My Plan section
  clickUpgradeButtonToDisplayPricingChart() {
    return this._myPlanPricingChartDisplayButton.click();
  }

  isChangePlanButtonDisplayed(){
    return this._myPlanPricingChartDisplayButton.isDisplayed();
  }

  isPricingChartDisplayed() {
    var hasClass = this._pricingChartContainer
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf('show') >= 0;
      });

    return hasClass;
  }

  isSliderLoaded() {
    var sliderContainer = this._sliderContainerElements.then(function(val) {
      return val[0].getAttribute('class')
                   .then(function(className) {
                      return className.indexOf('rzslider') >= 0;
                   });
    });
    // the library `angular-ui/ui-select` creates  the HTML
    // but it takes a little bit to populate the values
    // so we have to wait until the text is present.
    browser.wait(function() {
      return sliderContainer != false
    }, this._waitTimeout);

    return sliderContainer;
  }

  clickFirstSliderTick() {
    var sliderContainer = this._ticksElements.then(function(val) {
      return val[0].click();
    });
  }

  getPlanPrice() {
    return this._myPlanPrice.getText();
  }
  isRightPlanBoxDisplayed() {
    return this._rightPlanBox.isDisplayed();
  }
  getMonthConsumption() {
    return this._monthConsumption.getText();
  }
  getRenewalDate() {
    return this._renewalDate.getText();
  }
  getExtraEmails() {
    return this._extraEmails.getText();
  }
  getEmailsAmountForCurrentPlan() {
    return this._emailsAmount.getText();
  }
  isFreeTrialAsPriceDisplayed() {
    return this._myPlanPriceFreeTrial.isDisplayed();
  }
  getSliderEmailsPerMonth() {
    return this._sliderEmailsPerMonth.getText();
  }
  getBasicButtonText(){
    return this._basicPlanDisplayedButton.getText();
  }

  isProPlanButtonDisabled(){
    var hasClass = this._proPlanDisplayedButton
    .getAttribute('class')
    .then(function(className) {
      return className.indexOf('button--disabled') >= 0;
    });

    return hasClass;
  }

  isDowngradeMessageDisplayed() {    
    return this._downgradeMessage.isDisplayed();
  }
}
exports.BillingPage = BillingPage;
