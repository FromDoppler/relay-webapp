'use strict';

describe('settingsService', () => {

  var demoAnswer = {
    "items": [
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00059000,
        "fee": 5.90,
        "included_deliveries": 10000.0,
        "name": "PLAN-10K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00059000,
        "fee": 11.80,
        "included_deliveries": 20000.0,
        "name": "PLAN-20K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00059000,
        "fee": 17.70,
        "included_deliveries": 30000.0,
        "name": "PLAN-30K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00053000,
        "fee": 21.20,
        "included_deliveries": 40000.0,
        "name": "PLAN-40K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00053000,
        "fee": 26.50,
        "included_deliveries": 50000.0,
        "name": "PLAN-50K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00053000,
        "fee": 31.80,
        "included_deliveries": 60000.0,
        "name": "PLAN-60K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00053000,
        "fee": 37.10,
        "included_deliveries": 70000.0,
        "name": "PLAN-70K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00050000,
        "fee": 40.00,
        "included_deliveries": 80000.0,
        "name": "PLAN-80K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00050000,
        "fee": 45.00,
        "included_deliveries": 90000.0,
        "name": "PLAN-90K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00050000,
        "fee": 50.00,
        "included_deliveries": 100000.0,
        "name": "PLAN-100K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00050000,
        "fee": 75.00,
        "included_deliveries": 150000.0,
        "name": "PLAN-150K",
        "_links": []
      },
      {
        "currency": "USD",
        "extra_delivery_cost": 0.00047000,
        "fee": 94.00,
        "included_deliveries": 200000.0,
        "name": "PLAN-200K",
        "_links": []
      }
    ],
    "_links": [
      {
        "href": "/plans",
        "description": "Collection of plans",
        "rel": "/docs/rels/experimental /docs/rels/get-plan-collection self"
      },
      {
        "href": "/",
        "description": "API index",
        "rel": "/docs/rels/get-index"
      }
    ]
  };

  function createContext() {
    module('dopplerRelay');
    var context;
    inject((settings, $httpBackend, $rootScope) => {
      $rootScope.addError = () => { };
      context = {
        settings: settings,
        $httpBackend: $httpBackend,
        $rootScope : $rootScope
      };
    });
    return context;
  }


  describe('getPlansAvailable', () => {
    it('should query only one time when two calls are done', () => {
      var { settings, $httpBackend } = createContext();

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/plans')
      ).respond(200, demoAnswer);

      settings.getPlansAvailable();
      settings.getPlansAvailable();
      $httpBackend.flush();

      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should query return the same result in the second call', () => {
      var { settings, $httpBackend } = createContext();

      $httpBackend.when(
        'GET',
        url => url.endsWith('/plans')
      ).respond(200, demoAnswer);

      var result1;
      settings.getPlansAvailable().then(result => result1 = result);
      var result2;
      settings.getPlansAvailable().then(result => result2 = result);
      $httpBackend.flush();

      expect(result1).not.toBeNull();
      expect(result1.data).toBeDefined();
      expect(result1.data.items).toBeDefined();
      expect(result2).not.toBeNull();
      expect(result2.data.items).toBeDefined();
      expect(result1.data.items.length).toEqual(result2.data.items.length);
    });

    it('should query again after an error', () => {
      var { settings, $httpBackend } = createContext();

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/plans')
      ).respond(400);
      var result1;
      settings.getPlansAvailable().then(result => result1 = result);
      $httpBackend.flush();

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/plans')
      ).respond(200, demoAnswer);
      var result2;
      settings.getPlansAvailable().then(result => result2 = result);
      $httpBackend.flush();
      
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(result1).not.toBeDefined();
      expect(result2).not.toBeNull();
      expect(result2.data.items).toBeDefined();
      expect(result2.data.items.length).toBeGreaterThan(1);
    });
  });
});
