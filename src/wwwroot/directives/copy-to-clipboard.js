(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('copyToClipboard', copyToClipboard);
      
    copyToClipboard.$inject = [
      'ModalService'
    ];      

    function copyToClipboard(ModalService) {
        return {
            restrict: 'E',
            scope: {
                copyTarget: '@',
                buttonTextKey: '@',
                copyTooltipMessageKey: '@'
            },
            template: '<button class="button button--extra-small" tooltips tooltip-side="bottom" tooltip-template="{{copyTooltipMessageKey | translate}}" tooltip-show-trigger="click" tooltip-hidden="{{tooltipHidden}}">{{buttonTextKey | translate}}</button>',
            link: function (scope, element, attrs) {
                if (Clipboard.isSupported() ){
                    var clipboard = new Clipboard(element[0], {
                        target: function () { 
                            return $(scope.copyTarget)[0]; 
                        }
                    });
                    scope.tooltipHidden = false;
                    element.on('destroy', function() { clipboard.destroy(); });
                } else {
                    // If copy to clipboard is not supported, show a popup and avoid showing the tooltip
                    scope.tooltipHidden = true;
                    element.on('click', function (){
                      ModalService.showModal({
                        templateUrl: 'partials/modals/copy-to-clipboard.html',
                        controller: 'CopyToClipboardCtrl',
                        controllerAs: 'vm',
                        inputs: {
                          textToCopy: $(scope.copyTarget).text()
                        }
                      });
                    });
                }
            }
        };
    }
})();