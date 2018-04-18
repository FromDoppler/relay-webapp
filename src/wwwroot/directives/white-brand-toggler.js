(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('whiteBrandToggler', whiteBrandToggler);

      whiteBrandToggler.$inject = [
        'utils',
        '$window'
    ];

    function whiteBrandToggler(utils, $window) {
        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs, ctrls) {
              var hasDifferentDomain = utils.hasDifferentDomain();
              var usersWithMultiAccount = utils.getMultiAccountUsers();              
              if(hasDifferentDomain) {
                // Logo Toggler
                if (attrs.href && element[0].tagName === 'use') {
                  var baseUrlImage = attrs.href.split('#')[0];
                  var userWithMultiAccount = usersWithMultiAccount.reduce(function(user) {
                    var regex = new RegExp('\\b' + user.domain + '\\b');
                    if (regex.test($window.location.hostname)) {
                      return { companyName: user.companyName, logoName: user.logoName, domain: user.domain }
                    };
                  });
                  if(!!userWithMultiAccount && userWithMultiAccount.logoName) {
                    attrs.$set("href", baseUrlImage + "#doppler-icon-" + userWithMultiAccount.logoName);
                    element.parent().addClass("big-icon");
                  }
                }
              }
            }
          };
        return directive;
    }
})();
