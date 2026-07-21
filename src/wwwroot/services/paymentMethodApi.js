(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('paymentMethodApi', paymentMethodApi);

  paymentMethodApi.$inject = ['$http', '$q', 'RELAY_CONFIG', 'auth'];

  function paymentMethodApi($http, $q, RELAY_CONFIG, auth) {
    var service = {
      submitPaymentMethod: submitPaymentMethod
    };

    return service;

    // TODO: doppler-billing-user-api validates JWTs issued by Doppler's own
    // login-service (fromdoppler.net/.com legacy), not the Clerk-issued JWT
    // that Relay uses today (see services/clerk.js). Using auth.getAuthToken()/
    // getUserName() here is a best-effort placeholder so the rest of the
    // EPRotect flow can be built and tested end-to-end; it must be confirmed
    // (and very likely replaced) with the backend team before enabling
    // useEprotect in QA/INT/PROD. This is the only function that needs to
    // change once that's resolved.
    function resolveDopplerBillingIdentity() {
      return $q.when(auth.getAuthToken()).then(function (jwtToken) {
        return {
          email: auth.getUserName(),
          jwtToken: jwtToken
        };
      });
    }

    function submitPaymentMethod(tokenizedData) {
      return resolveDopplerBillingIdentity().then(function (identity) {
        var url = RELAY_CONFIG.dopplerBillingUserApiUrl.replace(/\/$/, '')
          + '/accounts/' + encodeURIComponent(identity.email)
          + '/payment-methods/current';

        var formData = new FormData();
        angular.forEach(buildPayload(tokenizedData), function (value, key) {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        return $http({
          actionDescription: 'action_updating_payment_method_eprotect',
          method: 'PUT',
          url: url,
          data: formData,
          headers: {
            'Authorization': 'bearer ' + identity.jwtToken,
            'Content-Type': undefined
          },
          transformRequest: angular.identity
        });
      });
    }

    function buildPayload(tokenizedData) {
      return {
        ccHolderFullName: tokenizedData.cardHolderName,
        paymentMethodName: 'CC',
        worldPayLowValueToken: tokenizedData.worldPayLowValueToken,
        lastFourDigitsCCNumber: tokenizedData.lastFourDigitsCCNumber,
        firstSixDigitsCCNumber: tokenizedData.firstSixDigitsCCNumber,
        ccExpMonth: tokenizedData.ccExpMonth,
        ccExpYear: tokenizedData.ccExpYear,
        ccType: tokenizedData.ccType,
        idSelectedPlan: tokenizedData.idSelectedPlan
      };
    }
  }
})();
