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
            var decodedTkn = auth.decodeToken();
            if(decodedTkn) {
              var hrefAllowed;
              if(!attrs.href) {
                // Finds the first element inside the container and analize.
                hrefAllowed = element[0].querySelector('a').href.split("#")[1].match(decodedTkn.acceptedUrlsPattern) ? true : false;
              } else {              
                hrefAllowed = attrs.href.match(decodedTkn.acceptedUrlsPattern) ? true : false;
              }
              if(!hrefAllowed) {
                element.remove();
              }
            }
        }
      };
      return directive;
    }
  })();
  