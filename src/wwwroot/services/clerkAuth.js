(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('clerkAuth', clerkAuth);

  clerkAuth.$inject = [
    '$window',
    '$q',
    '$rootScope'
  ];

  function clerkAuth($window, $q, $rootScope) {
    var clerk = {
      instance: null,
      user: null,
      session: null,
      isInitialized: false,
      
      // Methods
      getUser: getUser,
      getSession: getSession,
      signOut: signOut,
      isAuthenticated: isAuthenticated,
      openSignIn: openSignIn
    };

    var initializingPromise = null;

    init();
    return clerk;    
    
    function init() {
      if (initializingPromise) {
        return initializingPromise;
      }
      var deferred = $q.defer();
      initializingPromise = deferred.promise;

      if (!$window.Clerk) {
        initializingPromise = null;
        deferred.reject('Clerk is not loaded');
        return deferred.promise;
      }
      
      $window.Clerk.load({
            afterSignInUrl : '/clerk-login',
        })
        .then(function() {
          console.log("Clerk loaded", $window.Clerk);
          clerk.instance = $window.Clerk;

          // Set up Clerk event listeners
          clerk.instance.addListener(function(payload) {
            clerk.user = payload.user;
            clerk.session = payload.session;
            clerk.isInitialized = true;
            if (!$rootScope.$$phase) {
              $rootScope.$apply(); // Trigger Angular digest cycle
            }
          });

          deferred.resolve(clerk);
        })
        .catch(function(error) {
          initializingPromise = null;
          deferred.reject('Failed to load Clerk: ' + error);
        });

      return deferred.promise;
    }

    function getUser() {
      return clerk.user;
    }

    function getSession() {
      return clerk.session;
    }

    function signOut() {
      if (clerk.instance) {
        return clerk.instance.signOut();
      }
      return $q.reject('Clerk is not initialized');
    }

    function isAuthenticated() {
      console.log("isAuthenticated called");
      console.log("clerk.session", clerk.session);
      console.log("clerk status", !!clerk.session);
      console.log("clerk", clerk);
      return !!clerk.session;
    }    
    
    function openSignIn() {
      if (!clerk.instance) {
        return init().then(function() {
          return clerk.instance.openSignIn();
        });
      }
      return $q.when(clerk.instance.openSignIn());
    }
  }
})();
