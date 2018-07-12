class TemplatePage {
  constructor() {
    this._templateNameLabel = $("form .templates--information label[for='uName'");
    this._templateFromEmailLabel = $("form .templates--information label[for='uFromEmail'");
    this._templateFromNameLabel = $("form .templates--information label[for='uFromName'");
    this._templateSubjectLabel = $("form .templates--information label[for='uSubject'");
    this._templateEditorDescription = $("form .templates--edition label[for='uContent']");
    this._templateSaveButton = $('.button.button--medium');
    this._templateCompanyFooter = $('.company-footer');
    this._templateBodySection = $('#uContent');
    this._spanishFlag = $('.es_flag');
    this._englishFlag = $('.en_flag');
    this._templateNameInput = $('#uName');
    this._templateFromEmailInput = $('#uFromEmail');
    this._templateFromNameInput = $('#uFromName');
    this._templateSubjectInput = $('#uSubject');
    this._errorModal = $(".error-container");
  }

    getTemplateEditorDescriptionText() {
      return this._templateEditorDescription.getText();
    }

    isSaveButtonDisplayed() {
        return this._templateSaveButton.isDisplayed();
    }

    clickSaveTemplateButton() {
      this._templateSaveButton.click();
    }

    cleanTemplateBodySection() {
      this._templateBodySection.clear();
    }

    fillTemplateBodySection(text) {
      this._templateBodySection.sendKeys(text);
    }

    isInvalidTemplateBody() {
      return element(by.className('ng-invalid'));
    }

    clickSpanishFlag() {
      this._spanishFlag.click();
    }

    clickEnglishFlag() {
      this._englishFlag.click();
    }

    fillTemplateNameInput(text) {
      this._templateNameInput.click();
      this._templateNameInput.sendKeys(text);
    }

    fillTemplateFromEmailInput(text) {
      this._templateNameInput.click();
      this._templateFromEmailInput.sendKeys(text);
    }

    fillTemplateFromNameinput(text) {
      this._templateNameInput.click();
      this._templateFromNameInput.sendKeys(text);
    }

    fillTemplateSubjectInput(text) {
      this._templateNameInput.click();
      this._templateSubjectInput.sendKeys(text);
    }

    clearTemplateForm() {
      this._templateNameInput.clear();
      this._templateFromEmailInput.clear();
      this._templateFromNameInput.clear();
      this._templateSubjectInput.clear();
      this._templateBodySection.clear();
    }

    getTotalInvalidFields() {
      return element.all(by.className('ng-invalid')).count();
    }

    isErrorModalDisplayed() {
      return this._errorModal.isDisplayed();
    }
}
exports.TemplatePage = TemplatePage;