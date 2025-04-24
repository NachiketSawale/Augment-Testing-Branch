(function(angular){
	/*global angular,d3,globals,alert*/
	'use strict';
	var modulename = 'basics.riskregister';

	angular.module(modulename).directive('dRisk',[
		'$compile','$timeout',
		function ($compile,$timeout) {
			return {
				restrict: 'A',
				scope: {
					data: '=chartData',
					width: '=width',
					height: '=height'
				},
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/risk-calculator/estimate-risk-calculator-results.html',
				controller: 'basicsRiskCalculatorController',
				link: function (scope, element, attrs) {
					// set the dimensions and margins of the graph
					var modalPromise = $timeout(function () {
						modalPromise = null;
					},3000);
					var margin = {top: 10, right: 30, bottom: 30, left: 60},
						width = 460 - margin.left - margin.right,
						height = 400 - margin.top - margin.bottom;
					var data;
					/*if(scope.data && scope.data.Plots){
							data = scope.data.Plots;
						}else if(scope.points && scope.points.hasOwnProperty('Plots')){
							data = scope.points.Plots;
						}else{
							data = [];
						}*/
					if(scope.data && scope.data.Triangle){
						data = scope.data.Triangle;
					}else if(scope.points && scope.points.hasOwnProperty('Triangle')){
						data = scope.points.Triangle;
					}else{
						data = [];
					}
					sortObjs(data);
					// append the svg object to the body of the page
					var svg = d3.select('#my_dataviz')
						.append('svg')
						.attr('width', width + margin.left + margin.right)
						.attr('height', height + margin.top + margin.bottom)
						.append('g')
						.attr('transform',
							'translate(' + margin.left + ',' + margin.top + ')');
						// x-axis
					var lengthX = getMaxValue('x',data);
					var lengthY = getMaxValue('y',data);

					var curveFunc = d3.line()
					//.curve(d3.curveBasis)
						.x(function (d) {
							return d.x;
						})
						.y(function (d) {
							return d.y;
						});
					var x = d3.scaleLinear()
						.domain([0,lengthX])
						.range([0,width]);
					svg.append('g')
						.attr('transform','translate(0,' + height + ')')
						.call(d3.axisBottom(x));
					// y-axis
					var y = d3.scaleLinear()
						.domain([0,lengthY])
						.range([height,0]);
					svg.append('g')
						.call(d3.axisLeft(y));

					var line = d3.line()
						.x(function(d) {
							return x(d.x);
						})
						.y(function(d) {
							return y(d.y);
						});

					svg.append('path')
						.datum(data)
						.attr('class','line')
						.attr('d',line)
						.style('fill', d3.color('steelblue'));
					element.append(svg);
					$compile(svg)(scope);
					/*
						element.remove('d-risk');
						$compile(element)(scope);*/
					function getMaxValue(coordinate,values){
						var largest = 0;
						switch (coordinate) {
							case 'x':
								largest = 0;
								values.forEach(function (obj) {
									if(obj.x > largest){
										largest = obj.x;
									}

								});
								return largest;
							case 'y':
								largest = 0;
								values.forEach(function (obj) {
									if(obj.y > largest){
										largest = obj.y;
									}

								});
								return largest;
							default:
								return 0;
						}
					}

					function sortObjs(objList){
						objList.sort(function(a,b){
							return a.x - b.x;
						});
					}
					scope.$on('destroy',function () {
						if(modalPromise){
							$timeout.cancel(modalPromise);
						}
					});
				}
			};
		}]);
})(angular);
