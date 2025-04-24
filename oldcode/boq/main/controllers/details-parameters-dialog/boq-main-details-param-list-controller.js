/**
 * Created by zos on 3/14/2018.
 */

(function () {
	/* global _ */ 
	'use strict';

	var moduleName = 'boq.main';

	/**
     @ngdoc controller
	 * @name boqMainDetailsParamListController
	 * @function
	 *
	 * @description
	 * Controller for the Details Formula Parameter List view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('boqMainDetailsParamListController',
		['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'boqMainDetailsParamListConfigService', 'boqMainDetailsParamListDataService',
			'platformGridControllerService', 'estimateMainCommonFeaturesService', 'boqMainDetailsParamListValidationService', 'estimateRuleParameterConstant',
			function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, detailsParamConfigService, detailsParamListDataService,
				platformGridControllerService, estimateMainCommonFeaturesService, boqMainDetailsParamListValidationService, estimateRuleParameterConstant) {

				var myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					cellChangeCallBack: function (arg) {
						var currentItem = arg.item;
						var col = arg.grid.getColumns()[arg.cell].field;
						var estimateRuleCommonService = $injector.get('estimateRuleCommonService');

						var itemsCache;
						if (col === 'ValueDetail') {
							currentItem.ValueDetail = currentItem.ValueDetail.toUpperCase();
							if (currentItem.ValueType === estimateRuleParameterConstant.Text) {
								currentItem.ParameterText = currentItem.ValueDetail;
							} else {
								if (!currentItem.isCalculateByParamReference) {
									estimateRuleCommonService.calculateDetails(currentItem, col, 'ParameterValue', detailsParamListDataService);
								}
							}
						} else if (col === 'ParameterValue') {
							currentItem.ParameterValue = (currentItem.ParameterValue === '') ? 0 : currentItem.ParameterValue;
							estimateRuleCommonService.calculateDetails(currentItem, col, 'ValueDetail');
						} else if (col === 'ParameterText') {
							if (currentItem.ValueType !== estimateRuleParameterConstant.TextFormula) {
								currentItem.ValueDetail = currentItem.ParameterText;
							}
						} else if (col === 'Code') {
							itemsCache = detailsParamListDataService.getItemsTOCache();
							estimateMainCommonFeaturesService.changeCode(currentItem, itemsCache);

							$timeout(function () {
								var data = detailsParamListDataService.getList();
								angular.forEach(data, function (item) {
									boqMainDetailsParamListValidationService.validateCode(item, item.Code, 'Code', 'listLoad');

									$injector.get('boqMainDetailsParamDialogService').showSameCodeWarning(item, item.Code);
								});
								platformGridAPI.grids.invalidate($scope.gridId);
							});
						} else if (col === 'AssignedStructureId') {
							itemsCache = detailsParamListDataService.getItemsTOCache();
							estimateMainCommonFeaturesService.changeAssignedStructureId(currentItem, itemsCache);
						}

						estimateMainCommonFeaturesService.fieldChanged(col, currentItem);

						detailsParamListDataService.gridRefresh();
					}
				};

				$scope.gridId = platformCreateUuid();

				$scope.onContentResized = function () {
					resize();
				};

				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
				};

				// Define standard toolbar Icons and their function on the scope
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'create',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function () {
								detailsParamListDataService.createItem('');
							},
							disabled: false
						},
						{
							id: 'delete',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function () {
								detailsParamListDataService.deleteItem();
							},
							disabled: true
						}
					],
					update: function () {
						return;
					}
				};

				function updateTools(isRowChange) {
					angular.forEach($scope.tools.items, function (item) {
						var disable = !isRowChange;
						if (item.id === 'delete') {
							item.disabled = disable;
						}
					});
				}

				function onSelectedRowsChanged(e, args) {
					var isRowChange = args.rows.length > 0;
					updateTools(isRowChange);
				}

				function resize() {
					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, detailsParamConfigService, detailsParamListDataService, boqMainDetailsParamListValidationService, myGridConfig);
					$injector.get('boqMainDetailsParamDialogService').currentItemChangedFire();
					detailsParamListDataService.setGridId($scope.gridId);

					var entity = $injector.get('boqMainDetailsParamDialogService').getCurrentEntity();
					$injector.get('estimateParamComplexLookupCommonService').setCurrentParamService(detailsParamListDataService);
					var result = $injector.get('estimateParamComplexLookupCommonService').HandleUserFormTab($scope, entity);

					if (result && result.then) {
						result.then(function () {
							var includeUserFormRules = _.find(entity.RuleAssignment, function (item) {
								return !!item.FormFk;
							});
							var indexItem = includeUserFormRules ? _.find($scope.tabs, {contextFk: includeUserFormRules.Id}) : null;
							$scope.tabClick(indexItem || $scope.tabs[0], 'user_form_assign_parameter_frame_Pop_Boq', 3);
						});
					}
				}

				function setDataSource(data) {
					$scope.data = data;
					detailsParamListDataService.setDataList(data);
					detailsParamListDataService.refreshGrid();
					$scope.onContentResized();
				}

				function updateData(currentItem) {
					setDataSource(currentItem);
				}

				detailsParamListDataService.onUpdateList.register(updateData);
				detailsParamListDataService.onItemChange.register(updateData);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				// detailsParamListDataService.fieldChanged.register();

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					detailsParamListDataService.onItemChange.unregister(updateData);
					detailsParamListDataService.onUpdateList.unregister(updateData);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					detailsParamListDataService.clearCache();
				});

				init();
			}
		]);
})();