(function(){
	/* global Chart Platform */
	'use strict';

	let moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonChartConfigService', ['$translate', '_', 'accounting','platformContextService', 'platformLanguageService',
		function ($translate, _, accounting, platformContextService, platformLanguageService){
			let service = {};

			service.onFormConfigClose = new Platform.Messenger();

			service.getChartTypes = function (){
				return [
					{id:1, code:'line', desc: $translate.instant('basics.common.chartType.lineChart')},
					{id:2, code:'bar', desc: $translate.instant('basics.common.chartType.barChart')},
				];
			};

			service.isBarChart = function (id){
				let item = _.find(service.getChartTypes(), {id: id});

				return item && item.code === 'bar';
			};

			service.isLineChart = function (id){
				let item = _.find(service.getChartTypes(), {id: id});

				return item && item.code === 'line';
			};


			service.getAlignItems = function (){
				return alignItems;
			};

			let alignItems = [
				{id:1, code:'top', desc: $translate.instant('basics.common.chartConfig.top')},
				{id:2, code:'bottom', desc: $translate.instant('basics.common.chartConfig.bottom')},
				{id:3, code:'left', desc: $translate.instant('basics.common.chartConfig.left')},
				{id:4, code:'right', desc: $translate.instant('basics.common.chartConfig.right')}
			];

			function findAlignItem(id){
				let res = _.find(alignItems, {id: id});
				return res || alignItems[0];
			}

			service.getChartOption = function (scope){
				return {
					legend: {
						labels: {
							boxWidth: 10,
							fontSize:10
						},
						display: scope.dataItem.ShowLegend,
						position: findAlignItem(scope.dataItem.LegendAlign).code
						// reverse: scope.dataItem.ReverseOrder
					},
					title: {
						display: scope.dataItem.ShowTitle,
						text: scope.dataItem.Title,
						position: findAlignItem(scope.dataItem.TitleAlign).code
					},
					scales:{
						xAxes: [{
							display: true,
							scaleLabel:{
								display: scope.dataItem.ShowXAxis,
								labelString: scope.dataItem.XTitle
							},
							ticks:{
								callback: function (dataLabel){
									return dataLabel;
								}
							},
							gridLines: {drawOnChartArea: !scope.dataItem.HideXGridLine}
						}],
						yAxes:[{
							display: true,
							scaleLabel:{
								display: scope.dataItem.ShowYAxis,
								labelString: scope.dataItem.YTitle
							},
							ticks:{
								beginAtZero: true,
								callback: function(value){
									let culture = platformContextService.culture();
									let cultureInfo = platformLanguageService.getLanguageInfo(culture);
									return accounting.formatNumber(value, 0, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
								}
							},
							gridLines: {drawOnChartArea: !scope.dataItem.HideYGridLine}
						}]
					},
					element: {
						skipNullOrZero: scope.dataItem.HideZeroValueX
					}
				};
			};

			service.parseDecToRgb = function (dec) {
				if(!dec) {return null;}
				if (_.isString(dec) && dec.charAt('0') === '#') {
					dec = dec.substr(1);
				}
				let hex = dec.toString(16);
				let r = parseInt(hex.slice(0, 2), 16);
				let g = parseInt(hex.slice(2, 4), 16);
				let b = parseInt(hex.slice(4, 6), 16);
				return r + ',' + g + ',' + b;
			};

			service.rgbToDecimal = function (rgb) {
				if(!rgb) {return 0;}

				let ds = rgb.split(/\D+/);
				return  Number(ds[0]) * 65536 + Number(ds[1]) * 256 + Number(ds[2]);

			};

			service.getPlugins = function (scope){
				return [
					{
						beforeInit: function(chart){
							if(scope.dataItem.HideZeroValueX && chart.data.labels.length > 0){
								let labelNum = chart.data.labels.length;
								for(let i=0; i<labelNum; i++){
									let allSetIsZero = true;
									_.forEach(chart.data.datasets, function (item){
										if(item.data[i]){
											allSetIsZero = false;
										}
									});
									if(allSetIsZero){
										chart.data.labels[i] = '';
									}
								}
							}
						},
						beforeDatasetsUpdate: function (chart){
							chart.data.datasets.forEach(function(dataset, i) {
								let meta = chart.getDatasetMeta(i);
								if (!meta.hidden) {
									meta.data.forEach(function(element, index) {

										// hide zero value
										let value = dataset.data[index] - 0;
										dataset.data[index] = value === 0 && (scope.dataItem.HideZeroValue || scope.dataItem.HideZeroValueX) ? NaN : dataset.data[index];
									});
								}
							});
						},
						afterDatasetsDraw: function(chart) {
							let ctx = chart.ctx;
							let culture = platformContextService.culture();
							let cultureInfo = platformLanguageService.getLanguageInfo(culture);

							chart.data.datasets.forEach(function(dataset, i) {
								let meta = chart.getDatasetMeta(i);
								if (!meta.hidden) {
									meta.data.forEach(function(element, index) {
										// Draw the text in black, with the specified font
										ctx.fillStyle = 'rgb(0, 0, 0)';

										let fontSize = 11;
										let fontStyle = 'normal';
										let fontFamily = 'Helvetica Neue';
										ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

										// Just naively convert to string for now
										let value = dataset.data[index] - 0;
										let dataString = ((!value && scope.dataItem.HideZeroValue) || !scope.dataItem.ShowDataLabel ) ? '' : (accounting.formatNumber(value, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal) || '0.00');
										// element._model.width = !value && scope.dataItem.HideZeroValue ? 0 : element._model.width;

										// Make sure alignment settings are correct
										ctx.textAlign = 'center';
										ctx.textBaseline = 'middle';

										let padding = 1;
										let position = element.tooltipPosition();
										ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
									});
								}
							});
						}
					}
				];
			};

			return service;
		}
	]);
})();