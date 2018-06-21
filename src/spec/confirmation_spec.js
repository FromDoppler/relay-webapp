describe('Confirmation Page', () => {
  var ConfirmationPage = require('./page-objects/confirmation-page').ConfirmationPage;

  beforeEach(() => {
      browser.addMockModule('descartableModule', () => angular
          .module('descartableModule', ['ngMockE2E'])
          .run($httpBackend => {
             $httpBackend.whenGET(/\/resources\/industries\.json/).respond(200, [{"code": "dplr138","en": "Tobacco","es": "Tabaco"}]);
             $httpBackend.whenGET(/\/resources\/countries\.json/).respond(200, [{"code": "BV","en": "Bolivia, Plurinational State Of","es": "Bolivia"}]);
             $httpBackend.whenGET(/\/user/).respond(200, {
               "user_email": "pbarrios+dr001@makingsense.com",
               "user_id": 7,
               "account_name": "ms",
               "pending_activation": true,
               "domain": null,
               "password_empty": false,
               "firstName": "Pablo",
               "lastName": "Barrios",
               "terms_and_conditions_version": 2,
               "company_name": "MS",
               "phone_number": null,
               "country_code": null,
              "industry_code": null
             });
             $httpBackend.whenPOST(/\/user\/apikeys/).respond(201, { "api_key": "akbjhwltbtpw60givp7vka8qbsv0xf" });
      }));
  });

  afterEach(() => {
    browser.removeMockModule('descartableModule');
  });

  it('should load drop downs in different languages', () => {

    // Arrange
    browser.addMockModule('descartableModule2', () => angular
    .module('descartableModule2', ['ngMockE2E'])
    .run($httpBackend => {
      $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
        "data" : ""
      });
    }));
    var confirmationPage = new ConfirmationPage();
    var industryInEnglish = "Tobacco";
    var industryInSpanish = "Tabaco";
    var countryInEnglish = "Bolivia, Plurinational State Of";
    var countryInSpanish = "Bolivia";

    // Act
    confirmationPage.get('lang=en');
    // Assert
    expect(confirmationPage.getFirstIndustryName()).toBe(industryInEnglish);
    expect(confirmationPage.getFirstCountryName()).toBe(countryInEnglish);

    // Act
    confirmationPage.get('lang=es');
    // Assert
    expect(confirmationPage.getFirstIndustryName()).toBe(industryInSpanish);
    expect(confirmationPage.getFirstCountryName()).toBe(countryInSpanish);
  });
});
