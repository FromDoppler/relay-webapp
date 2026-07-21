angular.module('dopplerRelay').constant('RELAY_CONFIG', {
    baseUrl: 'http://localhost:34751',
    cuitServiceBaseUrl: 'https://apisint.fromdoppler.net/cuit',
    hostSmtp: '127.0.0.1',
    portSmtp: '2525',
    useClerkAuthentication: false,
    useEprotect: true,
    eprotectScriptUrl: 'https://request.eprotect.vantivprelive.com/eProtect/js/eProtect-iframe-client4.min.js',
    eprotectPaypageId: 'ASEot2ojNRKS3vVG',
    eprotectReportGroup: 'DopplerGroup_DEV',
    dopplerBillingUserApiUrl: 'http://localhost:10695/',
});
