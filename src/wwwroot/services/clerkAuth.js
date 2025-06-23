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

    init();
    return clerk;    
    
    function init() {
      var deferred = $q.defer();

      if (!$window.Clerk) {
        deferred.reject('Clerk is not loaded');
        return deferred.promise;
      }
      
      $window.Clerk.load({
            afterSignInUrl : '/clerk-login',
        })
        .then(function() {
          clerk.instance = $window.Clerk;
          clerk.user = clerk.instance.user;
          clerk.session = clerk.instance.session;
          clerk.isInitialized = true;

          // Set up Clerk event listeners
          clerk.instance.addListener(function(data) {
            clerk.user = data.user;
            clerk.session = data.session;
            if (!$rootScope.$$phase) {
              $rootScope.$apply(); // Trigger Angular digest cycle
            }
          });

          deferred.resolve(clerk);
        })
        .catch(function(error) {
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
