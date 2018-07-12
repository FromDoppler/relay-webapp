describe('Template Page', () => {
  var TemplatePage = require('./page-objects/template-page').TemplatePage;
    
  afterEach(() => {
    browser.removeMockModule('descartableModule');
    browser.removeMockModule('descartableModule2');
    browser.removeMockModule('descartableModule3');
  })

  function beginAuthenticatedSession() {
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', [])
      .run((jwtHelper, auth) => {
        var permanentToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ';
        auth.loginByToken(permanentToken);
      }));
  }

  function setupEditTemplateResponse() {
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
        http://localhost:34751/accounts/1003/templates
        $httpBackend.whenGET(/\/accounts\/[\d|-]*\/templates/).respond(200, {
          "items": [
            {
              "from_name": "test",
              "from_email": "test@test.test",
              "subject": "test",
              "body": "Test content body",
              "name": "test",
              "id": "32e93fa4-c8f4-467a-a2bb-da95f72a27b4",
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

        $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*/).respond(200, {
          "message": "Template successfully updated",
          "_links": []
        });

        $httpBackend.whenPUT(/\/accounts\/[\d|-]*\/templates\/[\w|-]*\/body/).respond(200, {
          "message": "Template successfully updated",
          "_links": []
        });
      }
    ));
  }

  it('should show template form texts in edit mode in english', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/32e93fa4-c8f4-467a-a2bb-da95f72a27b4');
    setupEditTemplateResponse();

    var templatePage = new TemplatePage();
    var expectedTitleText = "Template Info";
    var expectedTemplateNameText = "Template name";
    var expectedFromEmailText = "From Email";
    var expectedFromNameText = "From Name";
    var expectedSubjectText = "Subject";
    var expectedTemplateEditorTitle = "Template Editor";
    var expectedTemplateEditorDescription = "Here's where you can create and edit your custom template.";

    // Act
    templatePage.clickEnglishFlag();
    var templateTitleText = templatePage.getTemplatePageTitleText();
    var templateNameText = templatePage.getTemplateNameLabelText();
    var templateFromEmailText = templatePage.getTemplateFromEmailLabelText();
    var templateFromNameText = templatePage.getTemplateFromNameLabelText();
    var templateSubjectText = templatePage.getTemplateSubjectLabelText();
    var templateEditorTitleText = templatePage.getTemplateEditorTitleText();
    var templateEditorDescriptionText = templatePage.getTemplateEditorDescriptionText();

    // Assert
    expect(templateTitleText).toBe(expectedTitleText);
    expect(templateNameText).toBe(expectedTemplateNameText);
    expect(templateFromEmailText).toBe(expectedFromEmailText);
    expect(templateFromNameText).toBe(expectedFromNameText);
    expect(templateSubjectText).toBe(expectedSubjectText);
    expect(templateEditorTitleText).toBe(expectedTemplateEditorTitle);
    expect(templateEditorDescriptionText).toBe(expectedTemplateEditorDescription);
  });

  it('should show template form texts in edit mode in spanish', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/32e93fa4-c8f4-467a-a2bb-da95f72a27b4');
    setupEditTemplateResponse();

    var templatePage = new TemplatePage();
    var expectedTitleText = "Información de la Plantilla";
    var expectedTemplateNameText = "Nombre de la Plantilla";
    var expectedFromEmailText = "Dirección de Correo del Remitente";
    var expectedFromNameText = "Nombre del Remitente";
    var expectedSubjectText = "Asunto";
    var expectedTemplateEditorTitle = "Edición de la Plantilla";
    var expectedTemplateEditorDescription = "Aquí podrás crear y editar tu plantilla personalizada.";

    // Act
    templatePage.clickSpanishFlag();
    var templateTitleText = templatePage.getTemplatePageTitleText();
    var templateNameText = templatePage.getTemplateNameLabelText();
    var templateFromEmailText = templatePage.getTemplateFromEmailLabelText();
    var templateFromNameText = templatePage.getTemplateFromNameLabelText();
    var templateSubjectText = templatePage.getTemplateSubjectLabelText();
    var templateEditorTitleText = templatePage.getTemplateEditorTitleText();
    var templateEditorDescriptionText = templatePage.getTemplateEditorDescriptionText();

    // Assert
    expect(templateTitleText).toBe(expectedTitleText);
    expect(templateNameText).toBe(expectedTemplateNameText);
    expect(templateFromEmailText).toBe(expectedFromEmailText);
    expect(templateFromNameText).toBe(expectedFromNameText);
    expect(templateSubjectText).toBe(expectedSubjectText);
    expect(templateEditorTitleText).toBe(expectedTemplateEditorTitle);
    expect(templateEditorDescriptionText).toBe(expectedTemplateEditorDescription);
  });

  it('should show the save template button in edit mode in english', () => {
    // Arrange
    beginAuthenticatedSession();
    browser.get('/#/templates/32e93fa4-c8f4-467a-a2bb-da95f72a27b4');
    setupEditTemplateResponse();

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
    setupEditTemplateResponse();

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
    setupEditTemplateResponse();
    var body = "Test content body";

    var templatePage = new TemplatePage();

    // Act
    templatePage.FillTemplateBodySection(body);
    templatePage.clickSaveTemplateButton();
    
    // Assert
    expect(browser.getCurrentUrl()).not.toContain('templates/');
  });

});