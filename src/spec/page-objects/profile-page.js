class ProfilePage {
  constructor() {
    this._waitTimeout = 5000;
    this._url = '/#/settings/my-profile';
    this._editPasswordButton = $('.password .icon.edit-icon');
    //this._passwordTemplate = $('.password .flex.three > span');
    this._closePasswordTemplateLink = $('#form_pass .confirm-icons--container a.cross');
    this._passwordFormContainer = $('.password');
    this._submitPasswordFormButton = $('#form_pass .confirm-icons--container button.tick-icon'); //
    this._oldPasswordInput = $('#oldPass');
    this._newPasswordInput = $('#pass');
    this._confirmNewPasswordInput = $('#confPassword');
    this._changePasswordSuccessMessage = $('.my-profile--banner.green');
  }

  elemHasClass(elem,classNameParam){
    var hasClass = elem
      .getAttribute('class')
      .then(function(className) {
        return className.indexOf(classNameParam) >= 0;
      });
      return hasClass.then(function (results) {
          return results;
      });
  }
  togglePasswordTemplate(){
    return this._editPasswordButton.click();
  }
  closePasswordTemplate(){
    return this._closePasswordTemplateLink.click();
  }
  clickSubmitPasswordForm(){
    return this._submitPasswordFormButton.click();
  }
  getPasswordFormContainer(){
    return this._passwordFormContainer;
  }
  isPasswordFormVisible(){
    return this.elemHasClass(this.getPasswordFormContainer(), 'expanded');
  }
  isPasswordFormNotVisible(){    
    return this.elemHasClass(this.getPasswordFormContainer(), 'collapsed');
  }
  setOldPassword(value) {
    return this._oldPasswordInput.sendKeys(value);
  }
  setNewPassword(value) {
    return this._newPasswordInput.sendKeys(value);
  }
  setConfirmNewPassword(value) {
    return this._confirmNewPasswordInput.sendKeys(value);
  }
  getChangePasswordSuccessMessage(){
    return this._changePasswordSuccessMessage;
  }
  isChangePasswordSuccessMessageNotHidden(){
    return this.elemHasClass(this.getChangePasswordSuccessMessage(), 'ng-hide');
  }
}
exports.ProfilePage = ProfilePage;
