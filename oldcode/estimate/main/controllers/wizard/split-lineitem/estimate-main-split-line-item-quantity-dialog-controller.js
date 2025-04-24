/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainSplitLineItemQuantityDialogController
	 * @function
	 *
	 * @description
	 * Controller to split LineItem by Percentage and Quantity.
	 **/
	angular.module(moduleName).controller('estimateMainSplitLineItemQuantityDialogController',
		['$scope',
			'$timeout',
			'$injector',

			'platformGridAPI',
			'platformCreateUuid',
			'estimateMainSplitLineItemQuantityConfigDialogService',
			'platformGridControllerService',
			'platformToolbarBtnService',
			'projectMainCopyEntityService',
			'basicsCommonHeaderColumnCheckboxControllerService',
			'estimateMainSplitLineItemQuantityDialogService',
			'estimateMainSplitLineItemQuantityValidationService',

			function ($scope,
				$timeout,
				$injector,
				platformGridAPI,
				platformCreateUuid,
				configDialogService,
				platformGridControllerService,
				platformToolbarBtnService,
				projectMainCopyEntityService,
				basicsCommonHeaderColumnCheckboxControllerService,
				dataDialogService,
				dataValidationService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck : true,
					toolbarItemsDisabled: true,
					enableColumnReorder: true,
					skipToolbarCreation: true,
					enableCopyPasteExcel: false,
					gridDataAccess: 'gridData'
				};

				$scope.gridId = platformCreateUuid();

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.onContentResized = function () {
					resizeGrid();
				};

				function resizeGrid() {
					$timeout(function(){
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				let toolBarItems =
					{
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [

							{
								id: 't111',
								sort: 111,
								caption: 'cloud.common.gridlayout',
								iconClass: 'tlb-icons ico-settings',
								type: 'item',
								fn: function () {
									platformGridAPI.configuration.openConfigDialog($scope.gridId);
								},
								disabled: function(){
									return false;
								}
							}
						]
					};

				function setTools(tools) {
					$scope.tools = tools || {};
					$scope.tools.update = function () {
						tools.refreshVersion += 1;
					};
					$scope.tools.refresh = function () {
						tools.refreshVersion += 1;
					};
				}

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					dataDialogService.setDataList(true);
					platformGridControllerService.initListController($scope, configDialogService, dataDialogService, dataValidationService, myGridConfig);
					setTools(toolBarItems);
				}

				$scope.validateQuantityPercent = function validateQuantityPercent (entity, value, model){
					let result = dataValidationService.validateQuantityPercent(entity, value, model, $scope.DoSplitAsReference);
					updateModalOptions();
					return result;
				};

				$scope.validateQuantityTotal = function validateQuantityTotal (entity, value, model){
					let result = dataValidationService.validateQuantityTotal(entity, value, model, $scope.DoSplitAsReference, $scope.$parent.entity.applySplitResultTo);
					updateModalOptions();
					return result;
				};

				$scope.asyncValidateBoqItem = function asyncValidateBoqItem (entity, value, model){
					return asyncValidation(entity, value, model);
				};

				$scope.asyncValidateMdcControllingUnitFk = function asyncValidateMdcControllingUnitFk (entity, value, model){
					return asyncValidation(entity, value, model);
				};

				$scope.asyncValidatePsdActivityFk = function asyncValidatePsdActivityFk (entity, value, model){
					return asyncValidation(entity, value, model);
				};

				$scope.asyncValidatePrjLocationFk = function asyncValidatePrjLocationFk (entity, value, model){
					return asyncValidation(entity, value, model);
				};

				$scope.change = function(){
					updateModalOptions();
				};

				dataDialogService.listLoaded.register(onRefreshData);

				function asyncValidation(entity, value, model){
					return dataValidationService.asyncValidatePrjLocationFk(entity, value, model, $scope.DoSplitAsReference).then(function(result){
						updateModalOptions();
						return result;
					});
				}

				function onRefreshData() {
					platformGridAPI.grids.invalidate($scope.gridId);
					platformGridAPI.grids.refresh($scope.gridId, true);
				}

				function updateModalOptions() {
					if($scope.entity){
						$scope.entity.splitLineItems = dataDialogService.getSplitLineItems();
					}
				}

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					dataDialogService.listLoaded.unregister(onRefreshData);
				});

				init();
			}
		]);
})();
