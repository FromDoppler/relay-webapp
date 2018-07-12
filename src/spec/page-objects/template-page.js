class TemplatePage {
    constructor() {
        this._templateNameLabel = $("form .templates--information .information-fields label[for='uName'");
        this._templateFromEmailLabel = $("form .templates--information .information-fields label[for='uFromEmail'");
        this._templateFromNameLabel = $("form .templates--information .information-fields label[for='uFromName'");
        this._templateSubjectLabel = $("form .templates--information .information-fields label[for='uSubject'");
        this._templateEditorDescription = $("form .templates--edition label[for='uContent']");
        this._templatePageTitle = $('form .templates--information h2');
        this._templateIdText = $('form .templates--information h4');
        this._templateEditorTitle = $('form .templates--edition h2');
        this._templateSaveButton = $('.button.button--medium');
        this._templateCompanyFooter = $('.company-footer');
        this._templateBodySection = $('#uContent');
        this._spanishFlag = $('.es_flag');
        this._englishFlag = $('.en_flag');
    }

    getTemplatePageTitleText() {
        return this._templatePageTitle.getText();
    }

    getTemplateIdText() {
        return this._templateIdText.getText();
    }
    
    getTemplateNameLabelText() {
        return this._templateNameLabel.getText();
    }

    getTemplateFromEmailLabelText() {
        return this._templateFromEmailLabel.getText();
    }

    getTemplateFromNameLabelText() {
        return this._templateFromNameLabel.getText();
    }

    getTemplateSubjectLabelText() {
        return this._templateSubjectLabel.getText();
    }

    getTemplateEditorTitleText() {
        return this._templateEditorTitle.getText();
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

    FillTemplateBodySection(text) {
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
}
exports.TemplatePage = TemplatePage;