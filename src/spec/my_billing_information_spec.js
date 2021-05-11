describe('My Billing Information Page', () => {
    var MyBillingInformationPage = require('./page-objects/my-billing-information-page').MyBillingInformationPage;

  afterEach(() => {
    browser.removeMockModule('descartableModule');
    browser.removeMockModule('descartableModule2');
    browser.removeMockModule('descartableModule4');
  });

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.loginByToken(permanentToken);
      }));
  }

  function setupSampleStatusLimitResponse() {

    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
                "data" : ""
            });
      }));
  }

  function setupSamplePlanInfoResponse() {

    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": {"creditCard": {"cardNumber": "############4444","expiryDate": "1225","cardHoldersName": "Juan Test", "cardBrand": 'visa'}},
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
              "fee": 50,
              "includedDeliveries": 50.0
        });
      }));
  }

  //Free Account 
  it('should show the credit card information when the user has free account', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();

    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": {"creditCard": {"cardNumber": "############4444","expiryDate": "1225","cardHoldersName": "Juan Test", "cardBrand": 'visa'}},
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
        });
    }));

    var myBillingInformationPage = new MyBillingInformationPage();

    // Act
    var cardHolder = myBillingInformationPage.waitAndGetCardHolder();
    var creditCardNumber = myBillingInformationPage.waitAndGetCreditCardNumber();
    var expiryDate = myBillingInformationPage.waitAndGetExpiryDate();
    var verificationCode = myBillingInformationPage.waitAndGetVerificationCode();

    // Assert
    expect(cardHolder).toBe('');
    expect(creditCardNumber).toBe('');
    expect(expiryDate).toBe('');
    expect(verificationCode).toBe('');

    done();
  });

  it('should show the buy a plan when the user has free account', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();

    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": {"creditCard": {"cardNumber": "############4444","expiryDate": "1225","cardHoldersName": "Juan Test", "cardBrand": 'visa'}},
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
        });
    }));

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isFreePlanMessageDisplayed()).toBe(true);

    done();
  });

  it('should show a disabled the "change card" button when the user has free account', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();

    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": {"creditCard": {"cardNumber": "############4444","expiryDate": "1225","cardHoldersName": "Juan Test", "cardBrand": 'visa'}},
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
        });
    }));

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isChangeCardButtonDisabled()).toBe(true);

    done();
  });

  //Payment: Transfer
  it('should show a disabled the "change card" button when the user pays with transfer', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();

    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": null,
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
              "fee": 50,
              "includedDeliveries": 50.0
        });
    }));

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isChangeCardButtonDisabled()).toBe(true);

    done();
  });

  it('should show the transfer message when the user pays with transfer', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();

    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": null,
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
              "fee": 50,
              "includedDeliveries": 50.0
        });
    }));

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isTransferMessageDisplayed()).toBe(true);

    done();
  });

  //No Free Account
  it('should show the credit card information when the user has not free account', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();
    setupSamplePlanInfoResponse();

    var myBillingInformationPage = new MyBillingInformationPage();

    // Act
    var cardHolder = myBillingInformationPage.waitAndGetCardHolder();
    var expiryDate = myBillingInformationPage.waitAndGetExpiryDate();

    // Assert
    expect(cardHolder).toBe('Juan Test');
    expect(expiryDate).toBe('12/25');

    done();
  });

  it('should show visa icon when the brand is visa', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();
    setupSamplePlanInfoResponse();

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isCcIconVisaDisplayed()).toBeTruthy();
    expect(myBillingInformationPage.isCcIconAmexDisplayed()).toBeFalsy();
    expect(myBillingInformationPage.isCcIconMastercardDisplayed()).toBeFalsy();

    done();
  });

  it('should show amex icon when the brand is amex', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();
    
    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": {"creditCard": {"cardNumber": "############4444","expiryDate": "1225","cardHoldersName": "Juan Test", "cardBrand": 'amex'}},
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
              "fee": 50,
              "includedDeliveries": 50.0,
        });
    }));

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isCcIconVisaDisplayed()).toBeFalsy();
    expect(myBillingInformationPage.isCcIconAmexDisplayed()).toBeTruthy();
    expect(myBillingInformationPage.isCcIconMastercardDisplayed()).toBeFalsy();

    done();
  });

  it('should show mastercard icon when the brand is mastercard', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();
    
    browser.addMockModule('descartableModule4', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": {"creditCard": {"cardNumber": "############4444","expiryDate": "1225","cardHoldersName": "Juan Test", "cardBrand": 'mastercard'}},
              "billingInformation": null,
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
              "fee": 50,
              "includedDeliveries": 50.0,
        });
    }));

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isCcIconVisaDisplayed()).toBeFalsy();
    expect(myBillingInformationPage.isCcIconAmexDisplayed()).toBeFalsy();
    expect(myBillingInformationPage.isCcIconMastercardDisplayed()).toBeTruthy();

    done();
  });

  it('should show a enabled the "change card" button when the user has not free account', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();
    setupSamplePlanInfoResponse();

    var myBillingInformationPage = new MyBillingInformationPage();

    // Assert
    expect(myBillingInformationPage.isChangeCardButtonDisabled()).toBe(false);

    done();
  });

  it('should show all validation errors then the user click in "Save" button and all fields empty', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();
    setupSamplePlanInfoResponse();

    var myBillingInformationPage = new MyBillingInformationPage();

    myBillingInformationPage.clickChangeCard();

    var cardHolder = '';
    var creditCardNumber = '';
    var expDate = '';
    var secCode = ''

    myBillingInformationPage.setCardHolder(cardHolder);
    myBillingInformationPage.setCreditCardNumber(creditCardNumber);
    myBillingInformationPage.setExpDate(expDate);
    myBillingInformationPage.setSecCode(secCode);

    myBillingInformationPage.clickSave();

    // Assert
    expect(myBillingInformationPage.isInvalidCardHolderErrorDisplayed()).toBeTruthy();
    expect(myBillingInformationPage.isInvalidCCnumberErrorDisplayed()).toBeTruthy();
    expect(myBillingInformationPage.isInvalidExpirationDateErrorDisplayed()).toBeTruthy();
    expect(myBillingInformationPage.isInvalidVerificationCodeErrorDisplayed()).toBeTruthy();

    done();
  });

  it('should show card number validation error when the number is invalid', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-billing-information');
    setupSampleStatusLimitResponse();
    setupSamplePlanInfoResponse();

    var myBillingInformationPage = new MyBillingInformationPage();

    myBillingInformationPage.clickChangeCard();

    var cardHolder = 'Juan Test';
    var creditCardNumber = '4444444444444444';
    var expDate = '0999';
    var secCode = '123'

    myBillingInformationPage.setCardHolder(cardHolder);
    myBillingInformationPage.setCreditCardNumber(creditCardNumber);
    myBillingInformationPage.setExpDate(expDate);
    myBillingInformationPage.setSecCode(secCode);

    myBillingInformationPage.clickSave();

    // Assert
    expect(myBillingInformationPage.isInvalidCardHolderErrorDisplayed()).toBeFalsy();
    expect(myBillingInformationPage.isInvalidCCnumberErrorDisplayed()).toBeTruthy();
    expect(myBillingInformationPage.isInvalidExpirationDateErrorDisplayed()).toBeFalsy();
    expect(myBillingInformationPage.isInvalidVerificationCodeErrorDisplayed()).toBeFalsy();

    done();
  });
});
