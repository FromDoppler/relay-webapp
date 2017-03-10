describe('Settings Page', () => {

  var SettingsPage = require('./page-objects/settings-page').SettingsPage;

  afterEach(() => {
    browser.removeMockModule('descartableModule');
  });

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.saveToken(permanentToken);
      }));
  }

  it('should trigger correctly to show the add domain input', () => {
    // Arrange
    beginAuthenticatedSession();
    var settings = new SettingsPage();

    //Act
    browser.get('/#/settings/domain-manager');

    //Assert
    expect(settings.getDomainInputContainer().getAttribute('class')).not.toContain('active');
    expect(settings.getDomainInputContainer().getCssValue('height')).toEqual('0px');

    // Act
    settings.clickInputToggler();

    // Assert
    expect(settings.getDomainInputContainer().getAttribute('class')).toContain('active');
    expect(settings.getDomainInputContainer().getCssValue('height')).not.toEqual('0px');
  });
});
