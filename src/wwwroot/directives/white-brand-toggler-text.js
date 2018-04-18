(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('whiteBrandTogglerText', whiteBrandTogglerText);

      whiteBrandTogglerText.$inject = [
        'utils',
        '$window',
        '$rootScope'
    ];

    function whiteBrandTogglerText(utils, $window, $rootScope) {
        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs, ctrls) {
              var hasDifferentDomain = utils.hasDifferentDomain();
              var usersWithMultiAccount = utils.getMultiAccountUsers();              
              if(hasDifferentDomain) {
                var userWithMultiAccount = usersWithMultiAccount.reduce(function(user) {
                  var regex = new RegExp('\\b' + user.domain + '\\b');
                  if (regex.test($window.location.hostname)) {
                    return { companyName: user.companyName, logoName: user.logoName, domain: user.domain, companyLink: user.companyLink }
                  };
                });                
                if (!!userWithMultiAccount && element.parent().parent()[0].tagName == 'footer'.toUpperCase()) {
                  element.html("<a href="+ userWithMultiAccount.companyLink +" target='_blank'><svg width='60px' height='16px'><use href='/images/sprite.svg#doppler-icon-gire-logo-grey'></use></svg></a>");
                }
              }
              $rootScope.companyName = !!userWithMultiAccount ? userWithMultiAccount.companyName  : "Doppler Relay";
            }
          };
        return directive;
    }
})();
