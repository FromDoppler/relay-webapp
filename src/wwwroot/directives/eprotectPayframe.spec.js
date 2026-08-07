'use strict';

describe('eprotectPayframe', () => {
  var $compile;
  var $rootScope;
  var $interval;
  var $timeout;
  var $q;
  var $httpBackend;
  var mockClient;
  var mockEprotectService;

  beforeEach(() => {
    mockEprotectService = {
      loadScript: null, // set per test via $q
      buildConfig: jasmine.createSpy('buildConfig').and.callFake(function (divId, callback) {
        return { div: divId, callback: callback };
      })
    };

    module('dopplerRelay');

    module(($provide) => {
      $provide.value('eprotect', mockEprotectService);
      $provide.value('clerk', window.ClerkTestHelpers.createClerkMock());
    });
  });

  beforeEach(() => {
    inject((_$compile_, _$rootScope_, _$interval_, _$timeout_, _$q_, _$httpBackend_) => {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $interval = _$interval_;
      $timeout = _$timeout_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });

    // $interval.flush() triggers a full $rootScope.$apply(), which also
    // resolves ngRoute's pending initial route template request; respond
    // leniently to it so it doesn't fail unrelated assertions here.
    $httpBackend.whenGET(/\.html$/).respond(200, '');

    mockEprotectService.loadScript = jasmine.createSpy('loadScript').and.callFake(function () {
      return $q.when();
    });

    mockClient = { getPaypageRegistrationId: jasmine.createSpy('getPaypageRegistrationId') };
    window.EprotectIframeClient = jasmine.createSpy('EprotectIframeClient').and.callFake(function () {
      return mockClient;
    });
  });

  afterEach(() => {
    delete window.EprotectIframeClient;
  });

  function compileDirective() {
    var scope = $rootScope.$new();
    scope.onReadyResults = [];
    scope.handleReady = function (result) {
      scope.onReadyResults.push(result);
    };

    var element = $compile('<eprotect-payframe on-ready="handleReady(result)"></eprotect-payframe>')(scope);
    scope.$digest();
    document.body.appendChild(element[0]);

    return { element: element, scope: scope };
  }

  it('initializes the EprotectIframeClient once the container div is in the DOM and notifies onReady', () => {
    var compiled = compileDirective();

    compiled.scope.$digest();
    $interval.flush(100);
    compiled.scope.$digest();

    expect(window.EprotectIframeClient).toHaveBeenCalled();
    expect(compiled.scope.onReadyResults.length).toBe(1);
    expect(compiled.scope.onReadyResults[0].error).toBe(false);
    expect(typeof compiled.scope.onReadyResults[0].api.requestPaypageRegistrationId).toBe('function');
    expect(compiled.scope.onReadyResults[0].api.isReady()).toBe(true);

    compiled.element.remove();
  });

  it('resolves requestPaypageRegistrationId when the configured callback fires with a successful response', () => {
    var compiled = compileDirective();
    compiled.scope.$digest();
    $interval.flush(100);
    compiled.scope.$digest();

    var api = compiled.scope.onReadyResults[0].api;
    var configPassedToClient = window.EprotectIframeClient.calls.mostRecent().args[0];

    var resolvedValue = null;
    api.requestPaypageRegistrationId().then(function (response) {
      resolvedValue = response;
    });

    configPassedToClient.callback({
      response: '870',
      paypageRegistrationId: 'test-token',
      lastFour: '1111',
      firstSix: '411111',
      expMonth: '12',
      expYear: '30'
    });
    $timeout.flush();

    expect(resolvedValue).not.toBeNull();
    expect(resolvedValue.paypageRegistrationId).toBe('test-token');

    compiled.element.remove();
  });

  it('surfaces an error response through the resolved value so the caller can map it', () => {
    var compiled = compileDirective();
    compiled.scope.$digest();
    $interval.flush(100);
    compiled.scope.$digest();

    var api = compiled.scope.onReadyResults[0].api;
    var configPassedToClient = window.EprotectIframeClient.calls.mostRecent().args[0];

    var resolvedValue = null;
    api.requestPaypageRegistrationId().then(function (response) {
      resolvedValue = response;
    });

    configPassedToClient.callback({ response: '881' });
    $timeout.flush();

    expect(resolvedValue.response).toBe('881');

    compiled.element.remove();
  });

  it('notifies onReady with an error when EprotectIframeClient throws during initialization', () => {
    window.EprotectIframeClient = jasmine.createSpy('EprotectIframeClient').and.callFake(function () {
      throw new Error('boom');
    });

    var compiled = compileDirective();
    compiled.scope.$digest();
    $interval.flush(100);
    compiled.scope.$digest();

    expect(compiled.scope.onReadyResults[0].error).toBe(true);
    expect(compiled.scope.onReadyResults[0].api).toBeNull();

    compiled.element.remove();
  });

  it('notifies onReady with an error when the script fails to load', () => {
    mockEprotectService.loadScript = jasmine.createSpy('loadScript').and.callFake(function () {
      return $q.reject(new Error('script failed'));
    });

    var compiled = compileDirective();
    compiled.scope.$digest();

    expect(compiled.scope.onReadyResults.length).toBe(1);
    expect(compiled.scope.onReadyResults[0].error).toBe(true);

    compiled.element.remove();
  });
});
