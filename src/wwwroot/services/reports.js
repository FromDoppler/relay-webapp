(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('reports', reports);

  reports.$inject = [
    '$http',
    '$window',
    '$q',
    'auth',
    'RELAY_CONFIG',
    'linkUtilities',
    '$log'
  ];
  function reports($http, $window, $q, auth, RELAY_CONFIG, linkUtilities, $log) {

    var reportsService = {
      getRecords: getRecords,
      getMoreRecordsFromUrl: getMoreRecordsFromUrl,
      selectedRecord: selectedRecord,
      getReportRequests: getReportRequests,
      createReportRequest: createReportRequest,
      getDeliveriesAggregations: getDeliveriesAggregations,
      getEventsAggregations: getEventsAggregations
    };

    return reportsService;

    function getDeliveriesAggregations(from, to, aggregationsInterval) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/statistics/deliveries/' + aggregationsInterval
        + '?per_page=200';
      if (from) {
        url = url + '&from=' + from.toISOString();
      }
      if (to) {
        url = url + '&to=' + to.toISOString();
      }

      return $http({
        actionDescription: 'Gathering deliveries aggregations',
        method: 'GET',
        avoidStandarErrorHandling: true,
        url: url
      })
      .then(function (response) {
        return response;
      })
      .catch(function (reason) {
        $log.error(reason);
        return $q.reject(reason);
      });
    }

    function getEventsAggregations(from, to, aggregationsInterval) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/statistics/events/' + aggregationsInterval
        + '?per_page=200';

      if (from) {
        url = url + '&from=' + from.toISOString();
      }
      if (to) {
        url = url + '&to=' + to.toISOString();
      }

      return $http({
        actionDescription: 'Gathering events aggregations',
        method: 'GET',
        avoidStandarErrorHandling: true,
        url: url
      })
      .then(function (response) {
        return response;
      })
      .catch(function (reason) {
        $log.error(reason);
        return $q.reject(reason);
      });
    }

    function selectedRecord(item) {
      var results = [];
      if (item) {
        for (var i = 0; i < 5; i++) {
          if (item == jsonReports[i].email) {
            results.push(jsonReports[i]);
          }
        }
        return results;
      } else {
        return false;
      }
    }

    function getFormatedNumber(num) {
      var suffix;
      var separator = ',';
      var shortNumber = num.toString().substring(0, 3);
      if (num.toString().length <= 9 && num.toString().length > 8) {
        suffix = 'm';
        return shortNumber = shortNumber + suffix;
      }
      if (num.toString().length <= 8 && num.toString().length > 7) {
        suffix = 'm';
        return shortNumber = shortNumber.substring(0, 2) + separator + shortNumber.substring(2) + suffix;
      }
      if (num.toString().length <= 7 && num.toString().length > 6) {
        suffix = 'm';
        return shortNumber = shortNumber.substring(0, 1) + separator + shortNumber.substring(1) + suffix;
      }
      if (num.toString().length <= 6 && num.toString().length > 5) {
        suffix = 'k';
        return shortNumber = shortNumber + suffix;
      }
      if (num.toString().length <= 5 && num.toString().length > 4) {
        suffix = 'k';
        return shortNumber = shortNumber.substring(0, 2) + separator + shortNumber.substring(2) + suffix;
      }
      return num;
    }

    function getRecords(from, to, filter, perPage) {
      var accountName = auth.getAccountName();
        var url = '/accounts/' + accountName + '/deliveries';
        // TODO: UrlEncode parameters
        var params = [];
        if (filter) {
          params.push('filter=' + filter);
        }
        if (from) {
          params.push('from=' + from.toISOString());
        }
        if (to) {
          params.push('to=' + to.toISOString());
        }
        if (perPage) {
          params.push('per_page=' + perPage);
        }
        if (params.length)
        {
          url += '?' + params.join('&');
        }

        return getMoreRecordsFromUrl(url);
    }

    function getMoreRecordsFromUrl(url) {
      return $http({
        actionDescription: 'Gathering records',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + url
      })
      .then(function (response) {
        var nextLink = linkUtilities.findNextLink(response.data._links);
        return ({ records: response.data.items, nextLink: nextLink && nextLink.href, deliveriesCount: response.data.itemsCount });
      })
      .catch(function (reason) {
        $log.error(reason);
        return $q.reject(reason);
      });
    }

    function getReportRequests() {
      return $http({
        actionDescription: 'Gathering report requests',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/reports/reportrequests'
      }).then(function (response) {
        return (response.data.items);
      });
    }

    function createReportRequest(reportRequest) {
      var data = {
        start_date: reportRequest.startDate.toISOString(),
        end_date: reportRequest.endDate.toISOString()
      };
      return $http({
        actionDescription: 'Creating report request',
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/reports/reportrequest',
        data: data
      });
    }

  }
})();
