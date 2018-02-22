(function () {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .directive('linkToggler', linkToggler);
  
      linkToggler.$inject = [
      "auth"
    ];
  
    function linkToggler(auth) {
      var directive = {
        restrict: 'A',
        link: function (scope, element, attrs, ctrls) {
          var hrefAllowed;
          if(!attrs.href) {
            // Finds the first element inside the container and analize.
            hrefAllowed = auth.isUrlAllowed(element[0].querySelector('a').href.split("#")[1]);
          } else {              
            hrefAllowed = auth.isUrlAllowed(attrs.href);
          }
          if(!hrefAllowed) {
            element.remove();
          }
        }
      };
      return directive;
    }
  })();
  