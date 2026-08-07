(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .directive('eprotectPayframe', eprotectPayframe);

  eprotectPayframe.$inject = ['$window', '$document', '$interval', '$timeout', '$q', '$translate', 'eprotect'];

  var MAX_INIT_ATTEMPTS = 50;
  var INIT_RETRY_MS = 100;

  function eprotectPayframe($window, $document, $interval, $timeout, $q, $translate, eprotect) {
    var directive = {
      restrict: 'E',
      scope: {
        onReady: '&'
      },
      template: '<div class="eprotect-payframe-container"></div>',
      link: link
    };
    return directive;

    function link(scope, element) {
      var divId = 'eprotect-payframe-' + scope.$id;
      element.find('div').attr('id', divId);

      var client = null;
      var pendingRequest = null;
      var pollPromise = null;

      eprotect.loadScript().then(startPolling, function () {
        notifyReady(true);
      });

      function startPolling() {
        var attempts = 0;
        pollPromise = $interval(function () {
          attempts++;
          var payframeElement = $document[0].getElementById(divId);
          if ($window.EprotectIframeClient && payframeElement) {
            $interval.cancel(pollPromise);
            pollPromise = null;
            initializeClient();
          } else if (attempts >= MAX_INIT_ATTEMPTS) {
            $interval.cancel(pollPromise);
            pollPromise = null;
            console.error('Failed to initialize EprotectIframeClient after', MAX_INIT_ATTEMPTS, 'attempts');
            notifyReady(true);
          }
        }, INIT_RETRY_MS);
      }

      function initializeClient() {
        try {
          var config = eprotect.buildConfig(divId, payframeCallback, angular.bind($translate, $translate.instant));
          client = new $window.EprotectIframeClient(config);
          notifyReady(false);
        } catch (error) {
          console.error('Error initializing EprotectIframeClient:', error);
          notifyReady(true);
        }
      }

      function payframeCallback(response) {
        if (pendingRequest) {
          var toResolve = pendingRequest;
          pendingRequest = null;
          $timeout(function () {
            toResolve.resolve(response);
          });
        }
      }

      function requestPaypageRegistrationId() {
        if (!client) {
          return $q.reject(new Error('Payment form not ready'));
        }
        var deferred = $q.defer();
        pendingRequest = deferred;
        var timestamp = Date.now().toString();
        client.getPaypageRegistrationId({ id: timestamp, orderId: 'order_' + timestamp });
        return deferred.promise;
      }

      function isReady() {
        return !!client;
      }

      function notifyReady(hasError) {
        scope.onReady({
          result: {
            api: hasError ? null : { requestPaypageRegistrationId: requestPaypageRegistrationId, isReady: isReady },
            error: !!hasError
          }
        });
      }

      function handleWindowMessage(event) {
        if (event.data === 'checkoutWithEnter' && client) {
          var timestamp = Date.now().toString();
          client.getPaypageRegistrationId({ id: timestamp, orderId: 'order_' + timestamp });
        }
      }
      $window.addEventListener('message', handleWindowMessage);

      scope.$on('$destroy', function () {
        $window.removeEventListener('message', handleWindowMessage);
        if (pollPromise) {
          $interval.cancel(pollPromise);
        }
        pendingRequest = null;
        client = null;
      });
    }
  }
})();
