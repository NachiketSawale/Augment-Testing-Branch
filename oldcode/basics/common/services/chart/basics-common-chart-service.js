(function (){
	/* global Chart:false _ */
	'use strict';

	const pieColor = [];
	const moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonChartService', ['accounting','platformContextService', 'platformLanguageService',
		function (accounting, platformContextService, platformLanguageService){
			let service = {
				createChart : createChart,
				createConfigChart:createConfigChart,
				hasValue: hasValue
			};
			function initCanvasStyle(element) {

				let parentElement = element.parent(),
					siblingElements = parentElement.siblings() || [],
					totalHeight = 0;
				for (let i = 0; i < siblingElements.length; i++) {
					totalHeight += siblingElements[i].offsetHeight;
				}

				const width = parseInt(parentElement.css('width')) - parseInt(parentElement.css('padding-left')) - parseInt(parentElement.css('padding-right')),
					height = parseInt(parentElement.css('height')) - parseInt(parentElement.css('padding-top')) - parseInt(parentElement.css('padding-bottom')) - totalHeight;

				element.attr('width', width).attr('height', height).css('width', width).css('height', height);
			}

			function createChart(chartType, chartDataSource, element, options, viewData, legendColors) {
				if (!chartType || !chartDataSource || !element || !Array.isArray(chartDataSource.labels) || !Array.isArray(chartDataSource.datasets) ||
					chartDataSource.labels.length < 1 || chartDataSource.datasets.length < 1) {
					return null;
				}

				initCanvasStyle(element);
				const ctx = element[0].getContext('2d'),
					chartData = chartDataSource,
					barChartData = chartDataSource.datasets;
				if (!Array.isArray(barChartData)) {
					return false;
				}

				addLegend(chartData);

				let colorStructures = generateColorStructure(chartData);
				if (legendColors) {
					if (angular.isArray(legendColors) && legendColors.length > 0){
						legendColors.splice(0, legendColors.length);
					}
				}

				addColors(barChartData, chartType, viewData, colorStructures, legendColors);

				function addLegend(chartSource) {
					for (let i = 0; i < chartSource.datasets.length; i++) {
						angular.extend(chartSource.datasets[i], {label: chartSource.legends[i].name});
					}
				}

				options.legendData = chartData.legends;

				let parseFun = function (value) {
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

				switch (chartType) {
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
						yAxes: [{
							ticks: {
								beginAtZero: true,
								callback: function (value) {
									return parseFun(value);
								}
							}
						}]
					},
					lineTension: 0
				});

				return new Chart(ctx, {type: chartType, data: chartData, options: options, isCombo: true});
			}

			function createConfigChart(chartType, chartDataSource, element, options, legendColors, plugins) {
				if (!chartType || !chartDataSource || !element || !Array.isArray(chartDataSource.labels) || !Array.isArray(chartDataSource.datasets) ||
					chartDataSource.labels.length < 1 || chartDataSource.datasets.length < 1) {
					return null;
				}

				if(options.element.skipNullOrZero && chartDataSource.labels.length > 1){
					let count = chartDataSource.labels.length;
					for(let i=count-1; i>=0; i--){
						let allZeroOrNull = true;
						_.forEach(chartDataSource.datasets, function (dataset){
							if(!dataset.data[i] === false){
								allZeroOrNull = false;
							}
						});
						if(allZeroOrNull){

							if(chartType === 'line' && i === 0) {continue;} // for line chart, the first dataset is added manually, don't need to filter

							chartDataSource.labels.splice(i, 1);
							for(let j = 0; j< chartDataSource.datasets.length; j++){
								chartDataSource.datasets[j].data.splice(i, 1);
							}
						}
					}
				}

				initCanvasStyle(element);
				const ctx = element[0].getContext('2d'),
					chartData = chartDataSource,
					barChartData = chartDataSource.datasets;
				if (!Array.isArray(barChartData)) {
					return false;
				}

				addLegend(chartData);

				let colorStructures = generateColorStructure(chartData);

				addConfigColors(barChartData, chartType, colorStructures, legendColors);

				if(options.legend.reverse && chartType !== 'line'){
					chartData.datasets = chartData.datasets.reverse();
				}

				function addLegend(chartSource) {
					for (let i = 0; i < chartSource.datasets.length; i++) {
						angular.extend(chartSource.datasets[i], {label: chartSource.legends[i].name});
					}
				}

				options.legendData = chartData.legends;

				let parseFun = function (value) {
					if (angular.isNumber(value)) {
						return value.toFixed(2);
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
								let culture = platformContextService.culture();
								let cultureInfo = platformLanguageService.getLanguageInfo(culture);
								return data.labels[tooltipItem.index] + ': ' + accounting.formatNumber(tooltipItem.yLabel, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
							}
						}
					}
				});


				return new Chart(ctx, {type: chartType, data: chartData, options: options, isCombo: true, plugins:plugins});
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
			function addColors(dataSet, chartType, viewData, colorStructures, legendColors) {
				return dataSet.map(function (item, index) {
					const colorIndex = angular.isNumber(item.colorIndex) ? item.colorIndex : index;
					let color = compareColor(defaultColor(colorIndex), viewData);
					color = getColor(color, item, viewData);
					if (legendColors) {
						legendColors.push('rgba(' + color + ',1)');
					}
					switch (chartType) {
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
						case '3D_Columns': {
							let colors = color;
							if (!isAverage(item.label)) {
								if (viewData && (viewData.Max || viewData.Min)) {
									colors = getDefaultBackgroundColors(item.data, color, viewData, colorStructures);
								}
							}
							angular.extend(item, {
								fillColor:  addRgba(colors, 0.9),
								strokeColor: addRgba(colors, 0.7),
								highlightFill: addRgba(colors, 0.7),
								highlightStroke: addRgba(colors, 0.7),
								middleColor: addRgba(colors, 0.5),
								pointColor: addRgba(colors, 1),
								pointStrokeColor: '#fff',
								pointHighlightFill: '#fff',
								pointHighlightStroke: '#fff',
								backgroundColor:addRgba(colors, 1),
								borderColor: addRgba(colors, 1),
								borderWidth: 1
							});
							break;
						}
						case 'horizontalBar':
						case 'bar': {
							let borderColors = color;
							if (!isAverage(item.label)){
								if (viewData && (viewData.Max || viewData.Min)) {
									borderColors = getDefaultBackgroundColors(item.data, color, viewData, colorStructures);
								}
							}
							angular.extend(item, {
								backgroundColor: addRgba(color, 1),
								borderColor: addRgba(borderColors, 1),
								borderWidth: {
									left: 0,
									top: 10,
									right: 0,
									bottom: 0
								}
							});
							break;
						}
						case 'pie':
							for (let i = 0; i < item.data.length - pieColor.length; i++) {
								const color = PickColor();
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

			function addConfigColors(dataSet, chartType, colorStructures, legendColors) {
				return dataSet.map(function (item, index) {
					const colorIndex = angular.isNumber(item.colorIndex) ? item.colorIndex : index;
					let color = legendColors[colorIndex];
					if(!color){
						let idx = colorIndex;
						color = defaultColor(colorIndex);
						while (legendColors.indexOf(color) >= 0){
							color = defaultColor(idx++);
						}
					}else{
						colorArray.push(color);
					}

					if(!legendColors[colorIndex]){
						legendColors[colorIndex] = color;
					}
					switch (chartType) {
						case 'line':
							angular.extend(item, {
								fill: false,
								lineTension: 0.3,
								borderWidth:2,
								backgroundColor: 'rgba(' + color + ',1)',
								borderColor: 'rgba(' + color + ',1)',
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
						case '3D_Columns': {
							let colors = color;
							angular.extend(item, {
								fillColor:  addRgba(colors, 0.9),
								strokeColor: addRgba(colors, 0.7),
								highlightFill: addRgba(colors, 0.7),
								highlightStroke: addRgba(colors, 0.7),
								middleColor: addRgba(colors, 0.5),
								pointColor: addRgba(colors, 1),
								pointStrokeColor: '#fff',
								pointHighlightFill: '#fff',
								pointHighlightStroke: '#fff',
								backgroundColor:addRgba(colors, 1),
								borderColor: addRgba(colors, 1),
								borderWidth: 1
							});
							break;
						}
						case 'horizontalBar':
						case 'bar': {
							let colors = color;
							angular.extend(item, {
								backgroundColor: addRgba(colors, 1),
								borderColor: addRgba(colors, 1),
								borderWidth: 1
							});
							break;
						}
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

			const colorArray = ['16,78,139', '124,205,124', '154,50,205','244,164,96', '205,205,0', '255,130,171'];

			function defaultColor(index) {
				if (colorArray.length <= index) {
					colorArray.push(getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor());
				}
				return colorArray[index];
			}

			function PickColor() {
				return getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor();
			}

			function getRandomColor() {
				const max = 255;
				return Math.floor(Math.random() * max);
			}

			function getColor(defaultColor, dataSet, viewData){
				if (dataSet.label === 'Average' && viewData && viewData.Avg){
					defaultColor = viewData.Avg;
				}
				return defaultColor;
			}

			function isAverage(label){
				return label === 'Average';
			}

			function getMaxColor(defaultColor, viewData){
				if (viewData && viewData.Max){
					defaultColor = viewData.Max;
				}
				return defaultColor;
			}

			function getMinColor(defaultColor, viewData){
				if (viewData && viewData.Min){
					defaultColor = viewData.Min;
				}
				return defaultColor;
			}

			function getDefaultBackgroundColors(charData, defaultColor, viewData, colorStructures){
				let maxColor = getMaxColor(defaultColor, viewData);
				let minColor = getMinColor(defaultColor, viewData);
				let backgroundColors=[];
				charData.forEach(function (item, index){
					if (item === colorStructures[index].max){
						backgroundColors.push(maxColor);
					}
					else if (item === colorStructures[index].min){
						backgroundColors.push(minColor);
					}
					else {
						backgroundColors.push(defaultColor);
					}
				});
				return backgroundColors;
			}

			function addRgba(colors, alpha){
				if (!Array.isArray(colors)) {
					colors = 'rgba(' + colors + ',' + alpha + ')';
				}
				else {
					colors = colors.map(item => 'rgba(' + item + ',' + alpha + ')');
				}
				return colors;
			}

			function generateColorStructure(chartData) {
				let structures = [];
				for (let i = 0; i < chartData.labels.length; i++) {
					let data = [];
					for (let k = 0; k < chartData.datasets.length; k++) {
						if (!isAverage(chartData.datasets[k].label)) {
							data.push(chartData.datasets[k].data[i]);
						}
					}
					structures.push({
						label: chartData.labels[i],
						datasets: data,
						max: Math.max(...data),
						min: Math.min(...data)
					});
				}
				return structures;
			}

			function compareColor(defaultColor, viewData){
				if (viewData) {
					if (viewData.Avg) {
						let avgColor = viewData.Avg;
						defaultColor = deviateColor(defaultColor, avgColor);
					}
					if (viewData.Max) {
						let maxColor = viewData.Max;
						defaultColor = deviateColor(defaultColor, maxColor);
					}
					if (viewData.Min) {
						let minColor =  viewData.Min;
						defaultColor = deviateColor(defaultColor, minColor);
					}
				}
				return defaultColor;
			}

			function deviateColor(sourceColor, compareColor) {
				let sR = parseInt(sourceColor.split(',')[0]);
				let sG = parseInt(sourceColor.split(',')[1]);
				let sP = parseInt(sourceColor.split(',')[2]);
				let rR = sR, rG = sG, rP = sP;
				let cR = parseInt(compareColor.split(',')[0]);
				let cG = parseInt(compareColor.split(',')[1]);
				let cP = parseInt(compareColor.split(',')[2]);

				if (Math.abs(sR - cR) === 0 && Math.abs(sG - cG) === 0 && Math.abs(sP - cP) === 0) {
					rR = rR < sR ? rR - 100 : rR + 100;
					if (rR < 0) rR = 0;
					if (rR > 255) rR = 255;

					rG = rG < sG ? rG - 100 : rG + 100;
					if (rG < 0) rG = 0;
					if (rG > 255) rG = 255;

					rP = rP < sP ? rP - 100 : rP + 100;
					if (rP < 0) rP = 0;
					if (rP > 255) rP = 255;
				}

				return rR.toString() + ',' + rG.toString() + ',' + rP.toString();
			}

			return service;
		}
	]);
})();