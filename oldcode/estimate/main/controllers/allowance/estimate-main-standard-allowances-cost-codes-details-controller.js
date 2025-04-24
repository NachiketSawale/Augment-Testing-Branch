(function (angular){
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainStandardAllowancesCostCodeDetailController',
		['$scope','platformGridControllerService','estimateDefaultGridConfig','estStandardAllowancesCostCodeDetailConfigurationService','estStandardAllowancesCostCodeDetailDataService',
			'$translate','$injector','_','$timeout','estimateMainService','platformPermissionService',
			function ($scope,platformGridControllerService,estimateDefaultGridConfig,estStandardAllowancesCostCodeDetailConfigurationService,estStandardAllowancesCostCodeDetailDataService,
				$translate,$injector,_,$timeout,estimateMainService,platformPermissionService) {
				let gridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'CostCodeParentFk',
					childProp: 'CostCodes',
					childSort: false,
					enableColumnSort: false,
					cellChangeCallBack: function cellChangeCallBack() {
						let allowances = $injector.get('estimateMainStandardAllowancesDataService').getList();

						if(!allowances || !_.isArray(allowances)){
							return;
						}

						let allowanceEntity = $injector.get('estimateMainStandardAllowancesDataService').getSelected();

						if(!allowanceEntity){
							return;
						}

						let estMarkup2costCodes = estStandardAllowancesCostCodeDetailDataService.getList();

						let advancedAll = $injector.get('estimateMainContextDataService').getAdvancedAll();

						if(_.isArray(estMarkup2costCodes)){
							$injector.get('estimateMainMarkup2costcodeCalculationService').calculateMarkup2costCodes(allowanceEntity, estMarkup2costCodes, advancedAll);
							_.forEach(estMarkup2costCodes, function(item){
								estStandardAllowancesCostCodeDetailDataService.markItemAsModified(item);
							});
							estStandardAllowancesCostCodeDetailDataService.gridRefresh();
						}
					},
					rowChangeCallBack: function rowChangeCallBack() {

					}
				};

				platformGridControllerService.initListController($scope, estStandardAllowancesCostCodeDetailConfigurationService, estStandardAllowancesCostCodeDetailDataService, null, gridConfig);

				$scope.tools.items.unshift({
					id: 'update',
					caption: $translate.instant('estimate.main.markupUpdateMajorCostCode'),
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new-deepcopy',
					disabled: isDisabled,
					fn: function onClick() {
						let entity = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
						estStandardAllowancesCostCodeDetailDataService.updateMajorCostCode(entity);
					}
				});

				let createBtn =  _.find ($scope.tools.items, function (d) {
					return d.id === 'create';
				});

				createBtn.disabled = isDisabled;

				function isDisabled() {
					let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
					let item = estimateMainStandardAllowancesDataService.getSelected();
					if(item && item.MdcAllowanceTypeFk < 3){
						return !item;
					}else {
						let areaItem = $injector.get('estimateMainAllowanceAreaService').getSelected();
						return areaItem ? !(areaItem.AreaType < 3 && areaItem.Id > 0) : true;
					}
				}

				let deleteBtn =  _.find ($scope.tools.items, function (d) {
					return d.id === 'delete';
				});

				estStandardAllowancesCostCodeDetailDataService.afterSetSelectedEntities.register(canDelete);
				function canDelete(){
					if(!$scope.tools){
						return;
					}

					let items = estStandardAllowancesCostCodeDetailDataService.getSelectedEntities();
					if(items.length === 0){
						deleteBtn.disabled = true;
						$scope.tools.refresh();
						$timeout(function () {
							$scope.$apply();
						});
						return;
					}

					deleteBtn.disabled =  (items.length === 1 && items[0].Id === -2);
					$scope.tools.refresh();
					$timeout(function () {
						$scope.$apply();
					});
				}

				estStandardAllowancesCostCodeDetailDataService.afterclearContent.register(updateDeleteTool);
				function updateDeleteTool() {
					if($scope.tools){
						deleteBtn.disabled = true;
						$scope.tools.refresh();
						$timeout(function () {
							$scope.$apply();
						});
					}
				}

				function updateTools() {
					let filterToolIds = ['t14'];
					let isReadOnlyContainer = $injector.get('estimateMainStandardAllowancesDataService').getIsReadOnlyContainer();
					let writePermission = platformPermissionService.hasWrite('3416213311ef4b078db786669a80735e');

					if(isReadOnlyContainer || !writePermission){
						filterToolIds.push('update');
					}

					$scope.tools.items = _.filter ($scope.tools.items, function (d) {
						return !_.includes(filterToolIds,d.id);
					});
					$timeout (function () {
						$scope.tools.update();
					});
				}

				updateTools();

				estStandardAllowancesCostCodeDetailDataService.refreshData();
				estimateMainService.onContextUpdated.register(estStandardAllowancesCostCodeDetailDataService.clearDataFromFavorites);

				$timeout (function () {
					estStandardAllowancesCostCodeDetailDataService.refreshColumns($scope.gridId);
				});

				$scope.$on('$destroy', function () {
					estStandardAllowancesCostCodeDetailDataService.afterSetSelectedEntities.unregister(canDelete);
					estimateMainService.onContextUpdated.unregister(estStandardAllowancesCostCodeDetailDataService.clearDataFromFavorites);
				});
			}
		]);
})(angular);