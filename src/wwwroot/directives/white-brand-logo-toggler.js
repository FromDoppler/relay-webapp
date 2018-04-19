(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('whiteBrandLogoToggler', whiteBrandLogoToggler);

      whiteBrandLogoToggler.$inject = [
        'utils',
        '$window'
    ];

    function whiteBrandLogoToggler(utils, $window) {
        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs, ctrls) {
              var hasDifferentDomain = utils.hasDifferentDomain();
              if(hasDifferentDomain) {
                if (attrs.href && element[0].tagName === 'use') {
                  var usersWithMultiAccount = utils.getMultiAccountUsers();   
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
