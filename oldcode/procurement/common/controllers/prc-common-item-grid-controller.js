(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonPrcItemListController
	 * @require $scope, procurementCommonPrcItemDataService, procurementCommonPrcItemHttpService, lookupDataService, moduleContext, procurementRequisitionHeaderDataService, slickGridEditors, prcItemGridColDef, $filter, procurementCommonPrcItemValidationService,
	 * @description controller for procurement Item
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonPrcItemListController',
		['$scope', '$injector', 'platformControllerExtendService', 'procurementContextService', 'platformGridControllerService', 'procurementCommonPrcItemDataService',
			'procurementCommonPrcItemValidationService', 'procurementCommonItemUIStandardService', 'procurementCommonItemQuantityValidationFlagService',
			'procurementCommonPrcItemDataService', 'modelViewerStandardFilterService', 'basicsCommonMandatoryProcessor', 'platformGridAPI', '_',
			function ($scope, $injector, platformControllerExtendService, moduleContext, gridControllerService, dataServiceFactory,
				procurementCommonPrcItemValidationService, gridColumns, procurementCommonItemQuantityValidationFlagService,
				procurementCommonPrcItemDataService, modelViewerStandardFilterService, basicsCommonMandatoryProcessor, platformGridAPI, _) {

				var mainService = moduleContext.getMainService();
				var dataService = dataServiceFactory.getService(mainService);

				function updateTools() {
					$scope.tools.update();
				}

				var prcItemDataService = procurementCommonPrcItemDataService.getService();
				if (prcItemDataService.updateToolsEvent) {
					prcItemDataService.updateToolsEvent.register(updateTools);
				}

				procurementCommonPrcItemValidationService = procurementCommonPrcItemValidationService(dataService);
				if (mainService) {
					moduleContext.getItemDataContainer().data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'PrcItemDto',
						moduleSubModule: 'Procurement.Common',
						validationService: procurementCommonPrcItemValidationService,
						mustValidateFields: ['PrcStructureFk', 'BasUomFk', 'BasItemType2Fk']
					});
				}

				var gridConfig = dataService.treePresOpt || {};
				gridConfig.costGroupService = $injector.get('prcCommonPrcItemCostGroupService').getService(dataService);

				dataService.validateService = procurementCommonPrcItemValidationService;
				platformControllerExtendService.initListController($scope, gridColumns, dataService, procurementCommonPrcItemValidationService, gridConfig);

				function setValidationFlag() {
					var selectedItem = dataService.getSelected();
					if (selectedItem) {
						procurementCommonItemQuantityValidationFlagService.itemId = selectedItem.Id;
						procurementCommonItemQuantityValidationFlagService.validateOrNot = true;
						if (selectedItem.MdcMaterialFk) {

							procurementCommonPrcItemValidationService.getMaterialById(selectedItem.MdcMaterialFk).then(function (result) {
								var material = result.data;
								procurementCommonItemQuantityValidationFlagService.sellUnit = material.SellUnit;
								procurementCommonItemQuantityValidationFlagService.minQuantity = material.MinQuantity;
							}, function () {
								procurementCommonItemQuantityValidationFlagService.sellUnit = null;
								procurementCommonItemQuantityValidationFlagService.minQuantity = null;
							});
						} else {
							procurementCommonItemQuantityValidationFlagService.sellUnit = null;
							procurementCommonItemQuantityValidationFlagService.minQuantity = null;
						}
						var validation = procurementCommonPrcItemValidationService;
						validation.validateItemTypeFn(selectedItem.BasItemTypeFk,selectedItem,false);
					} else {
						procurementCommonItemQuantityValidationFlagService.itemId = null;
						procurementCommonItemQuantityValidationFlagService.validateOrNot = true;
					}
					setCopyMainCallOffItemTool();
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService);

				dataService.setToolItems($scope.tools.items);
				dataService.registerSelectionChanged(setValidationFlag);
				dataService.registerListLoaded(onListLoaded);

				$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtItemMainSerivce(dataService);
				$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtItemContainerScope($scope);
				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(setValidationFlag);
					if (prcItemDataService.updateToolsEvent) {
						prcItemDataService.updateToolsEvent.unregister(updateTools);
					}
					// dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtItemMainSerivce(null);
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtItemContainerScope(null);
					dataService.unregisterListLoaded(onListLoaded);
				});

				function setCopyMainCallOffItemTool() {
					if (mainService && mainService.name === 'procurement.contract' && $scope.tools && $scope.tools.items) {
						moduleContext.addToolCopyMainCallOffItem($scope, dataService);
					}
				}

				function onListLoaded() {
					let parentService = dataService.parentService();
					if(parentService.getModule().name === 'procurement.quote') {
						let itemList = dataService.getList();
						if (itemList && itemList.length > 0){
							let gridId = '274da208b3da47988366d48f38707de1';
							// let columns = platformGridAPI.columns.getColumns(gridId);
							let styleKey = 'quoteItemEvaluatedItemCellStyleOnLoad';
							let grid = platformGridAPI.grids.element('id', gridId);
							let highlightNodes = [];
							_.forEach(itemList, function(item, index) {
								if (item.ExQtnIsEvaluated){
									highlightNodes.push({
										cell: {
											row: index,
											col: 'price'
										}
									});
									highlightNodes.push({
										cell: {
											row: index,
											col: 'itemEvaluationFk'
										}
									});
								}
							});

							// step 1 remove style cache
							let itemEvaluatedCellStyle = grid.instance.getCellCssStyles(styleKey);
							if (itemEvaluatedCellStyle) {
								grid.instance.removeCellCssStyles(styleKey);
							}

							// step 2 add style to cache
							if (highlightNodes.length > 0) {
								let cssObject = {};
								_.forEach(highlightNodes, node => {
									let colCss = {};
									colCss[node.cell.col] = 'pc-item-evaluation';
									if (!Object.prototype.hasOwnProperty.call(cssObject, node.cell.row)) {
										cssObject[node.cell.row] = colCss;
									} else {
										_.extend(cssObject[node.cell.row], colCss);
									}
								});
								grid.instance.addCellCssStyles(styleKey, cssObject);
							}
						}
					}
				}

				setCopyMainCallOffItemTool();
			}]);
})(angular);

