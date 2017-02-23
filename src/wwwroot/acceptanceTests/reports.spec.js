'use strict';

describe('Reports', () => {

  var createSut;
  var $httpBackend;
  var auth;

  beforeEach(() => {
    module('dopplerRelay');
  });

  beforeEach(inject(function (_$controller_, $rootScope, _$httpBackend_, _auth_) {
    $httpBackend = _$httpBackend_;
    auth = _auth_;
    createSut = function () {
      var $scope = $rootScope.$new();
      var controller = _$controller_('ReportsCtrl', {
        $scope: $scope
      });
      return $scope;
    };
  }));

  describe('deliveries summary', () => {

    // TODO - Fix broken tests - Related ticket DR-923
    
    /*
    it('should have the sum of dropped deliveries', () => {

      // Arrange
      auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/accounts/70002/deliveries?days=0'))
        .respond({
          "success": true,
          "items": []
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/deliveries/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": [{ 'dropped': 2 }, { 'dropped': 6 }]
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/events/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": []
        });

      // Act
      var $scope = createSut();
      $httpBackend.flush();

      // Assert
      expect($scope.deliveriesSummary.qEmailsDropped).toBe(8);
    });

    it('should have 0 as sum of dropped deliveries when all statistics items have 0 dropped deliveries', () => {

      // Arrange
      auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/accounts/70002/deliveries?days=0'))
        .respond({
          "success": true,
          "items": []
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/deliveries/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": [{ 'dropped': 0 }, { 'dropped': 0 }]
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/events/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": []
        });

      // Act
      var $scope = createSut();
      $httpBackend.flush();

      // Assert
      expect($scope.deliveriesSummary.qEmailsDropped).toBe(0);
    });

    it('should have 0 as sum of dropped deliveries when there are not statistics items', () => {

      // Arrange
      auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/accounts/70002/deliveries?days=0'))
        .respond({
          "success": true,
          "items": []
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/deliveries/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": []
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/events/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": []
        });

      // Act
      var $scope = createSut();
      $httpBackend.flush();

      // Assert
      expect($scope.deliveriesSummary.qEmailsDropped).toBe(0);
    });

    it('should calculate deliverability correctly when exist dropped deliveries statistics items', () => {

      // Arrange
      auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/accounts/70002/deliveries?days=0'))
        .respond({
          "success": true,
          "items": []
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/deliveries/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": [{'total': 4, 'sent': 1, 'dropped': 1 }, {'total': 6, 'sent': 4, 'dropped': 2 }]
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/events/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": []
        });

      // Act
      var $scope = createSut();
      $httpBackend.flush();

      // Assert
      expect($scope.deliveriesSummary.qEmailsDropped).toBe(3);
      expect($scope.deliveriesSummary.qEmailDeliverability).toBe(50);
    });

    it('should calculate deliverability correctly when not exist dropped deliveries statistics items', () => {

      // Arrange
      auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");

      $httpBackend.expect(
        'GET',
        url => url.endsWith('/accounts/70002/deliveries?days=0'))
        .respond({
          "success": true,
          "items": []
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/deliveries/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": [{ 'total': 4, 'sent': 2, 'dropped': 0 }, { 'total': 6, 'sent': 6, 'dropped': 0 }]
        });

      $httpBackend.expect(
        'GET',
        url => url.includes('/accounts/account2/statistics/events/by_hour?per_page=200'))
        .respond({
          "success": true,
          "items": []
        });

      // Act
      var $scope = createSut();
      $httpBackend.flush();

      // Assert
      expect($scope.deliveriesSummary.qEmailsDropped).toBe(0);
      expect($scope.deliveriesSummary.qEmailDeliverability).toBe(80);
    });*/
  });
});

