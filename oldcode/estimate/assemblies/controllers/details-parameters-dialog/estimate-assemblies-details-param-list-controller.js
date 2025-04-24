/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 @ngdoc controller
	 * @name estimateAssembliesDetailsParamListController
	 * @function
	 *
	 * @description
	 * Controller for the Details Formula Parameter List view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('estimateAssembliesDetailsParamListController',
		['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'estimateAssembliesDetailsParamListConfigService',
			'estimateAssembliesDetailsParamListDataService', 'platformGridControllerService', 'estimateMainCommonFeaturesService','estimateAssembliesDetailsParamListValidationService','estimateRuleParameterConstant',
			function ($scope,  $timeout, $injector, platformGridAPI, platformCreateUuid,  detailsParamConfigService,
				detailsParamListDataService, platformGridControllerService, estimateMainCommonFeaturesService,estimateAssembliesDetailsParamListValidationService,estimateRuleParameterConstant) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck : true,
					cellChangeCallBack :function(arg){
						let item = arg.item,
							col = arg.grid.getColumns()[arg.cell].field;
						let estimateRuleCommonService = $injector.get('estimateRuleCommonService');
						if (col === 'ValueDetail') {
							if(item.ValueType === estimateRuleParameterConstant.Text){
								item.ParameterText = item.ValueDetail;
							}else{
								if(!item.isCalculateByParamReference){
									estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', detailsParamListDataService);
								}
							}
						}else if(col === 'ParameterText'){
							if(item.ValueType !== estimateRuleParameterConstant.TextFormula) {
								item.ValueDetail = item.ParameterText;
							}
						}else if(col === 'ParameterValue'){
							estimateRuleCommonService.calculateDetails(item, col, 'ValueDetail');
						} else if (item.ValueType === 1 && col === 'Code') {
							let itemsCache = detailsParamListDataService.getItemsTOCache();
							estimateMainCommonFeaturesService.changeCode(item, itemsCache);
						}

						if (col === 'Code') {
							$timeout(function () {
								let data = detailsParamListDataService.getList();
								angular.forEach(data, function (item) {
									estimateAssembliesDetailsParamListValidationService.validateCode(item, item.Code, 'Code', 'listLoad');
								});
								platformGridAPI.grids.invalidate($scope.gridId);
							});
						}

						estimateMainCommonFeaturesService.fieldChanged(col,item);

						detailsParamListDataService.gridRefresh();
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
					update : function () {}
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
					let estimateAssembliesDetailsParamDialogService = $injector.get('estimateAssembliesDetailsParamDialogService');
					platformGridControllerService.initListController($scope, detailsParamConfigService, detailsParamListDataService, estimateAssembliesDetailsParamListValidationService, myGridConfig);
					estimateAssembliesDetailsParamDialogService.currentItemChangedFire();
					detailsParamListDataService.setGridId($scope.gridId);

					let entity = estimateAssembliesDetailsParamDialogService.getCurrentEntity();
					$injector.get('estimateParamComplexLookupCommonService').setCurrentParamService(detailsParamListDataService);
					let result = $injector.get('estimateParamComplexLookupCommonService').HandleUserFormTab($scope, entity);
					if(result && result.then){
						result.then(function () {
							let includeUserFormRules = _.find(entity.RuleAssignment, function (item) { return !!item.FormFk;});
							let indexItem = includeUserFormRules ? _.find($scope.tabs, {contextFk:includeUserFormRules.Id}) : null;
							$scope.tabClick(indexItem || $scope.tabs[0], 'user_form_assign_parameter_frame_Pop_Assm', 3);
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
