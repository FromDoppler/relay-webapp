'use strict';

describe('eprotectService', () => {
  var eprotectService;
  var scope;

  beforeEach(() => {
    module('dopplerRelay');

    module(($provide) => {
      $provide.value('clerk', window.ClerkTestHelpers.createClerkMock());
    });
  });

  beforeEach(() => {
    inject((_eprotect_, $rootScope) => {
      eprotectService = _eprotect_;
      // Use an isolated child scope for $digest so this test doesn't also
      // resolve $rootScope's own ngRoute template requests.
      scope = $rootScope.$new();
    });
  });

  afterEach(() => {
    var scripts = document.querySelectorAll('script[src*="eProtect-iframe-client4.min.js"]');
    scripts.forEach(function (script) { script.parentNode.removeChild(script); });
  });

  describe('loadScript', () => {
    it('injects a single script tag and resolves on load', () => {
      var resolved = false;
      eprotectService.loadScript().then(function () { resolved = true; });

      var script = document.querySelector('script[src*="eProtect-iframe-client4.min.js"]');
      expect(script).not.toBeNull();

      script.onload();
      scope.$digest();

      expect(resolved).toBe(true);
    });

    it('does not append a second script tag when called again after loading', () => {
      window.EprotectIframeClient = function () {};

      eprotectService.loadScript();
      var script = document.querySelector('script[src*="eProtect-iframe-client4.min.js"]');
      script.onload();
      scope.$digest();

      eprotectService.loadScript();
      var count = document.querySelectorAll('script[src*="eProtect-iframe-client4.min.js"]').length;

      expect(count).toBe(1);

      delete window.EprotectIframeClient;
    });
  });

  describe('mapErrorCode', () => {
    it('maps cvv error codes to the cvv translation key', () => {
      expect(eprotectService.mapErrorCode(eprotectService.EProtectError.cvvNotNumeric))
        .toBe('eprotect_error_cvv_invalid');
      expect(eprotectService.mapErrorCode(eprotectService.EProtectError.cvvTooShort))
        .toBe('eprotect_error_cvv_invalid');
    });

    it('maps unknown codes to the generic error key', () => {
      expect(eprotectService.mapErrorCode('does-not-exist')).toBe('eprotect_error_generic');
    });
  });

  describe('buildConfig', () => {
    it('builds a config object wired to the given div id and callback', () => {
      var callback = function () {};
      var translateInstant = function (key) { return key; };

      var config = eprotectService.buildConfig('eprotect-payframe-test', callback, translateInstant);

      expect(config.div).toBe('eprotect-payframe-test');
      expect(config.callback).toBe(callback);
      expect(config.showCvv).toBe(true);
      expect(typeof config.paypageId).toBe('string');
      expect(typeof config.reportGroup).toBe('string');
    });
  });
});
