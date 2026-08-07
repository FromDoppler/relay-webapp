angular.module("dopplerRelay").constant("RELAY_CONFIG", {
  baseUrl: "https://qa-api-relay.fromdoppler.net",
  cuitServiceBaseUrl: "https://apisqa.fromdoppler.net/cuit",
  hostSmtp: "qa-smtp-relay.fromdoppler.net",
  portSmtp: "2525",
  useClerkAuthentication: true,
  useEprotect: false,
  eprotectScriptUrl: "https://request.eprotect.vantivprelive.com/eProtect/js/eProtect-iframe-client4.min.js",
  eprotectPaypageId: "ASEot2ojNRKS3vVG",
  eprotectReportGroup: "DopplerGroup_QA",
});
