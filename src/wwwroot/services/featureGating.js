(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .factory('featureGating', featureGating);

  featureGating.$inject = ['$q', 'auth', 'clerk', 'RELAY_CONFIG'];

  function featureGating($q, auth, clerk, RELAY_CONFIG) {
    var STATUS_ALLOWED = 'allowed';
    var STATUS_BLOCKED_NEEDS_2FA = 'blocked-needs-2fa';

    return {
      STATUS_ALLOWED: STATUS_ALLOWED,
      STATUS_BLOCKED_NEEDS_2FA: STATUS_BLOCKED_NEEDS_2FA,
      evaluate: evaluate
    };

    function evaluate(featureName) {
      if (!auth.isFeatureGatedBy2Fa(featureName)) {
        return $q.when(STATUS_ALLOWED);
      }
      if (!RELAY_CONFIG.useClerkAuthentication) {
        return $q.when(STATUS_ALLOWED);
      }
      return clerk.hasTwoFactorEnabled().then(function (enabled) {
        return enabled ? STATUS_ALLOWED : STATUS_BLOCKED_NEEDS_2FA;
      });
    }
  }
})();
