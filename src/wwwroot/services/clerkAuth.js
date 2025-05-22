(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('clerkAuth', clerkAuth);

  clerkAuth.$inject = ['$q', '$window'];

  function clerkAuth($q, $window) {
    var service = {
      initialize: initialize,
      isAuthenticated: isAuthenticated,
      getUser: getUser,
      signIn: signIn,
      signOut: signOut
    };

    return service;

    function initialize() {
      return $q(function(resolve, reject) {
        if ($window.Clerk) {
          $window.Clerk.load()
            .then(function() {
              resolve();
            })
            .catch(function(error) {
              reject(error);
            });
        } else {
          reject(new Error('Initialize - Clerk not loaded'));
        }
      });
    }

    function isAuthenticated() {
      return $window.Clerk && $window.Clerk.user !== null;
    }

    function getUser() {
      return $window.Clerk ? $window.Clerk.user : null;
    }

    function signIn() {
      return $q(function(resolve, reject) {
        if ($window.Clerk) {
          $window.Clerk.openSignIn()
            .then(function() {
              resolve();
            })
            .catch(function(error) {
              reject(error);
            });
        } else {
          reject(new Error('SignIn - Clerk not loaded'));
        }
      });
    }

    function signOut() {
      return $q(function(resolve, reject) {
        if ($window.Clerk) {
          $window.Clerk.signOut()
            .then(function() {
              resolve();
            })
            .catch(function(error) {
              reject(error);
            });
        } else {
          reject(new Error('SignOut - Clerk not loaded'));
        }
      });
    }
  }
})(); 