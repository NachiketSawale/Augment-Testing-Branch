(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.pes';

	/**
	 * @ngdoc controller
	 * @name procurementPesItemController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Section.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPesItemController',
		['$scope', '$translate', '$injector', 'procurementPesItemService', 'platformGridControllerService', 'procurementPesItemUIStandardService', 'procurementPesItemValidationService',
			'modelViewerStandardFilterService', 'procurementPesHeaderService', 'procurementStockAlternativeDialogService',
			function ($scope, $translate, $injector, procurementPesItemService, platformGridControllerService, procurementPesItemUIStandardService, procurementPesItemValidationService,
				modelViewerStandardFilterService, procurementPesHeaderService, procurementStockAlternativeDialogService) {

				var myGridConfig = {
					initCalled: false,
					columns: []
				};
				myGridConfig.costGroupService = $injector.get('pesItemCostGroupService');
				platformGridControllerService.initListController($scope, procurementPesItemUIStandardService, procurementPesItemService, procurementPesItemValidationService(procurementPesItemService), myGridConfig);

				var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				var isCreateIteming=false;

				$scope.tools.items.splice(createBtnIdx + 1, 0, {
					id: 'copypesitem',
					caption: $translate.instant('procurement.pes.pesItems.copyItem'),
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new-copy',
					fn: function () {
						$scope.isLoading = true;
						procurementPesItemService.deepCopy();
					},
					disabled: function () {
						if (procurementPesItemService.canAddDeleteItemByConfig() === false) {
							return true;
						}
						var headerSelectedItem = procurementPesHeaderService.getSelected();
						return procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
					}
				},
				{
					id: 'createotheritem',
					caption: 'procurement.common.copyContractNNonContractItems',
					type: 'item',
					iconClass: 'control-icons ico-copy-action1-2',
					fn: function () {
						var headerSelectedItem = procurementPesHeaderService.getSelected();
						var itemSelected = procurementPesItemService.getSelected();
						var isCreateCopyContract = true;
						if(itemSelected&&!isCreateIteming){
							isCreateIteming=true;
							procurementPesItemService.createOtherItems(itemSelected, false, false, null, true, null, isCreateCopyContract).then(function(){
								isCreateIteming=false;
							});
						} else if(headerSelectedItem&&!isCreateIteming){
							isCreateIteming=true;
							procurementPesItemService.createOtherItems({ConHeaderFk: headerSelectedItem.ConHeaderFk, ProjectFk: headerSelectedItem.ProjectFk}, false, true, null, true, null, isCreateCopyContract).then(function(){
								isCreateIteming=false;
							});
						}
					},
					disabled: function () {
						if (procurementPesItemService.canAddDeleteItemByConfig() === false) {
							return true;
						}
						var headerSelectedItem = procurementPesHeaderService.getSelected();
						return !headerSelectedItem || procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
					}
				}, {
					id: 'alternative',
					caption: 'procurement.stock.title.alternative',
					iconClass: 'tlb-icons ico-alternative',
					type: 'item',
					fn: function () {
						var selected = procurementPesItemService.getSelected();
						if (selected && !_.isNil(selected.MdcMaterialFk)) {
							var stockId = selected.PrjStockFk;
							var materialId = selected.MdcMaterialFk;
							var materialCode = selected.MaterialCode;
							var materialDescription = selected.Description1;
							procurementStockAlternativeDialogService.showDialog({requestId: materialId, code: materialCode, description: materialDescription, stockId: stockId});

						} else {
							procurementStockAlternativeDialogService.noMaterialRecordMessage();
						}

					}
				});

				function finishLoading() {
					$scope.isLoading = false;
				}

				function costGroupLoaded(costGroupCatalogs) {
					if (costGroupCatalogs.isForDetail === null || costGroupCatalogs.isForDetail === undefined) {
						$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, procurementPesItemUIStandardService, costGroupCatalogs, procurementPesItemService, procurementPesItemValidationService);
					}
				}

				function updateToolsEvent() {
					if ($scope.tools) {
						$scope.tools.update();
					}
					let selectedItem =procurementPesItemService.getSelected();
					if(selectedItem){
					return procurementPesItemService.canReadonlyByPrcItemBasItemType(selectedItem);}
				}

				procurementPesItemService.onCostGroupCatalogsLoaded.register(costGroupLoaded);
				procurementPesItemService.registerSelectionChanged(updateToolsEvent);

				/* add costGroupService to mainService */
				if (!procurementPesItemService.costGroupService) {
					procurementPesItemService.costGroupService = $injector.get('pesItemCostGroupService');
				}
				procurementPesItemService.costGroupService.registerCellChangedEvent($scope.gridId);

				if (procurementPesItemService.finishLoadingEvent) {
					procurementPesItemService.finishLoadingEvent.register(finishLoading);
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, procurementPesItemService.getServiceName());

				$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtItemMainSerivce(procurementPesItemService);
				$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtItemContainerScope($scope);
				$scope.$on('$destroy', function () {
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtItemMainSerivce(null);
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtItemContainerScope(null);
					procurementPesItemService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
					procurementPesItemService.unregisterSelectionChanged(updateToolsEvent);
					procurementPesItemService.costGroupService.unregisterCellChangedEvent($scope.gridId);
				});

			}
		]);
})(angular);