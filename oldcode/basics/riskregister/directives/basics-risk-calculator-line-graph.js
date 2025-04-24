(function (angular) {
	/*global angular,d3,globals,alert,console*/
	'use strict';
	var modulename = 'basics.riskregister';

	angular.module(modulename).directive('basicsRiskCalculatorLineGraph', [
		'$compile', '$timeout', '$http', 'basicsRiskCalculatorMainService',
		function ($compile, $timeout, $http, basicsRiskCalculatorMainService) {
			return {
				restrict: 'A',
				scope: {
					data: '=chartData',
					width: '=width',
					height: '=height',
					model: '=',
					entity: '='
				},
				template: '<svg></svg>',
				link: function (scope, element, attrs) {
					// set the dimensions and margins of the graph
					var modalPromise = $timeout(function () {
						modalPromise = null;
					}, 3000);

					var margin = {top: 10, right: 30, bottom: 30, left: 60},
						width = 460 - margin.left - margin.right,
						height = 400 - margin.top - margin.bottom;

					var data = [];

					//element.removeAttr('#normal_dist');
					var svg = d3.select('#svg')
					//.append("svg")
						.attr('width', width + margin.left + margin.right)
						.attr('height', height + margin.top + margin.bottom)
						.append('g')
						.attr('transform',
							'translate(' + margin.left + ',' + margin.top + ')');
					/*var lengthX = getMaxValue('x', data);
					var lengthY = getMaxValue('y', data);*/

					var curveFunc = d3.line()
					//.curve(d3.curveBasis)
						.x(function (d) {
							return d.x;
						})
						.y(function (d) {
							return d.y;
						});
					var x = d3.scaleUtc()
						.domain(d3.extent(data, function (d) {
							return d.x;
						}))
						.range([margin.left, width - margin.right]);

					svg.append('g')
						.attr('transform', 'translate(0,' + height + ')')
						.call(d3.axisBottom(x));
					// y-axis
					var y = d3.scaleLinear()
						.domain([0, d3.max(data, function (d) {
							return d.y;
						})])
						.range([height - margin.bottom, margin.top]);
					svg.append('g')
						.call(d3.axisLeft(y));

					var line = d3.line()
						.x(function (d) {
							return x(d.x);
						})
						.y(function (d) {
							return y(d.y);
						});

					svg.append('path')
						.datum(data)
						.attr('fill', 'none')
						.attr('stroke', 'steelblue')
						.attr('stroke-width', 1.5)
						.attr('stroke-linejoin', 'round')
						.attr('stroke-linecap', 'round')
						.attr('d', line);
					/*var triangleFlag = false;

					var objName = '';
					if (scope.entity && scope.entity.CalculationResults) {
						var step = scope.entity.CurrentStep;
						if (step) {
							var parsedStep = parseInt(step[step.length - 1]);
							if (typeof parsedStep === 'number') {
								var calcObj = scope.entity.CalculationResults[parsedStep];
								var selectedRisk = scope.entity.SelectedRisks[parsedStep];
								basicsRiskCalculatorMainService.setCalcResults(calcObj);
								/!*basicsRiskCalculatorMainService.getStatistics(calcObj,0).then(function (response) {
									console.log('Directive Response',response);
								});*!/
								basicsRiskCalculatorMainService.setFinalObjId(selectedRisk.Id);
								objName = calcObj.RiskName;
								if (calcObj) {
									if (calcObj.hasOwnProperty('Triangle') && calcObj.Triangle) {
										if (calcObj.Triangle.length > 0) {
											data = calcObj.Triangle;
											triangleFlag = true;
											sortObjs(data);
										} else {
											data = calcObj.Plots;
											triangleFlag = false;//temp to see whats going on
										}
									}
								}
							}
						}

					}

					if (triangleFlag) {
						triangle();
					} else {
						testDistributions();
					}
					/!*if (scope.entity.CurrentStep !== 'RiskResult0') {

						updateData();
					} else {
						if (triangleFlag) {
							triangle();
						} else {
							testDistributions();
						}

					}*!/
*/

					function getMaxValue(coordinate, values) {
						var largest = 0;
						switch (coordinate) {
							case 'x':
								largest = 0;
								values.forEach(function (obj) {
									if (obj.x > largest) {
										largest = obj.x;
									}

								});
								return largest;
							case 'y':
								largest = 0;
								values.forEach(function (obj) {
									if (obj.y > largest) {
										largest = obj.y;
									}

								});
								return largest;
							default:
								return 0;
						}
					}

					function sortObjs(objList) {
						objList.sort(function (a, b) {
							return a.x - b.x;
						});
					}


					scope.$on('destroy', function () {
						if (modalPromise) {
							$timeout.cancel(modalPromise);
						}
					});
				}
			};
		}]);

})(angular);
