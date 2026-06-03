(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .factory('featureGating', featureGating);

  featureGating.$inject = ['$q', 'auth', 'clerk', 'RELAY_CONFIG'];

  function featureGating($q, auth, clerk, RELAY_CONFIG) {
    var STATUS_ALLOWED = 'allowed';
    var STATUS_BLOCKED_NEEDS_2FA = 'blocked-needs-2fa';

    var DEFAULT_2FA_GATED = {
      update_email: true,
      manage_apikeys: true
    };

    return {
      STATUS_ALLOWED: STATUS_ALLOWED,
      STATUS_BLOCKED_NEEDS_2FA: STATUS_BLOCKED_NEEDS_2FA,
      isGated: isGated,
      evaluate: evaluate
    };

    function isGated(featureName) {
      var override = auth.getFeature2FaOverride(featureName);
      if (override === true || override === false) {
        return override;
      }
      return DEFAULT_2FA_GATED[featureName] === true;
    }

    function evaluate(featureName) {
      if (!isGated(featureName)) {
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
