angular.module("dopplerRelay").constant("RELAY_CONFIG", {
  baseUrl: "https://api.dopplerrelay.com",
  cuitServiceBaseUrl: "https://apis.fromdoppler.com/cuit",
  hostSmtp: "smtp.dopplerrelay.com",
  portSmtp: "587",
  useClerkAuthentication: true,
  useEprotect: false,
  eprotectScriptUrl: "https://request.eprotect.vantivcnp.com/eProtect/js/eProtect-iframe-client4.min.js",
  eprotectPaypageId: "JEeG54YNFUob2QBw",
  eprotectReportGroup: "DopplerGroup_PROD",
});
