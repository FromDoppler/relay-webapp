(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('PlanCtrl', PlanCtrl);

  PlanCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope',
    'auth',
    '$translate',
    '$timeout',
    'settings'
  ];

  function PlanCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
    ]);
    vm.hideDragMe = false;
    vm.activationPromise = activate();
    var defaultPlanName = 'PLAN_60K';
    var planItems;
    vm.langUsed = $translate.use();

    function activate() {
      return settings.getPlansAvailable().then(function(response){
        planItems = response.data.items;
        loadSlider();
        changePlan(defaultPlanName);
      });
    }

    function changePlan(planName) {
      var selectedItem = planItems.find(function(obj){
        return obj.name == planName;
      });
      vm.emailsSuggestedAmount = selectedItem.included_deliveries;
      vm.planName = selectedItem.name;
      vm.planPrice = selectedItem.fee;
      vm.costEmail = selectedItem.extra_delivery_cost;
    }

    function loadSlider() {
      var planItemsParsedForSlider = planItems.map(function(plan){
        return { value : plan.name};
      });
      vm.slider = {
        value: defaultPlanName,
        options: {
          showSelectionBar: true,
          stepsArray: planItemsParsedForSlider,
          onChange: function (sliderId, modelValue) {
            vm.hideDragMe = true;
            changePlan(modelValue);
          }
        }
      };
    }
  }

})();
