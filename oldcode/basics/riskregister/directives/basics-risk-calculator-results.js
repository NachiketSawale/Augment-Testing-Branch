(function (angular) {
	/*global angular,d3,globals,alert,console*/
	'use strict';
	var modulename = 'basics.riskregister';

	angular.module(modulename).directive('basicsRiskCalculatorResults', [
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
				replace:true,
				//templateUrl: globals.appBaseUrl + 'estimate.main/templates/risk-calculator/estimate-risk-calculator-results.html',
				/*
				controller: 'basicsRiskCalculatorController',*/
				link: function (scope, element, attrs) {
					// set the dimensions and margins of the graph
					var modalPromise = $timeout(function () {
						modalPromise = null;
					}, 3000);

					var margin = {top: 10, right: 30, bottom: 30, left: 60},
						width = 460 - margin.left - margin.right,
						height = 400 - margin.top - margin.bottom;

					var data = [];

					var triangleFlag = false;

					var objName = '';
					if (scope.entity && scope.entity.CalculationResults) {
						var step = scope.entity.CurrentStep;
						if (step) {
							var parsedStep = parseInt(step[step.length - 1]);
							if (typeof parsedStep === 'number') {
								var calcObj = scope.entity.CalculationResults[parsedStep];
								var selectedRisk = scope.entity.SelectedRisks[parsedStep];
								basicsRiskCalculatorMainService.setCalcResults(calcObj);
								/*basicsRiskCalculatorMainService.getStatistics(calcObj,0).then(function (response) {
									console.log('Directive Response',response);
								});*/
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


					chart();

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

					function updateData() {

						var lengthX = getMaxValue('x', data);
						var lengthY = getMaxValue('y', data);
						// Scale the range of the data again
						var x = d3.scaleLinear()
							.domain([0, lengthX])
							.range([0, width]);
						var y = d3.scaleLinear()
							.domain([0, lengthY])
							.range([height, 0]);

						// Select the section we want to apply our changes to
						var svg = d3.select('#my_dataviz').transition();
						var line = d3.line()
							.x(function (d) {
								return x(d.x);
							})
							.y(function (d) {
								return y(d.y);
							});
						// Make the changes
						svg.select('.line')   // change the line
							.duration(750)
							.attr('d', line(data));
						svg.select('.x.axis') // change the x axis
							.duration(750)
							.call(d3.axisBottom(x));
						svg.select('.y.axis') // change the y axis
							.duration(750)
							.call(d3.axisLeft(y));
						/*element.removeAttr("basicsRiskCalculatorResults");
						$compile(svg)(scope);*/
					}

					function triangle() {
						// append the svg object to the body of the page

						var svg = d3.select('#my_dataviz')
							.append('svg')
							.attr('width', width + margin.left + margin.right)
							.attr('height', height + margin.top + margin.bottom)
							.append('g')
							.attr('transform',
								'translate(' + margin.left + ',' + margin.top + ')');
						var lengthX = getMaxValue('x', data);
						var lengthY = getMaxValue('y', data);

						var curveFunc = d3.line()
						//.curve(d3.curveBasis)
							.x(function (d) {
								return d.x;
							})
							.y(function (d) {
								return d.y;
							});
						var x = d3.scaleLinear()
							.domain([0, lengthX])
							.range([0, width]);
						svg.append('g')
							.attr('transform', 'translate(0,' + height + ')')
							.call(d3.axisBottom(x));
						// y-axis
						var y = d3.scaleLinear()
							.domain([0, lengthY])
							.range([height, 0]);
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
							.attr('class', 'line')
							.attr('d', line)
							.style('fill', d3.color('steelblue'));
						/*element.removeAttr("basicsRiskCalculatorResults");
						*/
						element.append(svg);
						$compile(svg)(scope);
					}

					function testDistributions() {
						//element.removeAttr('#normal_dist');

						var svg = d3.select('#my_dataviz')
							.append('svg')
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
						/*element.removeAttr("basicsRiskCalculatorResults");
						element.append(svg);
						$compile(svg)(scope);*/
						element.append(svg);
						$compile(svg)(scope);
					}

					function chart(){

						if ($('.chart', element[0]).length) {
							$('.chart', element[0]).remove();
						}
						var svg = d3.select(element[0])
							.append('svg')
							.attr('width', width + margin.left + margin.right)
							.attr('height', height + margin.top + margin.bottom)
							.classed('chart', true)
							.attr('transform',
								'translate(' + margin.left + ',' + margin.top + ')');

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
							.call(d3.axisRight(y));

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
