describe('Billing Page', () => {
  var BillingPage = require('./page-objects/billing-page').BillingPage;

  afterEach(() => {
    browser.removeMockModule('descartableModule');
    browser.removeMockModule('descartableModule2');
  });

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.saveToken(permanentToken);
      }));
  }


  it('should show the selected plan name and price', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/plans/).respond(200, {
          "items": [
            { "currency": "USD",
              "fee": 5.90,
              "name": "PLAN-10K"},
            { "currency": "USD",
              "fee": 31.8,
              "name": "PLAN-60K" }
          ]
        });
      }));

    var billingPage = new BillingPage();

    // Act
    var plan = billingPage.getPlanName();
    var price = billingPage.getPrice();

    // Assert
    expect(plan).toBe('PLAN-60K');
    expect(billingPage.getPrice()).toBe('USD 31.80 x month');
  });

  it('should show credit card icon when complete visa credit card number valid', () => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/plans/).respond(200, {
          "items": [
            { "currency": "USD",
              "fee": 5.90,
              "name": "PLAN-10K"},
            { "currency": "USD",
              "fee": 31.8,
              "name": "PLAN-60K" }
          ]
        });
      }));

      var billingPage = new BillingPage();

      // Act
      billingPage.setCreditCardNumber(4);
      
      // Assert
      expect(billingPage.isCcIconDisplayed()).toBeTruthy();
  });

  it('should show credit card icon when complete master credit card number valid', () => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/plans/).respond(200, {
          "items": [
            { "currency": "USD",
              "fee": 5.90,
              "name": "PLAN-10K"},
            { "currency": "USD",
              "fee": 31.8,
              "name": "PLAN-60K" }
          ]
        });
      }));

      var billingPage = new BillingPage();

      // Act
      billingPage.setCreditCardNumber(54);
      
      // Assert
      expect(billingPage.isCcIconDisplayed()).toBeTruthy();
  });

  it('should show credit card icon when complete amex credit card number valid', () => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/plans/).respond(200, {
          "items": [
            { "currency": "USD",
              "fee": 5.90,
              "name": "PLAN-10K"},
            { "currency": "USD",
              "fee": 31.8,
              "name": "PLAN-60K" }
          ]
        });
      }));

      var billingPage = new BillingPage();

      // Act
      billingPage.setCreditCardNumber(34);
      
      // Assert
      expect(billingPage.isCcIconDisplayed()).toBeTruthy();
  });

});
