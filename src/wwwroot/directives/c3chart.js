(function () {
  'use strict';

  angular
      .module('dopplerRelay')
      .directive('c3chart', c3chart);

  function c3chart() {
    var directive = {
      restrict: 'E',
      link: link,
      template: '<div class="C3CHART"></div>',
      scope: {
        graphdata: '=graphdata'
      }
    };

    return directive;

    function link(scope, iElement, iAttrs) {
      scope.$watch('graphdata', function () {
        if (!scope.graphdata) {
          return;
        }

        var columns = [
          ['x'].concat(scope.graphdata.x.data)
        ].concat(scope.graphdata.series.map(function (serie) {
          return [serie.name].concat(serie.data);
        }));

        var legendNames = scope.graphdata.series.map(function (serie) {
          return serie.name;
        });

        var colors = {};
        for (var i in scope.graphdata.series) {
          var serie = scope.graphdata.series[i];
          colors[serie.name] = serie.color;
          }

        var xFormat = scope.graphdata.x.format;

        var chart = c3.generate({
          bindto: iElement[0],
          data: {
            x: 'x',
            xFormat: '%Y-%m-%d %H:%M:%S',
            columns: columns,
            colors: colors,
            type: 'area'
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: xFormat
              }
            }
          },
          zoom: {
            enabled: false
          },
          legend: {
            show: false
          },
          grid: {
            y: {
              show: true
            },
            x: {
              show: true
            }
          }

        });
        function toggle(id) {
          chart.toggle(id);
        }

        // Ugly patch, I am trying to replicate old behavior of: 
        //     d3.select('.first-chart')...
        // but without external references
        var d3Chart = d3.select(chart.element);

        d3Chart.insert('div').attr('class', 'legend').selectAll('span')
            .data(legendNames)
            .enter().append('span')
            .attr('data-id', function (legendName) { return legendName; })
            .html(function (legendName) { return legendName; })
            .each(function (legendName) {
              // Ugly patch to match the color with opacity 
              var rgb = d3.rgb(chart.color(legendName));
              var littleBox = d3.select(this).append('div')
                .style('border', 'solid 1px ' + chart.color(legendName))
                .style('background-color', "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",.2)");
            })
            .on('mouseover', function (legendName) { chart.focus(legendName); })
            .on('mouseout', function (legendName) { chart.revert(); })
            .on('click', function (legendName) { chart.toggle(legendName); });

      }, true);
    }
  }

})();
