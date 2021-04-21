(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('settings', settings);

  settings.$inject = [
    '$http',
    '$q',
    'RELAY_CONFIG',
    'auth'
  ];
  function settings($http, $q, RELAY_CONFIG, auth) {
    var settingsService = {
      getDomains: getDomains,
      createOrEditDomain: createOrEditDomain,
      setDefaultDomain: setDefaultDomain,
      deleteDomain: deleteDomain,
      getUserApiKeys: getUserApiKeys,
      getDomain: getDomain,
      getPlansAvailable: getPlansAvailable,
      billingPayment: billingPayment,
      getCurrentPlanInfo: getCurrentPlanInfo,
      getStatusPlanInfo: getStatusPlanInfo,
      downgrade: downgrade,
      getNextPlan: getNextPlan,
      requestEmailChange: requestEmailChange,
      getCustomerDataByCuit: getCustomerDataByCuit,
      resubscribeEmailAddress: resubscribeEmailAddress
    };

    var plansCache = null;
    var currentPlanInfoCache = null;

    return settingsService;

    function createOrEditDomain (domainName, isDisabled, onExpectedError) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains/'
        + domainName;

      var data = {};
      if (isDisabled) {
        data['disabled'] = true;
      }

      return $http({
        actionDescription: 'action_adding_domain',
        tryHandleError: function(rejection){ return tryHandleErrorDomainManager(rejection, onExpectedError); },
        method: 'PUT',
        data: data,
        url: url
      });
    }

    function setDefaultDomain (domainName) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains'
        + '/default';

      return $http({
        actionDescription: 'action_setting_default_domain',
        method: 'PUT',
        data: {
          'name': domainName
        },
        url: url
      });
    }

    function deleteDomain (domainName, onExpectedError) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains/'
        + domainName;

      return $http({
        actionDescription: 'action_deleting_domain',
        tryHandleError: function(rejection){ return tryHandleErrorDomainManager(rejection, onExpectedError); },
        method: 'DELETE',
        data: {},
        url: url
      });
    }

    function tryHandleErrorDomainManager(rejection, onExpectedError) {
        if (rejection.status != 400 || !rejection.data || rejection.data.errorCode != 4) {
          return false; // not handled
        }
        return onExpectedError(rejection.data);
    }

    function tryHandleErrorBilling(rejection, onExpectedError) {
      if (rejection.status != 400) {
        return false; // not handled
      }
      return onExpectedError(rejection.data);
    }

    function getDomains() {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains';

      return $http({
        actionDescription: 'Getting domains',
        method: 'GET',
        url: url
      })
      .then(function (response) {
        return response;
      });
    }

    function getDomain(domainName) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains/' + domainName;

      return $http({
        actionDescription: 'Getting domain',
        method: 'GET',
        url: url
      });
    }

    function getUserApiKeys() {
      var url = RELAY_CONFIG.baseUrl
        + '/user/apikeys';

      return $http({
        actionDescription: 'Getting API keys',
        method: 'GET',
        url: url
      })
      .then(function (response) {
        return response.data.api_keys;
      });
    }

    function getPlansAvailable() {
      plansCache = plansCache || $http({
        actionDescription: 'action_getting_plans',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/plans'
      }).catch(function(reason) {
        plansCache = null;
        return $q.reject(reason);
      });

      return plansCache;
    }

    function billingPayment(agreement, onExpectedError) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/'
        + auth.getAccountName()
        + '/agreements'
        + '/current';

      return $http({
        actionDescription: 'action_billing_payment',
        tryHandleError: function(rejection){ return tryHandleErrorBilling(rejection, onExpectedError); },
        method: 'PUT',
        data: agreement,
        url: url
      });
    }

    function downgrade(agreement, onExpectedError) {
      var url = RELAY_CONFIG.baseUrl
      + '/accounts/'
      + auth.getAccountName()
      + '/agreements'
      + '/next';

      return $http({
        actionDescription: 'action_billing_downgrade',
        tryHandleError: function(rejection){ return tryHandleErrorBilling(rejection, onExpectedError); },
        method: 'PUT',
        data: agreement,
        url: url
      });
    }
    function getNextPlan() {
      return $http({
        actionDescription: 'action_getting_current_plan',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + auth.getAccountName() + '/agreements/next'
      });
    }

    function getCurrentPlanInfo() {
      return $http({
        actionDescription: 'action_getting_current_plan',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + auth.getAccountName() + '/agreements' + '/current'
      });
    }

    function getStatusPlanInfo() {
      return $http({
        actionDescription: 'action_getting_status_plan',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + auth.getAccountName() + '/status' + '/plan'
      });
    }

    function requestEmailChange(email, lang) {
      var url = RELAY_CONFIG.baseUrl
        + '/user/email/change'
        + '?lang='+ lang;

      return $http({
        actionDescription: 'action_requesting_email_change',
        method: 'POST',
        avoidStandarErrorHandling: true,
        data: {
          'user_email': email
        },
        url: url
      });
    }

    function getCustomerDataByCuit(cuit) {
      return $http({
        actionDescription: 'action_getting_customer_data',
        method: 'GET',
        url: RELAY_CONFIG.cuitServiceBaseUrl + '/taxinfo/by-cuit/' + cuit
      });
    }

    function resubscribeEmailAddress(subscriberEmail, reason, domainName, onExpectedError) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/subscribers/'
        + subscriberEmail
        + '/resubscribe';

      return $http({
        actionDescription: 'action_requesting_resubscribe_email_address',
        tryHandleError: function(rejection){ return tryHandleErrorOnResubscribe(rejection, onExpectedError); },
        method: 'POST',
        data: {
          'reason': reason,
          'domain': domainName
        },
        url: url
      });
    }

    function tryHandleErrorOnResubscribe(rejection, onExpectedError) {
      console.log(rejection);
      if (rejection.status == 400 || rejection.status == 429) {
        return onExpectedError(rejection.data);
      }
      return false; // not handled
  }
}
})();
