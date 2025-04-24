/**
 * Created by wed on 12/06/2018.
 */

(function (angular) {
	'use strict';
	const moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('commonBusinessPartnerBusinessPartnerEvaluationNewController', [
		'$scope',
		'$injector',
		'_',
		'platformGridControllerService',
		'$translate',
		'platformGridAPI',
		'PlatformMessenger',
		'commonBusinessPartnerEvaluationScreenModalService',
		'platformPermissionService',
		'commonBusinessPartnerEvaluationAdaptorHelper',
		'platformModalService',
		'globals',
		'bascisCommonChartColorProfileService',
		'$timeout',
		'basicsLookupdataLookupDescriptorService',
		function (
			$scope,
			$injector,
			_,
			platformGridControllerService,
			$translate,
			platformGridAPI,
			PlatformMessenger,
			businessPartnerEvaluationScreenModalService,
			platformPermissionService,
			evaluationAdaptorHelper,
			platformModalService,
			globals,
			colorProfileService,
			$timeout,
			basicsLookupdataLookupDescriptorService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'PId',
				childProp: 'ChildrenItem',
				enableDraggableGroupBy: false
			};

			let serviceDescriptor = $scope.getContentValue('serviceDescriptor') || $scope.getContentValue('uuid'),
				accessRightDescriptor = $scope.getContentValue('permission') || $scope.getContentValue('uuid'),
				adaptorServiceName = $scope.getContentValue('configService');

			let adaptorContainer = evaluationAdaptorHelper.createAdaptorContainer(serviceDescriptor, adaptorServiceName ? $injector.get(adaptorServiceName) : {});
			let serviceContainer = adaptorContainer.serviceContainer;

			let adaptorService = adaptorContainer.completelyAdaptorService;
			let parentService = serviceContainer.parentService;
			let evaluationTreeService = serviceContainer.evaluationTreeService;
			let evaluationDetailService = serviceContainer.evaluationDetailService;
			let evaluationTreeUIStandardService = serviceContainer.evaluationTreeUIStandardService;
			let evaluationValidationService = serviceContainer.evaluationValidationService;

			platformGridControllerService.initListController($scope, evaluationTreeUIStandardService, evaluationTreeService, evaluationValidationService, myGridConfig);
			let detailButton = [
				{
					id: 't-evaluationDetail',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarEvaluationDetail'),
					iconClass: 'tlb-icons ico-rec',
					disabled: true,
					fn: function () {
						onGridDblClick();
					}
				},
				{
					id: 'd1',
					prio: 50,
					type: 'divider',
					isSet: true
				}

			];
			let chartToolbarButton = [
				{
					id: 't-radarChart',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarRadarChart'),
					iconClass: 'tlb-icons ico-radar-chart',
					disabled: true,
					fn: function () {
						$scope.chartType = 'radar';
					}
				},
				{
					id: 't-columnChart',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarColumnChart'),
					iconClass: 'tlb-icons ico-column-chart',
					disabled: true,
					fn: function () {
						$scope.chartType = 'bar';
					}
				},
				{
					id: 't-lineChart',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarLineChart'),
					iconClass: 'tlb-icons ico-line-chart',
					disabled: true,
					fn: function () {
						$scope.chartType = 'line';
					}
				},
				{
					id: 't-3dColumns',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbar3DColumns'),
					iconClass: 'tlb-icons ico-3d-column-chart',
					disabled: true,
					fn: function () {
						$scope.chartType = '3D_Columns';
					}
				},
				{
					id: 't-chartConfig',
					type: 'item',
					caption: $translate.instant('basics.common.chartSetting'),
					iconClass: 'tlb-icons ico-template-config',
					fn: showChartConfigDialog
				},
				{
					id: 'd1',
					prio: 50,
					type: 'divider',
					isSet: true
				}
			];
			let createEvaluationBtnConfig = {
				id: 't-newEvaluation',
				type: 'item',
				caption: $translate.instant('businesspartner.main.toolbarNewEvaluationScreen'),
				iconClass: 'tlb-icons ico-rec-new',
				disabled: function () {
					return adaptorService.disabledCreate($scope, parentService, evaluationTreeService, evaluationDetailService);
				},
				fn: function () {
					let createOptions = adaptorService.extendCreateOptions({
						businessPartnerId: null,
						EvaluationMotiveId: 1,
						canEditReferences: true,
						canSave: true,
						saveImmediately: false,
						saveCallbackFun: {
							fun: function (result) {
								evaluationTreeService.mergeData(result);
							}
						},
						projectFk: null,
						qtnHeaderFk: null,
						evaluationSchemaId: null
					}, parentService, evaluationTreeService);

					businessPartnerEvaluationScreenModalService.showDialog(angular.extend({
						create: createOptions
					}, serviceContainer));
				}
			};

			if (platformPermissionService.hasRead(accessRightDescriptor) && platformPermissionService.hasCreate(accessRightDescriptor)) {
				chartToolbarButton.push(createEvaluationBtnConfig);
			}

			$timeout(function () {
				// if container only has read permission, the check box still can be used to show chart
				let gridColums = platformGridAPI.columns.getColumns($scope.getContentValue('uuid')) || [];
				let checkedColumn = _.find(gridColums, {field: 'Checked'});
				if (checkedColumn && !checkedColumn.editor) {
					checkedColumn.editor = 'boolean';
				}
			});

			function onRowsChanged() {
				const checkedRoot = evaluationTreeService.getTree().find(item => item.Checked);
				if (checkedRoot) {
					setStateAndUpdateChartData(checkedRoot);
				}
			}

			function initContainer() {
				evaluationTreeService.clearDataCache();
				_.remove($scope.tools.items, function (tool) {
					return _.includes(['t7', 't8'], tool.id);
				});

				Array.prototype.unshift.apply($scope.tools.items, chartToolbarButton);
				Array.prototype.unshift.apply($scope.tools.items, detailButton);
				$scope.triggerUpdateEvent = new PlatformMessenger();
				$scope.chartTitle = '';
				$scope.chartType = 'bar';

				refreshChartData();

				platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCellChange);
				platformGridAPI.events.register($scope.gridId, 'onDblClick', onGridDblClick);
				platformGridAPI.events.register($scope.gridId, 'onRowsChanged', onRowsChanged);

				evaluationTreeService.dataChangeMessenger.register(dataChanged);

				evaluationTreeService.registerListLoaded(clear);

				parentService.registerSelectionChanged(updateToolbarStatusList);

				evaluationTreeService.registerSelectionChanged(updateTreeToolbarStatusList);

				evaluationTreeService.dataDeleted.register(setStateAndUpdateChartData);

				evaluationDetailService.collectLocalEvaluationDataScreen.register(evaluationTreeService.collectLocalEvaluationData);

				updateToolbarStatusList();

				adaptorService.onControllerCreate($scope, parentService, evaluationTreeService, evaluationDetailService);

				parentService.registerListLoadStarted(onParentListLoadStarted);

				$scope.$on('$destroy', function () {
					evaluationTreeService.dataChangeMessenger.unregister(dataChanged);

					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onGridCellChange);
					platformGridAPI.events.unregister($scope.gridId, 'onDblClick', onGridDblClick);
					platformGridAPI.events.unregister($scope.gridId, 'onRowsChanged', onRowsChanged);
					evaluationTreeService.unregisterListLoaded(clear);
					evaluationTreeService.dataDeleted.unregister(setStateAndUpdateChartData);
					evaluationDetailService.collectLocalEvaluationDataScreen.unregister(evaluationTreeService.collectLocalEvaluationData);
					parentService.unregisterSelectionChanged(updateToolbarStatusList);
					evaluationTreeService.unregisterSelectionChanged(updateTreeToolbarStatusList);
					adaptorService.onControllerDestroy($scope, parentService, evaluationTreeService, evaluationDetailService);
					parentService.unregisterListLoadStarted(onParentListLoadStarted);
				});

				$scope.$on('splitter.ResizeChanged', function () {
					$scope.triggerUpdateEvent.fire();
				});

				if (adaptorService.isLoadAutomatically(parentService)) {
					evaluationTreeService.load();
				}
			}

			function dataChanged() {
				$scope.chartDataSource = {
					labels: [],
					datasets: []
				};
				$scope.chartTitle = '';
				refreshChartData();
			}

			function clear() {
				dataChanged();
			}

			function refreshChartData() {
				let selectParentItem = _.find(evaluationTreeService.getTree(), {'Checked': true});
				if (selectParentItem) {
					updateChartData(selectParentItem);
				}
			}

			function setStateAndUpdateChartData(entity) {
				let currentParentItem = null;

				if (entity.Id < 0 && entity[myGridConfig.childProp] && entity[myGridConfig.childProp].length > 0) {
					currentParentItem = entity;

					setStateRecursive(entity, entity.Checked);
				} else {
					currentParentItem = _.find(evaluationTreeService.getTree(), {'Id': entity[myGridConfig.parentProp]});

					let childrenNodes = currentParentItem[myGridConfig.childProp];
					if (childrenNodes) {
						currentParentItem.Checked = childrenNodes.some(function (item) {
							return item.Checked;
						});
					}
				}

				evaluationTreeService.getTree().forEach(function (item) {
					if (item !== currentParentItem) {
						setStateRecursive(item, false);
					}
				});

				platformGridAPI.grids.invalidate($scope.gridId);

				updateChartData(currentParentItem);
			}

			function onGridCellChange(e, args) {
				setStateAndUpdateChartData(args.item);
			}

			function onGridDblClick() {
				let item = evaluationTreeService.getSelected();
				if (item && item.PId !== null && item.PId !== 0) {
					let updateOptions = adaptorService.extendUpdateOptions({
						evaluationId: item.Id,
						permissionObjectInfo: item['EvalPermissionObjectInfo'],
						canEditReferences: true,
						canSave: true,
						saveImmediately: false,
						getDataFromLocal: true,
						saveCallbackFun: {
							fun: function (result) {
								evaluationTreeService.mergeData(result);
							}
						}
					}, parentService, evaluationTreeService);
					businessPartnerEvaluationScreenModalService.showDialog(angular.extend({
						view: updateOptions
					}, serviceContainer));
				}
			}

			function setStateRecursive(groupData, newState) {
				groupData.Checked = newState;
				// region group select
				let subGroupData = groupData.ChildrenItem;
				if (subGroupData && subGroupData.length > 0)
					if (newState === true) {
						let notToCountStatusIds = [];
						let evaluationStatus = basicsLookupdataLookupDescriptorService.getData('EvaluationStatus');
						if (evaluationStatus) {
							_.forEach(evaluationStatus, function (item) {
								if (item.IsNotToCount) {
									notToCountStatusIds.push(item.Id);
								}
							});
						}
						if (notToCountStatusIds && notToCountStatusIds.length > 0) {
							let subGroupData = groupData.ChildrenItem;
							for (let i = 0; i < subGroupData.length; i++) {
								subGroupData[i].Checked = true;
								for (let c = 0; c < notToCountStatusIds.length; c++) {
									if (subGroupData[i].EvalStatusFk === notToCountStatusIds[c]) {
										subGroupData[i].Checked = false;
										break;
									}
								}
							}
						}
						// endregion
						// region group no select
					} else {
						for (let i = 0; i < subGroupData.length; i++) {
							subGroupData[i].Checked = newState;
						}
					}
			}
			function initChartDataSource() {
				$scope.chartDataSource = {
					legends: [],
					labels: [],
					datasets: []
				};
			}
			function updateChartData(parentNode) {

				updateToolbarStatusList();

				if (!parentNode.Checked) {
					$scope.chartDataSource = {
						labels: [],
						datasets: []
					};
					$scope.chartTitle = '';
				} else {
					let childProp = myGridConfig.childProp;
					let children = parentNode[childProp] && parentNode[childProp].length > 0 ? parentNode[childProp] : null;
					if (children) {

						let evaluationIds = children.map(function (item) {
							return item.Id;
						});

						let displayIdItem = [],
							displayItemDescription = [];

						for (let i = 0; i < children.length; i++) {
							let item = children[i];
							if (item.Checked) {
								displayIdItem.push(item.Id);
								displayItemDescription.push({name: item.Code});
							}
						}

						displayIdItem.push(-1000); // average
						// displayIdItem.push(-1001); // summary
						displayItemDescription.push({name: $translate.instant('businesspartner.main.chartLegend.average')});
						// displayItemDescription.push({ name: $translate.instant('businesspartner.main.chartLegend.total')});

						evaluationTreeService.getChartData(parentNode.EvaluationSchemaFk, evaluationIds).then(function (data) {
							if (data) {
								if (displayIdItem.length>1) {
									let groupData=data['DataSets'];
									let newCacheData = {};
									for (let b = 0; b < displayIdItem.length; b++) {
										let key = displayIdItem[b];
										if (groupData[key]) {
											newCacheData[key] = groupData[key];
										}
									}
									data['DataSets'] = newCacheData;
									$scope.chartTitle = adaptorService.getChartTitle(parentNode, parentService);
									builtChartData(data, displayIdItem, displayItemDescription);
								}
								else {
									$scope.chartTitle='';
									initChartDataSource();
								}
							}
						});
					} else {
						initChartDataSource();
					}
				}
			}

			function builtChartData(data, displayIdItem, displayItemDescription) {
				let labels = !data['Labels'] ? [] : data['Labels'].map(function (item) {
					return item.Description;
				});
				let datasets = [];
				if (data['DataSets']) {
					let averages = [];
					let summaries = [];
					let count = 0;
					let sortedDataSets = _.orderBy(data['DataSets'], (set) => {
						return displayIdItem.indexOf(set[0].EvaluationFk);
					});

					_.forEach(sortedDataSets, function (item) {
						let evaluationId = item[0].EvaluationFk;
						if (displayIdItem.indexOf(evaluationId) > -1) {
							datasets.push(item);
						}
						count++;
						summary(summaries, item);
					});

					average(averages, summaries, count);

					if (displayIdItem.indexOf(-1000) > -1) {
						datasets.push(averages);
					}
					datasets = datasets.map(function (item) {
						return {
							data: item.map(function (subItem) {
								return Number(subItem.Total.toFixed(2));
							})
						};
					});
				}

				$scope.chartDataSource = {
					legends: displayItemDescription,
					labels: labels,
					datasets: datasets
				};

				function summary(summaries, item) {
					summaries = angular.isArray(summaries) ? _.forEach(item, function (value, key) {
						if (summaries[key] === undefined) {
							summaries[key] = {Total: value.Total};
						} else {
							summaries[key].Total += value.Total;
						}
					}) : summaries;
				}

				function average(averages, summaries, count) {
					averages = angular.isArray(averages) && count > 0 ? _.forEach(summaries, function (sum, key) {
						averages[key] = {Total: sum.Total / count};
					}) : averages;
				}
			}

			function updateToolbarStatusList() {
				let chartButtons = ['t-radarChart', 't-columnChart', 't-lineChart', 't-3dColumns'];
				let hasChecked = !!_.find(evaluationTreeService.getList(), function (item) {
					return item.Checked === true && item.Id > 0;
				});

				_.forEach(chartToolbarButton, function (item) {
					if (_.includes(chartButtons, item.id)) {
						item.disabled = !hasChecked;
					}
				});
				$scope.tools.update();
			}

			function updateTreeToolbarStatusList() {
				let data = evaluationTreeService.getSelected();
				detailButton[0].disabled = !(data && data.Id > 0);

				$scope.tools.update();
			}

			function onParentListLoadStarted() {
				evaluationTreeService.clearContent();
			}

			function showChartConfigDialog() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'basics.common/partials/basics-common-chart-color-config-dialog.html',
					backdrop: false,
					width: '640px',
					resizeable: true,
					uuid: $scope.gridId
				}).then(function (result) {
					if (result.isOK) {
						refreshChartData();
					}
				});
			}

			$scope.legendColors = [];
			$scope.chartOption = {
				legend: {
					labels: {
						generateLabels: function (chart) {
							let data = chart.data;
							let legends = angular.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
								let legendStyle = {
									text: dataset.label,
									hidden: !chart.isDatasetVisible(i),
									fillStyle: $scope.legendColors[i],
									strokeStyle: $scope.legendColors[i]
								};
								return generateLegend(chart, dataset, legendStyle, i);
							}, this) : [];

							let viewData = colorProfileService.getCustomDataFromView($scope.gridId, 'chartColor');
							let legendLen = legends.length;
							if (viewData && viewData.Max) {
								let legendStyle = {
									text: 'Max',
									hidden: false,
									fillStyle: 'rgba(' + viewData.Max + ',1)',
									strokeStyle: 'rgba(' + viewData.Max + ',1)'
								};
								legends.push(generateLegend(chart, data.datasets[0], legendStyle, legendLen));
							}
							legendLen = legends.length;
							if (viewData && viewData.Min) {
								let legendStyle = {
									text: 'Min',
									hidden: false,
									fillStyle: 'rgba(' + viewData.Min + ',1)',
									strokeStyle: 'rgba(' + viewData.Min + ',1)'
								};
								legends.push(generateLegend(chart, data.datasets[0], legendStyle, legendLen));
							}
							return legends;
						}
					}
				}
			};

			function generateLegend(chart, dataset, style, index) {
				return {
					text: style.text,
					fillStyle: style.fillStyle,
					hidden: style.hidden,
					lineCap: dataset.borderCapStyle,
					lineDash: dataset.borderDash,
					lineDashOffset: dataset.borderDashOffset,
					lineJoin: dataset.borderJoinStyle,
					lineWidth: dataset.borderWidth,
					strokeStyle: style.strokeStyle,
					pointStyle: dataset.pointStyle,

					// Below is extra data used for toggling the datasets
					datasetIndex: index
				};
			}

			initContainer();
		}
	]);

})(angular);