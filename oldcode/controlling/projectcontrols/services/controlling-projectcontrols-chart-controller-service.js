(function () {
	/* global  _ */
	'use strict';

	let moduleName = 'controlling.projectcontrols';
	angular.module(moduleName).factory('controllingProjectControlsChartControllerService',
		['basicsCommonChartContainerFactoryService', 'platformGridAPI', 'basicsCommonChartCategoryType', 'controllingProjectcontrolsDashboardService', 'cloudCommonGridService',
			function (basicsCommonChartContainerFactoryService, platformGridAPI, basicsCommonChartCategoryType, controllingProjectcontrolsDashboardService, cloudCommonGridService) {
				let serviceFactory = {};

				serviceFactory.createNewInstance = function (scope) {

					let service = {};
					let $scope = scope;
					let filterBySelectStructure = true;
					let isLoading = false;

					service.initController = function () {
						filterBySelectStructure = $scope.dataItem.FilterBySelectStructure;
						if ($scope.dataItem.CategoryKey === basicsCommonChartCategoryType.ReportPeriod) {
							let chartDatas = basicsCommonChartContainerFactoryService.getCache($scope.guid);
							if (chartDatas) {
								$scope.chartDataSource = chartDatas;
							} else {
								$scope.chartDataSource = $scope.chartDataSourceTemp;
							}

							refreshLineChart();

							controllingProjectcontrolsDashboardService.registerCostAnalysisLoaded(onCostAnalysisLoaded);
							controllingProjectcontrolsDashboardService.registerConfigurationChanged(chartConfig);
							if(filterBySelectStructure){
								controllingProjectcontrolsDashboardService.registerSelectionChanged(refreshLineChart);
							}

							$scope.tools = {
								showImages: true,
								showTitles: true,
								cssClass: 'tools',
								items: [
									{
										id: 'refresh',
										sort: 0,
										caption: 'basics.common.button.refresh',
										type: 'item',
										iconClass: 'control-icons ico-refresh',
										fn: function () {
											onCostAnalysisLoaded();
										},
										disabled: false
									}
								],
								update: function () {
									return;
								}
							};

							$scope.setTools($scope.tools);

							$scope.$on('$destroy', function () {
								controllingProjectcontrolsDashboardService.unregisterCostAnalysisLoaded(onCostAnalysisLoaded);
								controllingProjectcontrolsDashboardService.unregisterConfigurationChanged(chartConfig);
								if(filterBySelectStructure){
									controllingProjectcontrolsDashboardService.unregisterSelectionChanged(refreshLineChart);
								}
							});
						} else {
							refreshBarChart();

							if(filterBySelectStructure){
								controllingProjectcontrolsDashboardService.registerSelectedEntitiesChanged(onProjectSelectedRowsChanged);
							}
							controllingProjectcontrolsDashboardService.registerConfigurationChanged(chartConfig);
							controllingProjectcontrolsDashboardService.registerCostAnalysisLoaded(refreshBarChart);

							currentSelectedEntities = [];
							previousSelected = [];

							if ($scope.dataItem.DrillDownForData && filterBySelectStructure) {
								$scope.tools = {
									showImages: true,
									showTitles: true,
									cssClass: 'tools',
									items: [
										{
											id: 'goBack',
											sort: 0,
											caption: 'controlling.projectcontrols.goBack',
											type: 'item',
											iconClass: 'control-icons ico-ar1-left1',
											fn: function () {
												if (previousSelected.length > 0) {
													currentSelectedEntities = previousSelected.pop();
													onProjectSelectedRowsChanged(currentSelectedEntities);
												}
											},
											disabled: false
										}
									],
									update: function () {
										return;
									}
								};

								$scope.setTools($scope.tools);
							}

							$scope.$on('$destroy', function () {
								if(filterBySelectStructure){
									controllingProjectcontrolsDashboardService.unregisterSelectedEntitiesChanged(onProjectSelectedRowsChanged);
								}
								controllingProjectcontrolsDashboardService.unregisterConfigurationChanged(chartConfig);
								controllingProjectcontrolsDashboardService.unregisterCostAnalysisLoaded(refreshBarChart);
								currentSelectedEntities = [];
								previousSelected = [];
							});
						}
					};

					let previousSelected;
					let currentSelectedEntities;

					service.chartClickFun = function (label) {
						if (!$scope.dataItem.DrillDownForData || $scope.dataItem.CategoryKey === basicsCommonChartCategoryType.ReportPeriod || label === null || label === undefined) {
							return;
						}

						let selectedItems = currentSelectedEntities.length > 0 ? currentSelectedEntities : controllingProjectcontrolsDashboardService.getSelectedEntities();
						// label = label === '' ? 'Structure Code' : label; // label === '', means it is root level
						let selected = label === '' ? _.find(selectedItems, {Id: 0}) : _.find(selectedItems, {Code: label});
						if (!selected) {
							return;
						}
						let children = selected.Children;
						if (!children || children.length <= 0) {
							return;
						}

						previousSelected.push(selectedItems);

						currentSelectedEntities = children;
						onProjectSelectedRowsChanged(children);
					};

					function onProjectSelectedRowsChanged(children) {
						if (!children) {
							// this mean is this action isn't invoked by drill down
							currentSelectedEntities = [];
							previousSelected = [];
						}
						let selectedItems = children || controllingProjectcontrolsDashboardService.getSelectedEntities();

						if (_.isArray(selectedItems) && selectedItems.length > 0) {
							_.forEach(selectedItems, function (item) {
								item.label = item.Id === 0 ? '' : item.Code;
							});

							// if($scope.chartType === 'line') {
							// selectedItems.unshift({label: ''});
							// }

							currentSelectedEntities = selectedItems;

							basicsCommonChartContainerFactoryService.reloadChartData($scope, selectedItems);
						} else {
							basicsCommonChartContainerFactoryService.reloadChartData($scope, []);
						}
					}

					function refreshLineChart(){
						basicsCommonChartContainerFactoryService.reloadChartData($scope, _.sortBy(getPeriodData(), 'label'));
					}

					function initPeriodData(label){
						let data = {
							label: label
						}

						if( $scope && _.isArray($scope.series) && $scope.series.length > 0){
							_.forEach($scope.series, (serie) => {
								data[serie.Code] = 0;
							})
						}

						return data;
					}

					function getPeriodData() {
						/**
						 * sometimes cannot get the selected entity by dataService.getSelected()
						 * but dataService.getSelectedEntities() works as excepted
						 */
						const selectedDashboardEntities = filterBySelectStructure ? controllingProjectcontrolsDashboardService.getSelectedEntities() : [controllingProjectcontrolsDashboardService.getList()[0]];
						const allPeriodCostAnalysisList = controllingProjectcontrolsDashboardService.getPeriodCostAnalysisList();
						if (!selectedDashboardEntities || !allPeriodCostAnalysisList || allPeriodCostAnalysisList.length === 0) {
							return [];
						}

						let periodCostAnalysisList = [];

						_.forEach(selectedDashboardEntities, (selectedDashboardItem) => {
							periodCostAnalysisList = periodCostAnalysisList.concat(_.filter(allPeriodCostAnalysisList, (d) => {
								if (selectedDashboardItem.StructureLevel !== d.StructureLevel) {
									return false;
								}

								for (let i = 1; i <= selectedDashboardItem.StructureLevel; i++) {
									if (d['StructureLevel' + i + 'Id'] !== selectedDashboardItem['StructureLevel' + i + 'Id'] || selectedDashboardItem.StructureIdId !== d.StructureIdId) {
										return false;
									}
								}

								return true;
							}));
						})

						let periodDataList = [];
						const periodDataGroup = _.groupBy(periodCostAnalysisList, (item) => {
							return item.periodDate;
						});

						_.forEach(periodDataGroup, (groupItems, date) => {
							let periodData = {
								label: date
							}

							if( $scope && _.isArray($scope.series) && $scope.series.length > 0){
								_.forEach($scope.series, (serie) => {
									periodData[serie.Code] = 0;
								})

								_.forEach(groupItems, (item) => {
									_.forEach($scope.series, (serie) => {
										periodData[serie.Code] += item[serie.Code];
									})
								})
							}

							periodDataList.push(periodData);
						});

						return periodDataList;
					}

					function onCostAnalysisLoaded() {
						if(isLoading){
							return;
						}

						isLoading = true;

						controllingProjectcontrolsDashboardService.setPeriodCostAnalysisList([]);
						controllingProjectcontrolsDashboardService.loadDashBorad(true).then(function (response) {
							let costAnalysisList = [];
							if (response && response.length) {
								cloudCommonGridService.flatten(response, costAnalysisList, 'Children');
							}

							isLoading = false;
							costAnalysisList = costAnalysisList.concat(controllingProjectcontrolsDashboardService.getList());
							controllingProjectcontrolsDashboardService.setPeriodCostAnalysisList(costAnalysisList);

							refreshLineChart();
						});
					}

					function refreshBarChart(){
						let selectedItems;

						if(filterBySelectStructure){
							selectedItems = controllingProjectcontrolsDashboardService.getSelectedEntities();
						}else{
							selectedItems = controllingProjectcontrolsDashboardService.getList();
							selectedItems = selectedItems.filter(item => item.Id === 0);
						}

						if (_.isArray(selectedItems)) {
							onProjectSelectedRowsChanged(selectedItems);
						} else {
							$scope.chartDataSource = $scope.chartDataSourceTemp;
						}
					}

					function chartConfig() {
						let series = [];
						_.forEach($scope.series, function (item) {
							series.push({
								id: item.SeriesType === 1 ? item.MdcContrColumnPropDefFk : item.MdcContrFormulapropdefFk,
								code: item.Code,
								type: item.SeriesType
							});
						});

						return {
							series: series,
							categoryType: $scope.dataItem.CategoryKey
						};
					}


					return service;
				};

				return serviceFactory;
			}
		]
	);


})();