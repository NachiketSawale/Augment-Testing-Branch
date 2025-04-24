/**
 * Created by wuj on 9/9/2014.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Platform */
	/* jshint -W072 */
	// many parameters because of dependency injection

	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialRecordService',
		['$http', '$injector', '$translate', 'platformDataServiceFactory', 'basicsMaterialMaterialGroupsService', 'basicsMaterialMaterialCatalogService',
			'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService',
			'cloudDesktopSidebarService', 'PlatformMessenger',
			'moment', 'basicsCommonMandatoryProcessor', '$rootScope', '$q', '$log',
			'platformModalService', 'basicsMaterialCalculationHelper', 'hourfactorReadonlyProcessor', 'ServiceDataProcessDatesExtension',
			'materialNumberGenerationSettingsService',
			'platformRuntimeDataService',
			'platformDataValidationService',
			'_', '$timeout', 'platformGridAPI',
			function ($http, $injector, $translate, dataServiceFactory, parentService, materialCatalogService, basicsLookupdataLookupDescriptorService,
					basicsLookupdataLookupFilterService, lookupService,
					cloudDesktopSidebarService, PlatformMessenger,
					moment, mandatoryProcessor, $rootScope, $q, $log,
					platformModalService, basicsMaterialCalculationHelper, hourfactorReadonlyProcessor, DatesProcessor,
					materialNumberGenerationSettingsService,
					platformRuntimeDataService,
					platformDataValidationService,
					_, $timeout, platformGridAPI) {

				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: false,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch:true
				};

				var self = this;
				var attachMaterialGroup = null, attachTaxCode = null,
					setCostPriceGross = null, serviceContainer = null, service = null;
				var tempIdOfMaterialWithoutMateiralTemp = -1;
				var isMaterialTempModified = false;
				var allReadonlyFields;

				let MaterialCatalogIds = [];

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getSelectedItems() {

					// var theCont = container;
					var theSvc = serviceContainer.service;
					var resultSet = theSvc.getSelected();
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getResultsSet() {

					var theSvc = serviceContainer.service;
					var resultSet = theSvc.getList();
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				function createInquiryResultSet(resultSet) {
					// var defNoName = $translate.instant('basics.material.inquiry.noname');
					var resultArr = [];
					_.forEach(resultSet, function (item) {
						if (item && item.Id) { // check for valid object
							resultArr.push({
								id: item.Id,
								materialId: item.Id,
								name: item.Code,
								description: item.DescriptionInfo1.Description || ''
							});
						}
					});

					return resultArr;
				}

				var serviceOption = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsMaterialRecordService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/material/',
							initReadData: function (readData, data) {
								if (service.isSearchFromCatalog) {
									readData.IsRefresh = false;
									readData.GroupIds = self.groupIds;
								} else {
									var filterRequest = cloudDesktopSidebarService.filterRequest;
									var patternFlg = filterRequest.pattern.length > 0;
									var gotoMaterialFlg = data.searchFilter && Object.prototype.hasOwnProperty.call(data.searchFilter, 'PKeys');
									var checkIds = materialCatalogService.getAllCheckedId();
									if (self.groupIds.length > 0) {
										if (-1 === self.groupIds[0] && patternFlg) {
											self.groupIds = [];
										}
									}
									if(!_.isNil(service.catalogId)){
										readData.catalogId = service.catalogId;
										service.catalogId = null;
									}
									readData.GroupIds = checkIds.length > 0 && !patternFlg && !gotoMaterialFlg ? self.groupIds : [];

									readData.IsRefresh = false;
								}
								if (parentService.cacheItemList && parentService.cacheItemList.length > 0) {
									let materialCatalogFks = [];
									_.forEach(parentService.cacheItemList, function (item) {
										if (self.groupIds.indexOf(item.Id) > -1 && materialCatalogFks.indexOf(item.MaterialCatalogFk) === -1) {
											materialCatalogFks.push(item.MaterialCatalogFk);
										}
									});
									readData.MaterialCatalogIds = materialCatalogFks;
								} else {
									readData.MaterialCatalogIds = [];
								}
								if (!_.isEqual(readData.MaterialCatalogIds, MaterialCatalogIds)) {
									data.searchFilter.PageNumber = 0;
									cloudDesktopSidebarService.filterRequest.pageNumber = 0;
									MaterialCatalogIds = readData.MaterialCatalogIds;
								}

								if (cloudDesktopSidebarService.checkStartupFilter()) {
									return null;
								}
								var params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter);
								angular.extend(readData, params);
							},
							usePostForRead: true
						},
						entitySelection: {supportsMultiSelection: true},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectedGroup = parentService.getSelected();
									if (selectedGroup !== null) {
										creationData.groupId = selectedGroup.Id;
										attachMaterialGroup(selectedGroup);
									}
								},
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									var items = {
										FilterResult: readData.FilterResult,
										dtos: readData.Main.Materails || []
									};

									/* if (!service.isSearchFromCatalog) {
									 materialCatalogService.cacheData(readData.Main.MaterailCatalogs || []);
									 var checkedGroupIds = [];
									 angular.forEach(readData.Main.Materails, function (item) {
									 if (checkedGroupIds.indexOf(item.MaterialGroupFk) === -1) {
									 checkedGroupIds.push(item.MaterialGroupFk);
									 }
									 });
									 parentService.cacheTreeData(readData.Main.MaterailGroups || [], checkedGroupIds);
									 } */
									if (!service.isSearchFromCatalog) {
										service.setParentItemsChecked(items.dtos);
									}
									setCostPriceGross(items.dtos);

									var materialRecords = readData.MaterialRecord ? readData.MaterialRecord : [];
									if (materialRecords.length > 0) {
										angular.forEach(items.dtos, function (item) {
											if (item.MdcMaterialFk) {
												var neutralMaterialRecord = _.find(materialRecords, function (netural) {
													return netural.Id === item.MdcMaterialFk;
												});
												if (neutralMaterialRecord) {
													item.NeutralMaterialCatalogFk = neutralMaterialRecord.MaterialCatalogFk;
												}
											}

											if (item.MdcMaterialStockFk) {
												var stockMaterialRecord = _.find(materialRecords, function (material) {
													return material.Id === item.MdcMaterialStockFk;
												});
												if (stockMaterialRecord) {
													item.StockMaterialCatalogFk = stockMaterialRecord.MaterialCatalogFk;
												}
											}
										});
									}


									var dataRead = serviceContainer.data.handleReadSucceeded(items, data);
									service.isSearchFromCatalog = false;
									if (dataRead && dataRead.length > 0) {
										service.setSelected(dataRead[0]);
									}
									isMaterialTempModified = false;
									ignoreDisplaySkeletonLoading();
									return dataRead;
								},
								handleCreateSucceeded: function (newData) {
									// service.completeEntityCreateed.fire(null, newData);
									return newData.Material;
								}
							}
						},
						dataProcessor: [setItemReadonly(), {
							processItem: angular.noop,
							revertProcessItem: function (item) {
								if (!angular.isArray(item)) {
									item = [item];
								}
								angular.forEach(item, function (entity) {
									if (entity.Version === 0) {
										var hasToGenerate = entity.BasRubricCategoryFk && materialNumberGenerationSettingsService.hasToGenerateForRubricCategory(entity.BasRubricCategoryFk);
										if (hasToGenerate) {
											entity.Code = '';
										}
									}
								});
							}
						}, new DatesProcessor(['UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5'])],
						entityRole: {
							root: {
								itemName: 'Materials',
								moduleName: 'cloud.desktop.moduleDisplayNameMaterial',
								addToLastObject: true,
								lastObjectModuleName: 'basics.material',
								codeField: 'Code',
								descField: 'DescriptionInfo1.Description',
								handleUpdateDone: function (updateData, response, data) {
									if (updateData.Material && !updateData.Material.Version) {
										platformRuntimeDataService.readonly(response.Materials[0], [{
											field: 'Code',
											readonly: false
										}]);
									}
									if (data.itemList) {

										service.syncItemsAfterUpdate(response);
										// localData.clearTransaction(angular.isDefined(response) && (response !== null) ? response.BoqItem : null);

										data.handleOnUpdateSucceeded(updateData, response, data, true);
									}
								}
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true}, // enable watchlist for this module
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: moduleName,
								getSelectedItemsFn: getSelectedItems,
								getResultsSetFn: getResultsSet
							}
						},  // 11.Jun.2015@rei added
						translation: {
							uid: 'basicsMaterialRecordService',
							title: 'basics.material.record.gridViewTitle',
							columns: [{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo1'
							}, {
								header: 'basics.material.record.furtherDescription',
								field: 'DescriptionInfo2'
							}, {
								header: 'cloud.common.EntitySpec',
								field: 'SpecificationInfo',
								maxLength: 2000
							}],
							dtoScheme: { typeName: 'MaterialDto', moduleSubModule: 'Basics.Material' }
						},
						actions: {
							delete: {},
							create: 'flat',
							canCreateCallBackFunc: function () {
								return !materialCatalogService.isReadonlyCatalog();
							},
							canDeleteCallBackFunc: function (item) {
								var result=false;
								if (item)
								{
									if(item.MaterialCatalogFk)
									{
										result= !materialCatalogService.isReadonlyCatalog(null, item.MaterialCatalogFk);
									}
									if(result&&item.MaterialStatusFk)
									{
										result= !isReadonlyMaterialStatus(item);
									}
								}
								return result;
							}
						}
					}
				};

				attachMaterialGroup = function (materialGroup) {
					basicsLookupdataLookupDescriptorService.updateData('MaterialGroup', [materialGroup]);

					if (materialGroup.PrcStructureFk) {
						lookupService.getItemByKey('PrcStructure', materialGroup.PrcStructureFk).then(function (response) {
							if (!angular.isObject(response)) {
								return;
							}
							attachTaxCode(response);
							service.gridRefresh();
						});
					}

					if (materialGroup.MaterialCatalogFk && self.groupIds.length === 0) {
						lookupService.getItemByKey('MaterialCatalog', materialGroup.MaterialCatalogFk).then(function (response) {
							if (!angular.isObject(response)) {
								return;
							}
							basicsLookupdataLookupDescriptorService.updateData('MaterialCatalog', [response]);
						});
					}
				};

				attachTaxCode = function (prcStructure) {
					if (prcStructure.TaxCodeFk) {
						lookupService.getItemByKey('TaxCode', prcStructure.TaxCodeFk).then(function (response) {
							if (!angular.isObject(response)) {
								return;
							}
							basicsLookupdataLookupDescriptorService.updateData('TaxCode', [response]);
						});
					}
				};

				setCostPriceGross = function (itemList) {
					if (!_.isArray(itemList)) {
						itemList = [itemList];
					}
					angular.forEach(itemList, function (item) {
						var taxCode = _.find(basicsLookupdataLookupDescriptorService.getData('TaxCode'), {Id: item.MdcTaxCodeFk});
						var vatPercent = taxCode ? taxCode.VatPercent : 0;
						let costPriceGross=item.Cost * (100 + vatPercent) / 100;
						item.CostPriceGross = basicsMaterialCalculationHelper.round(roundType.CostPriceGross,costPriceGross);
					});
				};

				var filters = [
					{
						key: 'basics-material-records-neutral-materialCatalog-filter',
						fn: function (dateItem) {
							return (dateItem.IsNeutral && dateItem.Islive);
						}
					},
					{
						key: 'basics-material-records-neutral-material-filter',
						serverSide: true,
						serverKey: 'basics-material-records-neutral-material-filter',
						fn: function () {
							var selectedEntity = service.getSelected();
							var neutralMaterialCatalogFk = selectedEntity ? selectedEntity.NeutralMaterialCatalogFk : -1;
							return {
								materialCatalogFk: neutralMaterialCatalogFk
							};
						}
					},
					{
						key: 'basics-material-records-stock-materialCatalog-filter',
						fn: function (dateItem) {
							return (dateItem.Islive);
						}
					},
					{
						key: 'basics-material-records-stock-material-filter',
						serverSide: true,
						serverKey: 'basics-material-records-stock-material-filter',
						fn: function () {
							var selectedEntity = service.getSelected();
							var neutralMaterialCatalogFk = selectedEntity ? selectedEntity.StockMaterialCatalogFk : -1;
							return {
								materialCatalogFk: neutralMaterialCatalogFk
							};
						}
					},
					{
						key: 'basics-material-records-agreement-filter',
						fn: function agreementFilter(dataItem) {
							var today = moment.utc();

							var from = null;
							var to = null;
							if (dataItem.ValidFrom && dataItem.ValidTo) {
								from = moment.utc(dataItem.ValidFrom);
								to = moment.utc(dataItem.ValidTo);
								return isEarlierOrEqual(from, today) && isEarlierOrEqual(today, to);
							}
							if (dataItem.ValidFrom && !dataItem.ValidTo) {
								from = moment.utc(dataItem.ValidFrom);
								return isEarlierOrEqual(from, today);
							}
							if (!dataItem.ValidFrom && dataItem.ValidTo) {
								to = moment.utc(dataItem.ValidTo);
								return isEarlierOrEqual(today, to);
							}

							return true;

							// //////////
							function isEarlierOrEqual(date1, date2) {
								var year1 = date1._d.getUTCFullYear();
								var year2 = date2._d.getUTCFullYear();
								var month1 = date1._d.getUTCMonth();
								var month2 = date2._d.getUTCMonth();
								var day1 = date1._d.getUTCDate();
								var day2 = date2._d.getUTCDate();

								return year1 < year2 ? true : (year1 > year2 ? false : (month1 < month2 ? true : (month1 > month2 ? false : (day1 < day2 ? true : day1 <= day2))));
							}
						}
					},
					{
						key: 'basics-material-discount-group-filter',
						fn: function (dateItem) {
							var materialCatalogFk = service.getSelected().MaterialCatalogFk;
							return (dateItem.MaterialCatalogFk === materialCatalogFk);
						}
					},
					{
						key: 'basics-material-records-material-template-filter',
						serverSide: true,
						serverKey: 'basics-material-records-material-template-filter',
						fn: function () {
							return {};
						}
					}, {
						key: 'basics-material-weight-uom-filter',
						fn: function (dateItem) {
							return dateItem.MassDimension === 1 && dateItem.IsLive;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;
				var localData = serviceContainer.data;

				service.deleteSelection = function deleteSelection() {
					return service.deleteEntities(service.getSelectedEntities());
				};

				// request canceler variables
				localData.specificationLoadCanceler = $q.defer();

				localData.currentSpecification = {
					Content: null,
					Id: 0,
					Version: 0
				};

				// Transaction variables
				localData.modifiedSpecifications = [];

				// Register to the selectionChanged event of the base service
				// Todo: is an unregister necessary and where is it placed best.
				// For the event is a property of the service itself, so it gets destroyed when the service is destroyed and the same applies to the added callbacks.
				// No unregister seems to be necessary concerning destruction of the service as the triggering scenario.

				self.groupIds = [];

				service.setParentItemsChecked = function setParentItemsChecked(itemList) {
					var groupIds = [];
					var catalogIds = [];
					var patternFlg = cloudDesktopSidebarService.filterRequest.pattern.length > 0;
					if (!patternFlg) {
						catalogIds = materialCatalogService.getAllCheckedId();
					}
					angular.forEach(itemList, function (item) {
						if (groupIds.indexOf(item.MaterialGroupFk) === -1) {
							groupIds.push(item.MaterialGroupFk);
						}

						if (catalogIds.indexOf(item.MaterialCatalogFk) === -1) {
							catalogIds.push(item.MaterialCatalogFk);
						}
					});

					// self.groupIds=groupIds;
					parentService.setItemsChecked(catalogIds, groupIds);
				};

				let roundType=basicsMaterialCalculationHelper.roundingType;
				service.recalculatePriceByPriceGross=function(entity,value){
					var TaxCodes = basicsLookupdataLookupDescriptorService.getData('TaxCode');
					var taxCode = _.find(TaxCodes, {Id: entity.MdcTaxCodeFk});
					var vatPercent = taxCode ? taxCode.VatPercent : 0;
					if (!entity.PrcPriceconditionFk) {
						entity.ListPrice = (value * 100 / (100 + vatPercent) - entity.Charges - entity.PriceExtra) * 100 / (100 - entity.Discount);
						entity.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,entity.ListPrice * (100 - entity.Discount) / 100 + (entity.Charges) + (entity.PriceExtra));
						entity.EstimatePrice = entity.Cost;
						entity.DayworkRate = entity.Cost;
						entity.ListPrice = basicsMaterialCalculationHelper.round(roundType.ListPrice,entity.ListPrice);
					} else {
						entity.Cost = value * 100 / (100 + vatPercent);
						entity.ListPrice = basicsMaterialCalculationHelper.round(roundType.ListPrice,(entity.Cost - entity.PriceExtra - entity.Charges) * 100 / (100 - entity.Discount));
						entity.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,entity.Cost);
						entity.EstimatePrice = entity.Cost;
						entity.DayworkRate = entity.Cost;
					}
				};

				service.recalculateCost = function recalculateCost(item, value, model) {

					if (!item) {
						item = service.getSelected();
					}
					if (model === 'ListPrice') {
						item.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,value * (100 - item.Discount) / 100 + (item.Charges) + (item.PriceExtra));
					} else if (model === 'Discount') {
						item.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,item.ListPrice * (100 - value) / 100 + (item.Charges) + (item.PriceExtra));

					} else if (model === 'Charges') {
						item.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,item.ListPrice * (100 - item.Discount) / 100 + value + (item.PriceExtra));

					} else if (model === 'PriceExtra') {
						item.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,item.ListPrice * (100 - item.Discount) / 100 + (item.Charges) + value);

					} else {
						item.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,item.ListPrice * (100 - item.Discount) / 100 + (item.Charges) + (item.PriceExtra));
					}

					let materialPortionEstimatePrice = $injector.get('basicsMaterialPortionDataService').getEstimatePrice();
					let materialPortionDayWorkRate = $injector.get('basicsMaterialPortionDataService').getDayWorkRate();
					let priceExtraDWRate = $injector.get('basicsMaterialPortionDataService').getPriceExtraDWRate();
					let priceExtraEstPrice = $injector.get('basicsMaterialPortionDataService').getPriceExtraEstPrice();

					if(model ==='IsEstimatePrice'){
						item.EstimatePrice = item.Cost;
						item.EstimatePrice = item.EstimatePrice + materialPortionEstimatePrice;
						item.PriceExtraEstPrice = priceExtraEstPrice;
					}else if(model ==='IsDayworkRate'){
						item.DayworkRate = item.Cost;
						item.DayworkRate = item.DayworkRate + materialPortionDayWorkRate;
						item.PriceExtraDwRate = priceExtraDWRate;
					}else {
						// Estimate price  is always set to COST whenever COST changes
						item.EstimatePrice = item.Cost;
						item.DayworkRate = item.Cost;

						item.EstimatePrice = item.EstimatePrice + materialPortionEstimatePrice;
						item.DayworkRate = item.DayworkRate + materialPortionDayWorkRate;
					}

					if(model ==='PrcPriceConditionFk' || model ==='all'){
						item.PriceExtraDwRate = priceExtraDWRate;
						item.PriceExtraEstPrice = priceExtraEstPrice;
					}

					setCostPriceGross(item);

					service.markItemAsModified(item);
					service.fireItemModified(item);
				};

				service.recalculatePrice = function recalculatePrice(material) {
					var currentItem = service.getSelected();
					if (material) {
						currentItem.PrcPriceConditionFk = currentItem.PrcPriceconditionFk = material.PrcPriceconditionFk;
						currentItem.PriceExtra = material.PriceExtra;
					}

					service.recalculateCost();
				};

				service.getFilterData=function (){
					let readData={};
					 serviceContainer.data.initReadData(readData,serviceContainer.data);
					 return readData;
				};

				var onMaterialGroupIdsCheckChanged = function (checkGroupIds) {
					service.isSearchFromCatalog = true;
					if (checkGroupIds.length === 0) {
						checkGroupIds = [-1];
					}
					self.groupIds = checkGroupIds;
					parentService.tempGroupIds = angular.copy(checkGroupIds);
					cloudDesktopSidebarService.filterInfo.isPending=false;
					cloudDesktopSidebarService.filterStartSearch();
					cloudDesktopSidebarService.filterInfo.isPending=false;
				};

				parentService.materialGroupIdsCheckChanged.register(onMaterialGroupIdsCheckChanged);
				service.priceConditionSelectionChanged = new PlatformMessenger();
				service.completeEntityCreateed = new PlatformMessenger();

				var baseRefresh = service.refresh;

				service.refresh = function () {
					materialCatalogService.load();
					parentService.load();
					baseRefresh.call(service);
				};

				var baseServiceClear = service.clear;
				service.clear = function clear() {
					parentService.clear();
					baseServiceClear();
				};

				service.clearData = function clearItems() {
					parentService.clearData();

					serviceContainer.data.itemList.length = 0;
					serviceContainer.data.listLoaded.fire();
				};

				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
					var materialTempUpdateStatus = newData.MaterialTempUpdateStatus;
					if (materialTempUpdateStatus) {
						basicsLookupdataLookupDescriptorService.updateData('materialTempUpdateStatus', [materialTempUpdateStatus]);
					}
					return onCreateSucceeded.call(serviceContainer.data, newData.Material, data, creationData).then(function () {
						var hasToGenerate = newData.Material.BasRubricCategoryFk && materialNumberGenerationSettingsService.hasToGenerateForRubricCategory(newData.Material.BasRubricCategoryFk);
						var code = newData.Material.Code;
						if ((code === null || code === '' || hasToGenerate) && newData.Material.Version === 0) {
							materialNumberGenerationSettingsService.assertLoaded().then(function () {
								platformRuntimeDataService.readonly(newData.Material, [{
									field: 'Code',
									readonly: materialNumberGenerationSettingsService.hasToGenerateForRubricCategory(newData.Material.BasRubricCategoryFk)
								}]);
								newData.Material.Code = materialNumberGenerationSettingsService.provideNumberDefaultText(newData.Material.BasRubricCategoryFk, code);
								var currentItem = serviceContainer.service.getSelected();
								var result = {apply: true, valid: true};
								if (newData.Material.Code === '') {
									result.valid = false;
									result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
								}
								platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
								platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
								service.fireItemModified(currentItem);
								serviceContainer.service.markCurrentItemAsModified();
								service.gridRefresh();

							});
						}
						service.completeEntityCreateed.fire(null, newData);
					});
				};

				// TODO: the filterSearchFromPKeys return a promise will be better
				service.navigationCompleted = function navigationCompleted(item, triggerField) {
					var navHeaderFk = item.MdcMaterialFk;
					if (angular.isDefined(navHeaderFk) && angular.isNumber(navHeaderFk)) {
						cloudDesktopSidebarService.filterSearchFromPKeys([navHeaderFk]);
					} else if (!navHeaderFk) {
						if(triggerField==='fromMaterialCatalog'){
							service.catalogId = item.Id;
							cloudDesktopSidebarService.filterSearchFromPKeys(null);
						}else{
							cloudDesktopSidebarService.filterSearchFromPKeys(item);
						}

					} else {
						throw new Error('The property contract header is not recognized.');
					}
				};

				service.filterByCatalogItem = function filterByCatalogItem(item) {
					materialCatalogService.load().then(function () {
						var catalogId = item ? item.Id : null;
						var catalogItem = materialCatalogService.getItemById(catalogId);
						// ensure trigger by material catalog ,not by other item
						if (!_.isEmpty(catalogItem) && catalogItem.InsertedAt === item.InsertedAt) {
							parentService.load().then(function () {
								service.refresh().then(function () {
									service.setList([]);
									parentService.setItemsChecked([], []);
									catalogItem.IsChecked = true;
									materialCatalogService.isCheckedValueChange(catalogItem, true);
									materialCatalogService.gridRefresh();
								});
							});
						}
					});

				};

				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'MaterialDto',
					moduleSubModule: 'Basics.Material',
					validationService: 'basicsMaterialRecordValidationService',
					mustValidateFields: ['UomFk']
				});

				service.createDeepCopy = function createDeepCopy() {
					if (service.hasSelection()) {
						$http.post(globals.webApiBaseUrl + 'basics/material/deepcopy', service.getSelected())
							.then(function (response) {
								if (!response || !response.data) {
									return;
								}
								if (response && response.data && response.data.ErrorMessage) {
									platformModalService.showMsgBox(response.data.ErrorMessage, $translate.instant('basics.common.taskBar.warning'), 'warning');
									return;
								}

								if (!response.data.Material) {
									return;
								}
								setItemReadonly(null, response.data.Material).processItem(response.data.Material);
								var dataProcessor = new DatesProcessor(['UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5']);
								dataProcessor.processItem(response.data.Material);
								service.setList(_.union(service.getList(), [response.data.Material]));
								//change in ticket:DEV-20762;service.goToLast() change to below
								service.setSelected(response.data.Material);
								service.gridRefresh();
							},
							function (/* error */) {
							});
					}
				};

				service.getServiceContainer = function () {
					return serviceContainer;
				};

				// display a SCS model in the viewer
				service.registerSelectionChanged(function (e, entity) {
					localData.onSetSelected(e, entity);
					$rootScope.$emit('selectedScsFileChanged', entity ? {
						uuid: entity.Uuid,
						description: entity.DescriptionInfo1 ? (entity.DescriptionInfo1.Translated || '') : ''
					} : null);
				});

				service.navigateToItem = function navigateToItem(materialIds) {

					var data = {
						GroupIds: [],
						PKeys: materialIds,
						IsRefresh: true,
					};
					$http.post(globals.webApiBaseUrl + 'basics/material/list', data).then(function (item) {
						if (item && item.data && item.data.Main && item.data.Main.Materails) {
							setCostPriceGross(item.data.Main.Materails);
							var res = _.filter(item.data.Main.Materails, function (material) {
								if (materialIds.indexOf(material.Id) > -1) {
									return material;
								}
							});
							var materialRecords = item.data.MaterialRecord;
							if (materialRecords && materialRecords.length) {
								_.forEach(res, function (material) {
									if (material.MdcMaterialFk) {
										var neutralMaterialRecord = _.find(materialRecords, function (netural) {
											return netural.Id === material.MdcMaterialFk;
										});
										if (neutralMaterialRecord) {
											material.NeutralMaterialCatalogFk = neutralMaterialRecord.MaterialCatalogFk;
										}
									}

									if (material.MdcMaterialStockFk) {
										var stockMaterialRecord = _.find(materialRecords, function (material) {
											return material.Id === item.MdcMaterialStockFk;
										});
										if (stockMaterialRecord) {
											item.StockMaterialCatalogFk = stockMaterialRecord.MaterialCatalogFk;
										}
									}
								});
							}
							if (item.data.MaterialGroup.length > 0) {
								var groups = item.data.MaterialGroup;
								if (groups.length > 0) {
									parentService.updateMaterialGroupByImport(groups);
								}
								parentService.gridRefresh();
							}
							if (res && res.length) {
								var originalList =  _.clone(service.getList());
								localData.selectedItem = null;
								localData.itemList.length = 0;

								_.forEach(res, function (item) {
									localData.itemList.push(item);
								});
								_.forEach(originalList, function (item) {
									var foundItem = _.find(localData.itemList, function (localItem) {
										return item.Id === localItem.Id;
									});
									if(_.isNil(foundItem)){
										localData.itemList.push(item);
									}
								});
								localData.listLoaded.fire();
								service.setSelected(res[0]);
								updateReadonlyForList(res);
							}
						}
					});
				};

				service.syncItemsAfterUpdate = function syncItemsAfterUpdate(responseData) {
					if (!responseData) {
						return;
					}
					var currentItem = service.getSelected();
					if (responseData.Materials && responseData.Materials.length) {
						var selectedItem = _.find(responseData.Materials, function (item) {
							return item.Id === currentItem.Id;
						});
						if (selectedItem) {
							currentItem = selectedItem;
						}
					}
					// var currentItem = (responseData.Materials !== null) ? responseData.Materials : service.getSelected();

					if (responseData.BlobSpecificationToSave) {
						if (typeof (localData.currentSpecification) !== 'undefined' && localData.currentSpecification !== null) {
							// Update the client side version with the server side version of this boqItem.
							if (localData.currentSpecification.Id === responseData.BlobSpecificationToSave.Id) {
								localData.copyToCurrentSpecification(responseData.BlobSpecificationToSave);
							}

							// Remove entry from modified specification list
							localData.modifiedSpecifications = _.filter(localData.modifiedSpecifications, function (item) {
								return item.MaterialId !== currentItem.Id;
							});
						}
					}
				};

				// Specification properties
				service.currentSpecificationChanged = new Platform.Messenger();

				localData.getModifiedSpecificationFor = function (materialItems) {

					if (angular.isUndefined(materialItems) || (materialItems === null)) {
						return null;
					}

					// var material = _.isArray(materialItems) ? materialItems[0] : materialItems;
					var modifiedSpecificationsEntries = _.filter(localData.modifiedSpecifications, function (item) {
						// return item.MaterialId === material.Id;
						return _.find(materialItems, {Id: item.MaterialId});
					});
					var modifiedSpecificationsEntry = null;
					if (modifiedSpecificationsEntries.length > 0) {
						modifiedSpecificationsEntry = _.last(modifiedSpecificationsEntries);
					}

					return angular.isDefined(modifiedSpecificationsEntry) && (modifiedSpecificationsEntry !== null) ? modifiedSpecificationsEntry.Specification : null;
				};

				localData.provideUpdateData = function (updateData/* , data */) {
					// Changes done to the boq items are already detected by the underlying modification tracker
					// mechanism and are delivered with the given updateData object so we currently should find here
					// an entry like updateData.BoqItem. But this is only the case when being a root service. When being a
					// child service we will find an array under the property updateData.BoqItemToSave which in turn holds the
					// complete data that is stored in updateData.BoqItem when being in root mode.

					// So we have to distinguish between root mode und child mode
					var completeEntityArray = [updateData];
					// var platformDataServiceModificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');

					// So we now only add our own special cases of additionally updated data.
					angular.forEach(completeEntityArray, function (completeEntity) {

						var materialItem = completeEntity.Materials;

						if (angular.isUndefined(materialItem) || materialItem === null) {
							materialItem = service.getSelected();
						}

						// Add modifiedSpecification
						var modifiedSpecificationForCurrentItem = localData.getModifiedSpecificationFor(materialItem);
						if (angular.isDefined(modifiedSpecificationForCurrentItem) && modifiedSpecificationForCurrentItem !== null) {
							completeEntity.SelectedMaterialId = service.getSelected() ? service.getSelected().Id : 0;
							completeEntity.BlobSpecificationToSave = modifiedSpecificationForCurrentItem;
							completeEntity.EntitiesCount += 1;
						}
					});

					return updateData;
				};

				localData.clearSpecification = function clearSpecification() {
					localData.currentSpecification.Content = null;
					localData.currentSpecification.Id = 0;
					localData.currentSpecification.Version = 0;

					// Notify that the specification has changed
					service.currentSpecificationChanged.fire(localData.currentSpecification);
				};

				localData.copyToCurrentSpecification = function copyToCurrentSpecification(specification) {
					if (specification) {
						localData.currentSpecification.Content = specification.Content;
						localData.currentSpecification.Id = specification.Id;
						localData.currentSpecification.Version = specification.Version;
						var currentlySelectedMaterialItem = service.getSelected();
						if (currentlySelectedMaterialItem) {
							localData.modifiedSpecifications.push({MaterialId: currentlySelectedMaterialItem.Id, Specification: localData.currentSpecification});
						}
					} else {
						localData.clearSpecification();
					}

					// Notify that the specification has changed
					service.currentSpecificationChanged.fire(localData.currentSpecification);
				};

				localData.loadSpecificationById = function loadSpecificationById(fkId) {
					localData.specificationLoadCanceler.resolve();
					localData.specificationLoadCanceler = $q.defer();

					if (fkId) {
						// We have a valid foreign key -> load related specification
						$http(
							{
								method: 'GET',
								url: globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + fkId,
								timeout: localData.specificationLoadCanceler.promise
							}
						).then(function (response) {
							// Load successful
							if (response && response.data) {
								// We use the already existing specification object and change its properties according the currently loaded specification object
								// in order to instantly update referencing elements.

								// Copy the loaded specification contents to the current specification
								localData.copyToCurrentSpecification(response.data);
							}
						},
						function (/* response */) {
							// Load failed
							localData.clearSpecification();
						});
					} else {
						// We have an invalid specification -> reset specification
						localData.clearSpecification();
					}
				};

				service.getCurrentSpecification = function getCurrentSpecification() {
					return localData.currentSpecification;
				};

				service.setSpecificationAsModified = function setSpecificationAsModified(specification) {

					if (!specification) {
						return;
					}

					var currentlySelectedMaterialItem = service.getSelected();
					var oldModifiedSpecification = localData.getModifiedSpecificationFor(currentlySelectedMaterialItem);

					if (typeof (oldModifiedSpecification) === 'undefined' || oldModifiedSpecification === null) {

						// Create a new specification object and copy the given changed specification to it
						// to isolate the specification to be saved from the currently displayed specification.
						// This is necessary to avoid unwanted updates.
						var newModifiedSpecification = angular.copy(specification);
						localData.modifiedSpecifications.push({MaterialId: currentlySelectedMaterialItem.Id, Specification: newModifiedSpecification});

						// In this use case a specification always has a corresponding boqItem.
						// The material has a foreign key to the corresponding data set in BAS_BLOBS table.
						// When inserting a new specification, the related boqItem has no foreign key set the boqItem
						// is set to be modified and the server cares about setting up the link to the BAS_BLOBS table
						// by creating a new id for the new blob and setting it as foreign key to the boqItem.

						if (currentlySelectedMaterialItem /* && !currentlySelectedBoqItem.BasBlobsSpecificationFk && (newModifiedSpecification.Version === 0) */) {
							// The currently selected materialRecordItem has no valid foreign key set to the corresponding blob object (i.e. specification)
							// and the specification itself hasn't been saved to the database before (i.e. specification.Version = 0)
							// -> add tis boqItem to the list of modified items and by this forcing it to be saved with the proper foreign key to the blob object
							// (this is all done on the server side)
							service.markItemAsModified(currentlySelectedMaterialItem);
						}
					} else {
						// The specification has already been added as modified
						// Check if the version fits
						if (specification.Version !== oldModifiedSpecification.Version) {
							// Although the id's of the two specification objects fit they differ in their version -> not good!!
							// Todo: not really sure if we should go on saving this specification
							$log.log('basicsMaterialRecordService.setSpecificationAsModified -> version mismatch of specification');
						}

						// Simply update it's content if necessary
						if (specification.Content !== oldModifiedSpecification.Content) {
							oldModifiedSpecification.Content = specification.Content;
						}
					}
				};

				localData.onSetSelected = function onSetSelected(e, args) {
					// Load the specification for the new selected materialItem
					if (angular.isDefined(args) && (args !== null)) {

						if (!angular.isObject(args)) {
							$log.log('boqMainServiceFactory -> onSetSelected : unexpected passed args object -> check call of related selectionChanged event');
							return;
						}
						if (angular.isDefined(args.BasBlobsSpecificationFk)) {
							localData.loadSpecificationById(args.BasBlobsSpecificationFk);
						}
					}
				};

				service.getMaterialCodeLength = function () {
					$http.get(globals.webApiBaseUrl + 'basics/material/getmaterialcodelimitlength')
						.then(function (response) {
							service.materialCodeLimitLength = response.data;
						});
				};

				service.setCostPriceGross = setCostPriceGross;
				service.getMaterialTempReadonlyFields = getMaterialTempReadonlyFields;
				service.buildFieldsReadonlyStatusFromUpdateStatuses = buildFieldsReadonlyStatusFromUpdateStatuses;
				service.setItemReadonly = setItemReadonly;
				service.setIsMaterialTempModified = setIsMaterialTempModified;
				service.canCreateCopy = canCreateCopy;
				service.canCreateOrDelete = canCreateCopy;
				service.setEntityToReadonlyIfRootEntityIs = setEntityToReadonlyIfRootEntityIs;
				service.isReadonlyMaterial = isReadonlyMaterial;
				service.materialTempChanged = new PlatformMessenger();
				localData.callAfterSuccessfulUpdate = callAfterSuccessfulUpdate;
				service.isSetReadonly=isSetReadonly;
				materialCatalogService.registerSelectionChanged(function () {
					var selectedItem = service.getSelected();
					if (selectedItem) {
						serviceContainer.data.selectionChanged.fire(null, selectedItem);
					}
				});

				updateReadonlyForList();
				return service;

				// ////////////////////////////

				function setIsMaterialTempModified() {
					isMaterialTempModified = true;
				}

				function buildFieldsReadonlyStatusFromUpdateStatuses(updateStatuses) {
					var result = [];

					if (!angular.isArray(updateStatuses) || updateStatuses.length <= 0) {
						return result;
					}

					_.forEach(updateStatuses, function (item) {
						for (var prop in item) {
							if (Object.prototype.hasOwnProperty.call(item, prop) && prop !== 'Id' && prop !== 'IsLive' && prop !== 'PriceExtra' && prop !== 'Cost') {
								result.push({
									field: prop,
									readonly: item[prop]
								});
							}
						}
					});
					return result;
				}

				function setItemReadonly(readonlyFields, modifiedEntity) {
					return {
						processItem: processItem
					};

					// /////////////////
					function processItem(item) {
						if (!item) {
							return;
						}

						if(isReadonlyMaterialStatus(item))
						{
							return isSetReadonly([item]);
						}
						if (materialCatalogService.isReadonlyCatalog(null, item.MaterialCatalogFk)) {
							if (!allReadonlyFields || !allReadonlyFields.length) {
								getAllReadonlyFields();
							}
							platformRuntimeDataService.readonly(item, allReadonlyFields);
							return;
						}
						tempRelatedReadonlyProcessor(readonlyFields, modifiedEntity).processItem(item);
						if (angular.isArray(readonlyFields)) {
							var factorHour = _.find(readonlyFields, {field: 'FactorHour'});
							if (factorHour) {
								if (!factorHour.readonly) {
									hourfactorReadonlyProcessor.processItem(item);
								}
							}
						}
					}
				}

				function tempRelatedReadonlyProcessor(readonlyFields, modifiedEntity) {
					return {
						processItem: function processItem(item) {
							if (!item) {
								return;
							}
							readonlyFields = readonlyFields || [];

							if (!angular.isArray(readonlyFields) || readonlyFields.length === 0) {
								readonlyFields = getMaterialTempReadonlyFields(modifiedEntity ? modifiedEntity.MaterialTempFk : item.MaterialTempFk);
							}

							var tempTypes = basicsLookupdataLookupDescriptorService.getData('materialtemptype');
							var currentTempType = null;
							if (tempTypes) {
								currentTempType = tempTypes[modifiedEntity ? modifiedEntity.MaterialTempTypeFk : item.MaterialTempTypeFk];
							}
							if (currentTempType) {
								readonlyFields.push({field: 'MaterialTempFk', readonly: currentTempType.Istemplate});
							}

							platformRuntimeDataService.readonly(item, readonlyFields);
						}
					};
				}

				function getMaterialTempReadonlyFields(tempId) {
					tempId = tempId || tempIdOfMaterialWithoutMateiralTemp;
					var updateStatues = basicsLookupdataLookupDescriptorService.getData('materialTempUpdateStatus');
					if (updateStatues) {
						var updateStatus = updateStatues[tempId];
						if (updateStatus) {
							return buildFieldsReadonlyStatusFromUpdateStatuses([updateStatus]);
						}
					}
					return [];
				}

				function updateReadonlyForList() {
					var materialStatus=basicsLookupdataLookupDescriptorService.getData('materialstatus');
					if(!materialStatus)
					{
						basicsLookupdataLookupDescriptorService.loadData('materialstatus');
					}
					var dataList = basicsLookupdataLookupDescriptorService.getData('materialtemptype');
					if (!dataList) {
						basicsLookupdataLookupDescriptorService.loadData('materialtemptype')
							.then(function (data) {
								updateReadonly(data);
							});
					} else {
						updateReadonly(dataList);
					}

					function updateReadonly(data) {
						if (!data) {
							return;
						}
						var list = service.getList();
						var catalogIsReadonlyObj = {};
						let needRefresh = false;
						_.forEach(list, function (item) {
							var currentTempType = data[item.MaterialTempTypeFk];
							if (currentTempType) {
								var fields = [{
									field: 'MaterialTempFk',
									readonly: currentTempType.Istemplate
								}];

								if (Object.prototype.hasOwnProperty.call(catalogIsReadonlyObj, item.MaterialCatalogFk)) {
									if (catalogIsReadonlyObj[item.MaterialCatalogFk]) {
										if (!allReadonlyFields || !allReadonlyFields.length) {
											getAllReadonlyFields();
										}
										fields = fields.concat(allReadonlyFields);
									}
								}
								else {
									if (materialCatalogService.isReadonlyCatalog(null, item.MaterialCatalogFk)) {
										catalogIsReadonlyObj[item.MaterialCatalogFk] = true;
										if (!allReadonlyFields || !allReadonlyFields.length) {
											getAllReadonlyFields();
										}
										fields = fields.concat(allReadonlyFields);
									}
									else {
										catalogIsReadonlyObj[item.MaterialCatalogFk] = false;
									}
								}

								platformRuntimeDataService.readonly(item, fields);
								needRefresh = true;
							}
						});
						// move gridRefresh to the end of the function to avoid multiple grid refresh
						if (needRefresh) {
							service.gridRefresh();
						}
					}
				}

				function callAfterSuccessfulUpdate() {
					if (isMaterialTempModified) {
						$timeout(function () {
							service.refresh();
						});
					}
				}

				function canCreateCopy() {
					var item = service.getSelected();
					if (item) {
						return (item.MaterialCatalogFk && !materialCatalogService.isReadonlyCatalog(null, item.MaterialCatalogFk));
					}
					return false;
				}

				function isReadonlyMaterial(selected) {
					var isReadonly = true;
					var selectedMaterial = selected ? selected : service.getSelected();
					if (selectedMaterial) {
						isReadonly = (selectedMaterial.MaterialCatalogFk && materialCatalogService.isReadonlyCatalog(null, selectedMaterial.MaterialCatalogFk));
					}
					return isReadonly;
				}

				function isSetReadonly(entityList)
				{
					var state=true;
					_.forEach(entityList, function (item) {
						if(!isReadonlyMaterialStatus(item))
						{
							state=false;
						}
						platformRuntimeDataService.readonly(item,state);
					});
				}

				function isReadonlyMaterialStatus(entity)
				{
					var isReadOnly = false;
					if(entity&&entity.MaterialStatusFk)
					{
						var status =_.find(basicsLookupdataLookupDescriptorService.getData('materialstatus'), {Id: entity.MaterialStatusFk});
						if (status && status.IsReadonly)
						{
							isReadOnly = true;
						}
					}
					return isReadOnly;
				}

				function setEntityToReadonlyIfRootEntityIs(entity) {
					var selected = service.getSelected();
					if(isReadonlyMaterial(selected)){
						platformRuntimeDataService.readonly(entity, true);
					}
				}

				function getAllReadonlyFields(isReadonly) {
					allReadonlyFields = [];
					var state= !isReadonly ? true : isReadonly;
					var uiStandardService = $injector.get('basicsMaterialRecordUIConfigurationService');
					var domains = _.map(uiStandardService.getStandardConfigForListView().columns, 'field');
					_.forEach(domains, function (value) {
						allReadonlyFields.push({field: value, readonly: state});
					});
				}

				/**
				 * When the module has multiple roots and a search is performed via the sidebar,
				 * the skeleton loading will be displayed for all grids, even those belonging to other root headers.
				 * This solution prevents the skeleton loading from always being displayed.
				 */
				function ignoreDisplaySkeletonLoading() {
					const gridIdsToIgnore = [
						'29bcf2f0bd994b0d9cdb941c2f4fbfcd', '875c61bb2c5a4f54987a8db8125dd211',
						'c84bd59dda4b4644aae314e1a5a11a0c', 'e850ba1740c24c35907491f922a3716b',
						'598ec1bff35c4f92ab46400c5d58a1d2', '127dcd97f72546cc90b8fb5583883f4b',
						'f15abe2a43684ffc8bf5e1d59a31f87c', '66dfcac15d7b45928f80ae9e873b3bcc',
						'26c9da52c4a44991b16fb5fcf1ef1370', '13f6aa1f21cf42bdb3b9219361284e59',
						'8161248d9b014fb4a284326e5dd3d1c7', '51054c9176dd42d0b029c58a4f75bad0',
						'd5aaf97f50e24a83831b8c3d07d15fb9', '327797c391a948d4bffb252099bdc6a3',
						'34b38ef093254e26bd13cbe2c7a27c3c', '65ff8ab73a2c8430e6aedeac3682b30a',
						'11a499665f2e92d41e3c1743ffef757f', 'f044708c79c2dbd9fd00612e3195bea0',
						'49f6e969068844539d3faa7cd155de24', '829eb265578a484a8719180f4e10ec57',
						'ca7d3a0de6794cf288a9283f5601d861', '67707f3826cf42e7944bbf200db5cb35',
						'0b28c1bcc71741239d6fbcb7f137ff20', '203a73460cc042efaf1879a45cb788fe',
						'de9355b7ded945918f287d76043602ff'
					];

					gridIdsToIgnore.forEach(gridId => {
						platformGridAPI.grids.skeletonLoading(gridId, false);
					});
				}


			}]);

})(angular);