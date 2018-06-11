describe('Reports page', () => {
  var ReportsPage = require('./page-objects/reports-page').ReportsPage;

  afterEach(() => {
    // each spec should remove registered modules
    browser.removeMockModule('descartableModule');
    browser.removeMockModule('descartableModule2');
  });

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.loginByToken(permanentToken);
      }));
  }

  it('should have dropped deliveries count', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/events\/(by_hour|by_day)/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/deliveries/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/deliveries\/(by_hour|by_day)/).respond(200, {
          "items": [ { "dropped": 3 }, { "dropped": 2 } ]
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "daily": {
            "limit": 400,
            "remaining": 400,
            "reset": "2017-09-16T00:00:00Z"
          },
          "hourly": {
            "limit": 200,
            "remaining": 200,
            "reset": "2017-09-15T16:00:00Z"
          }
        });
      }));
    var reportsPage = new ReportsPage();

    // Act
    browser.get('/#/reports');

    // Assert
    expect(reportsPage.getDroppedEl()).toEqual('5');
  });

  it('should have 0 as sum of dropped deliveries when all statistics items have 0 dropped deliveries', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/events\/(by_hour|by_day)/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/deliveries/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/deliveries\/(by_hour|by_day)/).respond(200, {
          "items": [ { "dropped": 0 }, { "dropped": 0 } ]
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "daily": {
            "limit": 400,
            "remaining": 400,
            "reset": "2017-09-16T00:00:00Z"
          },
          "hourly": {
            "limit": 200,
            "remaining": 200,
            "reset": "2017-09-15T16:00:00Z"
          }
        });
      }));
    var reportsPage = new ReportsPage();

    // Act
    browser.get('/#/reports');

    // Assert
    expect(reportsPage.getDroppedEl()).toEqual('0');
  });

  it('should have 0 as sum of dropped deliveries when there are not statistics items', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/events\/(by_hour|by_day)/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/deliveries/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/deliveries\/(by_hour|by_day)/).respond(200, {
          "items": [{'total': 4, 'sent': 1, 'dropped': 1 }, {'total': 6, 'sent': 4, 'dropped': 2 }]
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "daily": {
            "limit": 400,
            "remaining": 400,
            "reset": "2017-09-16T00:00:00Z"
          },
          "hourly": {
            "limit": 200,
            "remaining": 200,
            "reset": "2017-09-15T16:00:00Z"
          }
        });
      }));
    var reportsPage = new ReportsPage();

    // Act
    browser.get('/#/reports');

    // Assert
    expect(reportsPage.getDroppedEl()).toEqual('3');
    expect(reportsPage.getDeliverabilityPercentage()).toEqual('50.00%');
  });

  it('should calculate deliverability correctly when not exist dropped deliveries statistics items', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/events\/(by_hour|by_day)/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/deliveries/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/deliveries\/(by_hour|by_day)/).respond(200, {
          "items": [{ 'total': 4, 'sent': 2, 'dropped': 0 }, { 'total': 6, 'sent': 6, 'dropped': 0 }]
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "daily": {
            "limit": 400,
            "remaining": 400,
            "reset": "2017-09-16T00:00:00Z"
          },
          "hourly": {
            "limit": 200,
            "remaining": 200,
            "reset": "2017-09-15T16:00:00Z"
          }
        });
      }));
    var reportsPage = new ReportsPage();

    // Act
    browser.get('/#/reports');

    // Assert
    expect(reportsPage.getDroppedEl()).toEqual('0');
    expect(reportsPage.getDeliverabilityPercentage()).toEqual('80.00%');
  });

  it('should show the daily limits for accounts that have limits ', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/events\/(by_hour|by_day)/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/deliveries/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/deliveries\/(by_hour|by_day)/).respond(200, {
          "items": [{ 'total': 4, 'sent': 2, 'dropped': 0 }, { 'total': 6, 'sent': 6, 'dropped': 0 }]
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "daily": {
            "limit": 400,
            "remaining": 400,
            "reset": "2017-09-16T00:00:00Z"
          },
          "hourly": {
            "limit": 200,
            "remaining": 200,
            "reset": "2017-09-15T16:00:00Z"
          }
        });
      }));
    var reportsPage = new ReportsPage();

    // Act
    browser.get('/#/reports');

    // Assert
    expect(reportsPage.isMaxRateDailyLimitDisplayed()).toEqual(true);
  });

  it('should not show the daily limits for accounts that do not have limits', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/events\/(by_hour|by_day)/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/deliveries/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/deliveries\/(by_hour|by_day)/).respond(200, {
          "items": [{ 'total': 4, 'sent': 2, 'dropped': 0 }, { 'total': 6, 'sent': 6, 'dropped': 0 }]
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "noLimits": true,
        });
      }));
    var reportsPage = new ReportsPage();

    // Act
    browser.get('/#/reports');

    // Assert
    expect(reportsPage.isMaxRateDailyLimitDisplayed()).toEqual(false);
  });

  it('should show the daily limits for accounts that has zero limits', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.addMockModule('descartableModule2', () => angular
      // This code will be executed in the browser context,
      // so it cannot access variables from outside its scope
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/events\/(by_hour|by_day)/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/deliveries/).respond(200, {
          "items": []
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/statistics\/deliveries\/(by_hour|by_day)/).respond(200, {
          "items": [{ 'total': 4, 'sent': 2, 'dropped': 0 }, { 'total': 6, 'sent': 6, 'dropped': 0 }]
        });
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "daily": {
            "limit": 0,
            "remaining": 0,
            "reset": "2017-09-16T00:00:00Z"
          }
        });
      }));
    var reportsPage = new ReportsPage();

    // Act
    browser.get('/#/reports');

    // Assert
    expect(reportsPage.isMaxRateDailyLimitDisplayed()).toEqual(true);
    expect(reportsPage.getDailyLimitNumber()).toEqual('0');
  });
});
