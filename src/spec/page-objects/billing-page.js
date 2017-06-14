class BillingPage {
  constructor() {
    this._url = '/#/settings/billing';
    this._planName = $('.billing--plan-name-container .plan-name');
    this._planPrice = $('.billing--plan-name-container .plan-price');
    this._ccNumber = element(by.id('cc.number'));
    this._ccIcon = $('.credit-card .icon');
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
  isCcIconDisplayed(){
    return this._ccIcon.isDisplayed();
  }
}
exports.BillingPage = BillingPage;
