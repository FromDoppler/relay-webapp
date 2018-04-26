(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('whiteBrandLogoToggler', whiteBrandLogoToggler);

      whiteBrandLogoToggler.$inject = [
        'utils'
    ];

    function whiteBrandLogoToggler(utils) {
        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs, ctrls) {
              if(!utils.domainData.default) {
                if (attrs.href && element[0].tagName === 'use') {
                  attrs.$set("href","/images/sprite.svg#doppler-icon-" + utils.domainData.logoName);
                  element.parent().addClass("big-icon");
                }
              }
            }
          };
        return directive;
    }
})();
