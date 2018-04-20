(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('whiteBrandTogglerFooter', whiteBrandTogglerFooter);

      whiteBrandTogglerFooter.$inject = [
        'utils'
    ];

    function whiteBrandTogglerFooter(utils) {
        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs, ctrls) {
                if (!utils.domainData.default) {
                  element.html("<a href="+ utils.domainData.companyLink +" target='_blank'><svg width='60px' height='16px'><use href='/images/sprite.svg#doppler-icon-" + utils.domainData.logoName + "'></use></svg></a>");
                }
            }
          };
        return directive;
    }
})();
