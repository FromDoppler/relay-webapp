class ConfirmationPage {
  constructor() {
    this._waitTimeout = 5000;
    this._url = '/#/signup/confirmation?activation=lzqqdc7dqn0qw7qxobdtji1oy0jxrf';
    this._industrySelect =  element(by.id('confirmation-industry'));
    this._countrySelect =  element(by.id('confirmation-country'));
  }

  get(params) {
    return browser.get(params ? this._url + '&' + params : this._url);
  }

  getFirstIndustryName() {
    return this.getFirstSelectOptionText(this._industrySelect);
  }

  getFirstCountryName() {
    return this.getFirstSelectOptionText(this._countrySelect);
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
}

exports.ConfirmationPage = ConfirmationPage;
