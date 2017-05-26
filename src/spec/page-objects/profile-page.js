class ProfilePage {
  constructor() {
    this._url = '/#/settings/my-profile';
    this._passwordTemplate = $('#passwordTemplate');
    this._closePasswordTemplateLink = $('.my-profile--container .confirm-icons--container .cross');
    this._passwordForm = $('.my-profile--container .inputs--container');
    this._submitPasswordFormButton = $('.my-profile--container .inputs--container .confirm-icons--container span');
    this._oldPasswordInput = $('.my-profile--container .inputs--container #oldPass');
    this._newPasswordInput = $('.my-profile--container .inputs--container #pass');
    this._confirmNewPasswordInput = $('.my-profile--container .inputs--container #confPassword');
    this._changePasswordSuccessMessage = $('.my-profile--container .success');
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
    return this._passwordTemplate.click();
  }
  closePasswordTemplate(){
    return this._closePasswordTemplateLink.click();
  }
  clickSubmitPasswordForm(){
    return this._submitPasswordFormButton.click();
  }
  getPasswordFormContainer(){
    return this._passwordForm;
  }
  isPasswordFormVisible(){
    return this.elemHasClass(this.getPasswordFormContainer(), 'show');
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
  isChangePasswordSuccessMessageHidden(){
    return this.elemHasClass(this.getChangePasswordSuccessMessage(), 'ng-hide');
  }
}
exports.ProfilePage = ProfilePage;
