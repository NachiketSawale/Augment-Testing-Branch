(function(){
	/* global */
	'use strict';

	let moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonChartContainerFactoryService', ['_', 'basicsCommonChartConfigService', 'PlatformMessenger','$timeout', 'basicsCommonChartCategoryType',
		function (_, chartConfigService, PlatformMessenger,$timeout, basicsCommonChartCategoryType){
			let service = {};

			service.initController = function (scope, chartConfig){
				scope.dataItem = scope.$eval(chartConfig.MdcContrChartDto.ChartOptionConfig);

				if(chartConfig.MdcContrChartDto.BasChartTypeFk === 1){
					scope.dataItem.DrillDownForData = false;
					scope.dataItem.ReverseOrder = false;
				}else if(chartConfig.MdcContrChartDto.BasChartTypeFk === 2){
					scope.dataItem.FilterBySelectStructure = chartConfig.MdcContrChartDto.ChartOptionConfig.indexOf('FilterBySelectStructure') < 0 ? true : scope.dataItem.FilterBySelectStructure;
				}

				if(scope.dataItem.Is3DView){
					scope.chartType = '3D_Columns';
				}else{
					let chartType = chartConfigService.getChartTypes();
					let res = _.find(chartType, {id: chartConfig.MdcContrChartDto.BasChartTypeFk}) || chartType[0];
					scope.chartType = res.code;
				}


				let newLegends = [],
					newDataSets = [],
					newLabels = [];

				let labelNum = 1;
				for(let i=0; i<labelNum; i++){
					// let date = new Date();
					// newLabels.push(scope.dataItem.CategoryKey === 1 ? date.getUTCFullYear() + '-0' + (i +1) : 'Category ' + (i + 1));
					newLabels.push('');
				}

				scope.legendColors = [];

				chartConfig.MdcContrChartSeriesDtos = _.filter(chartConfig.MdcContrChartSeriesDtos, function (item){
					if(item.MdcContrColumnPropDefFk){
						return true;
					}else{
						let formulaObj = _.find(chartConfig.MdcContrFormulaDtos, {Id: item.MdcContrFormulapropdefFk});
						return !(formulaObj && !formulaObj.IsVisible);
					}
				});

				if(chartConfig.MdcContrChartSeriesDtos && chartConfig.MdcContrChartSeriesDtos.length > 0){

					_.forEach(chartConfig.MdcContrChartSeriesDtos, function (item){
						item.Code = item.Code ? item.Code.trim() : item.Code;
					});

					if(scope.chartType === 'bar'){
						chartConfig.MdcContrChartSeriesDtos = _.orderBy(chartConfig.MdcContrChartSeriesDtos, 'Code');
						// scope.dataItem.ReverseOrder
						// ? _.orderBy(chartConfig.MdcContrChartSeriesDtos, 'Code', 'desc')
						// : _.orderBy(chartConfig.MdcContrChartSeriesDtos, 'Code');
					}
					_.forEach(chartConfig.MdcContrChartSeriesDtos, function (item){
						newLegends.push({name: item.Description.Translated});
						item.Color = item.ChartDataConfig ? scope.$eval(item.ChartDataConfig).color - 0 : 0;
						scope.legendColors.push(item.Color ? chartConfigService.parseDecToRgb(_.padStart(item.Color.toString(16), 7, '#000000')) : null);
					});

					_.forEach(chartConfig.MdcContrChartSeriesDtos, function (){

						let newDataSet = [];
						for(let i=0; i<labelNum; i++) {
							newDataSet.push(0);
						}
						newDataSets.push({data: newDataSet});
					});
				}

				scope.legendColorsAsc = angular.copy(scope.legendColors);
				scope.legendColorsDesc = angular.copy(scope.legendColors);
				scope.legendColorsDesc = scope.legendColorsDesc.reverse();

				scope.series = chartConfig.MdcContrChartSeriesDtos;

				scope.chartOption = chartConfigService.getChartOption(scope);

				if(chartConfig.MdcContrChartDto.Description){
					scope.chartOption.containerTitle = chartConfig.MdcContrChartDto.Description.Translated || chartConfig.MdcContrChartDto.Description.Description;
				}

				// if(scope.dataItem.CategoryKey === basicsCommonChartCategoryType.ReportPeriod){
				// scope.chartOption.scales.xAxes[0].ticks.callback = function (label){
				// if(!label || label === ''){return '';}
				// let data = new Date(label);
				// return data.getFullYear() + '-' + (data.getMonth()+1);
				// };
				// }

				scope.plugins = chartConfigService.getPlugins(scope);

				scope.chartDataSourceTemp = {
					legends: newLegends,
					labels: newLabels,
					datasets: newDataSets
				};

				scope.triggerUpdateEvent = new PlatformMessenger();

				scope.onContentResized(function () {
					scope.triggerUpdateEvent.fire();
				});
			};

			service.reloadChartData = function (scope, items){
				let newLegends = [],
					newDataSets = [],
					newLabels = [];

				let itemsCopy = angular.copy(items);

				if(scope.chartType === 'line' || itemsCopy.length === 0) {
					itemsCopy.unshift({label: ''});
				}

				_.forEach(itemsCopy, function (item){
					let label = item.label;

					if(scope.dataItem.CategoryKey === basicsCommonChartCategoryType.ReportPeriod && label){
						let data = new Date(label);
						if(data.getFullYear() && (data.getMonth()+1) >= 1){
							let month = data.getMonth()+1;
							month = month < 10 ? '0'+ month : (month + '');
							label = data.getFullYear() + '-' + month;
						}
					}

					newLabels.push(label);

				});

				_.forEach(scope.series, function (i){
					let newDataSet = [];
					_.forEach(itemsCopy, function (item){
						let val = item[i.Code] || 0;
						val = Math.round((val-0) * Math.pow(10, 2)) / Math.pow(10, 2);
						newDataSet.push(val);

					});
					newDataSets.push({data: newDataSet});
					newLegends.push({name: i.Description.Translated});
				});

				if(scope.guid){
					service.setCache({
						legends: angular.copy(newLegends),
						labels: newLabels,
						datasets: angular.copy(newDataSets)
					}, scope.guid);
				}

				if(scope.dataItem.ReverseOrder){
					newLegends = newLegends.reverse();
					newDataSets = newDataSets.reverse();
					scope.legendColors = scope.legendColorsDesc;
				}else{
					scope.legendColors = scope.legendColorsAsc;
				}

				$timeout(function (){
					scope.chartDataSource = {
						legends: newLegends,
						labels: newLabels,
						datasets: newDataSets
					};
				});
			};

			let chartDataCache = {};
			service.setCache = function (chartDataSource, guid){
				chartDataCache[guid] = chartDataSource;
			};

			service.getCache = function (guid){
				return chartDataCache[guid];
			};

			return service;
		}
	]);

	angular.module(moduleName).constant('basicsCommonChartCategoryType', {
		ReportPeriod: 1,
		GroupStructure: 2
	});
})();