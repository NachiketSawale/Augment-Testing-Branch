/**
 * Created by waldrop on 12/10/2018
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'constructionsystem.main';
	/**
     * @ngdoc service
     * @name constructionsystemMainResourceDetailService
     * @function
     *
     * @description
     * constructionsystemMainResourceDetailService is the data service for resource related functionality.
     */
	angular.module(moduleName).factory('constructionsystemMainResourceDetailService',
		['$q', '$injector', '$http',
			'constructionsystemMainResourceDataService','estimateMainService',
			'estimateMainResourceImageProcessor','estimateMainSubItemCodeGenerator',
			'estimateMainResourceProcessor', 'constructionsystemMainCommonService',
			'constructionsystemMainCommonCalculationService', 'estimateMainGenerateSortingService',
			'estimateMainExchangeRateService', 'constructionsystemMainResourceValidationService',
			'constructionsystemMainResourceDataService','constructionsystemMainLineItemService',
			'constructionSystemMainInstanceService','estimateMainCommonService','estimateMainCompleteCalculationService',
			function ($q, $injector, $http,
				constructionsystemMainResourceDataService, estimateMainService,
				estimateMainResourceImageProcessor, estimateMainSubItemCodeGenerator,
				estimateMainResourceProcessor, constructionsystemMainCommonService,
				constructionsystemMainCommonCalculationService, estimateMainGenerateSortingService,
				estimateMainExchangeRateService, constructionsystemMainResourceValidationService,
				cosMainResourceDataService,cosMainLineItemService,
				constructionSystemMainInstanceService, estimateMainCommonService, estimateMainCompleteCalculationService) {
				var resList = [];
				// eslint-disable-next-line no-unused-vars
				var isSorted = false;
				var service = {
					fieldChange : fieldChange,
					valueChangeCallBack : valueChangeCallBack
				};

				var calcFields = [
					'Code',
					'DescriptionInfo',
					'EstCostTypeFk',
					'EstResourceFlagFk',
					'BasUomFk'
				];


				function refreshData(parentLineItem) {
					if(parentLineItem){
						cosMainLineItemService.markItemAsModified(parentLineItem);
					}
					angular.forEach(cosMainResourceDataService.getList(), function(resItem){
						cosMainResourceDataService.markItemAsModified(resItem);
						cosMainResourceDataService.fireItemModified(resItem);
					});
					// work around to display instantly sub-items cost total and other values after quantity has been updated.(the item is marked as modified then is refreshed)
					cosMainResourceDataService.gridRefresh();

					// use this to refresh line item container when the resource is changed
					// #defect: 73220
					cosMainLineItemService.fireItemModified(parentLineItem);

				}

				function fieldChange(item, field, column) {
					resList = cosMainResourceDataService.getList();
					var isPrcPackageChanged = false; // #80834
					var parentLineItem = cosMainLineItemService.getSelected();
					var selectedResourceItem = cosMainResourceDataService.getSelected();

					var projectInfo = constructionSystemMainInstanceService.getCurrentSelectedProjectId();

					if (item && item.Id && field) {
						var argData = {item: item, colName: field};
						if (field === 'EstResourceTypeFkExtend') {
							// TODO: set original price and quantity
							if (item.Version === 0) {
								item.QuantityOriginal = item.Quantity;
								item.CostUnitOriginal = item.CostUnit;
							}

							// item.ColumnId = 0;
							// do not take over if resource type is assembly || resource type is material
							if (item.EstResourceTypeFk !== 4) {
								item.BasUomFk = parentLineItem.BasUomFk;
							}
							item.BasCurrencyFk = projectInfo && projectInfo.ProjectCurrency ? projectInfo.ProjectCurrency : null;
							item.Code = item.DescriptionInfo.Translated = item.DescriptionInfo.Description = '';
							estimateMainResourceImageProcessor.processItem(item);

							if (item.EstResourceTypeFk === 2) { // Material
								item.BasUomFk = item.BasCurrencyFk = null;
							} else if (item.EstResourceTypeFk === 5) { // SubItem?
								estimateMainSubItemCodeGenerator.getSubItemCode(item, resList);
								estimateMainResourceProcessor.processItem(item, null);
								estimateMainResourceProcessor.setCostUnitReadOnly(item, true);
								estimateMainResourceProcessor.setLineTypeReadOnly(item, true);
							} else {
								return;
							}
						}
						else {
							// TODO: set original price and quantity
							if (field === 'Code' && item.Version === 0) {
								item.QuantityOriginal = item.Quantity;
								item.CostUnitOriginal = item.CostUnit;
							}

							if (field === 'CostUnit' && item.Version === 0) {
								item.CostUnitOriginal = item.CostUnit;
							}

							if (field === 'Quantity' && item.Version === 0) {
								item.QuantityOriginal = item.Quantity;
							}

							// calculation if code, description,cost type, resource flag, uom changes
							if (calcFields.indexOf(field) !== -1) {
								var info = {
									'projectInfo': projectInfo,
									'selectedResourceItem': selectedResourceItem,
									'parentLineItem': parentLineItem,
									'resList': resList,
									'lineItemList': cosMainLineItemService.getList()
								};
								constructionsystemMainCommonCalculationService.setInfo(info);
								// code extracted to function to use it twice (caused by async call below)
								var estimateResourcesAndRefresh = function estimateResourcesAndRefresh() {
									estimateMainExchangeRateService.loadData(projectInfo.ProjectId).then(
										function () {
										// estimateMainCommonCalculationService.calculateResources(item);
											estimateMainCommonService.estimateResources(argData, resList, parentLineItem, cosMainResourceDataService.getList(), null);
											cosMainResourceDataService.calLineItemDynamicColumns(parentLineItem, resList);
											cosMainLineItemService.markItemAsModified(parentLineItem);
											constructionsystemMainCommonService.GenerateLineItemAdvancedAllowance(parentLineItem, resList);
											refreshData(parentLineItem);
										});
								};

								if ([1, 2, 4].indexOf(item.EstResourceTypeFk) !== -1 && field === 'Code' && !_.isEmpty(item[field])) { // Cost Code/ Material/ Assembly
									// eslint-disable-next-line no-unused-vars
									var isCodeIdEmpty = false;
									if (item.EstResourceTypeFk === 1) {
										isCodeIdEmpty = item.MdcCostCodeFk === null;
									} else if (item.EstResourceTypeFk === 2) {
										isCodeIdEmpty = item.MdcMaterialFk === null;
									} else if (item.EstResourceTypeFk === 4) {
										// eslint-disable-next-line no-unused-vars
										isCodeIdEmpty = item.EstAssemblyFk === null;
									}
									item.Code = _.toUpper(item.Code);
								}

								if (field === 'Code' || field === 'DescriptionInfo') {
									estimateMainCommonService.ModifyIsIndirectValue(item);
								}

								estimateResourcesAndRefresh();
							}
						}

						if (estimateMainCommonService.isCharacteristicCulumn(column)) {
							if (estimateMainCommonService.isCharacteristicColumnExpired(column)) {
								var platformModalService = $injector.get('platformModalService');
								platformModalService.showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
									// eslint-disable-next-line no-prototype-builtins
									if (item.hasOwnProperty(field)) {
										item[field] = item[field + '__revert'];
										delete item[field + '__revert'];
										cosMainResourceDataService.gridRefresh();
									}
								});
							} else {
								var lineItem = item;
								var colArray = _.split(field, '.');
								if (lineItem[field] === undefined) {
									var itemValue = estimateMainCommonService.getCharacteristicColValue(angular.copy(lineItem), colArray);
									lineItem[field] = itemValue;
								}
								// estimateMainResourceService.fireLineItemValueUpdate(field, lineItem);
								// TODO: when update character value in estResource, sync update character.
								var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(cosMainResourceDataService, 33);
								var contextId = parseInt(_.replace(characteristicDataService.getFilter(), 'mainItemId=', ''));
								var currentContextId = item.Id;
								if (contextId === currentContextId) {
									characteristicDataService.syncUpdateCharacteristic(field, lineItem);
								} else {
									characteristicDataService.setUpdateCharOnListLoaded(field, lineItem);
								}
							}
						}

						cosMainResourceDataService.calLineItemDynamicColumns(parentLineItem, resList);
						// #80834
						if (!isPrcPackageChanged) {
							refreshData(parentLineItem);
							isPrcPackageChanged = true;
						}
					}


				}

				// bulk edit changes
				function valueChangeCallBack(item, field) {
					item.CompareFlag = 4;
					resList = cosMainResourceDataService.getList();
					// eslint-disable-next-line no-unused-vars
					var isPrcPackageChanged = false; // #80834
					var parentLineItem = cosMainLineItemService.getSelected(),
						selectedResourceItem = cosMainResourceDataService.getSelected();

					var projectInfo = constructionSystemMainInstanceService.getSelectedProjectInfo();

					if (item && item.Id && field) {
						var argData = {item: item, colName: field};

						if (field === 'IsDisabled' || field === 'IsDisabledPrc') {

							constructionsystemMainCommonService.GenerateLineItemAdvancedAllowance(parentLineItem, resList);
							return estimateMainResourceProcessor.processItemsAsync(resList).then(function () {
								cosMainLineItemService.markItemAsModified(parentLineItem);
								return constructionsystemMainCommonCalculationService.markResourceAsModified(false, selectedResourceItem);
							});
						}
						else if (field === 'IsLumpsum' || field === 'IsIndirectCost') {

							estimateMainCommonService.estimateResources(argData, resList, parentLineItem, cosMainLineItemService.getList(), null);
							constructionsystemMainCommonService.GenerateLineItemAdvancedAllowance(parentLineItem, resList);
							refreshData(parentLineItem);
							return $q.when();
						}

						else if (field === 'Sorting') {

							isSorted = true;
							estimateMainGenerateSortingService.sortOnEdit(resList, item);
							return $q.when();

						}
						else if (field === 'IsFixedBudget') {
							if (item && item.Id) {
								estimateMainResourceProcessor.processItem(item);
								cosMainResourceDataService.markItemAsModified(item);
							}
							return $q.when();
						}
						else if (field === 'BudgetUnit') {
							if (item && item.Id) {
								estimateMainCompleteCalculationService.calItemBudget(item);
								cosMainResourceDataService.markItemAsModified(item);
							}
							return $q.when();
						}
						else if (field === 'Budget') {
							if (item && item.Id) {
								estimateMainCompleteCalculationService.calItemUnitBudget(item);
								estimateMainCompleteCalculationService.calResBudgetDiff(item, resList);
								cosMainResourceDataService.markItemAsModified(item);
							}
							return $q.when();
						}
						else {
							// calculation if quantity or any details field changes
							var info = {
								'projectInfo': projectInfo,
								'selectedResourceItem': selectedResourceItem,
								'parentLineItem': parentLineItem,
								'resList': resList,
								'lineItemList': cosMainLineItemService.getList()
							};
							constructionsystemMainCommonCalculationService.setInfo(info);
							// code extracted to function to use it twice (caused by async call below)
							var estimateResourcesAndRefresh = function estimateResourcesAndRefresh() {
								return estimateMainExchangeRateService.loadData(projectInfo.ProjectId).then(
									function () {
									// estimateMainCommonCalculationService.calculateResources(item);
										estimateMainCommonService.estimateResources(argData, resList, parentLineItem, cosMainLineItemService.getList(), null, true);
										cosMainResourceDataService.calLineItemDynamicColumns(parentLineItem, resList);
										cosMainLineItemService.markItemAsModified(parentLineItem);
										constructionsystemMainCommonService.GenerateLineItemAdvancedAllowance(parentLineItem, resList);
										return refreshData(parentLineItem);
									});
							};

							// Code was set for resource of type 'Assembly'?
							if (item.EstResourceTypeFk === 4 && (field === 'Code' || field === 'DescriptionInfo')) {

								var assembly = estimateMainCommonService.getSelectedLookupItem();

								if (assembly && assembly.Id) {
									// set relation to assembly
									item.EstAssemblyFk = assembly.Id;
									item.EstHeaderAssemblyFk = assembly.EstHeaderFk;

									item.Code = assembly.Code;
									item.DescriptionInfo = assembly.DescriptionInfo;

									// take over properties from assembly
									item.BasUomFk = assembly.BasUomFk;

									item.MdcCostCodeFk = assembly.MdcCostCodeFk;
									item.MdcMaterialFk = assembly.MdcMaterialFk;

									// take over cost type from assembly costcode or material
									cosMainResourceDataService.takeOverCostTypeFromAssembly(item.MdcCostCodeFk, item.MdcMaterialFk, item);

									if (selectedResourceItem.EstAssemblyTypeFk) {
										var subResourcesToRemove = cosMainResourceDataService.getList().filter(function (resource) {
											return resource.EstResourceFk === item.Id;
										});
										_.forEach(subResourcesToRemove, function (resource) {
											cosMainResourceDataService.deleteItem(resource);
										});
									}
								}
							}
							return estimateResourcesAndRefresh();
						}

						// cosMainResourceDataService.calLineItemDynamicColumns(parentLineItem,resList);
						// #80834
						/* if (!isPrcPackageChanged) {
							refreshData(parentLineItem);
							isPrcPackageChanged = true;
						} */
					}

				}

				return service;

			}]);
})();
