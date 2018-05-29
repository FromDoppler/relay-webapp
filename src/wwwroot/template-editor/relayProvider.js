(function() {

  'use strict';

  // Patch to hide exit options dropdown button
  var hideExitOptionsDropdown = false;

  angular
    .module("mseditor")
    .provider("relay", relayProvider)
    .config(function(relayProvider) {
      relayProvider.$get().hideDropdown();
    });

  function relayProvider() {
    this.$get = function() {
      return {
        hideDropdown: function() {
          angular.element(document).ready(function() {
            var mainController = document.querySelector('[ng-controller=MainCtrl]');
            var mainScope = angular.element(mainController).scope();
            mainScope.hideExitOptions = function() {
              return hideExitOptionsDropdown;
            };
            mainScope.$apply();
          });
        }
      };
    }
  }
})();