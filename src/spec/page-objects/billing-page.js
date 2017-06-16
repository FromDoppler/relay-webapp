class BillingPage {
  constructor() {
    this._url = '/#/settings/billing';
    this._planName = $('.billing--plan-name-container .plan-name');
    this._planPrice = $('.billing--plan-name-container .plan-price');
    this._ccNumber = element(by.id('cc.number'));
    this._ccIconAmex = $('.icon-amex');
    this._ccIconVisa = $('.icon-visa');
    this._ccIconMaster = $('.icon-master');
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
  isCcIconVisaDisplayed() {
      return this._ccIconVisa.isDisplayed();
  }
  isCcIconMastercardDisplayed() {
      return this._ccIconMaster.isDisplayed();
  }
  isCcIconAmexDisplayed() {
      return this._ccIconAmex.isDisplayed();
  }
}
exports.BillingPage = BillingPage;
