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
        console.log("initializingPromise cached", initializingPromise);
        return initializingPromise;
      }
      console.log("initializingPromise first time");
      var deferred = $q.defer();
      initializingPromise = deferred.promise;

      /*if (!$window.Clerk) {
        initializingPromise = null;
        deferred.reject('Clerk is not loaded');
        return deferred.promise;
      }*/
      
      $window.Clerk.load({
            afterSignInUrl : '/clerk-login',
        })
        .then(function() {
          deferred.resolve($window.Clerk);
        })
        .catch(function(error) {
          initializingPromise = null;
          console.error("Failed to load Clerk: " + error);
          deferred.reject('Failed to load Clerk: ' + error);
        });

      return deferred.promise;
    }

    function getUser() {
      return init().then(function(clerk) {
        return clerk.user;
      });
    }

    function getSession() {
      return init().then(function(clerk) {
        return clerk.session;
      });
    }

    function signOut() {
      return init().then(function(clerk) {
        return clerk.signOut();
      });
    }

    function isAuthenticated() {
      /*console.log("isAuthenticated called 1");
      return init().then(function(clerk) {
        console.log("isAuthenticated called 2", clerk);
        console.log("isAuthenticated status", !!clerk.session);
        return !!clerk.session;
      });*/
      console.log("isAuthenticated", $window.Clerk);
      return !!($window.Clerk && $window.Clerk.session);
    }    
    
    function openSignIn() {
      return init().then(function(clerk) {
        return clerk.openSignIn();
      });
    }
  }
})();
