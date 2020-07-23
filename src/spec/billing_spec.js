describe('Billing Page', () => {
  var BillingPage = require('./page-objects/billing-page').BillingPage;

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

  function setupSamplePlanInfoResponse() {

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
              "fee": 0,
              "includedDeliveries": 50.0
        });

        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan/).respond(200, {
               "deliveriesCount": 200,
               "startDate": "2017-07-01T01:01:01Z",
               "endDate": "2017-08-01T01:01:01Z"
        });
      }));
  }

  function setupSamplePlansResponse() {

    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/plans/).respond(200, {
          "items": [
            { "currency": "USD",
              "fee": 5.90,
              "extra_delivery_cost": 0.00059000,
              "included_deliveries": 10000.0,
              "name": "PLAN-10K"},
            { "currency": "USD",
              "fee": 31.8,
              "extra_delivery_cost": 0.00053000,
              "included_deliveries": 60000.0,
              "name": "PLAN-60K" },
            { "currency": "USD",
              "fee": 40,
              "extra_delivery_cost": 0.00053000,
              "included_deliveries": 60000.0,
              "type":"pro",
              "ips_count":1,
              "cost_by_ip": 5,
              "name": "PLAN-PRO-60K" },
              { "currency": "USD",
              "fee": 51.8,
              "extra_delivery_cost": 0.00051000,
              "included_deliveries": 80000.0,
              "name": "PLAN-80K" }
          ]
        });
       $httpBackend.whenGET(/\/resources\/countries\.json/).respond(200, [
        {"code": "BV", "en": "Bolivia, Plurinational State Of", "es": "Bolivia"}, 
        {"code": "AR", "en": "Argentina", "es": "Argentina"}]);
       $httpBackend.whenGET(/\/resources\/consumerType\.json/).respond(200, [
        {"code": "CF", "en": "Final Consumer", "es": "Consumidor Final"},
        {"code": "EM", "en": "Company", "es": "Empresa"}]);
       $httpBackend.whenGET(/\/resources\/provinces\.json/).respond(200, [{"code": "BS","en": "Buenos Aires","es": "Buenos Aires"}]);
       $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
         "data" : ""
      });
      }));
  }

  it('should show the selected plan name and price in english', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();

    var billingPage = new BillingPage();

    // Act
    var plan = billingPage.getPlanName();
    var price = billingPage.waitAndGetPrice();

    // Assert
    expect(plan).toBe('PLAN-60K');
    expect(price).toBe('$ 31.80 per month');

    done();
  });

  it('should show the selected plan name and price in spanish', (done) => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K&lang=es');
    setupSamplePlansResponse();

    var billingPage = new BillingPage();

    // Act
    var plan = billingPage.getPlanName();
    var price = billingPage.waitAndGetPrice();

    // Assert
    expect(plan).toBe('PLAN-60K');
    expect(price).toBe('USD 31,80 por mes');

    done();
  });

  it('should show credit card icon when complete visa credit card number', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();

    var billingPage = new BillingPage();

    // Act
    billingPage.setCreditCardNumber(4);

    // Assert
    expect(billingPage.isCcIconVisaDisplayed()).toBeTruthy();
    expect(billingPage.isCcIconAmexDisplayed()).toBeFalsy();
    expect(billingPage.isCcIconMastercardDisplayed()).toBeFalsy();

    done();
  });

  it('should show credit card icon when complete master credit card number', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();

    var billingPage = new BillingPage();

    // Act
    billingPage.setCreditCardNumber(54);

    // Assert
    expect(billingPage.isCcIconMastercardDisplayed()).toBeTruthy();
    expect(billingPage.isCcIconVisaDisplayed()).toBeFalsy();
    expect(billingPage.isCcIconAmexDisplayed()).toBeFalsy();

    done();
  });

  it('should show credit card icon when complete amex credit card number', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();

    var billingPage = new BillingPage();

    // Act
    billingPage.setCreditCardNumber(34);

    // Assert
    expect(billingPage.isCcIconAmexDisplayed()).toBeTruthy();
    expect(billingPage.isCcIconVisaDisplayed()).toBeFalsy();
    expect(billingPage.isCcIconMastercardDisplayed()).toBeFalsy();

    done();
  });

  it('should not show credit card icons when complete with credit card number invalid', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();

    var billingPage = new BillingPage();

    // Act
    billingPage.setCreditCardNumber(988923432432);

    // Assert
    expect(billingPage.isCcIconAmexDisplayed()).toBeFalsy();
    expect(billingPage.isCcIconVisaDisplayed()).toBeFalsy();
    expect(billingPage.isCcIconMastercardDisplayed()).toBeFalsy();

    done();
  });

  it('should not show credit card icons by default', (done) => {

    // Arrange
    beginAuthenticatedSession();
    setupSamplePlansResponse();

    // Act
    browser.get('/#/settings/billing?plan=PLAN-60K');

    // Assert
    var billingPage = new BillingPage();
    expect(billingPage.isCcIconAmexDisplayed()).toBeFalsy();
    expect(billingPage.isCcIconVisaDisplayed()).toBeFalsy();
    expect(billingPage.isCcIconMastercardDisplayed()).toBeFalsy();

    done();
  });

  it('should show countries drop downs in different languages', (done) => {

    // Arrange
    var countryInEnglish = "Bolivia, Plurinational State Of";
    var countryInSpanish = "Bolivia";
    beginAuthenticatedSession();
    setupSamplePlansResponse();
    setupSamplePlanInfoResponse();

    // Act
    browser.get('/#/settings/billing?plan=PLAN-60K&lang=es');

    // Assert
    var billingPage = new BillingPage();
    expect(billingPage.getFirstCountryName()).toBe(countryInSpanish);

     // Act
    browser.get('/#/settings/billing?plan=PLAN-60K&lang=en');

    // Assert
    expect(billingPage.getFirstCountryName()).toBe(countryInEnglish);

    done();
  });

  it('should show billing information if available', (done) => {
    
    // Arrange
    beginAuthenticatedSession();
    setupSamplePlansResponse();
    //setupSamplePlanInfoResponse();
    
    browser.addMockModule('descartableModule4', () => angular
    // This code will be executed in the browser context,
    // so it cannot access variables from outside its scope
    .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": null,
              "billingInformation": {
                "name": "Test",
                "lastname": "Unit",
                "address": "Address 1234",
                "city": "Rosario",
                "zipCode": "2000",
                "countryCode": "AR",
                "consumerType": "CF",
                "fiscalId": "99999999",
                "fiscalIdType": "DNI",
                "provinceCode": "01"
              },
              "startDate": "2017-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
              "fee": 1,
              "includedDeliveries": 50
        });

        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan/).respond(200, {
              "deliveriesCount": 200,
              "startDate": "2017-07-01T01:01:01Z",
              "endDate": "2017-08-01T01:01:01Z"
        });
      }));

    // Act
    browser.get('/#/settings/billing?plan=PLAN-60K&lang=en');

    // Assert
    var billingPage = new BillingPage();

    var name = billingPage.waitAndGetName();
    var lastname = billingPage.waitAndGetLastname();
    var fiscalId = billingPage.waitAndGetDni();

    expect(name).toBe('Test');
    expect(lastname).toBe('Unit');
    expect(fiscalId).toBe('99999999');
    expect(billingPage.getAddress()).toBe('Address 1234');
    expect(billingPage.getCity()).toBe('Rosario');
    expect(billingPage.getZCode()).toBe('2000');

    done();
  });

  it('should show the confirmation page with all the fields filled', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();
    setupSamplePlanInfoResponse();

    var billingPage = new BillingPage();
    var consumerType = 'Company';
    var idFiscal = '99999999';
    var company = 'Company Test';
    var address = 'Address 123';
    var city = 'CityTest';
    var zCode = '1234';
    var country = 'Bolivia, Plurinational State Of';
    var cardHolder = 'TestName TestLastName';
    var creditCardNumber = '4485929253917658';
    var expDate = '0999';
    var secCode = '123'

    // Act
    billingPage.setCountry(country);
    billingPage.setConsumerType(consumerType);
    billingPage.setIdFiscal(idFiscal);
    billingPage.setCompany(company);
    billingPage.setAddress(address);
    billingPage.setCity(city);
    billingPage.setZCode(zCode);
    billingPage.setCardHolder(cardHolder);
    billingPage.setCreditCardNumber(creditCardNumber);
    billingPage.setExpDate(expDate);
    billingPage.setSecCode(secCode);

    billingPage.clickCheckOrder();

    // Assert
    expect(billingPage.isConfirmationDisplayed()).toBeTruthy();
    expect(billingPage.isCompanyDisplayed()).toBe(company);
    expect(billingPage.isCityDisplayed()).toBe(city);
    expect(billingPage.isZCodeDisplayed()).toBe(zCode);
    expect(billingPage.isCountryDisplayed()).toContain(country);
    expect(billingPage.isCardHolderDisplayed()).toBe(cardHolder);
    expect(billingPage.isCcNumberDisplayed()).toBe('************7658');
    expect(billingPage.isExpDateDisplayed()).toBe('09/99');
    expect(billingPage.isSecCodeDisplayed()).toBe('***');
    expect(billingPage.isBillingPageDisplayed()).toBeFalsy();

    done();
  });

  it('should not show the confirmation page if all fields are not filled', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();
    setupSamplePlanInfoResponse();

    var billingPage = new BillingPage();
    var consumerType = 'Company';
    var idFiscal = '99999999';
    var company = '';
    var address = 'Address 123';
    var city = 'CityTest';
    var zCode = '1234';
    var country = 'Bolivia, Plurinational State Of';
    var cardHolder = 'TestName TestLastName';
    var creditCardNumber = '4485929253917658';
    var expDate = '0999';
    var secCode = '123'

    // Act
    billingPage.setCountry(country);
    billingPage.setConsumerType(consumerType);
    billingPage.setIdFiscal(idFiscal);
    billingPage.setCompany(company);
    billingPage.setAddress(address);
    billingPage.setCity(city);
    billingPage.setZCode(zCode);
    billingPage.setCardHolder(cardHolder);
    billingPage.setCreditCardNumber(creditCardNumber);
    billingPage.setExpDate(expDate);
    billingPage.setSecCode(secCode);

    billingPage.clickCheckOrder();

    // Assert
    expect(billingPage.isConfirmationDisplayed()).toBeFalsy();
    expect(billingPage.isBillingPageDisplayed()).toBeTruthy();

    done();
  });

  it('should go back to billing page if the user clicks on modify information', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();
    setupSamplePlanInfoResponse();

    var billingPage = new BillingPage();
    var consumerType = 'Company';
    var idFiscal = '99999999';
    var company = 'Company Test';
    var address = 'Address 123';
    var city = 'CityTest';
    var zCode = '1234';
    var country = 'Bolivia, Plurinational State Of';
    var cardHolder = 'TestName TestLastName';
    var creditCardNumber = '4485929253917658';
    var expDate = '0999';
    var secCode = '123'

    billingPage.setCountry(country);
    billingPage.setConsumerType(consumerType);
    billingPage.setIdFiscal(idFiscal);
    billingPage.setCompany(company);
    billingPage.setAddress(address);
    billingPage.setCity(city);
    billingPage.setZCode(zCode);
    billingPage.setCardHolder(cardHolder);
    billingPage.setCreditCardNumber(creditCardNumber);
    billingPage.setExpDate(expDate);
    billingPage.setSecCode(secCode);
    billingPage.clickCheckOrder();

    expect(billingPage.isConfirmationDisplayed()).toBeTruthy();
    expect(billingPage.isBillingPageDisplayed()).toBeFalsy();

    // Act
    billingPage.clickModifyInformation();

    // Assert
    expect(billingPage.isConfirmationDisplayed()).toBeFalsy();
    expect(billingPage.isBillingPageDisplayed()).toBeTruthy();

    done();
  });

  it('should show error if the credit card is not valid by Luhn', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();
    setupSamplePlanInfoResponse();

    var billingPage = new BillingPage();
    var consumerType = 'Company';
    var idFiscal = '99999999';
    var company = 'Company Test';
    var address = 'Address 123';
    var city = 'CityTest';
    var zCode = '1234';
    var country = 'Bolivia, Plurinational State Of';
    var cardHolder = 'TestName TestLastName';
    var creditCardNumber = '4444444444444444';
    var expDate = '0999';
    var secCode = '123'

    billingPage.setCountry(country);
    billingPage.setConsumerType(consumerType);
    billingPage.setIdFiscal(idFiscal);
    billingPage.setCompany(company);
    billingPage.setAddress(address);
    billingPage.setCity(city);
    billingPage.setZCode(zCode);
    billingPage.setCardHolder(cardHolder);
    billingPage.setCreditCardNumber(creditCardNumber);
    billingPage.setExpDate(expDate);
    billingPage.setSecCode(secCode);
    billingPage.clickCheckOrder();

    // Assert
    expect(billingPage.isInvalidCCnumberErrorDisplayed()).toBeTruthy();
    expect(billingPage.isConfirmationDisplayed()).toBeFalsy();
    expect(billingPage.isBillingPageDisplayed()).toBeTruthy();

    done();
  });

  it('should show a nice error when the post return 400 error', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/billing?plan=PLAN-60K');
    setupSamplePlansResponse();
    setupSamplePlanInfoResponse();

    browser.addMockModule('descartableModule3', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule3', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/agreements\/current/).respond(400, { "data": { 'errorCode': 5 } });
      }));


    var billingPage = new BillingPage();
    var consumerType = 'Company';
    var idFiscal = '99999999';
    var company = 'Company Test';
    var address = 'Address 123';
    var city = 'CityTest';
    var zCode = '1234';
    var country = 'Bolivia, Plurinational State Of';
    var cardHolder = 'TestName TestLastName';
    var creditCardNumber = '4485929253917658';
    var expDate = '0999';
    var secCode = '123'

    // Act
    billingPage.setCountry(country);
    billingPage.setConsumerType(consumerType);
    billingPage.setIdFiscal(idFiscal);
    billingPage.setCompany(company);
    billingPage.setAddress(address);
    billingPage.setCity(city);
    billingPage.setZCode(zCode);
    billingPage.setCardHolder(cardHolder);
    billingPage.setCreditCardNumber(creditCardNumber);
    billingPage.setExpDate(expDate);
    billingPage.setSecCode(secCode);

    billingPage.clickCheckOrder();
    expect(billingPage.isConfirmationDisplayed()).toBeTruthy();
    billingPage.clickBuy();

    // Assert
    expect(billingPage.isDetachedErrorDisplayed()).toBeTruthy();

    done();
  });

  it('should not show change plan button when agreement is scheduled', (done) => {
    
    // Arrange
    beginAuthenticatedSession();        
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
              "endDate": "2017-08-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0,
              "fee": 50,
              "includedDeliveries": 75000
        });

        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan/).respond(200, {
              "deliveriesCount": 200,
              "startDate": "2017-07-01T01:01:01Z",
              "endDate": "2017-08-01T01:01:01Z"
        });
      }));
    
    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    //Act
    browser.get('/#/settings/my-plan?plan=PLAN-60K');

    // Assert
    expect(billingPage.isChangePlanButtonDisplayed()).toBeFalsy();

    done();
  });
  
  it('should show the pricing chart when the user click on upgrade button', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    setupSamplePlanInfoResponse();
    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    //Act
    billingPage.clickUpgradeButtonToDisplayPricingChart();

    // Assert
    expect(billingPage.isPricingChartDisplayed()).toBeTruthy();

    done();
  });

  it('should load the slider with default emails per month count selected', (done) => {
    
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    setupSamplePlanInfoResponse();
    setupSamplePlansResponse();
    var billingPage = new BillingPage();
    var defaultPlanDeliveries = '60,000';

    //Act
    billingPage.clickUpgradeButtonToDisplayPricingChart();

    // Assert
    expect(billingPage.isSliderLoaded()).toBeTruthy();
    expect(billingPage.getSliderEmailsPerMonth()).toBe(defaultPlanDeliveries);

    done();
  });

  it('should load the slider with default emails per month count calculated based on included deliveries', (done) => {
    
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    
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
              "includedDeliveries": 75000
        });

        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan/).respond(200, {
              "deliveriesCount": 200,
              "startDate": "2017-07-01T01:01:01Z",
              "endDate": "2017-08-01T01:01:01Z"
        });
      }));
    
    
    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    //Act
    billingPage.clickUpgradeButtonToDisplayPricingChart();

    // Assert
    expect(billingPage.isSliderLoaded()).toBeTruthy();
    expect(billingPage.getSliderEmailsPerMonth()).toBe('80,000');

    done();
  });

  it('should change the price when the user change slider position', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    setupSamplePlanInfoResponse();
    setupSamplePlansResponse();
    var billingPage = new BillingPage();
    billingPage.clickUpgradeButtonToDisplayPricingChart();
    expect(billingPage.isSliderLoaded()).toBeTruthy();
    var planDefaultPrice = billingPage.getPlanPrice();

    //Act
    billingPage.clickFirstSliderTick();

    // Assert
    expect(billingPage.getPlanPrice()).not.toBe(planDefaultPrice);

    done();
  });

  it('should show a disabled button for current plan and contact us for downgrade', (done) => {
    
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    
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
              "ips_count": 1,
              "cost_by_ip": 5,
              "extraDeliveryCost": 0,
              "fee": 45,
              "includedDeliveries": 60000
        });

        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan/).respond(200, {
              "deliveriesCount": 200,
              "startDate": "2017-07-01T01:01:01Z",
              "endDate": "2017-08-01T01:01:01Z"
        });
      }));
    
    
    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    //Act
    billingPage.clickUpgradeButtonToDisplayPricingChart();

    // Assert
    expect(billingPage.getBasicButtonText()).toBe('CHANGE PLAN');
    expect(billingPage.isProPlanButtonDisabled()).toBeTruthy();

    done();
  });

  it('should show the new box for Pro and premium plan', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    setupSamplePlanInfoResponse();
    setupSamplePlansResponse();
    var billingPage = new BillingPage();
    billingPage.clickUpgradeButtonToDisplayPricingChart();
    expect(billingPage.isSliderLoaded()).toBeTruthy();

    //Act
    billingPage.clickFirstSliderTick();

    // Assert
    expect(billingPage.isRightPlanBoxDisplayed()).toBe(true);

    done();
  });

  it('should show correct plan status values', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    setupSamplePlanInfoResponse();
    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    // Assert
    expect(billingPage.getEmailsAmountForCurrentPlan()).toBe('50');
    expect(billingPage.getMonthConsumption()).toBe('200');
    expect(billingPage.getExtraEmails()).toBe('150');
    expect(billingPage.getRenewalDate()).toBe('Aug 01, 2017');

    done();
  });

  it('should show correct plan status values with number separators in english', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    browser.addMockModule('descartableModule4', () => angular
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": null,
              "billingInformation": null,
              "startDate": "2016-07-01T00:00:00Z",
              "currency": "USD",
              "extraDeliveryCost": 0.00002000,
              "ips_count": 0,
              "cost_by_ip": 0,
              "fee": 122231.80,
              "includedDeliveries": 12000
        });

        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan/).respond(200, {
               "deliveriesCount": 20000000,
               "startDate": "2017-07-01T01:01:01Z",
               "endDate": "2017-08-01T01:01:01Z"
        });
      }));

    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    // Assert
    expect(billingPage.getCurrentPlanPrice()).toBe('$ 122,231.80');
    expect(billingPage.getCurrentPlanEmailPrice()).toBe('$ 0.00002');
    expect(billingPage.getEmailsAmountForCurrentPlan()).toBe('12,000');
    expect(billingPage.getMonthConsumption()).toBe('20,000,000');
    expect(billingPage.getExtraEmails()).toBe('19,988,000');

    done();
  });

  it('should show correct plan status values with number separators in spanish', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K&lang=es');
    browser.addMockModule('descartableModule4', () => angular
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current/).respond(200, {
              "planName": null,
              "paymentMethod": null,
              "billingInformation": null,
              "startDate": "2016-07-01T00:00:00Z",
              "currency": "USD",
              "ips_count": 0,
              "cost_by_ip": 0,
              "extraDeliveryCost": 0.00002000,
              "fee": 122231.80,
              "includedDeliveries": 12000
        });

        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan/).respond(200, {
               "deliveriesCount": 20000000,
               "startDate": "2017-07-01T01:01:01Z",
               "endDate": "2017-08-01T01:01:01Z"
        });
      }));

    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    // Assert
    expect(billingPage.getCurrentPlanPrice()).toBe('USD 122.231,80');
    expect(billingPage.getCurrentPlanEmailPrice()).toBe('USD 0,00002');
    expect(billingPage.getEmailsAmountForCurrentPlan()).toBe('12.000');
    expect(billingPage.getMonthConsumption()).toBe('20.000.000');
    expect(billingPage.getExtraEmails()).toBe('19.988.000');

    done();
  });

  it('should show correct plan status values for Free Trial user', (done) => {

    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/settings/my-plan?plan=PLAN-60K');
    setupSamplePlanInfoResponse();
    setupSamplePlansResponse();
    var billingPage = new BillingPage();

    // Assert
    expect(billingPage.isFreeTrialAsPriceDisplayed()).toBe(true);

    done();
  });

  it('should show a message when the user is waiting for a downgrade in my plan page', (done) => {
    
      // Arrange
      beginAuthenticatedSession();
      browser.get('/#/settings/my-plan');
      setupSamplePlanInfoResponse();
      setupSamplePlansResponse();

      browser.addMockModule('descartableModule4', () => angular
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/next/).respond(200, {
              "planName": "PLAN-80K",
              "billingInformation": null,
              "startDate": "2017-12-01T00:00:00Z",
              "currency": "USD",
              "extraDeliveryCost": 0.00050000,
              "fee": 40.00,
              "includedDeliveries": 80000.0,
              "ips_count": 0,
              "cost_by_ip": 0.00,
        });
      }));
      var billingPage = new BillingPage();
  
      // Assert
      expect(billingPage.isDowngradeMessageDisplayed()).toBe(true);

      done();
  });
});
