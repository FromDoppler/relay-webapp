(function () {
  'use strict';

  angular
    .module('dopplerRelay').constant('constants', {
      STATUS_QUEUED: 'queued',
      STATUS_SENT: 'sent',
      STATUS_REJECTED: 'rejected',
      STATUS_RETRYING: 'retrying',
      STATUS_INVALID: 'invalid',
      STATUS_DROPPED: 'dropped',
      URLS: {
        MY_BILLING_INFORMATION: 'settings/my-billing-information'
      }
    });
})();
