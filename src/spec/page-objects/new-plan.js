class MyPlanPage {
    constructor() {
      this._url = '/#/settings/my-plan';
      this._changePlanButton = $('.button.button--small.ng-binding.active');
      this._pricingChartContainer = $('.pricing-chart--container');
      this._basicPlanChangeButton = $('.basic .button.show');
      this._proPlanChangeButton = $('.pro .button.show');
      this._basicPlanChangeButtons = element.all(by.css('.basic .button.show'));
      this._proPlanChangeButtons = element.all(by.css('.pro .button.show'));
      this._planValidationMessages = element.all(by.css('.arrow--box-up ol li'));
    }

    beginAuthenticatedSession() {
        browser.addMockModule('descartableModule', () => angular
          .module('descartableModule', [])
          .run((jwtHelper, auth, $httpBackend) => {
            var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
            auth.loginByToken(permanentToken);
            $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200,
              {
                "noLimits": true,
                "dkimConfigurationRequired": true,
                "endDate": "2018-04-25T13:03:16Z",
                "domainConfigurationRequired": true,
                "hasNotDeliveries": true
              });
          }));
    }

    clickChangePlanButton(){
      return this._changePlanButton.click();
    }

    isPricingChartContainerDisplayed(){
        return this._pricingChartContainer.isDisplayed();
    }

    isDisabledBasicPlanChangeButton(){
        return this._basicPlanChangeButton.getAttribute('class');
    }

    isDisabledProPlanChangeButton(){
        return this._proPlanChangeButton.getAttribute('class');
    }

    isOnlyOneButtonInBasicPlanContainer(){
        return this._basicPlanChangeButtons.count().then(function(count){
          return count;
        });
    }

    isOnlyOneButtonInProPlanContainer(){
      return this._proPlanChangeButtons.count().then(function(count){
        return count;
      });
    }

    isFirstMessageShowed(){
      return this._planValidationMessages.get(0).getAttribute('class');
    }

    isSecondMessageShowed(){
      return this._planValidationMessages.get(2).getAttribute('class');
    }
  }
  exports.MyPlanPage = MyPlanPage;
  