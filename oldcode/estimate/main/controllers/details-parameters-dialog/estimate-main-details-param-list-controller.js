/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainDetailsParamListController
	 * @function
	 *
	 * @description
	 * Controller for the Details Formula Parameter List view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('estimateMainDetailsParamListController',
		['_', '$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'estimateMainDetailsParamListConfigService', 'estimateMainDetailsParamListDataService',
			'platformGridControllerService','estimateMainCommonFeaturesService','estimateMainDetailsParamListValidationService','estimateRuleParameterConstant',
			function (_, $scope,  $timeout, $injector, platformGridAPI, platformCreateUuid,  detailsParamConfigService, detailsParamListDataService,
				platformGridControllerService,estimateMainCommonFeaturesService,estimateMainDetailsParamListValidationService,estimateRuleParameterConstant) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					cellChangeCallBack: function (arg) {
						let itemsCache;
						let currentItem = arg.item;
						let col = arg.grid.getColumns()[arg.cell].field;
						let estimateRuleCommonService = $injector.get('estimateRuleCommonService');
						if (col === 'ValueDetail') {
							if(currentItem.ValueType === estimateRuleParameterConstant.Text){
								currentItem.ParameterText = currentItem.ValueDetail;
							}else{
								if(!currentItem.isCalculateByParamReference) {
									estimateRuleCommonService.calculateDetails(currentItem, col, 'ParameterValue', detailsParamListDataService);
								}
							}
						} else if (col === 'ParameterValue') {
							currentItem.ParameterValue = (currentItem.ParameterValue ==='') ? 0 : currentItem.ParameterValue;
							estimateRuleCommonService.calculateDetails(currentItem, col, 'ValueDetail');
						}else if(col === 'ParameterText'){
							if(currentItem.ValueType !== estimateRuleParameterConstant.TextFormula) {
								currentItem.ValueDetail = currentItem.ParameterText;
							}
						}
						else if( col === 'Code'){
							currentItem.Code = currentItem.Code ? currentItem.Code.toUpperCase():currentItem.Code;
							itemsCache = detailsParamListDataService.getItemsTOCache();
							estimateMainCommonFeaturesService.changeCode(currentItem, itemsCache);
						}else if( col === 'AssignedStructureId'){
							itemsCache = detailsParamListDataService.getItemsTOCache();
							detailsParamListDataService.checkConflictParam(currentItem, true);
							estimateMainCommonFeaturesService.changeAssignedStructureId(currentItem, itemsCache);
						}

						estimateMainCommonFeaturesService.fieldChanged(col, currentItem);

						detailsParamListDataService.gridRefresh();
					},
					rowChangeCallBack: function () {
						updateTools(true);
					}
				};


				$scope.gridId = platformCreateUuid();

				$scope.onContentResized = function () {
					resize();
				};

				$scope.setTools = function(tools){
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
							fn: function(){
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
							fn: function(){
								detailsParamListDataService.deleteItem();
							},
							disabled: true
						}
					],
					update : function () {return;}
				};

				function updateTools(isRowChange) {
					angular.forEach($scope.tools.items, function (item) {
						let disable = !isRowChange;
						if (item.id === 'delete') {
							item.disabled = disable;
						}
					});
				}


				function onSelectedRowsChanged(e, args){
					let isRowChange = args.rows.length > 0;
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
					let estimateMainDetailsParamDialogService = $injector.get('estimateMainDetailsParamDialogService');
					platformGridControllerService.initListController($scope, detailsParamConfigService, detailsParamListDataService, estimateMainDetailsParamListValidationService, myGridConfig);
					estimateMainDetailsParamDialogService.currentItemChangedFire();
					detailsParamListDataService.setGridId($scope.gridId);

					let entity = estimateMainDetailsParamDialogService.getCurrentEntity();
					$injector.get('estimateParamComplexLookupCommonService').setCurrentParamService(detailsParamListDataService);
					let result = $injector.get('estimateParamComplexLookupCommonService').HandleUserFormTab($scope, entity);
					if(result && result.then){
						result.then(function () {
							let includeUserFormRules = _.find(entity.PrjEstRuleToSave, function (item) { return !!item.FormFk;});
							let indexItem = includeUserFormRules ? _.find($scope.tabs, {contextFk:includeUserFormRules.Id}) : null;
							$scope.tabClick(indexItem || $scope.tabs[0], 'user_form_assign_parameter_frame_Pop', 3);
						});
					}else{
						$scope.tabClick({index:1}, 'user_form_assign_parameter_frame_Pop', 3);
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

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					detailsParamListDataService.onItemChange.unregister(updateData);
					detailsParamListDataService.onUpdateList.unregister(updateData);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					detailsParamListDataService.clearCache();

					estimateMainDetailsParamListValidationService.setCurrentDataService(null);
				});

				init();
			}
		]);
})();
