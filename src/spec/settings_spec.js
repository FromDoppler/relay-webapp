describe('Settings Page', () => {

  var SettingsPage = require('./page-objects/settings-page').SettingsPage;
  var DkimPage = require('./page-objects/dkim-page').DkimPage;
  var ConnectionSettingsPage = require('./page-objects/connection-settings-page').ConnectionSettingsPage;
  var ProfilePage = require('./page-objects/profile-page').ProfilePage;
  var MyPlanPage = require('./page-objects/new-plan').MyPlanPage;
  afterEach(() => {
    browser.removeMockModule('descartableModule');
    browser.removeMockModule('descartableModule2');
    browser.removeMockModule('descartableModule3');
    browser.removeMockModule('descartableModule4');
  });

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth, $httpBackend) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.loginByToken(permanentToken);
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "data" : ""
       });
      }));
      
  }
  function beginAuthenticatedSessionForUpgradePlan(){
    browser.addMockModule('descartableModule', () => angular
    .module('descartableModule', [])
    .run((jwtHelper, auth, $httpBackend) => {
      var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
      auth.loginByToken(permanentToken);
      $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200,
        {
          "noLimits": true,
          "dkimConfigurationRequired": true,
          "domainConfigurationRequired": true,
          "hasNotDeliveries": true
        });
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
          "default": "relay.com"
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
          "default": "relay.com"
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
          "default": "relay.com"
        });
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/domains\/test.com$/).respond(201, {
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
          "default": "relay.com"
        });
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/domains\/default$/).respond(200, {});
      }));
    var settings = new SettingsPage();

    //Act
    browser.get('/#/settings/domain-manager');
    var defaultDomain = settings.getDefaultDomain();
    settings.openEnabledNotDefaultDropdown();
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
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com" }, {name: "fromdoppler2.com" }, {name: "fromdoppler3.com", disabled: true }, {name: "makingsense.com", disabled: true }, {name: "makingsense12.com" }],
          "default": "relay.com"
        });
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/domains\/fromdoppler3.com$/, '{}').respond(201, {
          "result": true
        });
      }));
    var settings = new SettingsPage();
    browser.get('/#/settings/domain-manager');
    var countActivateButtons = settings.countDisableDomains();

    //Act
    settings.openDisabledDropDown();
    settings.clickActivateButton();

    //Assert
    expect(settings.countDisableDomains()).toBeLessThan(countActivateButtons);
  });

  /*
  it('should delete a domain correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com", disabled: true }, {name: "fromdoppler1.com"}, {name: "makingsense.com", disabled: true }],
          "default": "relay.com"
        });
        $httpBackend.whenDELETE(/\/accounts\/[\w|-]*\/domains\//).respond(200, {});
      }));
    var settings = new SettingsPage();

    //Act
    browser.get('/#/settings/domain-manager');
    var countDomainListItems = settings.countDomainListItems();
    
    // Move to scroll in the delete button
    browser.executeScript('window.scrollTo(94,188);');
    settings.clickFirstDeleteButton();

    //Assert
    expect(settings.countDomainListItems()).toBeLessThan(countDomainListItems);
  });*/
  it('should set as disabled domain', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains/).respond(200, {
          "domains": [{name: "relay.com"}, {name: "fromdoppler.com" }, {name: "makingsense.com", disabled: true }, {name: "makingsense12.com" }],
          "default": "relay.com"
        });
        $httpBackend.whenPUT(/\/accounts\/[\w|-]*\/domains\//, '{"disabled":true}').respond(200, {});
      }));
    var settings = new SettingsPage();
    browser.get('/#/settings/domain-manager');
    var countDisableDomains = settings.countDisableDomains();

    //Act
    settings.openEnabledNotDefaultDropdown();
    settings.clickDisableButton();

    //Assert
    expect(settings.countDisableDomains()).toBeGreaterThan(countDisableDomains);
  });

  it('should check the information of a domain we display', () => {
    // Arrange
    var domain = 'relay.com';
    var dkimSelector = 'test' + "._domainkey." + domain;
    var dkimPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC';
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains\/relay.com$/).respond(200, {
          "name": "relay.com",
          "dkim_ready": false,
          "spf_ready": false,
          "dkim_selector": "test",
          "dkim_public_key": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC",
          "_links": []
        });
      }));
    var settingsPage = new SettingsPage();
    var dkimPage = new DkimPage();

    // Act
    browser.get('/#/settings/domain-manager/dkim-configuration-help?d=relay.com');

    // Assert
    expect(dkimPage.getdKimDomainSelector()).toBe(dkimSelector);
    expect(dkimPage.getdKimDomainSelected()).toBe(domain);
    expect(dkimPage.getDkimPublicKey()).toBe('k=rsa; p=' + dkimPublicKey);

  });

  it('should check the information of a domain we display', () => {

    // Arrange
    var domain = 'relay.com';
    var dkimSelector = 'test' + "._domainkey." + domain;
    var dkimPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC';
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains$/).respond(200, {
          "domains": [{name: "relay.com", dkim_selector: "test", dkim_public_key: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC"}, {name: "fromdoppler.com" }, {name: "makingsense.com", disabled: true }, {name: "makingsense12.com" }],
          "default": "relay.com"
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains\/relay.com/).respond(200, {});
      }));
    var settingsPage = new SettingsPage();
    var dkimPage = new DkimPage();
    browser.get('/#/settings/domain-manager');

    //Act
    expect(settingsPage.isDkimInformationButtonDisplayed()).toBeTruthy();
  });

  it('should show api key correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/user\/apikeys/).respond(200, {
          "api_keys": [
            {
              "api_key": 'testApiKey'
            }
          ]
        });
      }));
    var settings = new ConnectionSettingsPage();

    //Act
    browser.get('/#/settings/connection-settings');

    //Assert
    expect(settings.getApiKey()).toEqual('testApiKey');
  });

  it('should copy api key to clipboard if browser supports it', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/user\/apikeys/).respond(200, {
          "api_keys": [
            {
              "api_key": 'testApiKey'
            }
          ]
        });
      }));

    var settings = new ConnectionSettingsPage();

    //Act
    browser.get('/#/settings/connection-settings');
    settings.clickCopyApiKey();

    // creating a new input element to test the pasted text
    browser.executeScript(function () {
        var el = document.createElement('input');
        el.setAttribute('id', 'testInput');

        document.getElementsByTagName('body')[0].appendChild(el);
    });
    var testInput = $("#testInput");
    testInput.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "v"));

    //Assert
    expect(testInput.getAttribute('value')).toEqual('testApiKey');
  });

  it('should show alert icons status', () => {
    // Arrange
    var domain = 'relay.com';
    var dkimSelector = 'test' + "._domainkey." + domain;
    var dkimPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC';
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains\/relay.com$/).respond(200, {
          "name": 'relay.com',
          "dkim_ready": false,
          "spf_ready": false,
          "dkim_selector": 'test',
          "dkim_public_key": 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC'
        });
      }));

    var dkimPage = new DkimPage();
    browser.get('/#/settings/domain-manager/dkim-configuration-help?d=relay.com');

    //Act
    expect(dkimPage.isAlertIconDisplayed()).toBeTruthy();
    expect(dkimPage.getDkimPublicKey()).toBe('k=rsa; p=' + dkimPublicKey);
    expect(dkimPage.getdKimDomainSelector()).toEqual(dkimSelector);
  });

  it('should show ok icons status', () => {
    // Arrange
    var domain = 'relay.com';
    var dkimSelector = 'test' + "._domainkey." + domain;
    var dkimPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC';
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains\/relay.com$/).respond(200, {
          "name": 'relay.com',
          "dkim_ready": true,
          "spf_ready": true,
          "dkim_selector": 'test',
          "dkim_public_key": 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC'
        });
      }));

    var dkimPage = new DkimPage();
    browser.get('/#/settings/domain-manager/dkim-configuration-help?d=relay.com');

    //Act
    expect(dkimPage.isOkIconDisplayed()).toBeTruthy();
    expect(dkimPage.getDkimPublicKey()).toBe('k=rsa; p=' + dkimPublicKey);
    expect(dkimPage.getdKimDomainSelector()).toEqual(dkimSelector);
  });

  it('should show the password form correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    var profilePage = new ProfilePage();

    //Act
    browser.get('/#/settings/my-profile');
    profilePage.togglePasswordTemplate();

    //Assert
    expect(profilePage.isPasswordFormVisible()).toBe(true);

    //Act
    profilePage.closePasswordTemplate();

    //Assert
    expect(profilePage.isPasswordFormNotVisible()).toBe(true);
  });

  it('should change the password correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule4', () => angular
      .module('descartableModule4', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenPUT(/\/password\/change/).respond(200, {
          "result": "We have change your password",
        });
      }));
    var profilePage = new ProfilePage();

    //Act
    browser.get('/#/settings/my-profile');
    profilePage.togglePasswordTemplate();
    profilePage.setOldPassword("Testing123");
    profilePage.setNewPassword("Testing1234");
    profilePage.setConfirmNewPassword("Testing1234");
    profilePage.clickSubmitPasswordForm();

    //Assert
    expect(profilePage.isPasswordFormVisible()).toBe(false);
    expect(profilePage.isChangePasswordSuccessMessageNotHidden()).toBe(true);
  });

  it('should change the language correctly', () => {
    // Arrange
    beginAuthenticatedSession();
    var profilePage = new ProfilePage();

    //Act
    browser.get('/#/settings/my-profile?lang=es');
    var userTextInSpanish = "LENGUAJE";
    var userTextInEnglish = "LANGUAGE";
    profilePage.clickChangeLangToEn();

    //Assert
    expect(profilePage.getLanguageLabelMessage()).toBe(userTextInEnglish);

    //Act
    profilePage.clickChangeLangToEs();

    //Assert
    expect(profilePage.getLanguageLabelMessage()).toBe(userTextInSpanish);
  });

  it('should show ok icon for Tracking Domain status', () => {
    // Arrange
    var domain = 'relay.com';
    var dkimSelector = 'test' + "._domainkey." + domain;
    var dkimPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC';
    var trackingDomain = 'test.relay.com';
    var cnameDomain = 'trk.relaytrk.com';
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains\/relay.com$/).respond(200, {
          "name": 'relay.com',
          "dkim_ready": true,
          "spf_ready": true,
          "dkim_selector": 'test',
          "dkim_public_key": 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC',
          "tracking_domain_ready": true,
          "tracking_domain": 'test.relay.com',
          "canonical_tracking_domain": 'trk.relaytrk.com'
        });
      }));

    var dkimPage = new DkimPage();
    browser.get('/#/settings/domain-manager/dkim-configuration-help?d=relay.com');

    //Act
    expect(dkimPage.isTrackingOkIconDisplayed()).toBeTruthy();
    expect(dkimPage.getTrackingName()).toEqual(trackingDomain);
    expect(dkimPage.getCnameDomain()).toEqual(cnameDomain);
  });

  it('should show alert icon for Tracking Domain status', () => {
    // Arrange
    var domain = 'relay.com';
    var dkimSelector = 'test' + "._domainkey." + domain;
    var dkimPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC';
    var trackingDomain = 'test.relay.com';
    var cnameDomain = 'trk.relaytrk.com';
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/domains\/relay.com$/).respond(200, {
          "name": 'relay.com',
          "dkim_ready": true,
          "spf_ready": true,
          "dkim_selector": 'test',
          "dkim_public_key": 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC',
          "tracking_domain_ready": false,
          "tracking_domain": 'test.relay.com',
          "canonical_tracking_domain": 'trk.relaytrk.com'
        });
      }));

    var dkimPage = new DkimPage();
    browser.get('/#/settings/domain-manager/dkim-configuration-help?d=relay.com');

    //Act
    expect(dkimPage.isTrackingAlertIconDisplayed()).toBeTruthy();
    expect(dkimPage.getTrackingName()).toEqual(trackingDomain);
    expect(dkimPage.getCnameDomain()).toEqual(cnameDomain);
  });

  it('should open the change plan dropdown', () => {
    //Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', ()=> angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        var emptyResponse = {
          'data': []
        }
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/plans$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan$/)
        .respond(200, emptyResponse);
      }));

      //Act
      browser.get('/#/settings/my-plan');
      var myPlanPage = new MyPlanPage();
      myPlanPage.clickChangePlanButton();

      //Assert
      expect(myPlanPage.isPricingChartContainerDisplayed()).toBeTruthy();
  });

  it('should show change plan button enabled', () => {
    //Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', ()=> angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        var emptyResponse = {
          'data': []
        }
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/plans$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan$/)
        .respond(200, emptyResponse);
      }));

      //Act
      browser.get('/#/settings/my-plan');
      var myPlanPage = new MyPlanPage();
      myPlanPage.clickChangePlanButton();

      //Assert
      expect(myPlanPage.isDisabledBasicPlanChangeButton()).not.toMatch('button--disabled');

  });

  it('should show change plan button disabled', () => {
    //Arrange
    beginAuthenticatedSessionForUpgradePlan();
    browser.addMockModule('descartableModule2', ()=> angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        var emptyResponse = {
          'data': []
        }
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/plans$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan$/)
        .respond(200, emptyResponse);
      }));

      //Act
      var myPlanPage = new MyPlanPage();
      browser.get('/#/settings/my-plan');
      myPlanPage.clickChangePlanButton();

      //Assert
      expect(myPlanPage.isDisabledBasicPlanChangeButton()).toMatch('button--disabled');

  });

  it('should show only one change plan button with require domain validation passed', () => {
    //Arrange
    beginAuthenticatedSessionForUpgradePlan();
    browser.addMockModule('descartableModule2', ()=> angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        var emptyResponse = {
          'data': []
        }
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/plans$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan$/)
        .respond(200, emptyResponse);
      }));

      //Act
      var myPlanPage = new MyPlanPage();
      browser.get('/#/settings/my-plan');
      myPlanPage.clickChangePlanButton();

      //Assert
      expect(myPlanPage.isOnlyOneButtonInBasicPlanContainer()).toEqual(1);

  });

  it('should show all the validation messages to upgrade the plan', () => {
    //Arrange
    beginAuthenticatedSessionForUpgradePlan();
    browser.addMockModule('descartableModule2', ()=> angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        var emptyResponse = {
          'data': []
        }
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/agreements\/current$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/plans$/)
        .respond(200, emptyResponse);
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/plan$/)
        .respond(200, emptyResponse);
      }));

      //Act
      var myPlanPage = new MyPlanPage();
      browser.get('/#/settings/my-plan');
      myPlanPage.clickChangePlanButton();

      //Assert
      expect(myPlanPage.isFirstMessageShowed()).not.toMatch('ng-hide');
      expect(myPlanPage.isSecondMessageShowed()).not.toMatch('ng-hide');
  });
});
