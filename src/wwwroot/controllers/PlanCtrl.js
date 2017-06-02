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
    var defaultPlanId = 6;
    var planItems;

    function activate() {
      return loadPlans();
    }

    function loadPlans() {
      return settings.getPlansAvailable()
      .then(function(response) {
        planItems = response.data;
      });
    }

    updatePlan(defaultPlanId);
    function updatePlan(planId) {
      var selectedItem = planItems.find(function(obj){
        return obj.id === planId;
      });
      vm.emailsSuggestedAmount = selectedItem.emailsAmount;
      vm.planName = selectedItem.name;
      vm.planPrice = selectedItem.price;
      vm.costEmail = selectedItem.costEmail;
    }

    vm.slider = {
      value: defaultPlanId,
      options: {
        showSelectionBar: true,
        stepsArray: [
          {value: 1},
          {value: 2},
          {value: 3},
          {value: 4},
          {value: 5},
          {value: 6},
          {value: 7},
          {value: 8},
          {value: 9},
          {value: 10},
          {value: 11},
          {value: 12}
        ],
        onChange: function (sliderId, modelValue) {
          vm.hideDragMe = true;
          updatePlan(modelValue);
        }
      }
    };
  }

})();
