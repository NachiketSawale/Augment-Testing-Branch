/**
 * Created by chd on 5/7/2020.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global $ */
(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * this module will be called from Line Item Activity Ai mapping dialog when user presses the drop down
	 * button on column "Suggested Activity"
	 * display the top (three) suggested Activity results.
	 */
	angular.module(moduleName).directive('estimateMainLineItemsActivityAiMappingLookup',
		['_', '$q', '$http', 'globals', '$translate', '$timeout',
			'platformModalService', 'platformGridAPI', 'platformTranslateService', 'platformRuntimeDataService',
			'BasicsLookupdataLookupDirectiveDefinition', 'platformObjectHelper', 'estimateMainLineItemsActivityAiMappingService', 'estimateMainLineItemsActivityAiMappingDataService',
			'estimateMainService', 'procurementPackageDataService', 'estimateMainLiSelStatementListValidationService', 'cloudCommonGridService', 'schedulingMainActivityImageProcessor',
			'estimateMainActivityLookupService',
			function (_, $q, $http, globals, $translate, $timeout,
				platformModalService, platformGridAPI, platformTranslateService, platformRuntimeDataService,
				BasicsLookupdataLookupDirectiveDefinition, platformObjectHelper, estimateMainLineItemsActivityAiMappingService, estimateMainLineItemsActivityAiMappingDataService,
				estimateMainService, procurementPackageDataService, estimateMainLiSelStatementListValidationService, cloudCommonGridService, schedulingMainActivityImageProcessor,
				estimateMainActivityLookupService) {

				let defaults = {
					lookupType: 'suggestedActivity',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: 'bebcfd88064c4da9bd217668a26881ee',
					columns: [
						{
							id: 'activityschedule',
							field: 'Id',
							name: 'Activity Schedule',
							name$tr$: 'estimate.main.activitySchedule',
							width: 100,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estlineitemactivity',
								displayMember: 'Code',
								dataServiceName: 'estimateMainActivityScheduleLookupService'
							},
							sortable: true
						},
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							width: 100,
							name$tr$: 'estimate.main.aiWizard.suggestedActivityCode',
							sortable: true
						},
						{
							id: 'desc',
							field: 'Description',
							name: 'Description',
							width: 200,
							name$tr$: 'estimate.main.aiWizard.suggestedActivityDescription',
							sortable: true
						}
					],
					width: 350,
					height: 120
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: 'estimateMainLineItemsActivityAiMappingDataService',
					controller: ['$scope', function ($scope) {
						let buttons = [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-lookup',
								execute: onOpenPopupClicked,
								canExecute: function () {
									return true;
								}
							}
						];

						$.extend($scope.lookupOptions, {
							buttons: buttons
						});

						function onOpenPopupClicked() {

							let dataService = createDataService();

							platformTranslateService.registerModule('estimate.main');
							let showOptions = {
								gridId: 'aef5ed0e4f1e41e9914845bfaee97887',
								width: '790px',
								height: '550px',
								templateUrl: globals.appBaseUrl + '/estimate.main/templates/activity-selection-dialog.html',
								backdrop: false,
								resizeable: true,
								controller: dialogController('', $scope.$parent.options, dataService)
							};

							return platformModalService.showDialog(showOptions).then(function (result) {
								if (!result || !result.isOk) {
									return;
								}
								$scope.$parent.entity.PsdActivityFk = result.data.Id;
								estimateMainLineItemsActivityAiMappingDataService.attachExtraData(result.data);
								estimateMainLineItemsActivityAiMappingService.gridRefresh();
							});
						}

						function getTitle(option) {
							if (option.title$tr$) {
								return $translate.instant(option.title$tr$);
							} else if (option.title) {
								return option.title;
							} else {
								return $translate.instant('estimate.main.aiWizard.dialogTitleSelectActivity') || 'Select Activity';
							}
						}

						function getGridConfig(scope, treeInfo, option) {
							let gridColumns = [
								{
									id: 'code',
									field: 'Code',
									name: 'Code',
									name$tr$: 'cloud.common.entityReferenceCode',
									width: 100
								},
								{
									id: 'dec',
									field: 'Description',
									name: 'Description',
									name$tr$: 'cloud.common.descriptionInfo',
									width: 100
								},
								{
									id: 'qty',
									field: 'Quantity',
									name: 'Quantity',
									name$tr$: 'cloud.common.entityQuantity',
									width: 100
								}
							];

							treeInfo = option.treeInfo || treeInfo;
							if (option.showId) {
								gridColumns.unshift({id: 'Id', field: 'Id', name: 'Id'});
							}

							return {
								id: scope.gridId,
								columns: platformTranslateService.translateGridConfig(angular.copy(gridColumns)),
								data: [],
								options: {
									indicator: true,
									iconClass: 'controls-icons',
									idProperty: 'Id',
									tree: true,
									collapsed: true,
									parentProp: treeInfo.parentProp,
									childProp: treeInfo.childProp
								},
								lazyInit: true
							};
						}

						function createDataService() {
							let $cacheData = [], $cacheFullData = [], $filter = null;
							let treeInfo = {
								parentProp: 'ParentActivityFk',
								childProp: 'Activities'
							};

							return {
								treeInfo: treeInfo,
								search: function (filter) {
									let defer = $q.defer();
									$filter = filter;
									if ($cacheFullData !== null && $cacheFullData.length > 0) {
										$cacheData = angular.copy($cacheFullData);
										if (filter) {
											$cacheData = doSearchFilter($cacheData, filter);
										}

										defer.resolve($cacheData);
									}
									else {
										estimateMainActivityLookupService.loadAsync().then(function (data) {
											let output = [];
											if (filter) {
												data = doSearchFilter(data, filter);
											}

											cloudCommonGridService.flatten(data, output, 'Activities');
											for (let i = 0; i < output.length; ++i) {
												schedulingMainActivityImageProcessor.processItem(output[i]);
											}
											$cacheData = data;
											$cacheFullData = angular.copy($cacheData);
											defer.resolve($cacheData);
										});
									}

									return defer.promise;
								},
								getTree: function () {
									return $cacheData;
								}
							};

							function filterNode(nodeData) {
								return (nodeData.Code !== null && nodeData.Code.toLowerCase().indexOf($filter) !== -1) || (nodeData.Description !== null && nodeData.Description.toLowerCase().indexOf($filter) !== -1);
							}

							function doSearchFilter(data) {
								let array = [];
								_.forEach(data, function (item) {
									isVisible(item);
									if (item.visible) {
										array.push(item);
									}
								});

								return array;

								function isVisible(item) {
									let activities = item.Activities ? item.Activities : [];
									if (activities.forEach(function (activity) {
										activity.visible = filterNode(activity);
										isVisible(activity);
									}), activities.length) {

										let pd = [];
										_.forEach(activities, function (activity) {
											if (activity.visible) {
												item.visible = true;
												pd.push(activity);
											}
										});

										item.Activities = pd;
									}
								}
							}
						}

						function dialogController(entities, option, dataService) {

							return ['$scope', 'keyCodes', function ($scope, keyCodes) {

								$scope.gridId = option.Id || 'structure.selected';
								$scope.gridData = {state: $scope.gridId};
								$scope.title = getTitle(option);
								$scope.isSelectable = true;
								platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

								function onSelectedRowsChanged() {
									let selectedItem = platformGridAPI.rows.selection({
										gridId: $scope.gridId,
										wantsArray: false
									});
									if (selectedItem && angular.isString(selectedItem.Id) && selectedItem.Id.indexOf(/[a-z]/i) === -1) {
										$scope.isSelectable = false;
									}
									else {
										$scope.isSelectable = true;
									}
								}

								$scope.ok = function onOK() {
									let schedulingActivity = $scope.getSelected();
									if (!schedulingActivity) {
										platformModalService.showMsgBox('estimate.main.aiWizard.dialogTitleSelectActivity',
											'estimate.main.aiWizard.error', 'error');
										return;
									}

									$scope.$close({
										isOk: true, data: $scope.getSelected()
									});
								};

								$scope.close = function onCancel() {
									$scope.$close({isOk: false, isCancel: true});
								};

								$scope.search = function (filter, event) {
									if (!event || event.keyCode === keyCodes.ENTER) {
										dataService.search(filter).then(function () {
											platformGridAPI.items.data($scope.gridId, dataService.getTree());
											if (filter) {
												platformGridAPI.rows.expandAllNodes($scope.gridId);
											}
										});
									}
								};

								$scope.getSelected = function getSelected() {
									let grid = platformGridAPI.grids.element('id', $scope.gridId).instance,
										rows = grid.getSelectedRows();

									let data = rows.map(function (row) {
										return grid.getDataItem(row);
									});
									if (data && data.length > 0) {
										return data[0];
									}
								};

								platformGridAPI.grids.config(getGridConfig($scope, dataService.treeInfo, option));
								$scope.$on('$destroy', function () {
									platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
									platformGridAPI.grids.unregister($scope.gridId);
								});

								$scope.search();
							}];
						}
					}]
				});
			}
		]);
})(angular);

