(function () {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .controller('OtpValidationCtrl', OtpValidationCtrl);

    OtpValidationCtrl.$inject = [
        'clerk',
        'auth',
        '$rootScope',
        '$location',
        'utils',
        '$scope'
    ];

    function OtpValidationCtrl(clerk, auth, $rootScope, $location, utils, $scope) {
        var vm = this;
        vm.submitRegistration = submitRegistration;
        vm.otp = null;
        vm.resendCode = resendCode;
        vm.resendSuccess = false;
        vm.process = $location.search().process;

        function submitRegistration(form) {
            if (form.$invalid) {
                return;
            }

            clerk.verifyOtp(vm.otp, vm.process).then(function(res) {
                if (res.verified) {
                    auth.loginByToken(res.token);
                    $rootScope.loadLimits();
                    $location.path('/');
                    return;
                }

                if (res.codeIncorrect) {
                    utils.setServerValidationToField($scope, $scope.form.otp, 'code_incorrect');
                    return;
                }

                if (res.verificationExpired) {
                    utils.setServerValidationToField($scope, $scope.form.otp, 'code_expired');
                    return;
                }

                utils.setServerValidationToField($scope, $scope.form.otp, 'code_general_error');
            }).catch(function(err) {
                utils.setServerValidationToField($scope, $scope.form.otp, 'code_general_error');
            });
        }

        function resendCode() {
            clerk.resendOtp().then(function(res) {
                if (res.sent) {
                    vm.resendSuccess = true;
                    return;
                }

                utils.setServerValidationToField($scope, $scope.form.otp, 'code_resend_error');
            }).catch(function(err) {
                utils.setServerValidationToField($scope, $scope.form.otp, 'code_resend_error');
            });
        }
    }
})();