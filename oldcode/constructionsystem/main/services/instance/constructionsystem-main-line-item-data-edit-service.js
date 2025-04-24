/**
 * Created by daniel on 01.08.2018.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'constructionsystem.main';
	/**
     * @ngdoc service
     * @name constructionsystemMainLineItemDataEditService
     * @function
     *
     * @description
     * constructionsystemMainLineItemDataEditService is the data service for script constructionsystem line item related functionality.
     */
	angular.module(moduleName).factory('constructionsystemMainLineItemDataEditService',
		['$q', '$injector', 'platformModalService',
			'constructionSystemMainInstanceService',  'constructionsystemMainDynamicColumnService',
			'estimateMainRefLineItemService', 'estimateMainCommonService', 'cloudCommonGridService',
			'estimateMainCommonCalculationService', 'estimateMainResourceProcessor',
			'estimateMainDurationCalculatorService','constructionsystemMainResourceDataService',
			'$http','platformDataValidationService','constructionsystemMainLineItemService',
			function ($q, $injector, platformModalService,
				constructionSystemMainInstanceService, constructionsystemMainDynamicColumnService,
				estimateMainRefLineItemService, estimateMainCommonService, cloudCommonGridService,
				estimateMainCommonCalculationService, estimateMainResourceProcessor,
				estimateMainDurationCalculatorService,constructionsystemMainResourceDataService,$http,
				platformDataValidationService,constructionsystemMainLineItemService
			) {


				/* var dataServiceName = $scope.getContentValue('dataService');
                var dataService = $injector.get(dataServiceName); */

				var service = {
					fieldChange : fieldChange,
					valueChangeCallBack : valueChangeCallBack,
					getDataService : function getDataService(ds){
						service.dataService = ds;
					},
					setSelectedLineItemColumnValue: setSelectedLineItemColumnValue,
					getSelectedLineItemColumnValue: getSelectedLineItemColumnValue,
					setSelectedFieldItem: setSelectedFieldItem,
					getSelectedFieldItem: getSelectedFieldItem,
				};

				service.SelectedLineItemColumnValue = null;

				service.SelectedItem = null;

				function setSelectedFieldItem(obj){
					service.SelectedItem = obj;
				}

				function getSelectedFieldItem(){
					return service.SelectedItem;
				}
				function setSelectedLineItemColumnValue(value){
					service.SelectedLineItemColumnValue = value;
				}

				function getSelectedLineItemColumnValue(){
					return service.SelectedLineItemColumnValue;
				}
				var map2Detail = {
						Quantity: 'QuantityDetail',
						QuantityTarget: 'QuantityTargetDetail',
						QuantityFactorDetail1: 'QuantityFactor1',
						QuantityFactorDetail2: 'QuantityFactor2',
						ProductivityFactorDetail:'ProductivityFactor',
						CostFactorDetail1: 'CostFactor1',
						CostFactorDetail2: 'CostFactor2',
						IsLumpsum:'null',
						QuantityFactor3:'null',
						QuantityFactor4 : 'null',
						QuantityTotal : 'QuantityTotal',
						WqQuantityTarget: 'WqQuantityTarget',
						WqQuantityTargetDetail: 'WqQuantityTargetDetail'
					},
					calcFields = angular.extend({}, _.invert(map2Detail), map2Detail);
				delete calcFields['null'];

				var sortCodes = [
					'SortCode01Fk',
					'SortCode02Fk',
					'SortCode03Fk',
					'SortCode04Fk',
					'SortCode05Fk',
					'SortCode06Fk',
					'SortCode07Fk',
					'SortCode08Fk',
					'SortCode09Fk',
					'SortCode10Fk'];

				var refresh = function refresh(item) {
					constructionSystemMainInstanceService.fireItemModified(item);
					/* angular.forEach(constructionsystemMainResourceDataService.getList(), function(resItem){
	                    constructionsystemMainResourceDataService.fireItemModified(resItem);
                    }); */
				};

				// calculate line item on change of any type of quantity, details, cost factors, lumpsum, fromdate or todate fields
				// calculate resources of line item
				// recalculate the dynamic column values
				// refresh items
				service.calcLineItemResNDynamicCol = function calcLineItemResNDynamicCol(col, item, resourceList){// agr as item
					/* calculate detail of lineItem */
					estimateMainCommonService.calculateDetails(item, col);

					item.forceBudgetCalc = !item.IsOptional && !item.IsDisabled;

					/* calculate quantity and cost of lineItem and resources */
					estimateMainCommonService.calculateLineItemAndResources(item, resourceList);

					/* mark resources as modified */
					if (item.Id && item.EstLineItemFk === null && resourceList.length > 0) {
						angular.forEach(resourceList, function (res) {
							constructionsystemMainResourceDataService.markItemAsModified(res);
						});
					} else {
						item.EstResources = [];
					}

					/* render the lineItem and resource to screen */
					refresh(item);
				};

				service.ds = function getDataService(dataService){
					service.dataService = dataService;
				};

				// eslint-disable-next-line no-unused-vars
				function calcCostUnitCostTotal(item){
					var resourceList = constructionsystemMainResourceDataService.getList();

					// var combinedResourceCostUnit = 0;
					var costFactorChanged = 0;

					/* angular.forEach(resourceList,function(res){
					if(!res.HasChildren) {
					combinedResourceCostUnit += (res.CostUnit * res.Quantity);
					}
					}); */

					if( service.SelectedLineItemColumnValue !== null && service.SelectedLineItemColumnValue !== 0){
						costFactorChanged = item.CostUnit / service.SelectedLineItemColumnValue;
					}else{
						costFactorChanged = item.CostFactor1;
					}

					angular.forEach(resourceList,function(res){
						if(!res.HasChildren){
							res.CostFactor1 = costFactorChanged;
						}

						constructionsystemMainResourceDataService.markItemAsModified(res);
					});

					constructionSystemMainInstanceService.markItemAsModified(item);

				}

				function fieldChange(item, field, column) {
					var serv = $injector.get('constructionsystemMainLineItemService');
					if(constructionsystemMainDynamicColumnService.isDynamicColumn(field)){
						serv.setWaitForDynamicColumnCalculate(true);

						var calculatePromise = constructionsystemMainDynamicColumnService.extendColumnValueChange(column, item);
						serv.setDynamicColumnCalculatePromise(calculatePromise);
					}
					else if(estimateMainCommonService.isCharacteristicCulumn(column)) { // characteristic culomn
						if (estimateMainCommonService.isCharacteristicColumnExpired(column)) {
							var platformModalService = $injector.get('platformModalService');
							platformModalService.showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
								if (Object.prototype.hasOwnProperty.call(item,field)) {
									item[field] = item[field + '__revert'];
									delete item[field + '__revert'];
									serv.gridRefresh();
								}
							});
						} else {
							var lineItem = item;
							var colArray = _.split(field, '.');
							if (lineItem[field] === undefined) {
								lineItem[field] = estimateMainCommonService.getCharacteristicColValue(angular.copy(lineItem), colArray);
							}
							// constructionsystemMainLineItemService.fireLineItemValueUpdate(field, lineItem);

							// TODO: when update character value in line item, sync update character.
							var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(serv, 28);
							var contextId = parseInt(_.replace(characteristicDataService.getFilter(), 'mainItemId=', ''));
							var currentContextId = item.Id;
							if (contextId === currentContextId) {
								characteristicDataService.syncUpdateCharacteristic(field, lineItem);
							} else {
								characteristicDataService.setUpdateCharOnListLoaded(field, lineItem);
							}
						}
					}
					else if(['WQ', 'BQ', 'ASQ'].indexOf(field) !== -1){
						var quantityService = $injector.get('estimateMainLineItemQuantityService');
						quantityService.generateQuantityItem(field, item).then(function(data){return data;});
					}

					var procurementPackageEstimateLineItemDataService = $injector.get('procurementPackageEstimateLineItemDataService');
					if(procurementPackageEstimateLineItemDataService && procurementPackageEstimateLineItemDataService.getList() && procurementPackageEstimateLineItemDataService.getList().length > 0){
						procurementPackageEstimateLineItemDataService.load();
					}

					var quantityAndFactors = ['QuantityTotal','QuantityDetail', 'Quantity', 'QuantityFactor1', 'QuantityFactorDetail1', 'QuantityFactor2', 'QuantityFactorDetail2', 'QuantityFactor3', 'QuantityFactorDetail3', 'QuantityFactor4', 'QuantityFactorDetail4', 'ProductivityFactor', 'ProductivityFactorDetail'];
					var quantitys = ['QuantityTotal','QuantityDetail', 'Quantity'];
					if(_.includes(quantityAndFactors, field))
					{
						var isQuantity = _.includes(quantitys, field);
						serv.onQuantityChanged.fire(item, isQuantity);
					}

					if (field === 'EstAssemblyFk') {
						var value = item[field];

						var estimateMainAssemblyTemplateService = $injector.get('estimateMainAssemblyTemplateService');
						var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
						var platformDataValidationService = $injector.get('platformDataValidationService');

						if (value && !_.isNumber(value)){
							estimateMainAssemblyTemplateService.getAssemblyByCodeAsync(value).then(function(lookupItem){
								if (lookupItem){
									estimateMainCommonService.setSelectedLookupItem(lookupItem);

									item.EstAssemblyFk = lookupItem.Id;
									serv.gridRefresh();
									var mainItemList = serv.getList();
									return service.modifiedAssemblyTemplate(item, mainItemList, field);
								}
								else{
									var result = platformDataValidationService.createErrorObject(moduleName + '.errors.codeParamNotFound', { code: value });
									platformRuntimeDataService.applyValidationResult(result, item, field);
									serv.gridRefresh();
								}
							});
						}
					}

					if(field === 'IsFixedBudget'){
						var fields =[];
						fields.push({field: 'BudgetUnit', readonly: !item.IsFixedBudget},
							{field: 'Budget',readonly: !item.IsFixedBudget});

						$injector.get('platformRuntimeDataService').readonly(item, fields);
					}

					if(field === 'IsLumpsum'){
						$injector.get('estimateMainLineItem2MdlObjectService').setQuantityReadOnly(item);
					}
				}

				function assignAssemblyTo(item, lineItemEntity, assembly, projectId, field, mainItemList, overwrite, pastedContent) {
					// only assign assembly when has value
					return estimateMainCommonService.assignAssembly(lineItemEntity, assembly, projectId, false, overwrite, pastedContent).then(function (response) {
						var resources = response.data;
						if (resources) {
							if (overwrite && overwrite.overwriteFlag && overwrite.canResOverwrite) {
								var resList = constructionsystemMainResourceDataService.getList();
								if(resList && resList.length){
									resList = _.filter(resList, function(res){
										return res.EstLineItemFk === lineItemEntity.Id;
									});
								}
								_.forEach(resList, function (resource) {
									constructionsystemMainResourceDataService.deleteItem(resource);
								});

								constructionsystemMainResourceDataService.updateList([]);
							}

							constructionsystemMainResourceDataService.resolveRessourceFromAssembly(lineItemEntity, resources);
							// set also assembly cat
							lineItemEntity.EstAssemblyCatFk = assembly.EstAssemblyCatFk;
							// calculation for Line Items
							// estimateMainCommonService.estimateLineItems(field, lineItemEntity, mainItemList, resources);

							// recalculate the dynamic column
							var flatResList = [];
							var resources2LineItem = constructionsystemMainResourceDataService.getList();
							cloudCommonGridService.flatten(resources2LineItem, flatResList, 'EstResources');
							estimateMainCommonCalculationService.calcResNLineItem(flatResList, item, true);
							constructionsystemMainDynamicColumnService.calculateLineItem(item, flatResList);

							$injector.get('constructionsystemMainResourceValidationService').validateSubItemsUniqueCodeFromAssembly(resources);

							constructionsystemMainResourceDataService.setItemResources(constructionSystemMainInstanceService.getSelected());

							// Add compound resources to Project
							_.forEach(resources, function (resource) {
								constructionsystemMainResourceDataService.addCompoundAssemblyToProject(resource);
							});

							return $q.when();

						}
					});
				}

				// changes for Bulk editor
				// eslint-disable-next-line no-unused-vars
				function valueChangeCalculationForBulkEdit(entity, field, originalValue) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, originalValue, field, service.dataService);
					asyncMarker.myPromise = valueChangeCallBackForBulkEdit(entity, field, originalValue).then(function () {
						return platformDataValidationService.finishAsyncValidation(true, entity, originalValue, field, asyncMarker, service, service.dataService);
					});
					return asyncMarker.myPromise;
				}

				function valueChangeCallBackForBulkEdit(entity,field,originalValue){
					var serv = $injector.get('constructionsystemMainLineItemDataEditService');

					return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitem?' + 'lineItemId=' + entity.Id + '&headerId=' + entity.EstHeaderFk
					).then(function (response) {
						var resourceList = response.data;
						serv.valueChangeCallBack(entity, field, originalValue,true, resourceList);
						serv.calcLineItemResNDynamicCol(field, entity, resourceList);
						return $q.when();
					});
				}
				function valueChangeCallBack(item, field, newValue,isFromBulkEditor,sourceResourceList) {
					var mainItemList = constructionsystemMainLineItemService.getList();
					var resourceList;

					if(isFromBulkEditor){
						resourceList = sourceResourceList;
					} else{
						var allResources = constructionsystemMainResourceDataService.getList();
						// in case of bulk editor operation of multi selected items find resource of item
						resourceList = allResources && allResources.length ? _.filter(allResources, {EstLineItemFk : item.Id, EstHeaderFk : item.EstHeaderFk}) : [];
					}

					if (field === 'EstLineItemFk') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								return estimateMainRefLineItemService.setRefLineItem(lineItem, mainItemList);
							});
						}else{
							return estimateMainRefLineItemService.setRefLineItem(item, mainItemList);
						}
					}else if (field === 'IsDisabled' || field === 'IsOptional') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (lineItem && lineItem.Id) {
									estimateMainCommonService.calculateLineItemAndResources(lineItem, resourceList);
									constructionsystemMainLineItemService.markItemAsModified(lineItem);
								}
								return $q.when();
							});
						}else {
							if (item && item.Id) {
								item.forceBudgetCalc = !item.IsOptional && !item.IsDisabled;
								estimateMainCommonService.calculateLineItemAndResources(item, resourceList);
								constructionsystemMainLineItemService.markItemAsModified(item);
							}
							return $q.when();
						}
					}else if (field === 'FromDate' || field === 'ToDate') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (lineItem && lineItem.Id && lineItem.BasUomFk) {
									var itemQty = lineItem.Quantity;
									return estimateMainDurationCalculatorService.getDuration(lineItem).then(function (result) {
										var qty = result;
										if (qty > 0 && qty !== itemQty) {
											item.Quantity = qty;
											item.QuantityDetail = qty;
											service.calcLineItemResNDynamicCol(field, lineItem, resourceList);
										}
										return $q.when();
									});
								}
							});
						}else {
							if(item.CombinedLineItems !== null) {
								angular.forEach(item.CombinedLineItems, function (lineItem) {
									if (lineItem && lineItem.Id && lineItem.BasUomFk) {
										var itemQty = item.Quantity;
										return estimateMainDurationCalculatorService.getDuration(lineItem).then(function (result) {
											var qty = result;
											if (qty > 0 && qty !== itemQty) {
												item.Quantity = qty;
												item.QuantityDetail = qty;
												service.calcLineItemResNDynamicCol(field, lineItem, resourceList);
											}
											return $q.when();
										});
									}
								});
							}else {
								if (item && item.Id && item.BasUomFk) {
									var itemQty = item.Quantity;
									return estimateMainDurationCalculatorService.getDuration(item).then(function (result) {
										var qty = result;
										if (qty > 0 && qty !== itemQty) {
											item.Quantity = qty;
											item.QuantityDetail = qty;
											service.calcLineItemResNDynamicCol(field, item, resourceList);
										}
										return $q.when();
									});
								}
							}
						}
						return $q.when();
					}else if (field === 'IsGc') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (lineItem && lineItem.Id) {
									constructionsystemMainResourceDataService.setIndirectCost(resourceList, lineItem.IsGc);
									estimateMainCommonService.calculateLineItemAndResources(lineItem, resourceList);
									constructionsystemMainLineItemService.markItemAsModified(lineItem);
									angular.forEach(resourceList, function (res) {
										constructionsystemMainResourceDataService.markItemAsModified(res);
									});
								}
							});
						}else {
							if (item && item.Id) {
								constructionsystemMainResourceDataService.setIndirectCost(resourceList, item.IsGc);
								estimateMainCommonService.calculateLineItemAndResources(item, resourceList);
								constructionsystemMainLineItemService.markItemAsModified(item);
								angular.forEach(resourceList, function (res) {
									constructionsystemMainResourceDataService.markItemAsModified(res);
								});
							}
						}
						return $q.when();
					}else if(sortCodes.indexOf(field) !== -1){
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								constructionsystemMainLineItemService.addSortCodeChangeInfo(field, lineItem);
							});
						}else {
							constructionsystemMainLineItemService.addSortCodeChangeInfo(field, item);
						}
						return $q.when();
					}else if (field === 'EstAssemblyFk') {
						return $q.when();
					}else if (field === 'IsFixedBudget') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if(lineItem && lineItem.Id) {
									var itemProcessor = $injector.get('estimateMainLineItemProcessor');
									itemProcessor.processItem(lineItem);
									constructionsystemMainLineItemService.markItemAsModified(lineItem);
								}
							});
						}else {
							if(item && item.Id) {
								var itemProcessor = $injector.get('estimateMainLineItemProcessor');
								itemProcessor.processItem(item);
								constructionsystemMainLineItemService.markItemAsModified(item);
							}
						}
						return $q.when();
					}else if (field === 'BudgetUnit') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if(lineItem && lineItem.Id) {
									var calculationService = $injector.get('estimateMainCompleteCalculationService');
									calculationService.calItemBudget(lineItem, field);
									calculationService.calLineItemBudgetDiff(lineItem, resourceList);
									constructionsystemMainLineItemService.markItemAsModified(lineItem);
								}
							});
						}else {
							var calcService = $injector.get('estimateMainCompleteCalculationService'),
								prjInfo = constructionsystemMainLineItemService.getSelectedProjectInfo(),
								prjId = prjInfo.ProjectId ? prjInfo.ProjectId : constructionsystemMainLineItemService.getSelectedProjectId();

							return calcService.calculateBudget(item, field, prjId, resourceList, null).then(function(){
								return constructionsystemMainLineItemService.markItemAsModified(item);
							});
						}
						return $q.when();
					}else if (field === 'Budget') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if(lineItem && lineItem.Id) {
									var calcService = $injector.get('estimateMainCompleteCalculationService');
									calcService.calItemUnitBudget(lineItem, field);
									calcService.calLineItemBudgetDiff(lineItem, resourceList);
									constructionsystemMainLineItemService.markItemAsModified(lineItem);
								}
							});
						}else {
							var completeCalcService = $injector.get('estimateMainCompleteCalculationService'),
								projectInfo = constructionsystemMainLineItemService.getSelectedProjectInfo(),
								projectId = projectInfo.ProjectId ? projectInfo.ProjectId : constructionsystemMainLineItemService.getSelectedProjectId();

							return completeCalcService.calculateBudget(item, field, projectId, resourceList, null).then(function(){
								return constructionsystemMainLineItemService.markItemAsModified(item);
							});
						}
						return $q.when();
					}else if(Object.prototype.hasOwnProperty.call(calcFields,field))
					{
						if(item.CombinedLineItems !== null) {
							var combineQuantityFactor = null;

							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (!lineItem[field] || lineItem[field] === '') {
									lineItem[field] = 0;
								}

								lineItem.DescriptionInfo = item.DescriptionInfo;

								if(field === 'Quantity') {
									combineQuantityFactor = item.Quantity / parseFloat(newValue);
									lineItem.Quantity = lineItem.Quantity * combineQuantityFactor;
								}else if (field === 'QuantityTotal') {
									combineQuantityFactor = item.QuantityTotal / parseFloat(newValue);
									if (lineItem.QuantityFactor1 === 0 || lineItem.QuantityFactor2 === 0 || lineItem.QuantityFactor3 === 0 || lineItem.QuantityFactor4 === 0 || lineItem.ProductivityFactor === 0) {
										if (lineItem.QuantityTotal > 0) {
											lineItem.QuantityFactor1 = lineItem.QuantityFactor1 === 0 ? 1 : lineItem.QuantityFactor1;
											lineItem.QuantityFactor2 = lineItem.QuantityFactor2 === 0 ? 1 : lineItem.QuantityFactor2;
											lineItem.QuantityFactor3 = lineItem.QuantityFactor3 === 0 ? 1 : lineItem.QuantityFactor3;
											lineItem.QuantityFactor4 = lineItem.QuantityFactor4 === 0 ? 1 : lineItem.QuantityFactor4;
											lineItem.ProductivityFactor = lineItem.ProductivityFactor === 0 ? 1 : lineItem.ProductivityFactor;
										}
									}

									if (lineItem.QuantityTarget === 0 && lineItem.Quantity === 0) {
										lineItem.Quantity = 1;
									}

									var isCalcTotalWithWq = $injector.get('constructionsystemMainLineItemService').getEstTypeIsTotalWq();
									if (lineItem.IsLumpsum) {
										lineItem.Quantity = lineItem.QuantityTotal / (lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor);
										lineItem.QuantityDetail = lineItem.Quantity;
									} else {
										if (!isCalcTotalWithWq && lineItem.QuantityTarget === 0 && lineItem.Quantity !== 0) {
											lineItem.QuantityTarget = lineItem.QuantityTotal / lineItem.Quantity / (lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor);
											// lineItem.QuantityTargetDetail = lineItem.QuantityTarget;
											lineItem.QuantityDetail = lineItem.Quantity;
										}
										else if (isCalcTotalWithWq && lineItem.WqQuantityTarget === 0 && lineItem.Quantity !== 0) {
											lineItem.WqQuantityTarget = lineItem.QuantityTotal / lineItem.Quantity / (lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor);
											// lineItem.QuantityTargetDetail = lineItem.WqQuantityTarget;
											lineItem.QuantityDetail = lineItem.Quantity;
										}
										else {
											var qty2Divide = isCalcTotalWithWq ? item.WqQuantityTarget : item.QuantityTarget;
											lineItem.Quantity = lineItem.QuantityTotal / qty2Divide / (lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor);
											lineItem.QuantityDetail = lineItem.Quantity;
										}
									}
								}

								/* check whether the resources is in the current lineItem */
								if (lineItem) {
									if (lineItem.EstLineItemFk) {
										var resources = estimateMainRefLineItemService.getResources(lineItem.Id);

										if (resources) {
											service.calcLineItemResNDynamicCol(field, lineItem, resources);
										}
									} else {
										if (resourceList === null || resourceList.length === 0) {
											service.calcLineItemResNDynamicCol(field, lineItem, resourceList);
										} else if (resourceList && resourceList.length > 0) {
											service.calcLineItemResNDynamicCol(field, lineItem, resourceList);
										}
									}
								}

								if (field !== 'QuantityTotal') {
									if (lineItem.__rt$data && lineItem.__rt$data.errors && lineItem.__rt$data.errors.QuantityTotal) {
										if (lineItem.QuantityTotal || lineItem.QuantityTotal === 0) {
											var platformDataValidationService = $injector.get('platformDataValidationService');
											platformDataValidationService.removeDeletedEntityFromErrorList(lineItem, constructionsystemMainLineItemService);

											lineItem.__rt$data.errors.QuantityTotal = null;
										}
									}
								}
							});
						}else {
							if (!item[field] || item[field] === '') {
								item[field] = '';
							}

							if (field === 'QuantityTotal') {
								if (item.QuantityFactor1 === 0 || item.QuantityFactor2 === 0 || item.QuantityFactor3 === 0 || item.QuantityFactor4 === 0 || item.ProductivityFactor === 0) {
									if (item.QuantityTotal > 0) {
										item.QuantityFactor1 = item.QuantityFactor1 === 0 ? 1 : item.QuantityFactor1;
										item.QuantityFactor2 = item.QuantityFactor2 === 0 ? 1 : item.QuantityFactor2;
										item.QuantityFactor3 = item.QuantityFactor3 === 0 ? 1 : item.QuantityFactor3;
										item.QuantityFactor4 = item.QuantityFactor4 === 0 ? 1 : item.QuantityFactor4;
										item.ProductivityFactor = item.ProductivityFactor === 0 ? 1 : item.ProductivityFactor;
									}
								}

								if (item.QuantityTarget === 0 && item.Quantity === 0) {
									item.Quantity = 1;
								}

								var isCalcTotalWithWq = $injector.get('constructionsystemMainLineItemService').getEstTypeIsTotalWq();
								if (item.IsLumpsum) {
									item.Quantity = item.QuantityTotal / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
									item.QuantityDetail = item.Quantity;
								} else {
									if (!isCalcTotalWithWq && item.QuantityTarget === 0 && item.Quantity !== 0 ) {
										item.QuantityTarget = item.QuantityTotal / item.Quantity / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
										// item.QuantityTargetDetail = item.QuantityTarget;
										item.QuantityDetail = item.Quantity;
									}
									else if(isCalcTotalWithWq && item.WqQuantityTarget === 0 && item.Quantity !== 0){
										item.WqQuantityTarget = item.QuantityTotal / item.Quantity / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
										// item.QuantityTargetDetail = item.WqQuantityTarget;
										item.QuantityDetail = item.Quantity;
									}
									else {
										var qty2Divide = isCalcTotalWithWq ? item.WqQuantityTarget : item.QuantityTarget;
										item.Quantity = item.QuantityTotal / qty2Divide / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
										item.QuantityDetail = item.Quantity;
									}
								}
							}

							/* check whether the resources is in the current lineItem */
							if (item) {
								if (item.EstLineItemFk) {
									var resources = estimateMainRefLineItemService.getResources(item.Id);

									if (resources) {
										service.calcLineItemResNDynamicCol(field, item, resources);
									}
								} else {
									if (resourceList === null || resourceList.length === 0) {
										service.calcLineItemResNDynamicCol(field, item, resourceList);
									} else if (resourceList && resourceList.length > 0 && item.Id === resourceList[0].EstLineItemFk) {
										service.calcLineItemResNDynamicCol(field, item, resourceList);
									}
								}
							}

							if (field !== 'QuantityTotal') {
								if (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.QuantityTotal) {
									if (item.QuantityTotal || item.QuantityTotal === 0) {
										var platformDataValidationService = $injector.get('platformDataValidationService');
										platformDataValidationService.removeDeletedEntityFromErrorList(item, constructionsystemMainLineItemService);

										item.__rt$data.errors.QuantityTotal = null;
									}
								}
							}
						}
						return $q.when();
					}

					else{
						return $q.when();
					}
				}


				service.modifiedAssemblyTemplate = function (lineItem, mainItemList, field, assemblyItem, pastedContent){
					var lineItemEntity = lineItem,
						assembly = assemblyItem ? assemblyItem : estimateMainCommonService.getSelectedLookupItem(),
						projectId = constructionSystemMainInstanceService.getCurrentSelectedProjectId();

					if (lineItemEntity && lineItemEntity.EstAssemblyFk) {
						// TO DO: copy character1 and character2 to line item form assembly
						$injector.get('estimateMainCharacteristicCommonService').copyCharacter1AssemblyToLineItem(constructionSystemMainInstanceService, assembly, lineItemEntity);
						$injector.get('estimateMainCharacteristicCommonService').copyCharacter2AssemblyToLineItem(constructionSystemMainInstanceService, assembly, lineItemEntity);

						var estimateRuleComplexLookupCommonService = $injector.get('estimateRuleComplexLookupCommonService');

						var lookupItems = _.isArray(lineItemEntity.RuleAssignment) ? lineItemEntity.RuleAssignment : lineItemEntity.RuleAssignment ? [lineItemEntity.RuleAssignment] : [];
						var ls2RuleData = {
							PrjEstRulesToSave : lookupItems,
							LSItemId : lineItemEntity.IsRoot ? lineItemEntity.EstHeaderFk : lineItemEntity.Id,
							LSName : 'EstLineItems',
							ProjectId : projectId,
							EstHeaderId : constructionSystemMainInstanceService.getCurrentInstanceHeaderId()
						};

						var promises = [];
						promises.push(estimateMainCommonService.checkIfResourceCanBeDeleted(lineItemEntity.Id, lineItemEntity.BasUomFk, assembly.BasUomFk, lineItemEntity.EstHeaderFk));
						promises.push(estimateRuleComplexLookupCommonService.canDeleteLS2RuleItems(ls2RuleData));

						// clear all resources under this lineitem if system option "Overwrite line item when change assembly template" = true
						return $q.all(promises).then(function (response) {
							console.log(response);// removing intellisense error
							var responseData = promises[0].$$state.value.data;
							var overwrite = {
								canResOverwrite: responseData && responseData.CanOverwrite,
								overwriteFlag: responseData && responseData.OverwrideFlag,
								canRuleOverwrite: promises[1].$$state.value.data,
								hasSameUom: responseData && responseData.HasSameUom
							};

							if (overwrite && !overwrite.canResOverwrite) {
								platformModalService.showMsgBox(responseData.ErrorMessage, '', 'warning');
							}
							return assignAssemblyTo(lineItem, lineItemEntity, assembly, projectId, field, mainItemList, overwrite, pastedContent);
						});
					}else{
						return $q.when();
					}
				};

				return service;

			}]);
})();
