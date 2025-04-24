(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$, math */

	var moduleName = 'procurement.pes';
	var procurementPesModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name procurementPesItemService
	 * @function
	 * @description procurementPesItemService is the data service for Pes Item.
	 */
	/* jshint -W072 */
	procurementPesModule.factory('procurementPesItemService',
		['_', '$q', '$http', 'platformDataServiceFactory', 'procurementPesHeaderService', 'basicsLookupdataLookupDescriptorService', 'platformContextService', 'procurementPesItemValidationService',
			'platformDataServiceDataProcessorExtension', 'platformSchemaService', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'platformDataServiceSelectionExtension', 'globals',
			'basicsCommonMandatoryProcessor', 'platformDataValidationService', 'platformModuleStateService', 'PlatformMessenger', 'prcCommonCalculationHelper', 'platformModalService', '$translate', '$injector', 'cloudCommonGridService', 'prcCommonItemCalculationHelperService','platformDataServiceActionExtension',
			'prcGetIsCalculateOverGrossService','procurementContextService',
			function (_, $q, $http, platformDataServiceFactory, procurementPesHeaderService, basicsLookupdataLookupDescriptorService, platformContextService, procurementPesItemValidationService,
				platformDataServiceDataProcessorExtension, platformSchemaService, platformRuntimeDataService, basicsLookupdataLookupFilterService, basicsLookupdataLookupDataService, platformDataServiceSelectionExtension, globals,
				basicsCommonMandatoryProcessor, platformDataValidationService, platformModuleStateService, PlatformMessenger, prcCommonCalculationHelper, platformModalService, $translate, $injector, cloudCommonGridService, itemCalculationHelper,platformDataServiceActionExtension,
				prcGetIsCalculateOverGrossService,procurementContextService
			) {
				// eslint-disable-next-line no-unused-vars
				// basicsLookupdataLookupDescriptorService.loadData('MaterialCommodity');
				var procurementPesItemServiceOption = {
					flatNodeItem: {
						module: procurementPesModule,
						serviceName: 'procurementPesItemService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/pes/item/',
							endRead: 'list',
							endCreate: 'createnew'
						},
						presenter: {
							list: {
								initCreationData: initCreationData,
								incorporateDataRead: incorporateDataRead,
								handleCreateSucceeded: handleCreateSucceeded
							}
						},
						entityRole: {
							node: {
								itemName: 'Item',
								parentService: procurementPesHeaderService
							}
						},
						dataProcessor: [{processItem: addAdditionalProperties}],
						actions: {
							create: 'flat',
							canCreateCallBackFunc: function canCreateCallBackFunc() {
								var headerSelectedItem = procurementPesHeaderService.getSelected();
								return !procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
							},
							delete: true,
							canDeleteCallBackFunc: function canDeleteCallBackFunc() {
								var headerSelectedItem = procurementPesHeaderService.getSelected();
								return !procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
							}
						},
						filterByViewer: true
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(procurementPesItemServiceOption);

				var validator = procurementPesItemValidationService(serviceContainer.service);
				var priceConditionDataService;

				angular.extend(serviceContainer.service,
					{
						name: 'procurement.pes.item',
						calculateQuantityRemaining: calculateQuantityRemaining,
						createOtherItems: createOtherItems,
						setReadonly: setReadonly,
						updateByPrcItem: updateByPrcItem,
						priceReadOnly: priceReadOnly,
						updateRootRow: updateRootRow,
						updateDeliveredAndRemainingQuantity: updateDeliveredAndRemainingQuantity,
						changeHeaderConHeader: changeHeaderConHeader,
						calculateTotalAndVatAndGross: calculateTotalAndVatAndGross,
						updateprjstockReadOnly: updateprjstockReadOnly,
						updatePrjStockReadOnlyForCopy: updatePrjStockReadOnlyForCopy,
						selectprjstockReadOnly: selectprjstockReadOnly,
						initprjstockReadOnly: initprjstockReadOnly,
						updateItemDeliveredAndRemainingQuantity: updateItemDeliveredAndRemainingQuantity,
						setReadonlyByPrcItemFk: setReadonlyByPrcItemFk,
						calcDeliveredAndRemaining: calcDeliveredAndRemaining,
						calculateForCopy: calculateForCopy,
						getPriceOc: getPriceOc,
						getControllingUnit: getControllingUnit,
						reloadPriceCondition: validator.reloadPriceCondition,
						setNetValuesAfterChangeVatPrecent: setNetValuesAfterChangeVatPrecent,
						calculateDeliveredTotal: calculateDeliveredTotal,
						canReadonlyByPrcItemBasItemType:canReadonlyByPrcItemBasItemType
					}
				);

				procurementPesHeaderService.statusChangeMessenger.register(statusChangeHandler);
				procurementPesHeaderService.vatGroupChanged.register(vatGroupChanged);
				procurementPesHeaderService.registerValidationIssuesClearUp(onClearUpValidationIssues);
				procurementPesHeaderService.registerValidationIssuesRemove(onRemoveValidationIssues);

				serviceContainer.service.registerSelectionChanged(onSetReadonly);

				serviceContainer.service.onSpecificationChanged = new PlatformMessenger();

				let roundingType = itemCalculationHelper.roundingType;
				// when the contract change, change the relative message in PES Header and PES BoQ
				function changeHeaderConHeader(conHeaderFk, entity) {
					return procurementPesHeaderService.changeItemConHeader(conHeaderFk, entity);
				}

				function initCreationData(creationData) {
					var maxItemNo = getMaxItemNo();
					var selectedItem = procurementPesHeaderService.getSelected();
					creationData.MainItemId = selectedItem.Id;
					creationData.ProjectFk = selectedItem.ProjectFk;
					creationData.PrcStructureFk = selectedItem.PrcStructureFk;
					creationData.PackageFk = selectedItem.PackageFk;
					creationData.MaxItemNo = maxItemNo;
					creationData.ConHeaderFk = selectedItem.ConHeaderFk;
					creationData.ControllingUnitFk = selectedItem.ControllingUnitFk;
					creationData.PrcConfigurationFk = selectedItem.PrcConfigurationFk;
				}

				var StockCache = {};

				function incorporateDataRead(readItems, data) {
					StockCache._Prcstock = readItems._Prcstock;
					StockCache._Prcstructure = readItems._Prcstructure;
					basicsLookupdataLookupDescriptorService.removeData('PrcStockTranType2RubCat');
					basicsLookupdataLookupDescriptorService.attachData(readItems || {});


					var items = data.usesCache && angular.isArray(readItems) ? readItems : readItems.Main;
					var headerSelectedItem = procurementPesHeaderService.getSelected();
					var allReadonly = procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
					var dataRead = data.handleReadSucceeded(items, data, true);

					_.forEach(items, function (item) {
						setReadonly(item, allReadonly);
						// The Price is read only every time, just when we use the wizards change the value of read only.
						if (item.PrcItemFk) {
							priceReadOnly(item, true);
						}
						else {
							priceReadOnly(item, allReadonly);
						}
					});
					initprjstockReadOnly(items, allReadonly);
					setPrcStockTransactionType(items, allReadonly);
					provisionReadOnly(items, allReadonly);

					$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
						basicsCostGroupAssignmentService.process(readItems, serviceContainer.service, {
							mainDataName: 'Main',
							attachDataName: 'PesItem2CostGroups', // name of MainItem2CostGroup
							dataLookupType: 'PesItem2CostGroups',// name of MainItem2CostGroup
							identityGetter: function identityGetter(entity) {
								return {
									Id: entity.MainItemId
								};
							}
						});
					}]);
					serviceContainer.service.gridRefresh();
					return dataRead;
				}

				var filters = [
					{
						key: 'procurement-pes-item-contract-filter',
						serverKey: 'procurement-pes-item-contract-filter',
						serverSide: true,
						fn: function () {
							/* var filter = 'StatusIsInvoiced = false and StatusIsCanceled = false and StatusIsVirtual = false and StatusIsOrdered = true and StatusIsDelivered = false';
							 var currentItem = serviceContainer.service.getSelected() || {};
							 var parentItem = procurementPesHeaderService.getSelected() || {};
							 if (parentItem && parentItem.BusinessPartnerFk !== null && parentItem.BusinessPartnerFk !== -1) {
							 filter += ' And BusinessPartnerFk=' + parentItem.BusinessPartnerFk;
							 filter += ' OR BusinessPartner2Fk = ' + parentItem.BusinessPartnerFk;
							 }
							 if (currentItem.ProjectFk !== null) {
							 filter += ' And ProjectFk=' + currentItem.ProjectFk;
							 }
							 if (currentItem.PrcPackageFk) {
							 filter += ' AND PrcPackageFk = ' + currentItem.PrcPackageFk;
							 }
							 if (currentItem.ControllingUnitFk) {
							 filter += ' AND ControllingUnitFk = ' + currentItem.ControllingUnitFk;
							 }

							 if (currentItem.PrcStructureFk) {
							 filter += ' AND PrcStructureFk = ' + currentItem.PrcStructureFk;
							 }

							 // this is a special case, PrcItemStatusIsCanceled is not a property of the table.  please make sure the condition 'PrcItemStatusIsCanceled' is the last one and separate them with '[Case:]'
							 /!*filter += ' [Case:PrcItemStatusIsCanceled=false]';
							 return filter;*!/

							 return {
							 customerFilter: filter,
							 prcItemStatusIsCanceled: false
							 }; */
							var currentItem = serviceContainer.service.getSelected();
							var parentItem = procurementPesHeaderService.getSelected() || {};
							if (!currentItem) {
								return {};
							}
							var filterObj = {
								StatusIsInvoiced: false,
								StatusIsCanceled: false,
								StatusIsVirtual: false,
								StatusIsOrdered: true,
								// StatusIsDelivered: false,
								ControllingUnit: currentItem.ControllingUnitFk,
								prcItemStatusIsCanceled: false,
								IsFramework: false
							};
							if (parentItem && parentItem.BusinessPartnerFk !== null && parentItem.BusinessPartnerFk !== -1) {
								filterObj.BusinessPartnerFk = parentItem.BusinessPartnerFk;
							}
							if (currentItem.PrcPackageFk) {
								filterObj.PrcPackageFk = currentItem.PrcPackageFk;
							}
							if (currentItem.PrcStructureFk) {
								filterObj.PrcStructureFk = currentItem.PrcStructureFk;
							}
							if (currentItem.ProjectFk) {
								filterObj.ProjectFk = currentItem.ProjectFk;
							}
							if (currentItem.PesHeaderFk) {
								filterObj.PrcConfigurationRelatedPesHeaderId = currentItem.PesHeaderFk;
							}
							return filterObj;
						}
					},
					{
						key: 'procurement-pes-item-item-filter',
						serverKey: 'procurement-pes-item-item-filter',
						serverSide: true,
						fn: function (dataContext) {
							var currentItem = serviceContainer.service.getSelected();
							var pesHeaderId = currentItem !== null ? currentItem.PesHeaderFk : 0;
							return {
								IsCanceled: false,
								ContractId: dataContext.ConHeaderFk,
								PesHeaderId: pesHeaderId
							};
						}
					},
					{
						key: 'procurement-pes-item-package-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected() || {};
							var filter = '';
							if (currentItem.ProjectFk !== null) {
								filter += 'ProjectFk=' + currentItem.ProjectFk;
							} else if (platformContextService.loginProject !== null && angular.isDefined(platformContextService.loginProject)) {
								filter += 'ProjectFk=' + platformContextService.loginProject;
							}

							return filter;
						}
					},
					{
						key: 'procurement-pes-item-stock-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected() || {};
							if (currentItem.ControllingUnitFk !== null) {
								return {ControllingUnitFk: currentItem.ControllingUnitFk};
							} else {
								return {};
							}
						}
					},
					{
						key: 'procurement-pes-item-stocklocation-filter',
						serverSide: true,
						fn: function () {
							var projectstockview = basicsLookupdataLookupDescriptorService.getData('ProjectStock2ProjectStock');
							var currentItem = serviceContainer.service.getSelected() || {};
							if (projectstockview && projectstockview[currentItem.PrjStockFk] && projectstockview[currentItem.PrjStockFk].IsLocationMandatory) {
								return {ProjectStockFk: currentItem.PrjStockFk};
							} else {
								return {};
							}
						}
					},
					{
						key: 'procurement-pes-item-transaction-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected() || {};
							if (currentItem) {
								// return {PrjStockFk: currentItem.PrjStockFk, PesItemFK: currentItem.Id};
								return {PrjStockFk: currentItem.PrjStockFk, MdcMaterialFk: currentItem.MdcMaterialFk};
							} else {
								return {PrjStockFk: 0};
							}
						}
					},
					{
						key: 'procurement-pes-item-transactiontype-filter',
						serverSide: true,
						fn: function () {
							var currentItem = procurementPesHeaderService.getSelected();
							var filter = '';
							if (currentItem && currentItem.PrcConfigurationFk !== null) {
								filter = 'PrcConfiguration=' + currentItem.PrcConfigurationFk;
							}
							return filter;
						}
					},
					{
						key: 'controlling-unit-for-pes-item-filter',
						serverSide: true,
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							if (currentItem) {
								return {
									ByStructure: true,
									ExtraFilter: true,
									PrjProjectFk: currentItem.ProjectFk,
									CompanyFk: null
								};
							}
						}
					},
					{
						key: 'procurement-pes-item-mdcmaterial-filter',
						serverSide: true,
						fn: function (dataItem, searchOptions) {
							var filter = {};
							var currentItem = procurementPesHeaderService.getSelected();
							var conHeaders = basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
							var isFreeItemsAllowed;
							if (currentItem) {
								if (conHeaders) {
									var conHeader = _.find(conHeaders, {Id: currentItem.ConHeaderFk});
									if (conHeader) {
										isFreeItemsAllowed  = conHeader.IsFreeItemsAllowed;
									}
								}

								let contractFk = currentItem.ConHeaderFk;
								if(!_.isNil(contractFk)){
									let contract = _.find(conHeaders, {Id: currentItem.ConHeaderFk});
									if (contract && contract.MdcMaterialCatalogFk) {
										filter.MaterialCatalogId = contract.MdcMaterialCatalogFk;
									}
								}

								// set Filter for material-lookup-controller
								searchOptions.DisplayedPriceType = 1; // using cost price
								searchOptions.Filter = filter;
								searchOptions.ContractName = "ProcurementMaterialFilter";

								searchOptions.MaterialTypeFilter = {
									IsForProcurement: true
								};

								filter.ConHeaderId = currentItem.ConHeaderFk;
								filter.PrcConfigurationId = currentItem.PrcConfigurationFk;

								if (dataItem && dataItem.PrcStructureFk) {
									filter.PrcStructureId = dataItem.PrcStructureFk;
									// #144045 - Adjustment of the pre-allocation in the material lookup
									filter.PrcStructureOptional = true;
								}
								if (isFreeItemsAllowed !== undefined) {
									filter.IsFreeItemsAllowed = isFreeItemsAllowed;
								}
							}

							return filter;
						}
					},
					{
						key: 'procurement-pes-item-fixed-asset-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							if(currentItem && currentItem.IsAssetManagement){
								var etmContextFk = $injector.get('prcInvoiceGetEtmCompanyContext').getEtmContextFk();
								return etmContextFk ? (' EtmContextFk = ' + etmContextFk) : ' EtmContextFk = -1';
							}
							else{
								return ' EtmContextFk = -1';
							}
						}
					},
					{
						key: 'procurement-pes-item-mdcsalestaxgroup-filter',
						serverSide: false,
						fn: function (item) {
							var loginCompanyFk = platformContextService.clientId;
							var LedgerContextFk;
							if (loginCompanyFk) {
								var companies = basicsLookupdataLookupDescriptorService.getData('Company');
								company = _.find(companies, {Id: loginCompanyFk});
								if (company) {
									LedgerContextFk = company.LedgerContextFk;
								}
							}
							return (item.LedgerContextFk === LedgerContextFk) && item.IsLive;
						}
					},
					{
						key: 'procurement-pes-item-stock-type-filter',
						serverSide: false,
						fn: function (item) {
							return item.IsProcurement;
						}
					},

				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'PesItemDto',
					moduleSubModule: 'Procurement.Pes',
					validationService: validator,
					mustValidateFields: ['UomFk','AlternativeUomFk','ControllingUnitFk', 'PrcStructureFk', 'PrcStockTransactionTypeFk']
				});

				// do not override onDeleteDone if have some special logic , use service.registerEntityDeleted(onEntityDeleted);
				// do by stone.
				serviceContainer.service.finishLoadingEvent = new PlatformMessenger();
				serviceContainer.service.deepCopy = function () {
					try {
						var pesHeaderId = procurementPesHeaderService.getSelected().Id;
						var selectedItems = serviceContainer.service.getSelectedEntities();
						var PesGrpSetDTLDataService = $injector.get('procurementPesGrpSetDTLDataService');
						getPriceConditionService();
						var priceConditionCache = priceConditionDataService.getPriceConditionCache();
						if (selectedItems.length === 0) {
							platformModalService.showMsgBox($translate.instant('cloud.common.noItemSelection'), 'Info', 'ico-info');
							serviceContainer.service.finishLoadingEvent.fire();
							return;
						}
						else {
							_.forEach(selectedItems, function (item) {
								if (priceConditionCache.has(item.Id)) {
									item.PesItempriceconditionEntities = (priceConditionCache.get(item.Id));
								}
							});
						}
						if (_.some(selectedItems, function (item) {
							return item.PesHeaderFk !== pesHeaderId;
						})) {
							platformModalService.showMsgBox($translate.instant('cloud.common.noItemSelection'), 'Info', 'ico-info');
							serviceContainer.service.finishLoadingEvent.fire();
							return false;
						}
						var CachedItemIds = [];
						priceConditionCache.forEach(function (value, key) {
							CachedItemIds.push(key);
						});
						if (selectedItems) {
							var maxItemNo = getMaxItemNo();
							var param = {
								CachedItemIds: CachedItemIds,
								PesItemDtos: selectedItems,
								MaxItemNo: maxItemNo
							};
							var copyPromise = $http.post(globals.webApiBaseUrl + 'procurement/pes/item/deepcopy', param);
							var promisArray = [];
							return copyPromise.then(function (response) {
								var newList = response.data.PesItems;
								if (angular.isArray(newList) && newList.length > 0) {
									serviceContainer.data.supportUpdateOnSelectionChanging = false;

									getPriceConditionService();
									_.forEach(newList, function (entity) {
										var item = entity.Item;
										var prcItemFk = item.PrcItemFk;
										if (prcItemFk) {
											item.PrcItemFk = null;
											var validatePrcItemPromise = validator.validatePrcItemForCopy(item, prcItemFk);
											promisArray.push(validatePrcItemPromise);
											priceReadOnly(item, true);
										}
										item.PesItempriceconditionEntities = entity.PesItemPriceConditionToSave;
										priceConditionCache.set(item.Id, item.PesItempriceconditionEntities);

										if (serviceContainer.data.handleCreateSucceededWithoutSelect) {
											serviceContainer.data.handleCreateSucceededWithoutSelect(entity.Item, serviceContainer.data, {});
											serviceContainer.service.setSelected(item).then(function () {
												PesGrpSetDTLDataService.roadData(item, entity.controllingStructureGrpSetDTLToSave);
												PesGrpSetDTLDataService.gridRefresh();

												priceConditionDataService.setList(item.PesItempriceconditionEntities);
												priceConditionDataService.gridRefresh();
											});
										}
										calculateForCopy(item);
									});

									serviceContainer.service.gridRefresh();
									serviceContainer.data.supportUpdateOnSelectionChanging = true;
								}
								$q.all(promisArray).then(function () {
									_.forEach(newList, function (entity) {
										var item = entity.Item;
										var prcItemFk = item.PrcItemFk;
										if (prcItemFk) {
											$http.get(globals.webApiBaseUrl + 'procurement/pes/item/getcostgroupbyprcitem' + '?prcItemFk=' + prcItemFk  + '&pesHeaderId=' + pesHeaderId  + '&pesItemFk=' + item.Id).then(function (response) {
												$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
													var responseData = response.data;
													responseData.dtos = [];
													responseData.dtos.push(item);
													// responseData.CostGroupCats.isForDetail = true;
													basicsCostGroupAssignmentService.process(responseData, serviceContainer.service, {
														mainDataName: 'dtos',
														attachDataName: 'PesItem2CostGroups', // name of MainItem2CostGroup
														dataLookupType: 'PesItem2CostGroups',// name of MainItem2CostGroup
														identityGetter: function identityGetter(entity) {
															return {
																Id: entity.MainItemId
															};
														}
													});
												}]);
											});
										}

									});
									serviceContainer.service.finishLoadingEvent.fire();
								});
							});
						}
					}
					catch (e) {
						serviceContainer.service.finishLoadingEvent.fire();
						throw e;
					}
				};

				function calculateForCopy(item) {
					calculateTotalAndVatAndGross(item, true);
					serviceContainer.service.calcPesItemQty(item);
					serviceContainer.service.gridRefresh();
				}

				function validate(item, props) {
					_.forEach(props, function (prop) {
						var func = 'validate' + prop;
						var result = validator[func](item, item[prop], prop);
						platformRuntimeDataService.applyValidationResult(result, item, prop);
						platformDataValidationService.finishValidation(angular.copy(result), item, item[prop], prop, validator, serviceContainer.service);
					});
				}

				function addAdditionalProperties(item) {
					item.QuantityRemaining = calculateQuantityRemaining(item.QuantityContracted, item.QuantityDelivered);
					item.QuantityRemainingConverted = round(roundingType.QuantityRemainingConverted,mathBignumber(item.QuantityRemaining).mul(item.PrcItemFactorPriceUnit).toNumber());
					platformRuntimeDataService.readonly(item, [{field: 'AlternativeUomFk', readonly: !item.Material2Uoms}]);
					serviceContainer.service.setVat(item);
					if (item.Version === 0) {
						initprjstockReadOnly(item, false);
						provisionReadOnly(item, false);
						setPrcStockTransactionType(item, false);
					}
				}

				function calculateQuantityRemaining(quantityContracted, quantityDelivered) {
					if (quantityContracted !== null && quantityDelivered !== null) {
						return round(roundingType.QuantityRemaining, mathBignumber(quantityContracted).sub(quantityDelivered).toNumber());
					}
					return 0.0;
				}

				function calculateDeliveredTotal(pesItem, oldTotal, oldTotalOc) {
					if (pesItem.dontModifyDeliveredTotal) {
						delete pesItem.dontModifyDeliveredTotal;
					}
					else if (pesItem.QuantityDelivered === 0) {
						pesItem.TotalDelivered = 0;
						pesItem.TotalOcDelivered = 0;
					}
					else {
						pesItem.TotalDelivered = round(roundingType.TotalDelivered, mathBignumber(pesItem.TotalDelivered).sub(oldTotal).add(pesItem.Total));
						pesItem.TotalOcDelivered = round(roundingType.TotalOcDelivered, mathBignumber(pesItem.TotalOcDelivered).sub(oldTotalOc).add(pesItem.TotalOc));
					}
					if (pesItem.markModifyQuantityOfItemWithPrcItem) {
						var diffMathObj = mathBignumber(pesItem.Total).sub(oldTotal);
						var diffOcMathObj = mathBignumber(pesItem.TotalOc).sub(oldTotalOc);
						_.forEach(serviceContainer.service.getList(), function (item) {
							if (item.PrcItemFk === pesItem.PrcItemFk && item.Version && item.Id !== pesItem.Id) {
								item.TotalDelivered = round(roundingType.TotalDelivered, mathBignumber(item.TotalDelivered).add(diffMathObj));
								item.TotalOcDelivered = round(roundingType.TotalOcDelivered, mathBignumber(item.TotalOcDelivered).add(diffOcMathObj));
							}
						});
						serviceContainer.service.gridRefresh();
						delete pesItem.markModifyQuantityOfItemWithPrcItem;
					}
				}

				function calculateTotalAndVatAndGross(pesItem, notRecalTotalAndGross, isResetPriceExtra, dontReCalcuPricGrossOc) {
					if (pesItem === null) {
						return;
					}
					var taxItems = basicsLookupdataLookupDescriptorService.getData('TaxCode');
					var taxCode = null;
					var priceUnit;
					var factor;

					if (pesItem.MdcTaxCodeFk > 0) {
						taxCode = _.find(taxItems, {Id: pesItem.MdcTaxCodeFk});
					}
					var vatPercent = 0, prcItem, material;
					var PesSelectedItem = procurementPesHeaderService.getSelected();
					var exchangeRate = PesSelectedItem.ExchangeRate;
					if (taxCode) {
						vatPercent = serviceContainer.service.getVatPercentWithTaxCodeMatrix(pesItem.MdcTaxCodeFk);
					}
					var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var inputFieldObje = serviceContainer.service.getInputWhichField();

					if (pesItem.PrcItemFk !== null) {
						var prcItems = basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
						prcItem = _.filter(prcItems, function (item) {
							return item.Id === pesItem.PrcItemFk;
						});
						if (prcItem.length > 0) {
							var _prcItem = prcItem[0];
							if (_prcItem.PriceUnit !== 0) {
								if (pesItem.enableEditPrice || isResetPriceExtra) {
									pesItem.TotalPriceGrossOc = (inputFieldObje.TotalPrice && isCalculateOverGross) ?
										pesItem.TotalPriceGrossOc :
										itemCalculationHelper.getTotalPriceOCGross(pesItem, vatPercent);
									pesItem.TotalPriceGross = (inputFieldObje.TotalPrice && isCalculateOverGross) ?
										pesItem.TotalPriceGross :
										itemCalculationHelper.getTotalPriceGross(pesItem, vatPercent, exchangeRate);
									pesItem.TotalPrice = (inputFieldObje.TotalPrice && isCalculateOverGross) ?
										pesItem.TotalPrice :
										itemCalculationHelper.getTotalPrice(pesItem, vatPercent);
									pesItem.TotalPriceOc = (inputFieldObje.TotalPrice && isCalculateOverGross) ?
										pesItem.TotalPriceOc :
										itemCalculationHelper.getTotalPriceOc(pesItem, vatPercent);
								}
								priceUnit = _prcItem.PriceUnit;
								factor = _prcItem.FactorPriceUnit;
							}
							canReadonlyByPrcItemBasItemType(pesItem);
						}
					}
					else if (pesItem.MdcMaterialFk !== null) {

						var materials = basicsLookupdataLookupDescriptorService.getData('MaterialCommodity') || [];
						material = _.find(materials, {Id: pesItem.MdcMaterialFk});

						if (material && material.FactorPriceUnit !== null) {
							priceUnit = material.PriceUnit;
							factor = material.FactorPriceUnit;
						}
					}

					if (!notRecalTotalAndGross) {
						var originTotal = pesItem.Total;
						var originTotalOc = pesItem.TotalOc;
						inputFieldObje = serviceContainer.service.getInputWhichField();

						if (!inputFieldObje.PriceGross && !inputFieldObje.PriceGrossOc && !dontReCalcuPricGrossOc) {
							pesItem.PriceGross = itemCalculationHelper.getPriceGross(pesItem, vatPercent);
							pesItem.PriceGrossOc = itemCalculationHelper.getPriceGrossOc(pesItem, vatPercent);
						}

						if (isCalculateOverGross) {
							pesItem.TotalPriceGrossOc = inputFieldObje.TotalPrice ?
								pesItem.TotalPriceGrossOc :
								itemCalculationHelper.getTotalPriceOCGross(pesItem, vatPercent);
							pesItem.TotalPriceGross = inputFieldObje.TotalPrice ?
								pesItem.TotalPriceGross :
								itemCalculationHelper.getTotalPriceGross(pesItem, vatPercent, exchangeRate);
							pesItem.TotalPrice = inputFieldObje.TotalPrice ?
								pesItem.TotalPrice :
								itemCalculationHelper.getTotalPrice(pesItem, vatPercent);
							pesItem.TotalPriceOc = inputFieldObje.TotalPrice ?
								pesItem.TotalPriceOc :
								itemCalculationHelper.getTotalPriceOc(pesItem, vatPercent);
							pesItem.TotalGrossOc = itemCalculationHelper.getTotalGrossOc(pesItem, vatPercent, priceUnit, factor);
							pesItem.TotalGross = itemCalculationHelper.getTotalGross(pesItem, vatPercent, exchangeRate);
							pesItem.Total = itemCalculationHelper.getTotal(pesItem, vatPercent, priceUnit, factor);
							pesItem.TotalOc = itemCalculationHelper.getTotalOc(pesItem, vatPercent, priceUnit, factor);
						}
						else {
							pesItem.TotalPrice = itemCalculationHelper.getTotalPrice(pesItem, vatPercent);
							pesItem.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(pesItem, vatPercent);
							pesItem.TotalPriceGross = itemCalculationHelper.getTotalPriceGross(pesItem, vatPercent, exchangeRate);
							pesItem.TotalPriceGrossOc = itemCalculationHelper.getTotalPriceOCGross(pesItem, vatPercent);
							pesItem.Total = itemCalculationHelper.getTotal(pesItem, vatPercent, priceUnit, factor);
							pesItem.TotalOc = itemCalculationHelper.getTotalOc(pesItem, vatPercent, priceUnit, factor);
							pesItem.TotalGross = itemCalculationHelper.getTotalGross(pesItem, vatPercent, exchangeRate);
							pesItem.TotalGrossOc = itemCalculationHelper.getTotalGrossOc(pesItem, vatPercent, priceUnit, factor);
						}
						calculateDeliveredTotal(pesItem, originTotal, originTotalOc);
					}
					pesItem.Vat = round(roundingType.Vat, mathBignumber(pesItem.Total).mul(vatPercent).div(100));
					pesItem.VatOC = round(roundingType.VatOC, mathBignumber(pesItem.TotalOc).mul(vatPercent).div(100));
					// serviceContainer.service.gridRefresh();
				}

				function createOtherItems(currentItem, ignoreItemReadOnly, isPesHeader, newItems, isIncludeNonContractedPesItems, callBackAfterCreate, isCreateCopyContract, isCreate4Contract, isSkippingValidation) {


					var defer = $q.defer();
					var headerSelectedItem = procurementPesHeaderService.getSelected();
					if (!ignoreItemReadOnly && (procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem) || currentItem.ConHeaderFk === null)) {
						defer.resolve([]);
						return;
					}

					if (headerSelectedItem.PesHeaderFk || angular.isUndefined(isIncludeNonContractedPesItems)) {
						isIncludeNonContractedPesItems = false;
					}

					var filter = {
						IsCanceled: false,
						ContractId: currentItem.ConHeaderFk,
						PesHeaderId: headerSelectedItem.Id,
						IncludeDeliveredCon: true
					};

					var getItemsAsync = newItems ? $q.when({data: newItems}) : $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getitems4create', filter);

					getItemsAsync.then(function (response) {
						var foundPrcItems = response.data;
						if (!angular.isArray(foundPrcItems)) { // } || foundPrcItems.length === 0) {
							defer.resolve([]);
							return;
						}

						var controllingUnitIds = _.map(_.filter(foundPrcItems, function (item) {
								return item.ControllingUnitFk !== null;
							}), function (item) {
								return {Id: item.ControllingUnitFk};
							}),
							getCtrlingUnitPromise = controllingUnitIds.length > 0 ? basicsLookupdataLookupDataService.getSearchList('controllingunit', {
								RequestIds: controllingUnitIds
							}) : $q.when({
								items: []
							});

						getCtrlingUnitPromise.then(function (lookup) {
							basicsLookupdataLookupDescriptorService.addData('controllingunit', cloudCommonGridService.flatten(lookup.items, [], 'ChildItems'));


							basicsLookupdataLookupDescriptorService.updateData('PrcItemMergedLookup', foundPrcItems);

							var prcItemIds = [];
							var pesItemList = serviceContainer.service.getList();
							var nonContractedItems = _.filter(pesItemList, function(item){
								return !item.PrcItemFk;
							});
							var nonContractedItemInstanceIds = _.map(nonContractedItems, function (item) {
								return item.InstanceId;
							});
							var items = _.filter(pesItemList, {ConHeaderFk: currentItem.ConHeaderFk});
							_.forEach(items, function (item) {
								if (item.PrcItemFk !== null) {
									prcItemIds.push(item.PrcItemFk);
								}
							});
							var allPrcItemIds = [];
							_.forEach(foundPrcItems, function (item) {
								allPrcItemIds.push(item.Id);
							});

							var remainingIds = _.difference(allPrcItemIds, prcItemIds);
							// if (remainingIds.length > 0) {
							var allPromise = [];
							if (!isPesHeader && currentItem.PrcItemFk === null && remainingIds.length > 0) {
								var firstRemainingId = remainingIds[0];
								var prcItem = _.find(foundPrcItems, {Id: firstRemainingId});
								// var completePrcItem = _.find(completePrcItems, {Id: firstRemainingId});
								updateByPrcItem(currentItem, prcItem/* , completePrcItem */);
								allPromise.push(validator.reloadPriceCondition(currentItem, currentItem.PrcPriceConditionFk, true));// jshint ignore: line
								if (prcItem && prcItem.ControllingUnitFk === null) {
									prcItem.ControllingUnitFk = procurementPesHeaderService.getSelected().ControllingUnitFk;
								}

								if (currentItem && currentItem.PrcItemFk) {
									allPromise.push($http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/creategrpset?mainItemId=' + currentItem.Id + '&prcItemFk=' + currentItem.PrcItemFk)
										.then(function (response) {
											var entity = response.data;
											if (entity) {
												var GrpSetDTLDataService = $injector.get('procurementPesGrpSetDTLDataService');
												return GrpSetDTLDataService.roadData(currentItem, entity);
											}
											return $q.when([]);
										}));
								}
								inticreateOtherItems(currentItem, prcItem);

								setReadonly(currentItem);
								priceReadOnly(currentItem, true);
								_.remove(remainingIds, function (id) {
									return id === firstRemainingId;
								});
							}
							var maxItemNo = getMaxItemNo();
							var creationData = {
								MainItemId: procurementPesHeaderService.getSelected().Id,
								ProjectFk: currentItem.ProjectFk,
								ConHeaderFk: currentItem.ConHeaderFk,
								PackageFk: procurementPesHeaderService.getSelected().PackageFk,
								PrcItemIds: remainingIds,
								MaxItemNo: maxItemNo,
								ControllingUnitFk: procurementPesHeaderService.getSelected().ControllingUnitFk,
								IsIncludeNonContractedPesItems: isIncludeNonContractedPesItems,
								ExcludeInstanceIds: nonContractedItemInstanceIds
							};
								// var newData;
							$http.post(globals.webApiBaseUrl + 'procurement/pes/item/createitems', creationData).then(function (response) {

								if (!response || !response.data) {
									defer.resolve(serviceContainer.service.getList());
									return;
								}
								var newList = response.data.Main;

								if (angular.isArray(newList) && newList.length > 0) {
									var GrpSetDTLDataService = $injector.get('procurementPesGrpSetDTLDataService');
									var createIndex = 0;
									if (callBackAfterCreate && _.isFunction(callBackAfterCreate)) {
										var newItems = _.map(newList, function(l) {
											return l.Item;
										});
										callBackAfterCreate(newItems);
									}
									_.forEach(newList, function (entity) {
										var item = entity.Item;
										if (item.PrcItemFk) {
											var prcItems = basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
											var prcItem = _.find(prcItems, {Id: item.PrcItemFk});
											if (prcItem) {
												item.MaterialCode = prcItem.MaterialCode;
												item.PrcItemFactorPriceUnit = prcItem.FactorPriceUnit;
												item.QuantityContractedAccepted = prcItem.QuantityContractedAccepted;
												item.AlternativeUomFk = prcItem.AlternativeUomFk;
												item.AlternativeQuantity = prcItem.AlternativeQuantity;
												item.MaterialStockFk = prcItem.MaterialStockFk;
												if (!isSkippingValidation) {
													// set cost group from prcItem
													$http.get(globals.webApiBaseUrl + 'procurement/pes/item/getcostgroupbyprcitem' + '?prcItemFk=' + item.PrcItemFk + '&pesHeaderId=' + headerSelectedItem.Id + '&pesItemFk=' + item.Id).then(function (response) {
														$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
															var responseData = response.data;
															responseData.dtos = [];
															responseData.dtos.push(item);
															basicsCostGroupAssignmentService.process(responseData, serviceContainer.service, {
																mainDataName: 'dtos',
																attachDataName: 'PesItem2CostGroups', // name of MainItem2CostGroup
																dataLookupType: 'PesItem2CostGroups',// name of MainItem2CostGroup
																identityGetter: function identityGetter(entity) {
																	return {
																		Id: entity.MainItemId
																	};
																}
															});
														}]);
													});
												}
											}
										}
										var rate = headerSelectedItem.ExchangeRate;
										if (rate) {
											var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
											var vatPercent = serviceContainer.service.getVatPercentWithTaxCodeMatrix(item.MdcTaxCodeFk);
											var sameRate = _.isNil(item.ConHeaderExchangeRate) ? false : item.ConHeaderExchangeRate === rate;
											var sameVatPercent = _.isNil(item.ConVatPercent) ? false : item.ConVatPercent === vatPercent;
											if (isCalculateOverGross) {
												item.PriceGross = (sameRate && item.PriceGross !== 0) ?
													item.PriceGross :
													itemCalculationHelper.getPriceGrossByPriceGrossOc(item, rate);
												item.PriceOc = (sameRate && sameVatPercent && item.PriceOc !== 0) ?
													item.PriceOc : itemCalculationHelper.getPriceOc(item, vatPercent);
												item.Price = (sameRate && sameVatPercent && item.Price !== 0) ?
													item.Price : itemCalculationHelper.getPrice(item, vatPercent);

												item.PriceExtra = (sameRate && item.PriceExtra !== 0) ?
													item.PriceExtra :
													itemCalculationHelper.getPriceExtraByExchangeRate(item, rate);
												item.TotalPrice = (sameRate && item.TotalPrice !== 0) ?
													item.TotalPrice :
													itemCalculationHelper.getTotalPriceByTotalPriceOc(item, rate);
												item.TotalPriceGross = (sameRate && item.TotalPriceGross !== 0) ?
													item.TotalPriceGross :
													itemCalculationHelper.getTotalPriceGross(item, vatPercent, rate);

												item.DiscountAbsoluteGross = (sameRate && sameVatPercent && item.DiscountAbsoluteGross !== 0) ?
													item.DiscountAbsoluteGross :
													itemCalculationHelper.getDiscountAbsoluteGrossByGrossOc(item, rate, true);
												item.DiscountAbsoluteOc = (sameVatPercent && item.DiscountAbsoluteOc !== 0) ?
													item.DiscountAbsoluteOc :
													itemCalculationHelper.getDiscountAbsoluteOcByGrossOc(item, vatPercent, true);
												item.DiscountAbsolute = (sameRate && item.DiscountAbsolute !== 0) ?
													item.DiscountAbsolute :
													itemCalculationHelper.getDiscountAbsoluteByOc(item, rate, true);
											}
											else {
												item.Price = (sameRate && item.Price !== 0) ?
													item.Price : itemCalculationHelper.getPriceByPriceOc(item, rate);
												item.PriceGrossOc = (sameRate && sameVatPercent && item.PriceGrossOc !== 0) ?
													item.PriceGrossOc : itemCalculationHelper.getPriceGrossOc(item, vatPercent);
												item.PriceGross = (sameRate && sameVatPercent && item.PriceGross !== 0) ?
													item.PriceGross : itemCalculationHelper.getPriceGrossByPriceGrossOc(item, rate);
												item.PriceExtra = itemCalculationHelper.getPriceExtraByExchangeRate(item, rate);
												item.TotalPrice = itemCalculationHelper.getTotalPriceByTotalPriceOc(item, rate);
												item.DiscountAbsolute = (sameRate && item.DiscountAbsolute !== 0) ?
													item.DiscountAbsolute :
													itemCalculationHelper.getDiscountAbsoluteByOc(item, rate, true);
												item.DiscountAbsoluteGrossOc = (sameVatPercent && item.DiscountAbsoluteGrossOc !== 0) ?
													item.DiscountAbsoluteGrossOc :
													itemCalculationHelper.getDiscountAbsoluteGrossOcByOc(item, vatPercent, true);
												item.DiscountAbsoluteGross = (sameRate && sameVatPercent && item.DiscountAbsoluteGross !== 0) ?
													item.DiscountAbsoluteGross :
													itemCalculationHelper.getDiscountAbsoluteGrossByGrossOc(item, rate, true);
											}
										}
										item.dontModifyDeliveredTotal = true;
										serviceContainer.service.setInputWhichField({PriceGrossOc: true,TotalPrice:true});
										if (isCreateCopyContract) {
											item.haventLoadPrcieCondition = true;
										}
										if (isCreate4Contract) {
											item.isCreate4Contract = true;
										}
										if (!isSkippingValidation) {
											serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data);
											delete item.haventLoadPrcieCondition;
											var prcPriceConditionFk = item.PrcPriceConditionFk === null ? -1 : item.PrcPriceConditionFk;
											allPromise.push(validator.reloadPriceCondition(item, prcPriceConditionFk, true));
											validator.asyncValidateControllingUnitFk(item, item.ControllingUnitFk, 'ControllingUnitFk');
											allPromise.push(GrpSetDTLDataService.roadData(item, entity.controllingStructureGrpSetDTLToSave));
											if (newList.length <= ++createIndex) {
												$q.all(allPromise).then(function () {

													delete item.isCreate4Contract;
													defer.resolve(serviceContainer.service.getList());
													serviceContainer.service.setInputWhichField({});
												});
											}
											priceReadOnly(item, true);
											serviceContainer.service.setSelectedEntities([item]);
											serviceContainer.service.calcPesItemQty(item);
										}
									});
									if (isSkippingValidation) {
										$q.all(allPromise).then(function () {
											defer.resolve(newList);
										});
									}
								} else {
									$q.all(allPromise).then(function () {
										defer.resolve(serviceContainer.service.getList());
									});
								}
							});
						});
					});

					return defer.promise;
				}

				function statusChangeHandler() {
					var headerSelectedItem = procurementPesHeaderService.getSelected(),
						dataItem = serviceContainer.service.getList(),
						allReadonly = procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);

					_.forEach(dataItem, function (item) {
						setReadonly(item, allReadonly);
						// The Price is read only every time, just when we use the wizards change the value of read only.
						priceReadOnly(item, true);
					});
					serviceContainer.data.listLoaded.fire();
				}

				function priceReadOnly(item, readonly) {
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var fields = [
						{
							field: 'Price',
							readonly: readonly
						},
						{
							field: 'PriceOc',
							readonly: readonly
						},
						{
							field: 'PriceGross',
							readonly: readonly
						},
						{
							field: 'PriceGrossOc',
							readonly: readonly
						},
						{
							field: 'TotalGross',
							readonly: !isOverGross
						},
						{
							field: 'TotalGrossOc',
							readonly: !isOverGross
						}
					];
					platformRuntimeDataService.readonly(item, fields);
				}

				function updateprjstockReadOnly(entity) {
					var parentItem = serviceContainer.service.parentService().getSelected();
					var item = getIsStock(entity);
					var isstock = true;
					if (item.PrjStockFk !== null) {
						if (item.PrjStockFk === 0) {
							entity.PrjStockFk = null;
						}
						else {
							entity.PrjStockFk = item.PrjStockFk;
						}
						entity.PrcStockTransactionTypeFk = item.PrcStockTransactionTypeFk;
						isstock = false;
					}
					else {
						entity.PrjStockFk = null;
						entity.PrcStockTransactionTypeFk = null;
						entity.PrcStockTransactionFk = null;
						entity.PrjStockLocationFk = null;
						entity.ProvisionPercent = 0;
						entity.ProvisonTotal = 0;
						entity.LotNo = null;
						entity.ExpirationDate= null;
					}
					setPrjstockReadOnly(entity, isstock);
					validator.asyncValidatePrjStockFk(entity, entity.PrjStockFk, 'PrjStockFk', true);
					validator.asyncValidateLotNo(entity, entity.LotNo);
					validator.asyncValidateExpirationDate(entity, entity.ExpirationDate);
					validator.asyncValidatePrcStockTransactionTypeFk(entity, entity.PrcStockTransactionTypeFk, 'PrcStockTransactionTypeFk', isstock,parentItem);
					serviceContainer.service.gridRefresh();
				}

				function updatePrjStockReadOnlyForCopy(entity, isStock) {
					setPrjstockReadOnly(entity, isStock);
					serviceContainer.service.gridRefresh();
				}

				function provisionReadOnly(_items, allReadonly) {
					var items = [];
					if (!_items.length) {
						items.push(_items);
					}
					else {
						items = _items;
					}

					if (!allReadonly) {
						_.each(_.filter(items,
							function (item) {
								return !item.PrjStockFk;
							}), function (_item) {
							platformRuntimeDataService.readonly(_item, [{
								field: 'ProvisionPercent',
								readonly: true
							}, {field: 'ProvisonTotal', readonly: true}]);
						});

						var getitems = _.filter(items, function (item) {
							return item.PrjStockFk;
						});
						if (getitems.length > 0) {
							$http.post(globals.webApiBaseUrl + 'procurement/pes/item/getprovisionsallowed', getitems).then(function (responseData) {
								_.each(responseData.data, function (item) {
									var isReadonly = !item.isReadonly;
									var entity = _.find(getitems, {Id: item.Id});
									platformRuntimeDataService.readonly(entity, [{
										field: 'ProvisionPercent',
										readonly: isReadonly
									}, {field: 'ProvisonTotal', readonly: isReadonly}]);
								});
							});
						}
					}
					else {
						_.each(items, function (entity) {
							platformRuntimeDataService.readonly(entity, [{
								field: 'ProvisionPercent',
								readonly: true
							}, {field: 'ProvisonTotal', readonly: true}]);
						});
					}
				}

				function initprjstockReadOnly(_items, allReadonly) {
					var items = [];
					if (!_items.length) {
						items.push(_items);
					}
					else {
						items = _items;
					}
					if (!allReadonly) {
						_.each(_.filter(items,
							function (item) {
								return item.PrjStockFk;
							}), function (_item) {
							setPrjstockReadOnly(_item, false);
						});
						var getitems = _.filter(items, function (item) {
							return !item.PrjStockFk;
						});
						if (getitems.length > 0) {
							_.each(getitems, function (getitem) {
								var item = getIsStock(getitem);
								if (item.PrjStockFk === null) {
									setPrjstockReadOnly(getitem, true);
								} else {
									setPrjstockReadOnly(getitem, false);
								}

							});
						}
					}
					else {
						_.each(items, function (item) {
							setPrjstockReadOnly(item, true);
						});

					}
				}

				function inticreateOtherItems(item, prcItem) {
					if (item.PrjStockFk) {

						var readOnyStatus,itemStatus;
						if (_.isFunction(procurementPesHeaderService.getItemStatus)) {
							itemStatus = procurementPesHeaderService.getItemStatus();
						}
						else{
							var pesStatuses = _.orderBy(_.filter(basicsLookupdataLookupDescriptorService.getData('PesStatus'),function (item) {
								return item.IsDefault;
							}),'Id');
							if (pesStatuses) {
								itemStatus = pesStatuses[0];
							}
						}

						if (itemStatus) {
							readOnyStatus = itemStatus.IsReadOnly;
						} else {
							readOnyStatus = false;
						}
						setPrjstockReadOnly(item, readOnyStatus);
						provisionReadOnly(item);
						setPrcStockTransactionType(item);
					}
					else {
						if (prcItem) {
							item.ControllingUnitFk = prcItem.ControllingUnitFk;
						}
						var val = getIsStock(item);
						if (val.PrjStockFk) {
							if (val.PrjStockFk !== 0) {
								item.PrjStockFk = val.PrjStockFk;
								item.PrcStockTransactionTypeFk = val.PrcStockTransactionTypeFk;
							}
							setPrjstockReadOnly(item, false);
						}
						else {
							setPrjstockReadOnly(item, true);
						}
						provisionReadOnly(item);
						setPrcStockTransactionType(item);
						validate(item, ['ControllingUnitFk']);
						if (null !== item.ControllingUnitFk) {
							validator.asyncValidateControllingUnitFk(item, item.ControllingUnitFk, 'ControllingUnitFk');
						}
						serviceContainer.service.gridRefresh();
					}
				}

				function selectprjstockReadOnly(entity) {
					var defer = $q.defer();
					var _setData = {data: getIsStock(entity)};
					defer.resolve(_setData);
					return defer.promise;
				}

				function setFieldReadOnly(item, model, isReadOnly) {
					var properties = [];
					$.each(model, function (i) {
						properties.push({field: model[i], readonly: isReadOnly});
					});
					platformRuntimeDataService.readonly(item, properties);
				}

				function setPrjstockReadOnly(entity, isstock) {
					var fields = ['PrjStockFk', 'PrcStockTransactionTypeFk', 'PrcStockTransactionFk', 'PrjStockLocationFk', 'ProvisionPercent', 'ProvisonTotal', 'LotNo','ExpirationDate'];
					setFieldReadOnly(entity, fields, isstock);
				}

				function setPrcStockTransactionType(_items, allReadonly) {
					var items = [];
					if (!_items.length) {
						items.push(_items);
					} else {
						_.forEach(_items, function (_item) {
							items.push(_item);
						});
					}
					var fields = ['PrcStockTransactionFk'];

					if (!allReadonly) {
						// case 1-->Material Receipt
						var items1 = _.filter(items, function (item) {return item.PrcStockTransactionTypeFk === 1;});
						if (items1.length > 0) {
							$http.post(globals.webApiBaseUrl + 'procurement/pes/item/getmaterial2projectstocks', items1).then(function (responseData) {
								_.each(responseData.data, function (item) {
									var entity = _.find(items1, {Id: item.Id});
									setFieldReadOnly(entity, fields,  !item.IsInStock2Material);
								});
							});
						}

						// case 2-->//Incidental Acquisition Expense
						var items2 = _.filter(items, function (item) {return item.PrcStockTransactionTypeFk === 2;});
						_.each(items2, function (entity) {
							setFieldReadOnly(entity, fields,  false);
						});
						// case other-->when type_isdela===true
						_.pullAll(items, items1);
						_.pullAll(items, items2);

						var transactionType = basicsLookupdataLookupDescriptorService.getData('PrcStocktransactiontype');
						_.each(items, function (entity) {
							var type = _.find(transactionType, {Id: entity.PrcStockTransactionTypeFk});
							setFieldReadOnly(entity, fields, _.isUndefined(type)?true:!type.IsDelta);
						});
					}
					else {
						_.each(items, function (entity) {
							setFieldReadOnly(entity, fields, true);
						});
					}
				}


				function onSetReadonly() {
					var headerSelectedItem = procurementPesHeaderService.getSelected();
					var allReadonly = procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
					var currentItem = serviceContainer.service.getSelected();
					if(currentItem){
						if(currentItem.PrcItemFk) {
							return $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/getbyid?id=' + currentItem.PrcItemFk).then(function (response) {
								let parentItem = response.data;
								let columns = Object.keys(currentItem);
								var fields = [];
								if (parentItem.BasItemTypeFk === 7) {
									let isReadonly;
									_.forEach(columns, (item) => {
										if (item === 'Itemno' || item === 'Description1' || item === 'Description2' || item === 'PrcItemSpecification' || item === 'UserDefined1'
											|| item === 'UserDefined2' || item === 'UserDefined3' || item === 'UserDefined4' || item === 'UserDefined5') {
											isReadonly = false;
										} else {
											isReadonly = true;
										}
										fields.push({field: item, readonly: isReadonly});
									});
								} else {
									setReadonly(currentItem, allReadonly);
								}
								platformRuntimeDataService.readonly(currentItem, fields);
							});
						}else{
							setReadonly(currentItem, allReadonly);
						}
					}else{
						setReadonly(currentItem, allReadonly);
					}

					// platformRuntimeDataService.readonly(currentItem, [{field: 'Price', readonly: true}, {field: 'PriceOc', readonly: true}]);
				}

				function setReadonly(currentItem, allReadonly) { /* jshint -W074 */
					if (!currentItem || !currentItem.Id) {
						return;
					}
					var itemAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'PesItemDto',
						moduleSubModule: 'Procurement.Pes'
					}).properties;

					var fields = [];
					for (var prop in itemAttributeDomains) {
						// eslint-disable-next-line no-prototype-builtins
						if (itemAttributeDomains.hasOwnProperty(prop) && prop !== 'Price' && prop !== 'PriceOc' && prop !== 'PriceGross' && prop !== 'PriceGrossOc' && prop !== 'ProvisionPercent' &&
							prop !== 'ProvisonTotal' && prop !== 'PrjStockFk' && prop !== 'PrjStockLocationFk' && prop !== 'PrcStockTransactionFk' &&
							prop !== 'PrcStockTransactionTypeFk' && prop !== 'LotNo'&& prop !== 'ExpirationDate') {
							if (allReadonly) {
								fields.push({field: prop, readonly: allReadonly});
							} else {
								var editable = getCellEditable(currentItem, prop);
								fields.push({field: prop, readonly: !editable});
							}
						}
					}

					if (currentItem.PrcItemFk > 0 || currentItem.HasDuplicatedContractedPesItem) {
						var readonlyFieldsIfPrcItemFk = ['MdcMaterialFk', 'Description1', 'Description2'/* , 'MdcTaxCodeFk' */];
						_.forEach(readonlyFieldsIfPrcItemFk, function (field) {
							fields.push({field: field, readonly: true});
						});
					}

					platformRuntimeDataService.readonly(currentItem, fields);
				}

				function getCellEditable(currentItem, model) {
					if (!currentItem || !currentItem.Id) {
						return false;
					}

					if (model === 'PrcItemFk') {
						return currentItem.ConHeaderFk;
					} else if (model === 'UomFk') {
						return !(!!currentItem.MdcMaterialFk || !!currentItem.PrcItemFk);
					}  else if (model === 'AlternativeUomFk') {
						return !!currentItem.Material2Uoms;
					} else if (model === 'IsAssetManagement') {
						var controllingUnits = basicsLookupdataLookupDescriptorService.getData('ControllingUnit');
						if (controllingUnits && currentItem.ControllingUnitFk) {
							var controllingUnit = _.find(controllingUnits, {Id: currentItem.ControllingUnitFk});
							if (controllingUnit) {
								return controllingUnit.Isassetmanagement;
							}
							return true;
						}
						else {
							return true;
						}
					} else if (model === 'FixedAssetFk') {
						return currentItem.IsAssetManagement;
					}
					else if (model === 'BudgetPerUnit' || model === 'BudgetTotal' || model === 'BudgetFixedUnit' || model === 'BudgetFixedTotal') {
						return false;
					}
					else if (model === 'TotalGross' || model === 'TotalGrossOc') {
						return prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					}
					else if (model === 'ConHeaderFk') {
						var parentItem = procurementPesHeaderService.getSelected();
						return !((parentItem && parentItem.ConHeaderFk > 0 && parentItem.ConfigHeaderIsConsolidateChange) || !parentItem);
					}
					return true;
				}

				function getMaxItemNo() {
					var modState = platformModuleStateService.state(serviceContainer.service.getModule());
					var updateData = angular.copy(modState.modifications);
					/** @namespace updateData.ItemToDelete */
					/** @namespace updateData.ItemToSave */
					var allItems;
					if(updateData.ItemToSave !== undefined){
						allItems = (updateData.ItemToSave || []).concat(serviceContainer.service.getList() || []);
					}else{
						allItems = (updateData.ItemToSave || []).concat(updateData.ItemToDelete || []).concat(serviceContainer.service.getList() || []);
					}

					var allItemNos = _.map(allItems, function (item) {
						return item.ItemNo;
					});
					return _.max(allItemNos);
				}

				function updateByPrcItem(entity, prcItem, quantityContract/* , completePrcItem */) {
					if (prcItem) {
						var parentItem = serviceContainer.service.parentService().getSelected();
						if (prcItem.Id !== entity.PrcItemFk) {
							var DeliveryScheduleService = $injector.get('procurementCommonDeliveryScheduleDataService').getService(serviceContainer.service);
							DeliveryScheduleService.SelectQuantity(prcItem.Id);
							DeliveryScheduleService.reload(prcItem.Id);
						}
						entity.PrcItemFk = prcItem.Id;
						entity.InstanceId = prcItem.InstanceId;
						entity.QuantityContracted = quantityContract;
						entity.QuantityContractedAccepted = prcItem.QuantityContractedAccepted;

						let isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
						let vatPercent = serviceContainer.service.getVatPercentWithTaxCodeMatrix(prcItem.TaxCodeFk);
						let sameRate = _.isNil(prcItem.ConHeaderExchangeRate) ? false : prcItem.ConHeaderExchangeRate === parentItem.ExchangeRate;
						let sameVatPercent = _.isNil(prcItem.ConVatPercent) ? false : prcItem.ConVatPercent === vatPercent;
						if (isCalculateOverGross) {
							entity.PriceGrossOc = prcItem.PriceGrossOc;
							entity.PriceGross = (sameRate && prcItem.PriceGross !== 0) ?
								prcItem.PriceGross :
								itemCalculationHelper.getPriceGrossByPriceGrossOc(prcItem, parentItem.ExchangeRate);
							entity.PriceOc = (sameRate && sameVatPercent && prcItem.PriceOc !== 0) ?
								prcItem.PriceOc : itemCalculationHelper.getPriceOc(prcItem, vatPercent);
							entity.Price = (sameRate && sameVatPercent && prcItem.Price !== 0) ?
								prcItem.Price : itemCalculationHelper.getPrice(entity, vatPercent);

							entity.PriceExtraOc = prcItem.PriceExtraOc;
							entity.PriceExtra = (sameRate && prcItem.PriceExtra !== 0) ?
								prcItem.PriceExtra :
								itemCalculationHelper.getPriceExtraByExchangeRate(prcItem, parentItem.ExchangeRate);
							entity.TotalPriceOc = prcItem.TotalPriceOc;
							entity.TotalPrice = (sameRate && prcItem.TotalPrice !== 0) ?
								prcItem.TotalPrice :
								itemCalculationHelper.getTotalPriceByTotalPriceOc(prcItem, parentItem.ExchangeRate);
							entity.TotalPriceGrossOc = prcItem.TotalPriceGrossOc;
							entity.TotalPriceGross = (sameRate && prcItem.TotalPriceGross !== 0) ?
								prcItem.TotalPriceGross :
								itemCalculationHelper.getTotalPriceGrossByTotalPriceGrossOc(prcItem, vatPercent, parentItem.ExchangeRate);
							entity.DiscountAbsoluteGrossOc = prcItem.DiscountAbsoluteGrossOc;
							entity.DiscountAbsoluteGross = (sameRate && sameVatPercent && prcItem.DiscountAbsoluteGross !== 0) ?
								prcItem.DiscountAbsoluteGross :
								itemCalculationHelper.getDiscountAbsoluteGrossByGrossOc(prcItem, parentItem.ExchangeRate, true);
							entity.DiscountAbsoluteOc = (sameVatPercent && prcItem.DiscountAbsoluteOc !== 0) ?
								prcItem.DiscountAbsoluteOc :
								itemCalculationHelper.getDiscountAbsoluteOcByGrossOc(prcItem, vatPercent, true);
							entity.DiscountAbsolute = (sameRate && prcItem.DiscountAbsolute !== 0) ?
								prcItem.DiscountAbsolute :
								itemCalculationHelper.getDiscountAbsoluteByOc(prcItem, parentItem.ExchangeRate, true);
						}
						else {
							entity.PriceOc = prcItem.PriceOc;
							entity.Price = (sameRate && prcItem.Price !== 0) ?
								prcItem.Price : itemCalculationHelper.getPriceByPriceOc(prcItem, parentItem.ExchangeRate);
							entity.PriceGrossOc = (sameRate && sameVatPercent && prcItem.PriceGrossOc !== 0) ?
								prcItem.PriceGrossOc : itemCalculationHelper.getPriceGrossOc(prcItem, vatPercent);
							entity.PriceGross = (sameRate && sameVatPercent && prcItem.PriceGross !== 0) ?
								prcItem.PriceGross : itemCalculationHelper.getPriceGrossByPriceGrossOc(prcItem, parentItem.ExchangeRate);
							entity.PriceExtraOc = /* (completePrcItem || prcItem) */prcItem.PriceExtraOc;
							entity.PriceExtra = itemCalculationHelper.getPriceExtraByExchangeRate(entity, parentItem.ExchangeRate);
							entity.DiscountAbsoluteOc = prcItem.DiscountAbsoluteOc;
							entity.DiscountAbsolute = (sameRate && prcItem.DiscountAbsolute !== 0) ?
								prcItem.DiscountAbsolute :
								itemCalculationHelper.getDiscountAbsoluteByOc(prcItem, parentItem.ExchangeRate, true);
							entity.DiscountAbsoluteGrossOc = (sameVatPercent && prcItem.DiscountAbsoluteGrossOc !== 0) ?
								prcItem.DiscountAbsoluteGrossOc :
								itemCalculationHelper.getDiscountAbsoluteGrossOcByOc(prcItem, vatPercent, true);
							entity.DiscountAbsoluteGross = (sameRate && sameVatPercent && prcItem.DiscountAbsoluteGross !== 0) ?
								prcItem.DiscountAbsoluteGross :
								itemCalculationHelper.getDiscountAbsoluteGrossByGrossOc(prcItem, parentItem.ExchangeRate, true);
						}

						entity.PrcItemFactorPriceUnit = prcItem.FactorPriceUnit;
						entity.MdcTaxCodeFk = prcItem.TaxCodeFk;
						var dontReCalcuPricGrossOc = true;
						serviceContainer.service.setInputWhichField({TotalPrice: true});
						calculateTotalAndVatAndGross(entity, false, false, dontReCalcuPricGrossOc);
						serviceContainer.service.setInputWhichField({});
						entity.UomFk = prcItem.BasUomFk;
						entity.ControllingUnitFk = prcItem.MdcControllingunitFk || prcItem.ControllingUnitFk || entity.ControllingUnitFk;
						entity.PrcStructureFk = prcItem.PrcStructureFk || entity.PrcStructureFk;
						entity.PrcItemStatusFk = prcItem.PrcItemStatusFk;
						entity.MaterialCode = /* (completePrcItem || prcItem) */prcItem.MaterialCode;
						entity.MdcMaterialFk = /* (completePrcItem || prcItem) */prcItem.MdcMaterialFk;
						entity.PrcPriceConditionFk = /* (completePrcItem || prcItem) */prcItem.PrcPriceConditionFk;
						entity.MaterialExternalCode = /* (completePrcItem || prcItem) */prcItem.PrcItemMaterialExternalCode;
						entity.TotalPrice = prcItem.TotalPrice;
						entity.TotalPriceOc = prcItem.TotalPriceOc;
						entity.Discount = prcItem.Discount;
						entity.PrjStockFk = prcItem.PrjStockFk;
						entity.PrjStockLocationFk = prcItem.PrjStockLocationFk;
						entity.Description1 = prcItem.Description1;
						entity.Description2 = prcItem.Description2;
						entity.UserDefined1 = prcItem.UserDefined1;
						entity.UserDefined2 = prcItem.UserDefined2;
						entity.UserDefined3 = prcItem.UserDefined3;
						entity.UserDefined4 = prcItem.UserDefined4;
						entity.UserDefined5 = prcItem.UserDefined5;
						entity.ExternalCode = prcItem.ExternalCode;
						entity.BudgetFixedTotal = prcItem.BudgetFixedTotal;
						entity.BudgetFixedUnit = prcItem.BudgetFixedUnit;
						entity.BudgetPerUnit = prcItem.BudgetPerUnit;
						entity.BudgetTotal = prcItem.BudgetTotal;

						entity.AlternativeUomFk = prcItem.AlternativeUomFk;
						entity.AlternativeQuantity = prcItem.AlternativeQuantity;
						entity.MaterialStockFk = prcItem.MaterialStockFk;

						calcDeliveredAndRemaining(entity);
						validate(entity, ['UomFk','AlternativeUomFk','ControllingUnitFk', 'PrcStructureFk']);
						if (null !== entity.ControllingUnitFk) {
							validator.asyncValidateControllingUnitFk(entity, entity.ControllingUnitFk, 'ControllingUnitFk');
						}
						serviceContainer.service.onSpecificationChanged.fire(prcItem.Specification);
					} else {
						entity.PrcItemFk = null;
						entity.InstanceId = -1;
						entity.QuantityContracted = 0;
						entity.QuantityContractedAccepted = 0;
						entity.QuantityDelivered = entity.Quantity;
						entity.QuantityRemaining = -entity.Quantity;
						entity.TotalDelivered = entity.Total;
						entity.TotalOcDelivered = entity.TotalOc;
						entity.PrcItemStatusFk = null;
						entity.Vat = 0;
						entity.PriceOc = 0;
						entity.Price = 0;
						entity.PriceExtraOc = 0;
						entity.PriceExtraOc = 0;
						entity.Total = 0;
						entity.TotalOc = 0;
						entity.VatOC = 0;
						entity.PrcPriceConditionFk = null;
						entity.MdcMaterialFk = null;
						entity.MaterialCode = null;
						entity.MaterialExternalCode = null;
						entity.Discount = 0;
						entity.DiscountAbsolute = 0;
						entity.DiscountAbsoluteOc = 0;
						entity.DiscountAbsoluteGross = 0;
						entity.DiscountAbsoluteGrossOc = 0;
						entity.TotalPrice = 0;
						entity.TotalPriceOc = 0;
					}
					serviceContainer.service.calcPesItemQty(entity);
				}

				function calcDeliveredAndRemaining(entity) {
					var data = {
						PesHeaderId: entity.PesHeaderFk,
						PrcItemFk: entity.PrcItemFk,
						InstanceId: entity.InstanceId
					};
					$http.post(globals.webApiBaseUrl + 'procurement/pes/item/calculatedeliveredquantityandtotal', data)
						.then(function (response) {
							var list = serviceContainer.service.getList();
							var deliveredQuantities = _.sumBy(list, function (item) {
								if (item.Id !== entity.Id && item.PrcItemFk === entity.PrcItemFk && !item.Version) {
									return item.Quantity;
								}
								return 0;
							});
							var deliveredTotal = _.sumBy(list, function (item) {
								if (item.Id !== entity.Id && item.PrcItemFk === entity.PrcItemFk && !item.Version) {
									return item.Total;
								}
								return 0;
							});
							var deliveredTotalOc = _.sumBy(list, function (item) {
								if (item.Id !== entity.Id && item.PrcItemFk === entity.PrcItemFk && !item.Version) {
									return item.TotalOc;
								}
								return 0;
							});
							entity.QuantityDelivered = round(roundingType.QuantityDelivered, response.data.DeliveredQuantity + entity.Quantity + deliveredQuantities);
							entity.TotalDelivered = round(roundingType.TotalDelivered, response.data.DeliveredTotal + entity.Total + deliveredTotal);
							entity.TotalOcDelivered = round(roundingType.TotalOcDelivered, response.data.DeliveredTotalOc + entity.TotalOc + deliveredTotalOc);
							entity.QuantityRemaining = round(roundingType.QuantityRemaining, calculateQuantityRemaining(entity.QuantityContracted, entity.QuantityDelivered));
							serviceContainer.service.calcPesItemQty(entity);
							serviceContainer.service.gridRefresh();
						});
				}

				serviceContainer.service.calcPesItemQty = function calcPesItemQty(entity) {
					entity.QuantityContractedConverted = round(roundingType.QuantityContractedConverted, mathBignumber(entity.QuantityContracted).mul(entity.PrcItemFactorPriceUnit).toNumber());
					entity.QuantityDeliveredConverted = round(roundingType.QuantityDeliveredConverted, mathBignumber(entity.QuantityDelivered).mul(entity.PrcItemFactorPriceUnit).toNumber());
					entity.QuantityRemainingConverted = round(roundingType.QuantityRemainingConverted, mathBignumber(entity.QuantityRemaining).mul(entity.PrcItemFactorPriceUnit).toNumber());
					entity.QuantityConverted = round(roundingType.QuantityConverted, mathBignumber(entity.Quantity).mul(entity.PrcItemFactorPriceUnit).toNumber());
					calcInvoiceQuantityForEntity(entity);
				};

				function calcInvoiceQuantityForEntity(entity) {
					entity.InvoiceQuantity = entity.Quantity;
				}

				// Below code:
				// The system must check, if PES_ITEM.PRC_STRUCTURE_FK is always the same, then use this PRC_STRUCTURE_FK.
				// If multiple PRC_STRUCTURE_FK are found, set NULL
				function updateRootRow() {
					var pesHeader = procurementPesHeaderService.getSelected();
					if (pesHeader) { // defect 93234 when contract and contract.structureFk is not null.
						var conHeaderFk = pesHeader.ConHeaderFk;
						if (conHeaderFk) {
							var conHeaders = basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
							var conHeader = conHeaders ? _.find(conHeaders, {Id: conHeaderFk}) : null;
							if (conHeader && !conHeader.PrcStructureFk) {
								procurementPesHeaderService.updateHeaderPrcStructure();
							}
							else if (!conHeader) {
								$http.post(globals.webApiBaseUrl + 'procurement/pes/header/getstructureId?conHeaderId=' + parseInt(conHeaderFk)).then(function (response) {
									if (response.data <= 0) {
										procurementPesHeaderService.updateHeaderPrcStructure();
									}
								});
							}
						} else {
							procurementPesHeaderService.updateHeaderPrcStructure();
						}
					}
					var selected = serviceContainer.service.getSelected();
					if (selected && selected.Id) {
						procurementPesHeaderService.updateHeaderConHeader(selected.ConHeaderFk);
					}
				}

				serviceContainer.service.deleteItem = function deleteItem(entity) {
					if (entity.PrcItemFk && entity.Quantity) {
						updateDeliveredAndRemainingQuantity(-entity.Quantity, entity.PrcItemFk);
					}
					serviceContainer.data.deleteItem(entity, serviceContainer.data);
				};

				function handleCreateSucceeded(creationData) {
					var itemNo = getMaxItemNo();
					if(itemNo === undefined){
						itemNo = 0;
					}
					creationData.ItemNo = itemNo + 1;
					setReadonly(creationData);
					return creationData;
				}

				function updateDeliveredAndRemainingQuantity(diff, prcItemFk, dontRefreshGrid) {
					if (!prcItemFk || !diff) {
						return;
					}

					_.forEach(serviceContainer.service.getList(), function (item) {
						if (item.PrcItemFk === prcItemFk) {
							updateItemDeliveredAndRemainingQuantity(item, diff);
							serviceContainer.service.markItemAsModified(item);
						}
					});

					if (!dontRefreshGrid) {
						serviceContainer.service.gridRefresh();
					}
				}

				function updateItemDeliveredAndRemainingQuantity(item, diff) {
					if (!item || !diff) {
						return;
					}
					item.QuantityDelivered += round(roundingType.QuantityDelivered, diff);
					item.QuantityRemaining -= round(roundingType.QuantityRemaining, diff);

				}

				function onClearUpValidationIssues() {
					if (platformDataValidationService.hasErrors(serviceContainer.service)) {
						var modState = platformModuleStateService.state(serviceContainer.service.getModule());
						modState.validation.issues = [];
					}
				}

				// noinspection JSUnusedLocalSymbols
				function onRemoveValidationIssues(e, id) {
					if (platformDataValidationService.hasErrors(serviceContainer.service)) {
						var modState = platformModuleStateService.state(serviceContainer.service.getModule());
						modState.validation.issues = _.filter(modState.validation.issues, function (err) {
							return err.entity.PesHeaderFk !== id;
						});
					}
				}


				function getIsStock(entity) {
					var cacheStock = StockCache._Prcstock;
					var cacheStructure = StockCache._Prcstructure;
					var PrcItemFk = entity.PrcItemFk;
					var PrcStructureFk = entity.PrcStructureFk;
					var MdcMaterialFk = entity.MdcMaterialFk;
					var prcStockTranTypeDefault = serviceContainer.service.getDefaultprcStockTranType();
					var result = {
						PrjStockFk: null,
						PrcStockTransactionTypeFk: entity.PrcStockTransactionTypeFk
					};

					if (!prcStockTranTypeDefault && prcStockTranTypeDefault !== 0) {
						prcStockTranTypeDefault = entity.PrcStockTransactionTypeDefaultFk;// jshint ignore: line
					}

					var prcItems = basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
					if (prcItems && prcItems[PrcItemFk]) {
						var prcItem = prcItems[PrcItemFk];
						if (prcItem && prcItem.PrjStockFk) {
							return {
								PrjStockFk: prcItem.PrjStockFk,
								PrcStockTransactionTypeFk: prcStockTranTypeDefault
							};
						}
					}

					// 1.PES_ITEM.MDC_MATERIAL_FK is not NULL
					if (MdcMaterialFk === null) {
						return result;
					}

					// 2.PES_ITEM.PRC_STRUCTURE_FK.ISSTOCKEXCLUDED = FALSE
					var PrcstructureItem = _.filter(cacheStructure, function (item) {
						/** @namespace item.PrcstructureId */
						return item.PrcstructureId === PrcStructureFk;
					});
					/** @namespace PrcstructureItem.IsStockexcluded */
					if (PrcstructureItem.length === 0 || PrcstructureItem[0].IsStockexcluded) {
						return result;
					}

					// 3-1.PES_ITEM.MDC_CONTROLLINGUNIT is not null
					// 3-2.PES_ITEM.pes_header_fk.MDC_CONTROLLUNIT_FK instead if PES_ITEM.MDC_CONTROLLINGUNIT.ISSTOCKMANAGEMENT is null
					// 3-3.PES_ITEM.PRC_ITEM_FK.MDC_CONTROLLUNIT_FK(prc_item_fk is not null) instead if ES_ITEM.pes_header_fk.MDC_CONTROLLUNIT_FK is null
					// 3-4.PES_ITEM.CON_HEADER.MDC_CONTROLLUNIT instead if PES_ITEM.PRC_ITEM_FK.MDC_CONTROLLUNIT_FK is null
					// if pes_item.mdc_controllingunit.fk is not null, then check pes_item.mdc_controllingunit.fk.isstockmamgerment,
					// if true,columns about stock in item container should be enable,
					// if  false, then those columns should be read only.
					var ControllingUnitFk = getControllingUnit(entity);
					if (ControllingUnitFk) {
						return getStockItemByControllingUnit(cacheStock,ControllingUnitFk,prcStockTranTypeDefault);
					}

					return result;
				}

				serviceContainer.service.deleteDone = new PlatformMessenger();
				var baseOnDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = function onDeleteDone(deleteParams) {
					var deleteOptions = angular.copy(deleteParams);
					baseOnDeleteDone.apply(serviceContainer.data, arguments);
					if (deleteOptions) {
						var entity = deleteOptions.entity;
						if (!entity) {
							if (deleteOptions.entities) {
								var index = 0;
								if (deleteOptions.index < deleteOptions.entities.length) {
									index = deleteOptions.index;
								}
								entity = deleteOptions.entities[index];
								if (deleteOptions.entities.length) {
									_.forEach(deleteOptions.entities, function (deletedItem) {
										serviceContainer.service.updateDeliveredAndRemainingQuantity(-deletedItem.Quantity, deletedItem.PrcItemFk);
									});
								}
							}
						}
						else {
							serviceContainer.service.updateDeliveredAndRemainingQuantity(-entity.Quantity, entity.PrcItemFk);
						}
						serviceContainer.service.deleteDone.fire(entity);
					}
				};

				serviceContainer.service.canAddDeleteItemByConfig = function canAddDeleteItemByConfig() {
					var selectedItem = procurementPesHeaderService.getSelected();
					if(selectedItem && selectedItem.PrcConfigurationFk){
						var configFk = selectedItem.PrcConfigurationFk;
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: configFk});
						if(config && config.IsMaterial === false){
							return false;
						}
					}
					return true;
				};
				function setReadonlyor() {
					var selectedItem = procurementPesHeaderService.getSelected();
					if(serviceContainer.service.canAddDeleteItemByConfig() === false) {
						return false;
					}
					if (selectedItem && selectedItem.PesHeaderFk) {
						return false;
					}

					var Isreadonly = true;
					/** @namespace selectedItem.PesStatus */
					if (selectedItem && selectedItem.PesStatus) {
						Isreadonly = !selectedItem.PesStatus.IsReadOnly;
					}
					return Isreadonly;
				}

				function setReadonlyByPrcItemFk(entity, readonly) {
					var readonlyFields = ['MdcMaterialFk', 'Description1', 'Description2','Price', 'PriceOc','PriceGross', 'PriceGrossOc'];
					var fields = [];
					_.forEach(readonlyFields, function (field) {
						fields.push({field: field, readonly: readonly});
					});

					platformRuntimeDataService.readonly(entity, fields);
				}

				function vatGroupChanged() {
					var list = serviceContainer.service.getList();
					var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (list && list.length) {
						_.forEach(list, function (item) {
							if (isCalculateOverGross) {
								setNetValueAfterChangeVatPrecent(item);
							}
							else {
								calculateTotalAndVatAndGross(item);
							}
							serviceContainer.service.markItemAsModified(item);
						});
					}
				}

				function getPriceOc(entity, baseOfItem) {
					var priceOc = 0;
					var parentItem = serviceContainer.service.parentService().getSelected();
					var vatPercent = serviceContainer.service.getVatPercentWithTaxCodeMatrix(entity.MdcTaxCodeFk);
					var rate = parentItem.ExchangeRate;
					var value = entity[baseOfItem];
					var itemObj = {};
					itemObj[baseOfItem] = value;
					if (baseOfItem.toLowerCase() === 'pricegross') {
						priceOc = itemCalculationHelper.getPriceOcByPriceGross(itemObj, vatPercent, rate);
						return priceOc;
					}
					if (baseOfItem.toLowerCase() === 'pricegrossoc') {
						priceOc = itemCalculationHelper.getPriceOc(itemObj, vatPercent);
						return priceOc;
					}
					if (baseOfItem.toLowerCase() === 'totalgross') {
						priceOc = itemCalculationHelper.getPriceOcByTotalGross(itemObj, vatPercent, rate);
						return priceOc;
					}
					if (baseOfItem.toLowerCase() === 'totalgrossoc') {
						priceOc = itemCalculationHelper.getPriceOcByTotalGrossOc(itemObj, vatPercent);
						return priceOc;
					}
					return priceOc;
				}

				function getControllingUnit(entity) {
					var ControllingUnitFk = entity.ControllingUnitFk || procurementPesHeaderService.getSelected().ControllingUnitFk;
					if (!ControllingUnitFk) {
						var prcItemCache = _.find(basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup'),{Id: entity.PrcItemFk});
						if (prcItemCache) {
							ControllingUnitFk = prcItemCache.ControllingUnitFk;
						}
					}
					if (!ControllingUnitFk) {
						var conHeaderCache = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'),{Id: entity.ConHeaderFk});
						if (conHeaderCache) {
							ControllingUnitFk = conHeaderCache.ControllingUnitFk;
						}
					}
					return ControllingUnitFk;
				}

				function getStockItemByControllingUnit(stockCache, controllingUnitFk, transactionTypeFk) {
					var result = {
						PrjStockFk: null,
						PrcStockTransactionTypeFk: null
					};
					var stockItem = _.filter(stockCache, function (item) {
						/** @namespace item.ControllingunitId */
						return item.ControllingunitId === controllingUnitFk;
					});

					if (stockItem.length > 0) {
						var _stockItem = _.filter(stockItem, function (item) {
							/** @namespace item.PrcstockId */
							return item.PrcstockId !== null;
						});
						if (_stockItem.length > 0) {
							return _stockItem[0].IsStockmanagement ? {
								PrjStockFk: _stockItem[0].PrcstockId, PrcStockTransactionTypeFk: transactionTypeFk
							} : result;
						}
					} else {
						return result;
					}
				}

				function setNetValuesAfterChangeVatPrecent(items) {
					angular.forEach(items, function (item) {
						setNetValueAfterChangeVatPrecent(item);
					});
				}

				function setNetValueAfterChangeVatPrecent(item) {
					var originTotal = item.Total;
					var originTotalOc = item.TotalOc;
					var vatPercent = serviceContainer.service.getVatPercentWithTaxCodeMatrix(item.MdcTaxCodeFk);
					item.Price = itemCalculationHelper.getPrice(item, vatPercent);
					item.PriceOc = itemCalculationHelper.getPriceOc(item, vatPercent);
					item.TotalPrice = itemCalculationHelper.getTotalPrice(item, vatPercent);
					item.TotalPriceOc = itemCalculationHelper.getTotalPriceOc(item, vatPercent);
					item.Total = itemCalculationHelper.getTotal(item, vatPercent);
					item.TotalOc = itemCalculationHelper.getTotalOc(item, vatPercent);

					if (item.BasItemTypeFk === 2 || item.BasItemType2Fk === 3 || item.BasItemType2Fk === 5) {
						item.Total = 0;
						item.TotalOc = 0;
					}
					item.Vat = round(roundingType.Vat, mathBignumber(item.Total).mul(vatPercent).div(100));
					item.VatOC = round(roundingType.VatOC, mathBignumber(item.TotalOc).mul(vatPercent).div(100));
					calculateDeliveredTotal(item, originTotal, originTotalOc);
				}

				serviceContainer.service.canCreate = function () {
					return setReadonlyor();
				};
				serviceContainer.service.canDelete = function () {
					return setReadonlyor();
				};

				serviceContainer.service.getDefaultprcStockTranType = function getDefaultprcStockTranType() {
					var tranType2RubCats = basicsLookupdataLookupDescriptorService.getData('PrcStockTranType2RubCat');
					let tranTypeDefault;
					if (tranType2RubCats) {
						let tranType2RubCat = _.find(tranType2RubCats, {IsDefault: true});
						if (_.isUndefined(tranType2RubCat)) {
							tranTypeDefault = _.head(Object.values(tranType2RubCats)).PrcStockTransactionTypeFk;
						} else {
							tranTypeDefault = tranType2RubCat.PrcStockTransactionTypeFk;
						}
					}
					return tranTypeDefault;
				};

				serviceContainer.service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk) {
					return procurementPesHeaderService.getVatPercentWithTaxCodeMatrix(taxCodeFk);
				};

				serviceContainer.service.getMaterialLookupSelectedItems=function(selectedItems){
					// TODO DEV-39063 - select multiple material enhance
					var  creationData={};
					initCreationData(creationData,{},null);
					var materialIds=[];
					var addItems=_.slice(selectedItems,1);
					if (!addItems.length) {
						return;
					}

					_.forEach(addItems,function(item){
						materialIds.push(item.Id);}
					);
					var createPrcItemParameter={
						itemCreateParameter:creationData,
						materialIds:materialIds
					};
					basicsLookupdataLookupDescriptorService.updateData('MaterialCommodity', addItems);
					$http.post(globals.webApiBaseUrl + 'procurement/pes/item/getmaterialstopesitem',createPrcItemParameter).then(function(response){
						var itemList=response.data;
						const validatePromise = [];
						serviceContainer.data.supportUpdateOnSelectionChanging = false;
						_.forEach(itemList,function(item){
							serviceContainer.data.itemList.push(item);
							platformDataServiceActionExtension.fireEntityCreated(serviceContainer.data, item);
							serviceContainer.service.markItemAsModified(item);
							validatePromise.push(validator.asyncValidateMdcMaterialFk(item, item.MdcMaterialFk));
						});
						Promise.all(validatePromise).finally(function() {
							serviceContainer.data.supportUpdateOnSelectionChanging = true;
						});

					}, function(err){
						window.console.error(err);
					});
				};

				serviceContainer.service.setVat = function setVat(items) {
					if (!_.isArray(items)) {
						items = [items];
					}
					_.forEach(items, function(item) {
						let vatPercent = serviceContainer.service.getVatPercentWithTaxCodeMatrix(item.MdcTaxCodeFk);
						item.Vat = round(roundingType.Vat, mathBignumber(item.Total).mul(vatPercent).div(100));
						item.VatOC = round(roundingType.VatOC, mathBignumber(item.TotalOc).mul(vatPercent).div(100));
					});
				};

				var exchangeUpdated = function exchangeUpdated(e, args) {
					getPriceConditionService();
					_.forEach(serviceContainer.service.getList(), function (item) {
						item.Price = itemCalculationHelper.getPriceByPriceOc(item, args.ExchangeRate);
						item.PriceGross = itemCalculationHelper.getPriceGrossByPriceGrossOc(item, args.ExchangeRate);
						item.calculateTotalLater = true;
						var originalExtra = item.PriceExtra;
						var originalExtraOc = item.PriceExtraOc;
						priceConditionDataService.recalculate(item, item.PrcPriceConditionFk).then(function () {
							var isResetPriceExtra = (item.PriceExtra !== originalExtra || item.PriceExtraOc !== originalExtraOc);
							var notRecalTotalAndGross = false;
							var dontReCalcuPricGrossOc = true;
							serviceContainer.service.calculateTotalAndVatAndGross(item, notRecalTotalAndGross, isResetPriceExtra, dontReCalcuPricGrossOc);
							serviceContainer.service.markItemAsModified(item);
							item.calculateTotalLater = false;
						}).finally(function () {
						});
					});
				};
				if (procurementPesHeaderService.registerExchangeRateChanged) {
					procurementPesHeaderService.registerExchangeRateChanged(exchangeUpdated);
				}

				serviceContainer.service.inputWhichField = {};
				serviceContainer.service.setInputWhichField = function(inputFieldObj) {
					serviceContainer.service.inputWhichField = inputFieldObj;
				};
				serviceContainer.service.getInputWhichField = function() {
					return serviceContainer.service.inputWhichField;
				};

				var company = null;

				function loadList() {
					var list = serviceContainer.service.getList();
					if (list && list.length) {
						serviceContainer.service.load();
					}
				}
				if (procurementPesHeaderService.onRecalculationItemsAndBoQ) {
					procurementPesHeaderService.onRecalculationItemsAndBoQ.register(loadList);
				}

				function getPriceConditionService() {
					if (!priceConditionDataService) {
						priceConditionDataService = $injector.get('procurementPesItemPriceConditionDataService');
					}
				}

				function mathBignumber(val) {
					return math.bignumber(val);
				}

				function round(roundingField, value) {
					return _.isNaN(value) ? 0 : itemCalculationHelper.round(roundingField, value);
				}

				function canReadonlyByPrcItemBasItemType(entity) {
					var parentItem;
					let selectedItem = serviceContainer.service.getSelected();
					if(selectedItem){
						if(selectedItem.PrcItemFk){
							return  $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/getbyid?id=' + selectedItem.PrcItemFk).then(function (response) {
								parentItem = response.data;
								let columns = Object.keys(selectedItem);
								if(parentItem.BasItemTypeFk ===7) {
									entity.BasUomFk = 0;
									entity.BasUomPriceUnitFk = 0;
									entity.AlternativeUomFk = 0;
									entity.AlternativeQuantity = 0;
									entity.SellUnit = 0;
									entity.Quantity = 0;
									entity.Price = 0;
									entity.PriceOc = 0;
									entity.PriceGross = 0;
									entity.PriceGrossOc = 0;
									entity.Total = 0;
									entity.TotalOc = 0;
									entity.TotalGross = 0;
									entity.TotalGrossOc = 0;
									entity.TotalPrice = 0;
									entity.TotalPriceOc = 0;
									entity.TotalPriceGross = 0;
									entity.TotalPriceGrossOc = 0;
									entity.FactorPriceUnit = 0;
									entity.QuantityRemaining = 0;
									entity.QuantityRemainingUi = 0;
									entity.QuantityConverted = 0;
									entity.PriceExtra = 0;
									entity.PriceExtraOc = 0;
									entity.Discount = 0;
									entity.DiscountAbsolute = 0;
									entity.DiscountAbsoluteGross = 0;
									entity.DiscountAbsoluteGrossOc = 0;
									entity.DiscountAbsoluteOc = 0;
									entity.DiscountSplit = 0;
									entity.DiscountSplitOc = 0;
									entity.TotalNoDiscount = 0;
									entity.TotalCurrencyNoDiscount = 0;
									entity.QuantityConfirm = 0;
									entity.ProvisionPercent = 0;
									entity.QuantityDelivered = 0;
									entity.TotalDelivered = 0;
									entity.TotalOcDelivered = 0;
									let isReadonly;
									_.forEach(columns, (item) => {
										if (item === 'Itemno' || item === 'Description1' || item === 'Description2' || item === 'PrcItemSpecification' || item === 'UserDefined1'
											|| item === 'UserDefined2' || item === 'UserDefined3' || item === 'UserDefined4' || item === 'UserDefined5') {
											isReadonly = false;
										} else {
											isReadonly = true;
										}
										platformRuntimeDataService.readonly(selectedItem, [{field: item, readonly: isReadonly}]);
									});
									serviceContainer.service.canEdit = false;
								}else{
									serviceContainer.service.canEdit = true;
								}
							});
						}
					}

				}

				$injector.get('procurementCommonMaterialSpecificationFactory').getItemSpecification(serviceContainer.service);
				// add the onCostGroupCatalogsLoaded messenger
				serviceContainer.service.onCostGroupCatalogsLoaded = new PlatformMessenger();
				return serviceContainer.service;
			}
		]);
})(angular);
