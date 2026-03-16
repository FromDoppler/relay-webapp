(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .directive('clerkUserButton', clerkUserButton);

  clerkUserButton.$inject = ['clerk', 'RELAY_CONFIG', 'auth'];

  function clerkUserButton(clerk, RELAY_CONFIG, auth) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        if (RELAY_CONFIG.useClerkAuthentication) {
          var container = angular.element('<div class="clerk-user-button-with-email" style="display:flex;align-items:center;gap:0.5rem;"></div>');
          var buttonHost = angular.element('<div></div>');
          var emailWrapper = angular.element('<p class="header--config-menu-trigger" style="margin:0"></p>');
          var emailSpan = angular.element('<span class="clerk-user-email"></span>');

          var email = auth.getUserName && auth.getUserName();
          if (email) {
            emailSpan.text(email);
          }

          emailWrapper.append(emailSpan);

          container.append(emailWrapper);
          container.append(buttonHost);
          element.empty();
          element.append(container);

          scope.$on('emailChanged', function (event, newEmail) {
            emailSpan.text(newEmail);
          });

          // Make email clickable to open Clerk menu
          emailWrapper.attr('tabindex', '0');
          emailWrapper.attr('title', 'Open user menu');
          emailWrapper.css('cursor', 'pointer');

          function openClerkMenu() {
            try {
              var trigger = buttonHost[0].querySelector('button, [role="button"]');
              if (trigger && typeof trigger.click === 'function') {
                trigger.click();
              }
            } catch (e) {}
          }

          emailWrapper.on('click', function (evt) {
            evt.preventDefault();
            openClerkMenu();
          });

          var profile = auth.getProfile();
          clerk.mountUserButton(buttonHost[0], { profile: profile });
        }
      }
    };
  }
})(); 