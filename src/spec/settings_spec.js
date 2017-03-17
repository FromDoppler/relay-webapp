describe('Settings Page', () => {

  var SettingsPage = require('./page-objects/settings-page').SettingsPage;

  afterEach(() => {
    browser.removeMockModule('descartableModule');
    browser.removeMockModule('descartableModule2');
    browser.removeMockModule('descartableModule3');
  });

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.saveToken(permanentToken);
      }));
  }
  ///This test will be commented until we add the new Domain Functionality
  //it('should show add domain input when you click in add domain button', () => {
    // Arrange
    //beginAuthenticatedSession();
    //var settings = new SettingsPage();

    //Act
    //browser.get('/#/settings/domain-manager');

    //Assert
    //expect(settings.isDomainInputVisible()).toBe(false);

    //This will be commented until we add Add domain functionality.
    /*// Act
    settings.clickInputToggler();

    // Assert
    expect(settings.isDomainInputVisible()).toBe(true);*/
  //});

  it('should list and show the domains correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com", disabled: true }, {name: "makingsense.com", disabled: true }],
          "defaultDomain": "relay.com"
        });
      }));
    var settings = new SettingsPage();

    //Act
    browser.get('/#/settings/domain-manager');

    //Assert
    expect(settings.countDomainListItems()).not.toBe(0);
  });

  it('should show an empty list of domains', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule3', () => angular
      .module('descartableModule3', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": []
        });
      }));
    var settings = new SettingsPage();

    //Act
    browser.get('/#/settings/domain-manager');

    //Assert
    expect(settings.countDomainListItems()).toBe(0);
  });
});
