angular.module("dopplerRelay").constant("RELAY_CONFIG", {
  baseUrl: "https://int-api-relay.fromdoppler.net",
  cuitServiceBaseUrl: "https://apisint.fromdoppler.net/cuit",
  hostSmtp: "int-smtp-relay.fromdoppler.net",
  portSmtp: "2525",
  useClerkAuthentication: true,
  useEprotect: true,
  eprotectScriptUrl: "https://request.eprotect.vantivprelive.com/eProtect/js/eProtect-iframe-client4.min.js",
  eprotectPaypageId: "ASEot2ojNRKS3vVG",
  eprotectReportGroup: "DopplerGroup_INT",
});
