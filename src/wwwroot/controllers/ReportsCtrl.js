(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('ReportsCtrl', ReportsCtrl);

  ReportsCtrl.$inject = [
    '$scope',
    'reports',
    'auth',
    '$location',
    'constants',
    '$translate',
    'ModalService',
    '$rootScope',
    'moment'
  ];

  function ReportsCtrl($scope, reports, auth, $location, constants, $translate, ModalService, $rootScope, moment) {
    loadRateLimits();
    applyFilter();
    $scope.moreThanOneDay = false;
    $scope.canSearch = true;
    $scope.searchInProgress = false;
    $scope.curSection = $location.path().substring(1);
    $scope.deliveriesSummary = {};
    $scope.eventsSummary = {};
    $scope.noLimits = true;

    function loadRateLimits() {
      reports.getStatusPlanLimits()
      .then(function (result) {        
        $scope.maxRateDailyLimitBar = 50;

        if (result.daily){
          $scope.noLimits = false;
          var progressUsedValue = result.daily.limit - result.daily.remaining;
          $scope.maxRateDailyLimit = result.daily.limit;
          
          $scope.progressLimitValue = Math.ceil((progressUsedValue / result.daily.limit) * 50);
        }
      });
    }    

    var todayLabel = $translate.instant('reports_filter_label_today');
    var yesterdayLabel = $translate.instant('reports_filter_label_last_day');
    var lastWeekLabel = $translate.instant('reports_filter_label_last_7_days');
    var last15Label = $translate.instant('reports_filter_label_last_15_days');
    var lastMonthLabel = $translate.instant('reports_filter_label_last_30_days');
    var last90Label = $translate.instant('reports_filter_label_last_90_days');
    var customRangeLabel = $translate.instant('reports_filter_label_custom_range');
    var ranges = {};

    ranges[todayLabel] = [moment.utc().startOf('day'), moment.utc().endOf('day')];
    ranges[yesterdayLabel] = [moment.utc().subtract(1, 'days'), moment.utc().endOf('day')];
    ranges[lastWeekLabel] = [moment.utc().subtract(7, 'days'), moment.utc().endOf('day')];
    ranges[last15Label] = [moment.utc().subtract(15, 'days'), moment.utc().endOf('day')];
    ranges[lastMonthLabel] = [moment.utc().subtract(30, 'days'), moment.utc().endOf('day')];
    ranges[last90Label] = [moment.utc().subtract(90, 'days'), moment.utc().endOf('day')];

    $scope.opts = {
        opens: "left",
        autoApply: true,
        locale: {
          customRangeLabel: customRangeLabel,
          format: 'YYYY-MM-DD'
        },
        ranges: ranges,
        eventHandlers : {
            'apply.daterangepicker' : function() {
              changeDateRange();
            }
        }
    };
    ///TODO: http://jira.makingsense.com/browse/DR-703
    if ($rootScope.isNewUser) {
      ModalService.showModal({
        templateUrl: 'partials/modals/welcome.html',
        controller: 'WelcomeCtrl',
        controllerAs: 'vm'
      });
      $rootScope.isNewUser = false;
    }

    changeDateRange();

    function applyFilter () {
      if (!$scope.dateRange) {
        $scope.dateRange = {
              startDate: moment.utc().startOf('day'),
              endDate: moment.utc().endOf('day')
        };
      }
      $scope.currentFullDateFilter = {
        //We are doing this in order to interpret user date range selection as UTC in place of local time
      	startDate: moment.utc($scope.dateRange.startDate.format('YYYY-MM-DDTHH:mm:ss.SSS')),
      	endDate:moment.utc($scope.dateRange.endDate.format('YYYY-MM-DDTHH:mm:ss.SSS')),
      	filter: $scope.searchTable
      };
      $scope.moreThanOneDay = $scope.currentFullDateFilter.endDate && $scope.currentFullDateFilter.endDate.diff($scope.currentFullDateFilter.startDate, 'days') != 0 || false;
    }

    function getCleanParams() {
      var from = $scope.currentFullDateFilter.startDate.clone();
      var to = $scope.currentFullDateFilter.endDate.clone();
      var aggregationsInterval = GetAggregationType(from, to);
      if (to > moment.utc()) {
        to = null;
      } else if (to.milliseconds() == 999) {
        // Because in our API to is exclusive and not inclusive
        to.add(1, 'ms');
      }

      return {
        startDate: from.toDate(),
        endDate: to && to.toDate() || null,
        filter: $scope.searchTable,
        aggregationsInterval: aggregationsInterval
      };
    }

    function getCleanParamsForGenerateReports() {
      var from = $scope.currentFullDateFilter.startDate.clone();
      var to = $scope.currentFullDateFilter.endDate.clone();
      if (from > moment.utc()) {
        from = moment.utc();
      }
      if (to > moment.utc()) {
        to = moment.utc();
      } else if (to.milliseconds() == 999) {
        // Because in our API to is exclusive and not inclusive
        to.add(1, 'ms');
      }
      return {
        startDate: from.toDate(),
        endDate: to.toDate(),
        filter: $scope.searchTable
      };
    }

    function changeDateRange() {
      applyFilter();
      var params = getCleanParams();
      loadRecords(params.startDate, params.endDate, params.filter);
      loadGraphData(params.startDate, params.endDate, params.aggregationsInterval);
    }

    $scope.statusIsFailed = function (record) {
      return (record.Status === constants.STATUS_REJECTED || record.Status === constants.STATUS_INVALID);
    };

    $scope.dateChanged = function (record1, record2) {
      return !record2 || new Date(record1).setHours(0, 0, 0, 0) !== new Date(record2).setHours(0, 0, 0, 0);
    };

    $scope.getMoreRecords = function () {
      if ($scope.hasMoreRecords) {
        $scope.searchInProgress = true;
        reports.getMoreRecordsFromUrl($scope.moreRecordsUrl)
            .then(function (result) {
              handleLoadRecordsSuccess(result, false);
            })
            .finally(function () {
              $scope.searchInProgress = false;
            });
      }
    };

    $scope.searchResultsUpdate = function () {
      if ($scope.canSearch) {
        applyFilter();
        var params = getCleanParams();
        loadRecords(params.startDate, params.endDate, params.filter);
      }
    };

    $scope.updateCanSearch = function () {
      $scope.canSearch = (!$scope.searchTable || $scope.searchTable.length === 0 || $scope.searchTable.length > 2);
    };

    $scope.getStatusKey = function (status, bounceType) {
      switch (status) {
        case constants.STATUS_QUEUED: return 'reports_status_Queued';
        case constants.STATUS_SENT: return 'reports_status_Sent';
        case constants.STATUS_REJECTED: return bounceType == 'hard' ? 'reports_status_Rejected_Hard' : 'reports_status_Rejected_Soft';
        case constants.STATUS_RETRYING: return 'reports_status_Retrying';
        case constants.STATUS_INVALID: return bounceType == 'hard' ? 'reports_status_Invalid_Hard' : 'reports_status_Invalid_Soft';
        case constants.STATUS_DROPPED: return 'reports_status_dropped';
        default: return '';
      }
    };

    $scope.generateReport = function () {
      applyFilter();
      var params = getCleanParamsForGenerateReports();
      reports.createReportRequest(params)
        .then(function () {
          $location.path('/reports/downloads');
        });
    };

    function GetAggregationType(from, to) {
      to = to || moment.utc();
      var days = to.diff(from, 'days');
      if (days < 4) {
        return 'by_hour';
      }
      return 'by_day';
    }

    function getSeriesTranslations() {
      // TODO: find a better way
      return $translate([
        'reports_graph_value',
        'reports_graph_value2',
        'reports_graph_value3',
        'reports_graph_value4'
      ]).then(function (translations) {
        return {
          delivered: translations['reports_graph_value'],
          bounced: translations['reports_graph_value2'],
          opens: translations['reports_graph_value3'],
          clicks: translations['reports_graph_value4']
        };
      });
    }

    function convertIsoDateToSimpleDate(isoDate) {
      return isoDate && isoDate.replace('T', ' ').replace('+00:00', '').replace('Z', '');
    }

    function loadGraphData(from, to, aggregationsInterval) {
      $scope.loadInProgressVolume = true;
      $scope.loadInProgressOpensClicks = true;
      $scope.showRequestErrorVolume = false;
      $scope.showRequestErrorOpensClicks = false;

      getSeriesTranslations().then(function (seriesTranslations) {
        reports.getDeliveriesAggregations(from, to, aggregationsInterval).then(function (result) {
          if (result) {
            $scope.dataFirstGraph = {
              x: {
                format: getXDateFormat(aggregationsInterval),
                data: result.data.items.map(function (obj) {
                  return convertIsoDateToSimpleDate(obj.from);
                })
              },
              series: [
                {
                  name: seriesTranslations.delivered,
                  color: '#5FC1A4',
                  data: result.data.items.map(function (obj) { return obj.sent; })
                },
                {
                  name: seriesTranslations.bounced,
                  color: '#EA8202',
                  data: result.data.items.map(function (obj) { return obj.hard_bounced + obj.soft_bounced; })
                }
              ]
            };

            $scope.deliveriesSummary = calculateDeliverySummary(result);
          }
        })
        .catch(function (error) {
          console.log(error);
          $scope.showRequestErrorVolume = true;
        })
        .finally(function () {
          $scope.loadInProgressVolume = false;
        });

        reports.getEventsAggregations(from, to, aggregationsInterval).then(function (result) {
          if (result) {
            $scope.dataSecondGraph = {
              x: {
                format: getXDateFormat(aggregationsInterval),
                data: result.data.items.map(function (obj) {
                  return convertIsoDateToSimpleDate(obj.from);
                })
              },
              series: [
                {
                  name: seriesTranslations.opens,
                  color: '#5FC1A4',
                  data: result.data.items.map(function (obj) { return obj.opens; })
                },
                {
                  name: seriesTranslations.clicks,
                  color: '#EA8202',
                  data: result.data.items.map(function (obj) { return obj.clicks; })
                }
              ]
            };

            $scope.eventsSummary = calculateEventsSummary(result);
          }
        })
        .catch(function () {
          $scope.showRequestErrorOpensClicks = true;
        })
        .finally(function () {
          $scope.loadInProgressOpensClicks = false;
        });
      });
    }

    function calculateDeliverySummary(result) {
      var emailTotalSent = result.data.items.reduce(function (agg, item) {
        return agg + item.total;
      }, 0);
      var amountDeliveredEmails = result.data.items.reduce(function (agg, item) {
        return agg + item.sent;
      }, 0);
      var amountDays = result.data.items.reduce(function (agg, item) {
        return agg + item.hours;
      }, 0) / 24;

      var qEmailOpened = result.data.items.reduce(function (agg, item) {
        return agg + item.opened;
      }, 0);

      var qEmailClicks = result.data.items.reduce(function (agg, item) {
        return agg + item.clicked;
      }, 0);

      var qEmailsSoft = result.data.items.reduce(function (agg, item) {
        return agg + item.soft_bounced;
      }, 0);

      var qEmailsHard = result.data.items.reduce(function (agg, item) {
        return agg + item.hard_bounced;
      }, 0);

      var qEmailsDropped = result.data.items.reduce(function (agg, item) {
        return agg + item.dropped;
      }, 0);

      var deliveriesSummary = {
        qEmails: emailTotalSent,
        qEmailsDelivered: amountDeliveredEmails,
        qEmailDeliverability: emailTotalSent && amountDeliveredEmails / emailTotalSent * 100 || null,
        qEmailsSoft: qEmailsSoft,
        qEmailsHard: qEmailsHard,
        qEmailsDropped: qEmailsDropped,
        qEmailAverageSendDaily: amountDays && emailTotalSent / amountDays || null,
        qEmailOpenedRate: emailTotalSent && qEmailOpened / emailTotalSent * 100 || null,
        qEmailClickedRate: emailTotalSent && qEmailClicks / emailTotalSent * 100 || null
      };

      return deliveriesSummary;
    }

    function calculateEventsSummary(result) {
      var amountOpens = result.data.items.reduce(function (agg, item) {
        return agg + item.opens;
      }, 0);

      var amountClicks = result.data.items.reduce(function (agg, item) {
        return agg + item.clicks;
      }, 0);

      var amountDays = result.data.items.reduce(function (agg, item) {
        return agg + item.hours;
      }, 0) / 24;

      var eventsSummary = {
        qEmailAverageOpensDaily: amountDays && amountOpens / amountDays || null,
        qEmailAverageClicksDaily: amountDays && amountClicks / amountDays || null
      };

      return eventsSummary;
    }

    function getXDateFormat(filterType) {
      if (filterType == 'by_day') {
        return '%Y-%m-%d';
      }
      else {
        return '%Y-%m-%d %H:%M';
      }
    }

    function loadRecords(dateFrom, dateTo, filter) {
      $scope.searchInProgress = true;
      reports.getRecords(dateFrom, dateTo, filter)
          .then(function (result) {
            handleLoadRecordsSuccess(result, true);
          })
          .finally(function () {
            $scope.searchInProgress = false;
          });
    }

    function handleLoadRecordsSuccess(result, shouldReplace) {
      $scope.moreRecordsUrl = result.nextLink;
      $scope.hasMoreRecords = (result.records.length > 0 && !!result.nextLink);
      if (shouldReplace) {
        $scope.records = result.records;
      }
      else {
        $scope.records = $scope.records.concat(result.records);
      }
    }
  }
})();
