(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('eprotect', eprotect);

  eprotect.$inject = ['$q', '$window', '$document', 'RELAY_CONFIG', 'utils'];

  var EProtectError = {
    invalidAccountNumber: '871',
    accountNumberTooShort: '872',
    accountNumberTooLong: '873',
    accountNumberNotNumeric: '874',
    unableToEncryptField: '875',
    invalidAccountNumberGeneric: '876',
    invalidPaypageRegistrationId: '877',
    expiredPaypageRegistrationId: '878',
    merchantNotAuthorized: '879',
    reportGroupInvalid: '880',
    cvvNotNumeric: '881',
    cvvTooShort: '882',
    cvvTooLong: '883',
    payframeHtmlFailedToLoad: '884',
    payframeCssFailedToLoad: '885',
    expirationMonthInvalid: '886-month',
    expirationYearInvalid: '886-year',
    expirationDateInvalid: '886',
    secondaryPaypageRequestError: '887',
    paypageSignatureVerificationFailed: '888',
    failure: '889',
    pinNumMissingOrTooShort: '893',
    pinTooLong: '894',
    genericTokenRegistrationError: '898',
    success: '870'
  };

  function eprotect($q, $window, $document, RELAY_CONFIG, utils) {
    var scriptLoadPromise = null;

    var service = {
      EProtectError: EProtectError,
      loadScript: loadScript,
      buildConfig: buildConfig,
      mapErrorCode: mapErrorCode
    };

    return service;

    function loadScript() {
      if (scriptLoadPromise) {
        return scriptLoadPromise;
      }

      var deferred = $q.defer();
      var existingScript = $document[0].querySelector('script[src="' + RELAY_CONFIG.eprotectScriptUrl + '"]');

      if (existingScript && $window.EprotectIframeClient) {
        deferred.resolve();
        scriptLoadPromise = deferred.promise;
        return scriptLoadPromise;
      }

      var script = $document[0].createElement('script');
      script.src = RELAY_CONFIG.eprotectScriptUrl;
      script.async = true;
      script.onload = function () {
        deferred.resolve();
      };
      script.onerror = function () {
        console.error('Failed to load eProtect script');
        scriptLoadPromise = null;
        deferred.reject(new Error('Failed to load eProtect script'));
      };
      $document[0].head.appendChild(script);

      scriptLoadPromise = deferred.promise;
      return scriptLoadPromise;
    }

    function buildConfig(divId, callback, translateInstant) {
      var isSpanish = (utils.getPreferredLanguage() || 'en').toLowerCase().indexOf('es') === 0;

      var months = {};
      for (var m = 1; m <= 12; m++) {
        months[m] = m < 10 ? '0' + m : '' + m;
      }

      return {
        paypageId: RELAY_CONFIG.eprotectPaypageId,
        style: isSpanish ? 'enhancedstyleDB5ESPA' : 'enhancedstyleDB5ENGL',
        reportGroup: RELAY_CONFIG.eprotectReportGroup,
        timeout: '5000',
        div: divId,
        height: '350',
        callback: callback,
        showCvv: true,
        months: months,
        numYears: 15,
        expYearFormat: 'YY',
        tabIndex: { accountNumber: 1, expMonth: 2, expYear: 3, cvv: 4 },
        placeholderText: {
          cvv: translateInstant('eprotect_placeholder_cvv'),
          accountNumber: translateInstant('eprotect_placeholder_credit_card')
        },
        htmlTimeout: '5000',
        clearCvvMaskOnReturn: true,
        enhancedUxFeatures: {
          inlineFieldValidations: true,
          numericInputsOnly: true,
          enhancedUxVersion: 2,
          coloredCardNetworkLogos: true,
          cVVValidation: true,
          expDateValidation: false
        },
        label: {
          accountNumber: translateInstant('eprotect_label_account_number'),
          expDate: translateInstant('eprotect_label_exp_date'),
          cvv: translateInstant('eprotect_label_cvv')
        },
        customErrorMessages: buildCustomErrorMessages(translateInstant)
      };
    }

    function buildCustomErrorMessages(translateInstant) {
      var messages = {};
      angular.forEach(EProtectError, function (code) {
        var key = mapErrorCode(code);
        if (key) {
          messages[code] = translateInstant(key);
        }
      });
      return messages;
    }

    function mapErrorCode(code) {
      switch (code) {
        case EProtectError.expirationMonthInvalid:
        case EProtectError.expirationYearInvalid:
        case EProtectError.expirationDateInvalid:
          return 'eprotect_error_invalid_expiration_date';
        case EProtectError.invalidAccountNumber:
        case EProtectError.accountNumberTooShort:
        case EProtectError.accountNumberTooLong:
        case EProtectError.accountNumberNotNumeric:
        case EProtectError.invalidAccountNumberGeneric:
          return 'eprotect_error_invalid_credit_card_number';
        case EProtectError.failure:
          return 'eprotect_error_declined';
        case EProtectError.unableToEncryptField:
        case EProtectError.invalidPaypageRegistrationId:
        case EProtectError.reportGroupInvalid:
        case EProtectError.secondaryPaypageRequestError:
        case EProtectError.paypageSignatureVerificationFailed:
          return 'eprotect_error_unable_to_encrypt_field';
        case EProtectError.expiredPaypageRegistrationId:
          return 'eprotect_error_expired_paypage_registration_id';
        case EProtectError.merchantNotAuthorized:
          return 'eprotect_error_merchant_not_authorized';
        case EProtectError.cvvNotNumeric:
        case EProtectError.cvvTooShort:
        case EProtectError.cvvTooLong:
          return 'eprotect_error_cvv_invalid';
        case EProtectError.payframeHtmlFailedToLoad:
        case EProtectError.payframeCssFailedToLoad:
          return 'eprotect_error_payframe_failed_to_load';
        default:
          return 'eprotect_error_generic';
      }
    }
  }
})();
