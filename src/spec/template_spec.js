describe('Template Page', () => {
  var TemplatePage = require('./page-objects/template-page').TemplatePage;
    
  afterEach(() => {
    browser.removeMockModule('descartableModule');
    browser.removeMockModule('descartableModule2');
    browser.removeMockModule('descartableModule3');
    browser.removeMockModule('descartableModule4');
    browser.removeMockModule('descartableModule5');
    browser.removeMockModule('descartableModule6');
    browser.removeMockModule('descartableModule7');
  })

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.loginByToken(permanentToken);
      }));
  }

  function setupTemplateResponse() {
    browser.addMockModule('descartableModule2', () => angular
      .module('descartableModule2', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenGET(/\/accounts\/[\d|-]*\/templates\/[\w|-]*/).respond(200, {
          "from_name": "test",
          "from_email": "test@test.test",
          "subject": "test subject",
          "body": "test body",
          "name": "test name",
          "id": "32e93fa4-c8f4-467a-a2bb-da95f72a27b4",
          "last_updated": "2018-07-12T13:28:23Z",
          "created_at": "2018-07-12T13:27:40Z",
          "bodyType": "rawHtml",
          "_links": []
        });

        $httpBackend.whenGET(/\/accounts\/[\d|-]*\/templates\/[\w|-]*\/body/).respond(200, {
          "name": "test",
          "html": "test",
          "_links": []
        });
          
        $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
          "noLimits": true,
          "dkimConfigurationRequired": false,
          "domainConfigurationRequired": false,
          "_links": []
        });
      }
    ));
  }

  function setupCreateTemplateSuccessResponse() {
    browser.addMockModule('descartableModule3', () => angular
    .module('descartableModule3', ['ngMockE2E'])
    .run($httpBackend => {

      $httpBackend.whenGET(/\/accounts\/[\d|-]*\/templates/).respond(200, {
        "items": [
          {
            "from_name": "test name",
            "from_email": "test@test.test",
            "subject": "test subject",
            "body": "Template body test",
            "name": "Test template",
            "id": "1169ab26-78dc-4474-a8c2-e1f02f6c05ed",
            "last_updated": "2018-07-12T15:45:19Z",
            "created_at": "2018-07-12T13:27:40Z",
            "bodyType": "rawHtml",
            "_links": []
          }
        ],
        "pageSize": 200,
        "itemsCount": 1,
        "currentPage": 1,
        "pagesCount": 1,
        "_links": []
      });

      $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*\/body/).respond(200, {
        "message": "Template successfully updated",
        "_links": []
      });

      $httpBackend.whenPOST(/\/accounts\/[\d|-]*\/templates/).respond(200, {
        "createdResourceId": "1169ab26-78dc-4474-a8c2-e1f02f6c05ed",
        "message": "Template successfully created",
        "_links": []
      });
    }));
  }

  function setupCreateNewTemplateFailResponse() {
    browser.addMockModule('descartableModule4', () => angular
    .module('descartableModule4', ['ngMockE2E'])
    .run($httpBackend => {

      $httpBackend.whenGET(/\/accounts\/[\d|-]*\/templates/).respond(200, {
        "items": [
          {
            "from_name": "test name",
            "from_email": "test@test.test",
            "subject": "test subject",
            "body": "Template body test",
            "name": "Test template",
            "id": "1169ab26-78dc-4474-a8c2-e1f02f6c05ed",
            "last_updated": "2018-07-12T15:45:19Z",
            "created_at": "2018-07-12T13:27:40Z",
            "bodyType": "rawHtml",
            "_links": []
          }
        ],
        "pageSize": 200,
        "itemsCount": 1,
        "currentPage": 1,
        "pagesCount": 1,
        "_links": []
      });

      $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*\/body/).respond(200, {
        "message": "Template successfully updated",
        "_links": []
      });

      $httpBackend.whenPOST(/\/accounts\/[\d|-]*\/templates/).respond(500, {
        "createdResourceId": "1169ab26-78dc-4474-a8c2-e1f02f6c05ed",
        "message": "Template creation fail",
        "_links": []
      });
    }));
  }

  function setupTemplateListSuccessResponse() {
    browser.addMockModule('descartableModule5', () => angular
    .module('descartableModule5', ['ngMockE2E'])
    .run($httpBackend => {

      $httpBackend.whenGET(/\/accounts\/[\d|-]*\/templates/).respond(200, {
        "items": [
          {
            "from_name": "test name",
            "from_email": "test@test.test",
            "subject": "test subject",
            "body": "Template body test",
            "name": "Test template",
            "id": "1169ab26-78dc-4474-a8c2-e1f02f6c05ed",
            "last_updated": "2018-07-12T15:45:19Z",
            "created_at": "2018-07-12T13:27:40Z",
            "bodyType": "rawHtml",
            "_links": []
          }
        ],
        "pageSize": 200,
        "itemsCount": 1,
        "currentPage": 1,
        "pagesCount": 1,
        "_links": []
      });
    }));
  }

  function setupEditTemplateSuccessResponse() {
    browser.addMockModule('descartableModule6', () => angular
    .module('descartableModule6', ['ngMockE2E'])
    .run($httpBackend => {

      $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*/).respond(200, {
        "message": "Template successfully updated",
        "_links": []
      });
    
      $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*\/body/).respond(200, {
        "message": "Template successfully updated",
        "_links": []
      });
    }));
  }

  function setupEditTemplateErrorResponse() {
    browser.addMockModule('descartableModule7', () => angular
    .module('descartableModule7', ['ngMockE2E'])
    .run($httpBackend => {

      $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*/).respond(500, {
        "message": "Template successfully updated",
        "_links": []
      });
    
      $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*\/body/).respond(500, {
        "message": "Template successfully updated",
        "_links": []
      });
    }));
  }

  it('should show the save template button in edit mode', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/32e93fa4-c8f4-467a-a2bb-da95f72a27b4');
    setupTemplateResponse();

    var templatePage = new TemplatePage();

    // Act
    var saveTemplateButtonIsDisplayed = templatePage.isSaveButtonDisplayed();

    // Assert
    expect(saveTemplateButtonIsDisplayed).toBeTruthy();
  });

  it('should not allow to save template with empty body content', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/32e93fa4-c8f4-467a-a2bb-da95f72a27b4');
    setupTemplateResponse();

    var templatePage = new TemplatePage();

    // Act
    templatePage.cleanTemplateBodySection();
    templatePage.clickSaveTemplateButton();

    // Assert
    expect(templatePage.isInvalidTemplateBody()).toBeTruthy();
  });

  it('should save template in edit mode and redirect to templates list', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/32e93fa4-c8f4-467a-a2bb-da95f72a27b4');
    setupTemplateResponse();
    setupEditTemplateSuccessResponse();
    setupTemplateListSuccessResponse();
    var body = "Test content body";
    var templatePage = new TemplatePage();

    // Act
    templatePage.fillTemplateBodySection(body);
    templatePage.clickSaveTemplateButton();
    
    // Assert
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/templates');
  });

  it('should show error and do not redirect when save fails', () => {
    // Arrange
    beginAuthenticatedSession();
    var templateUrl = '/#/templates/32e93fa4-c8f4-467a-a2bb-da95f72a27b4';
    browser.get(templateUrl);
    setupTemplateResponse();
    setupEditTemplateErrorResponse();
    setupTemplateListSuccessResponse();
    var body = "Test content body";
    var templatePage = new TemplatePage();

    // Act
    templatePage.fillTemplateBodySection(body);
    templatePage.clickSaveTemplateButton();
    
    // Assert
    expect(templatePage.isErrorModalDisplayed()).toBeTruthy();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + templateUrl);

  });

  it('should show error and do not redirect when create template fails', () => {
    // Arrange
    beginAuthenticatedSession();
    var newTemplateUrl = '/#/templates/new';
    browser.get(newTemplateUrl);
    setupTemplateResponse();
    setupCreateNewTemplateFailResponse();
    setupTemplateListSuccessResponse();
    var templateName = "Test template";
    var templateFromEmail = "test@test.test";
    var templateFromName = "test name";
    var templateSubject = "test subject";
    var templateBody = "Template body test"
    var templatePage = new TemplatePage();

    // Act
    templatePage.fillTemplateNameInput(templateName);
    templatePage.fillTemplateFromEmailInput(templateFromEmail);
    templatePage.fillTemplateFromNameinput(templateFromName);
    templatePage.fillTemplateSubjectInput(templateSubject);
    templatePage.fillTemplateBodySection(templateBody);
    templatePage.clickSaveTemplateButton();
    
    // Assert
    expect(templatePage.isErrorModalDisplayed()).toBeTruthy();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + newTemplateUrl);
  });

  it('should redirect to template list after successfully save', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/new');
    setupTemplateResponse();
    setupCreateTemplateSuccessResponse();
    setupTemplateListSuccessResponse();
    var templateName = "Test template";
    var templateFromEmail = "test@test.test";
    var templateFromName = "test name";
    var templateSubject = "test subject";
    var templateBody = "Template body test"
    var templatePage = new TemplatePage();

    // Act
    templatePage.fillTemplateNameInput(templateName);
    templatePage.fillTemplateFromEmailInput(templateFromEmail);
    templatePage.fillTemplateFromNameinput(templateFromName);
    templatePage.fillTemplateSubjectInput(templateSubject);
    templatePage.fillTemplateBodySection(templateBody);
    templatePage.clickSaveTemplateButton();
    
    // Assert
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/templates');
  });

  it('should not allow to create a new template when the form is not completed', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/new');
    setupTemplateResponse();
    var expectedTotalInvalidFields = 4;
    var templatePage = new TemplatePage();

    // Act
    templatePage.clearTemplateForm();
    templatePage.clickSaveTemplateButton();
    
    // Assert
    expect(templatePage.getTotalInvalidFields()).toBe(expectedTotalInvalidFields);
  });

  it('should not show the mseditor button when the token forceMseditor is null', () => {
    // Arrange
    beginAuthenticatedSession();
    var templatePage = new TemplatePage();

    // Act
    browser.get('/#/templates/new');

    // Assert
    expect(templatePage.isTemplateHtmlRawInputDisplayed()).toBe(true);
    expect(templatePage.isTemplateMsEditorInputDisplayed()).toBe(false);
  });

  it('should show the mseditor button when the token forceMseditor is not null', () => {
    // Arrange
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1MzM3MzMxNzQsImV4cCI6MTUzNjMyNTE3NCwiaWF0IjoxNTMzNzMzMTc0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjo3NTI2NiwidW5pcXVlX25hbWUiOiJjZ2lhZ2FudGUrNzdAbWFraW5nc2Vuc2UuY29tIiwicmVsYXlfYWNjb3VudHMiOlsiY2dpYWdhbnRlIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSIsImltcGVyc29uYXRlZF9ieSI6bnVsbCwiZm9yY2VfbXNlZGl0b3IiOnRydWV9.bjfgSg803yKZ5w4_vAu0xERqILkf-a4XBuEc8PlrvbwOqwovtwt20p5IUYvPY7auROG7Sm8o5IqP1D7sUFAXlYeXNXihUhkoM-HnMmUtx94JCkjJeLxueFMSkYPcqPb2ckeLTZukzeILf1o-rkrP65-yddoTSXXBY3YaXK246oeN49lelKldUUcjFSc_1c2s030xiY7oVdY-xjYXJMBfvdyWmzcm2vzn6HWoFQCBIE_iqMw_h5HhSwADRFE7InEmsbLhw8jfvEmWwWnC4iOJNpmPc-tFqEuxdJ0MX_YHv4RlACybtM6mNlTKziI4mv7GlhUpXRaGfWBJtpGgweFtuw';
        auth.loginByToken(permanentToken);
      }));
    var templatePage = new TemplatePage();

    // Act
    browser.get('/#/templates/new');

    // Assert
    expect(templatePage.isTemplateHtmlRawInputDisplayed()).toBe(false);
    expect(templatePage.isTemplateMsEditorInputDisplayed()).toBe(true);
  });
});