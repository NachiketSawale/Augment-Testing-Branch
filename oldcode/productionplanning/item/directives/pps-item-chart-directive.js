/**
 * Created by anl on 9/2/2019.
 */

/*global Chart:false */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	var pieColor = [];

	angular.module(moduleName).directive('productionplanningItemChartDirective',
		['platformContextService', 'platformLanguageService', 'platformDomainService', '$interval',
			function (platformContextService, platformLanguageService, platformDomainService, $interval) {
				return {
					restrict: 'E',
					template: '<canvas id="ppsChart"></canvas>',
					replace: true,
					scope: {
						chartDataSource: '=',
						chartType: '=',
						triggerUpdateEvent: '=',
						printChartEvent: '='
					},
					link: function (scope, element) {
						var myChart = null;

						scope.$watch('chartDataSource', function () {
							recreateChart();
						});

						scope.$watch('chartType', function () {
							recreateChart();
						});

						scope.$watch('triggerUpdateEvent', function () {
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.register(recreateChart);
							}
						});

						scope.$watch('printChartEvent', function () {
							if (scope.printChartEvent) {
								scope.printChartEvent.register(printChart);
							}
						});

						platformContextService.contextChanged.register(contextChangedHandler);

						function contextChangedHandler(type) {
							if (type === 'culture' &&
								scope.chartDataSource &&
								scope.chartDataSource.datasets &&
								scope.chartDataSource.datasets.yValueDomain &&
								scope.chartDataSource.datasets.yValueDomain.name) {
								var domainInfo = platformDomainService.loadDomain(scope.chartDataSource.datasets.yValueDomain.name),
									culture = platformContextService.culture(),
									cultureInfo = platformLanguageService.getLanguageInfo(culture);

								angular.extend(scope.chartDataSource.datasets.yValueDomain, {
									decimal: cultureInfo[domainInfo.datatype].decimal,
									thousand: cultureInfo[domainInfo.datatype].thousand
								});
							}
						}

						scope.$on('$destroy', function () {
							platformContextService.contextChanged.unregister(contextChangedHandler);
							if (myChart) {
								myChart.destroy();
							}
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.unregister(resizeChart);
							}
						});

						function recreateChart(print) {
							if (myChart) {
								myChart.destroy();
							}

							contextChangedHandler('culture');
							myChart = createChart(scope.chartType, scope.chartDataSource, element, {
								onAnimationProgress: function () {
									if (!hasValue(scope.chartDataSource)) {
										this.destroy();
									}
								},
								print: print
							});
						}

						function resizeChart() {
							if (myChart) {
								myChart.resize(myChart.render, true);
							}
						}

						function printChart() {
							recreateChart('print');
							$interval(doPrint, 1000, 1);
						}

						function doPrint(){
							var win = window.open();
							var chartElement = document.getElementById('ppsChart');
							beforePrint(win);
							win.document.write('<br><img src="' + chartElement.toDataURL() + '" style="margin:50px";></br>');
							win.document.close();
							$interval(recreateChart, 1000, 1);
						}

						function beforePrint(win) {
							var style = document.createElement('style');
							var chartHeight = $('#ppsChart').height();
							var marginTop = '0mm';
							if (chartHeight < 800) {
								var temp = 800 - parseInt(chartHeight);
								marginTop = (temp / 8).toFixed(2) + 'mm';
							}
							style.innerHTML = '@page(size:landscape; margin:auto 0mm; margin-top:' + marginTop + '';
							win.document.head.appendChild(style);
						}
					}
				};
			}
		]);


	function initCanvasStyle(element) {

		var parentElement = element.parent(),
			siblingElements = parentElement.siblings() || [],
			totalHeight = 0;
		for (var i = 0; i < siblingElements.length; i++) {
			totalHeight += siblingElements[i].offsetHeight;
		}

		var width = parseInt(parentElement.css('width')) - parseInt(parentElement.css('padding-left')) - parseInt(parentElement.css('padding-right')),
			height = parseInt(parentElement.css('height')) - parseInt(parentElement.css('padding-top')) - parseInt(parentElement.css('padding-bottom')) - totalHeight;

		element.attr('width', width).attr('height', height).css('width', width).css('height', height);
	}

	function createChart(charType, chartDataSource, element, options) {
		if (!charType || !chartDataSource || !element || !Array.isArray(chartDataSource.labels) || !Array.isArray(chartDataSource.datasets) ||
			chartDataSource.labels.length < 1 || chartDataSource.datasets.length < 1) {
			return null;
		}

		initCanvasStyle(element);

		var ctx = element[0].getContext('2d'),
			chartData = chartDataSource,
			barChartData = chartDataSource.datasets;
		if (!Array.isArray(barChartData)) {
			return false;
		}

		addColors(barChartData, charType);

		addLegend(chartData);

		function addLegend(chartSource) {
			for (var i = 0; i < chartSource.datasets.length; i++) {
				angular.extend(chartSource.datasets[i], {label: chartSource.legends[i].name});
			}
		}

		options.legendData = chartData.legends;

		var parseFun = function (value) {
			if (angular.isNumber(value)) {
				return parseFloat(value.toFixed(2));
			}
			return value;
		};

		options.data = chartData;

		if (chartData.datasets.yValueDomain) {
			if (Chart.Domain[chartDataSource.datasets.yValueDomain.name]) {
				parseFun = Chart.Domain[chartDataSource.datasets.yValueDomain.name].parse;
			}
		}

		options.barStrokeWidth = 1;
		options.responsive = true;

		switch (charType) {
			case 'line':
				angular.extend(options, {
					tooltips: {
						callbacks: {
							title: function (tooltipItem, data) {
								if (data && tooltipItem && data.legends && data.legends.length > 0 && tooltipItem.length > 0) {
									return data.legends[tooltipItem[0].datasetIndex].name;
								} else {
									return '';
								}
							},
							label: function (tooltipItem, data) {
								return data.labels[tooltipItem.index] + ': ' + parseFun(tooltipItem.yLabel);
							}
						}
					}
				});
				break;
			default:
				break;
		}

		angular.extend(options, {
			scales: {
				xAxes: [{
					stacked: true
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: function (value) {
							return parseFun(value);
						}
					},
					stacked: true
				}]
			},
			lineTension: 0
		});

		if(options.print === 'print'){
			ctx.canvas.width = 1400;
			ctx.canvas.height = 700;
			options.responsive = false;
		}

		// quickly fix issue of #146230
		const tmpLength = chartData.datasets.length;
		if(tmpLength > 0){
			for (let i = 0; i < tmpLength; i++) {
				if (chartData.datasets[i].type === 'bar') {
					chartData.datasets[i] = {
						'data': chartData.datasets[i].data,
						'label': chartData.datasets[i].label,
						'backgroundColor': chartData.datasets[i].backgroundColor,
						'borderColor': chartData.datasets[i].borderColor,
						'borderWidth': chartData.datasets[i].borderWidth,
					};
				}
			}
		}

		var myChart = new Chart(ctx, {type: charType, data: chartData, options: options});

		return myChart;
	}

	function hasValue(data) {
		return (data && Array.isArray(data.datasets) && Array.isArray(data.labels) &&
		data.labels.length > 0 && data.datasets.length > 0);
	}

	/*
	 * fillColor: "rgba(220,220,220,0.7)"
	 * strokeColor: "rgba(220,220,220,0.8)"
	 * highlightFill: "rgba(220,220,220,0.9)"
	 * highlightStroke: "rgba(220,220,220,1)"
	 */
	function addColors(dataSet, charType) {
		return dataSet.map(function (item, index) {
			var color;
			if (item.intColor) {
				color = ((item.intColor >> 16) & 0xFF) + ',' + ((item.intColor >> 8) & 0xFF) + ',' + (item.intColor & 0xFF);
			} else {
				var colorIndex = angular.isNumber(item.colorIndex) ? item.colorIndex : index;
				color = defaultColor(colorIndex);
			}

			switch (charType) {
				case 'radar':
					angular.extend(item, {
						backgroundColor: 'rgba(' + color + ',0.5)',
						borderColor: 'rgba(' + color + ',0.4)',
						pointBackgroundColor: 'rgba(' + color + ',0.3)',
						pointBorderColor: 'rgba(' + color + ',1)',
						pointHoverBackgroundColor: 'rgba(' + color + ',0.8)',
						pointHoverBorderColor: 'rgba(' + color + ',0.9)'
					});
					break;
				case 'line':
					angular.extend(item, {
						fill: true,
						lineTension: 0.1,
						backgroundColor: 'rgba(' + color + ',0.5)',
						borderColor: 'rgba(' + color + ',0.3)',
						borderCapStyle: 'rgba(' + color + ',0.4)',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'rgba(' + color + ',0.6)',
						pointBackgroundColor: 'rgba(' + color + ',1)',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBorderColor: 'rgba(' + color + ',1)',
						pointHoverBorderWidth: 2,
						pointHitRadius: 10,
						spanGaps: false
					});
					break;
				case '3D_Columns':
					angular.extend(item, {
						fillColor: 'rgba(' + color + ',0.9)',
						strokeColor: 'rgba(' + color + ',0.7)',
						highlightFill: 'rgba(' + color + ',0.7)',
						highlightStroke: 'rgba(' + color + ',0.7)',
						middleColor: 'rgba(' + color + ',0.5)',
						pointColor: 'rgba(' + color + ',1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: '#fff',
						backgroundColor: 'rgba(' + color + ',1)',
						borderColor: 'rgba(' + color + ',1)',
						borderWidth: 1
					});
					break;
				case 'horizontalBar':
				case 'bar':
					angular.extend(item, {
						backgroundColor: 'rgba(' + color + ',1)',
						borderColor: 'rgba(' + color + ',1)',
						borderWidth: 1
					});
					break;
				case 'pie':
					var length = item.data.length - pieColor.length;
					for (var i = 0; i < length; i++) {
						color = pickColor();
						pieColor.push('rgba(' + color + ',0.8)');
					}
					angular.extend(item, {
						backgroundColor: pieColor
					});
					break;
				default:
					angular.extend(item, {
						fillColor: 'rgba(' + color + ',1)',
						strokeColor: 'rgba(' + color + ',1)',
						highlightFill: 'rgba(' + color + ',0.9)',
						highlightStroke: 'rgba(' + color + ',1)',
						middleColor: 'rgba(' + color + ',0.5)',
						pointColor: 'rgba(' + color + ',1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: '#fff'
					});
			}
		});
	}

	var colorArray = ['0,103,177', '171,211,144', '182,96,238'];

	function defaultColor(index) {
		if (colorArray.length <= index) {
			colorArray.push(getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor());
		}
		return colorArray[index];
	}

	function pickColor() {
		return getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor();
	}

	function getRandomColor() {
		var max = 255;
		return Math.floor(Math.random() * max);
	}

})(angular);