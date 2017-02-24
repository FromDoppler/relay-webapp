class ReportsPage {
  constructor() {
    this._url = '/#/reports';
    this._dropdownEl = $('.relay-dropdown input');
    this._daterangepickerEl = $('.daterangepicker');
    this._droppedEl = $('.dropped-count');
    this._deliverabilityPercentageEl = $('.deliverability-percentage');
  }

  clickDropdown(){
    return this._dropdownEl.click();
  }
  getDroppedEl(){
    return this._droppedEl.getText();
  }
  getDeliverabilityPercentage(){
    return this._deliverabilityPercentageEl.getText();
  }

}
exports.ReportsPage = ReportsPage;
