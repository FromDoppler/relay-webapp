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
  it('should show "add domain" input when you click in add domain button', () => {
    //Arrange
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
    browser.get('/#/settings/domain-manager');
    expect(settings.isDomainInputVisible()).toBe(false);

    // Act
    settings.clickInputToggler();

    // Assert
    expect(settings.isDomainInputVisible()).toBe(true);
  });

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

  it('should add a domain correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com", disabled: true }, {name: "makingsense.com", disabled: true }],
          "defaultDomain": "relay.com"
        });
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/domains/).respond(201, {
          "result": true
        });
      }));

      var settings = new SettingsPage();

      browser.get('/#/settings/domain-manager');
      settings.clickInputToggler();
      expect(settings.isDomainInputVisible()).toBe(true);

      // Act
      settings.setDomain('test.com');
      settings.submitAddDomain();

      // Assert
      expect(settings.isDomainInputVisible()).toBe(false);

  });

  it('should show an empty list of domains', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
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

  it('should set as default domain correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com" }, {name: "makingsense.com" }, {name: "makingsense12.com" }],
          "defaultDomain": "relay.com"
        });
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/domains/).respond(200, {});
      }));
    var settings = new SettingsPage();

    //Act
    browser.get('/#/settings/domain-manager');
    var defaultDomain = settings.getDefaultDomain();
    settings.clickSetAsDefault();

    //Assert
    expect(settings.getDefaultDomain()).not.toEqual(defaultDomain);
    expect(settings.getDefaultDomain()).toEqual("fromdoppler.com");
  });

  it('should set as enabled domain', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com" }, {name: "makingsense.com", disabled: true }, {name: "makingsense12.com" }],
          "defaultDomain": "relay.com"
        });
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/domains/, '{}').respond(201, {
          "result": true
        });
      }));
    var settings = new SettingsPage();
    browser.get('/#/settings/domain-manager');
    var countActivateButtons = settings.countActivateButtons();

    //Act
    settings.clickFirstActivateButton();

    //Assert
    expect(settings.countActivateButtons()).toBeLessThan(countActivateButtons);
  });

  it('should delete a domain correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com", disabled: true }, {name: "makingsense.com", disabled: true }],
          "defaultDomain": "relay.com"
        });
        $httpBackend.whenDELETE(/\/accounts\/[\w|-]*\/domains/).respond(200, {});
      }));
    var settings = new SettingsPage();

    //Act
    browser.get('/#/settings/domain-manager');
    var countDeleteButtons = settings.countDeleteButtons();
    settings.clickDeleteDomain();

    //Assert
    expect(settings.countDeleteButtons()).toBeLessThan(countDeleteButtons);
  });
});
