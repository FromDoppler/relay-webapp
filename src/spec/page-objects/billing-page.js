class BillingPage {
  constructor() {
    this._url = '/#/settings/billing';
    this._planName = $('.billing--plan-name-container .plan-name');
    this._planPrice = $('.billing--plan-name-container .plan-price');
  }

  getPlanName() {
    return this._planName.getText();
  }
  getPrice() {
    return this._planPrice.getText();
  }
}
exports.BillingPage = BillingPage;
