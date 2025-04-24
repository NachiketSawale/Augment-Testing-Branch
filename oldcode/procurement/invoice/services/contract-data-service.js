(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,moment,globals,_,$ */
	var modName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('procurementInvoiceContractDataService',
		['$q', 'platformDataServiceFactory', 'procurementInvoiceHeaderDataService', 'procurementContextService',
			'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'platformRuntimeDataService',
			'procurementInvoiceContractReadOnlyProcessor', 'basicsLookupdataLookupDataService', '$http', 'invoiceHeaderElementValidationService',
			'procurementInvoiceCertificateDataService', 'basicsLookupdataLookupDescriptorService',
			'platformObjectHelper', 'math', '$injector', 'prcCommonItemCalculationHelperService', 'platformContextService',
			'prcCommonGetVatPercent',
			'prcGetIsCalculateOverGrossService', 'procurementCommonHelperService',
			function ($q, dataServiceFactory, parentService, moduleContext, lookupDescriptorService, basicsLookupdataLookupFilterService,
				platformRuntimeDataService, readonlyProcessor, lookupService, $http, invoiceHeaderValidationService, procurementInvoiceCertificateDataService, basicsLookupdataLookupDescriptorService,
				platformObjectHelper, math, $injector, itemCalculationHelper, platformContextService,
				prcCommonGetVatPercent,
				prcGetIsCalculateOverGrossService, procurementCommonHelperService) {
				var serviceContainer;
				var service;
				let roundingType = itemCalculationHelper.roundingType;
				let contractRoundingMethod = $injector.get('procurementCommonConstantValues').contractRoundingMethod;

				// var baseNchangeOrderPrcHeaderIds = {};
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(modName),
						httpCRUD: {route: globals.webApiBaseUrl + 'procurement/invoice/contract/'},
						dataProcessor: [readonlyProcessor, {processItem: initprjstockReadOnly}],
						serviceName: 'procurementContractHeaderDataService',
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									/** @namespace readData.ConHeaderView */
									var conHeaders = readData.ConHeaderView ? readData.ConHeaderView : [];
									angular.forEach(conHeaders, function (item) {
										item.DateOrdered = moment.utc(item.DateOrdered);
									});
									var items = readData.Main || [];
									angular.forEach(items, function (item) {
										if(!_.isNil(item.PrcItemFk)){
											if(!_.isNil(item.BasItemTypeFk)){
												if(item.BasItemTypeFk === 7){
													service.canReadonlyByPrcItemBasItemType(item, true);
												}else{
													initData(conHeaders,items);
												}
											}else{
												initData(conHeaders,items);
											}
										}else{
											initData(conHeaders,items);
										}
									});
									setAdditionalGross(items);
									items = serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
									return items;
								},
								initCreationData: function (creationData) {
									var invoiceHeaderItem = parentService.getSelected();
									if (invoiceHeaderItem) {
										creationData.mainItemId = invoiceHeaderItem.Id;
										creationData.conHeaderId = invoiceHeaderItem.ConHeaderFk;
									}
								},
								handleCreateSucceeded: function handleCreateSucceeded(newData) {
									newData.Percentage = 0;
									if (newData.OrderQuantity) {
										newData.Percentage = itemCalculationHelper.getPercentageForInv(newData.Quantity, newData.OrderQuantity);
									}
									// #147304 - 0 is invalid value
									if (newData.ConHeaderFk === 0) {
										newData.ConHeaderFk = -1;
									}
								}
							}
						},
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusCreateRightToContract');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToContract');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							},
							canDeleteCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusDeleteRightToContract');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToContract');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							}
						},
						entityRole: {
							node: {
								itemName: 'InvContract',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						filterByViewer: true
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;
				new procurementCommonHelperService.addAutoSaveHandlerFunctions(service, serviceContainer);

				var filters = [
					{
						key: 'inv-boq-con-merge-boq-filter',
						serverSide: true,
						serverKey: 'inv-boq-con-merge-boq-filter',
						fn: function (item) {
							var currentList = service.getList();
							var selectedItem = serviceContainer.service.getSelected();
							var currentItem = item ? item : selectedItem;
							// var value = service.getLookupValue(currentItem, 'ConHeaderFk:ConHeaderView');
							var notPrcBoqIds = [];
							var notBoqItemPrjBoqIds = [];
							// var prcHeaderIds = getBaseNChangeOrderPrcHeaderIds();

							if (currentList) {
								var prcBoqs = basicsLookupdataLookupDescriptorService.getData('PrcMergeBoqView');
								if (prcBoqs) {
									_.forEach(currentList, function (value) {
										if (!value.PrcBoqFk) {
											return;
										}
										var boq = _.find(prcBoqs, {Id: value.PrcBoqFk});
										if (boq) {
											var boqList = _.filter(prcBoqs, {BoqItemPrjBoqFk: boq.BoqItemPrjBoqFk});
											if (boqList && boqList.length > 0) {
												var notPrcBoqIdList = _.uniq(_.map(boqList, 'Id'));
												var notBoqItemPrjBoqIdList = _.uniq(_.map(boqList, 'BoqItemPrjBoqFk'));
												notPrcBoqIds = notPrcBoqIds.concat(notPrcBoqIdList);
												notBoqItemPrjBoqIds = notBoqItemPrjBoqIds.concat(notBoqItemPrjBoqIdList);
											}
										}
									});
								}
							}

							return {
								isCanceled: false,
								// isDelivered: false,
								notPrcBoqIds: notPrcBoqIds,
								// prcHeaderIds: prcHeaderIds,
								notBoqItemPrjBoqIds: notBoqItemPrjBoqIds,
								contractId: currentItem.ConHeaderFk
							};
						}
					},
					{
						key: 'prc-invoice-item-filter',
						serverKey: 'prc-invoice-item-filter',
						serverSide: true,
						fn: function (dataContext) {
							return {
								IsCanceled: false,
								// prcHeaderIds: getBaseNChangeOrderPrcHeaderIds(dataContext.ConHeaderFk)
								// PrcHeaderFk: dataContext.PrcHeaderId
								ContractId: dataContext.ConHeaderFk
							};
							// return 'IsCanceled=false And IsDelivered=false And PrcHeaderFk=' + dataContext.PrcHeaderId;
						}
					},
					{
						key: 'prc-invoice-boq-filter',
						serverSide: true,
						fn: function (dataContext) {
							return 'IsCanceled=false And IsDelivered=false And PrcHeaderFk=' + dataContext.PrcHeaderId;
						}
					},
					{
						key: 'prc-invoice-stock-filter',
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
						key: 'prc-invoice-stocklocation-filter',
						serverSide: true,
						fn: function () {
							var projectstockview = basicsLookupdataLookupDescriptorService.getData('ProjectStock2ProjectStock');
							var currentItem = serviceContainer.service.getSelected() || {};
							/** @namespace projectstockview[currentItem.PrjStockFk].Islocationmandatory */
							// noinspection JSUnresolvedVariable
							if (projectstockview && projectstockview[currentItem.PrjStockFk] && projectstockview[currentItem.PrjStockFk].Islocationmandatory) {
								return {ProjectStockFk: currentItem.PrjStockFk};
							} else {
								return {};
							}
						}
					},
					{
						key: 'prc-invoice-transaction-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected() || {};
							if (currentItem) {
								var prcItem = _.first(_.filter(basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup'), function (item) {
									return item.Id === currentItem.PrcItemFk;
								}));
								// return {PrjStockFk: currentItem.PrjStockFk, Inv2contractFk: currentItem.Id};
								return {
									PrjStockFk: currentItem.PrjStockFk,
									MdcMaterialFk: prcItem ? prcItem.MdcMaterialFk : null
								};
							} else {
								return {PrjStockFk: 0};
							}
						}
					},
					{
						key: 'prc-invoice-transactiontype-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected() || {};
							if (currentItem) {
								return {PesItemFk: currentItem.Id};
							} else {
								return {};
							}
						}
					},
					{
						key: 'prc-invoice-item-transactiontype-filter',
						serverSide: true,
						fn: function () {
							var currentItem = parentService.getSelected();
							var filter = '';
							if (currentItem && currentItem.PrcConfigurationFk !== null) {
								filter = 'PrcConfiguration=' + currentItem.PrcConfigurationFk;
							}
							return filter;
						}
					},
					{
						key: 'procurement-invoice-item-fixed-asset-filter',
						serverSide: true,
						fn: function (currentItem) {
							if (currentItem && currentItem.IsAssetManagement) {
								var etmContextFk = $injector.get('prcInvoiceGetEtmCompanyContext').getEtmContextFk();
								return etmContextFk ? (' EtmContextFk = ' + etmContextFk) : ' EtmContextFk = -1';
							} else {
								return ' EtmContextFk = -1';
							}
						}
					},{
						key: 'prc-invoice-item-stock-type-filter',
						serverSide: false,
						fn: function (item) {
							return item.IsProcurement;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				service.updateReadOnly = function (item) {
					readonlyProcessor.processItem(item);
				};


				service.provisionReadOnly = function provisionReadOnly(item) {
					if (item.PrjStockFk) {
						var value = item.PrjStockFk;
						$http.get(globals.webApiBaseUrl + 'project/stock/material/getprovisionallowed?projectStockId=' + value
						).then(function (res) {
							if (res) {
								var isReadonly = !res.data;
								platformRuntimeDataService.readonly(item, [{
									field: 'ProvisionPercent',
									readonly: isReadonly
								}, {field: 'ProvisionTotal', readonly: isReadonly}]);
								if (isReadonly === true) {
									item.ProvisionPercent = 0;
									item.ProvisionTotal = 0;
									service.gridRefresh();
								}
							}
						}
						);
					}
				};

				function initprjstockReadOnly(item) {
					if (item.PrjStockFk) {
						var readOnyStatus, itemStatus = parentService.getItemStatus();
						if (itemStatus) {
							readOnyStatus = itemStatus.IsReadOnly;
						} else {
							readOnyStatus = false;
						}
						service.setPrjstockReadOnly(item, readOnyStatus);
						if (!readOnyStatus) {
							service.provisionReadOnly(item);
							service.setPrcStockTransactionType(item);
						}
						service.gridRefresh();
					} else {
						service.selectprjstockReadOnly(item).then(function (response) {
							if (response.data) {
								var val = response.data;
								if (val.PrjStockFk) {
									if (val.PrjStockFk !== 0) {
										item.PrjStockFk = val.PrjStockFk;
										item.PrjStockLocationFk = val.PrjStockLocationFk;
										item.PrcStockTransactionTypeFk = val.PrcStockTransactionTypeFk;
									}
									service.setPrjstockReadOnly(item, false);
								} else {
									service.setPrjstockReadOnly(item, true);
								}
								service.provisionReadOnly(item);
								service.setPrcStockTransactionType(item);
								service.gridRefresh();
							}

						});
					}
				}

				function initData(conHeaders,items) {
					if (conHeaders.length > 0) {
						angular.forEach(items, function (item) {
							if (item.ConHeaderFk) {
								var conHeader = _.find(conHeaders, function (conHeader) {
									return conHeader.Id === item.ConHeaderFk;
								});
								if (conHeader) {
									item.PrcHeaderId = conHeader.PrcHeaderId;
								}
							}

							item.Percentage = 0;
							if (item.OrderQuantity) {
								item.Percentage = itemCalculationHelper.getPercentageForInv(item.Quantity, item.OrderQuantity);
							}
							initprjstockReadOnly(item);
						});
					}
				}

				var _requestData;
				var _setData;

				service.selectprjstockReadOnly = function selectprjstockReadOnly(entity) {
					var defer = $q.defer();
					var parentSeleted = parentService.getSelected();
					var requestData = {
						PrcStructureFk: entity.PrcStructureFk,
						ControllingUnitFk: entity.ControllingUnitFk,
						PrcItemFk: entity.PrcItemFk,
						ConHeaderFk: entity.ConHeaderFk,
						InvHeaderPrcConfigurationFk: parentSeleted ? parentSeleted.PrcConfigurationFk : null
					};
					if (_.isEqual(_requestData, requestData)) {
						defer.resolve(_setData);
					} else {
						_requestData = requestData;
						_setData = $http.post(globals.webApiBaseUrl + 'procurement/invoice/contract/getisstock', requestData);
						defer.resolve(_setData);
					}
					return defer.promise;
				};

				function setFieldReadOnly(item, model, isReadOnly) {
					var properties = [];
					$.each(model, function (i) {
						properties.push({field: model[i], readonly: isReadOnly});
					});
					platformRuntimeDataService.readonly(item, properties);
				}


				service.setPrjstockReadOnly = function setPrjstockReadOnly(entity, isstock) {
					if (entity.PrcBoqFk) {
						platformRuntimeDataService.readonly(entity, [{
							field: 'IsAssetManagement',
							readonly: true
						}]);
					}
					var fields = ['PrjStockFk', 'PrcStockTransactionTypeFk', 'PrcStockTransactionFk', 'PrjStockLocationFk', 'ProvisionPercent', 'ProvisonTotal', 'LotNo', 'ExpirationDate'];
					setFieldReadOnly(entity, fields, isstock);
				};


				service.setPrcStockTransactionType = function setPrcStockTransactionType(entity) {
					var fields = ['PrcStockTransactionFk'];
					var type = entity.PrcStockTransactionTypeFk;
					var transactionType = basicsLookupdataLookupDescriptorService.getData('PrcStocktransactiontype');
					if (type === 1) {
						// case 1-->Material Receipt
						$http.get(globals.webApiBaseUrl + 'procurement/pes/item/getmaterial2projectstock?prcItemId=' + entity.PrcItemFk + '&&projectStockId=' + entity.PrjStockFk + '&&quantity=' + entity.Quantity).then(function (response) {
							if (response.data) {
								var item = response.data;
								if (item) {
									/** @namespace item.IsInStock2Material */
									setFieldReadOnly(entity, fields, !item.IsInStock2Material);
								}
							}
						});
					} else if (type === 2) {
						// case 2-->//Incidental Acquisition Expense
						setFieldReadOnly(entity, fields, false);
					} else {
						// case other-->when type_isdela===true
						var _type = _.find(transactionType, {Id: entity.PrcStockTransactionTypeFk});
						setFieldReadOnly(entity, fields, _.isUndefined(_type) ? true : !_type.IsDelta);
					}
				};

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
					service.recalcuteContract();
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				service.recalcuteContract = function recalcuteContract() {
					var netOc = 0, net = 0, grossOc = 0, gross = 0;
					_.forEach(service.getList(), function (item) {
						let constant = getContractRoundingMethod(item);

						netOc += round(roundingType.TotalValueOc, item.TotalValueOc, constant);
						net += round(roundingType.TotalValue, item.TotalValue, constant);
						grossOc += round(roundingType.TotalValueGrossOc, item.TotalValueGrossOc, constant);
						gross += round(roundingType.TotalValueGross, item.TotalValueGross, constant);
					});

					invoiceHeaderValidationService.recalcuteContract(netOc, net, grossOc, gross);
				};

				service.createOtherContracts = function createOtherContracts(currentItem) {
					var parentSeleted = parentService.getSelected();
					var conHeaderId = currentItem && currentItem.ConHeaderFk ? currentItem.ConHeaderFk : parentSeleted.ConHeaderFk;
					if (!conHeaderId) {
						return;
					}
					var items = _.filter(service.getList(), {ConHeaderFk: conHeaderId});
					var prcItemIds = [];
					_.forEach(items, function (item) {
						if (item.PrcItemFk) {
							prcItemIds.push(item.PrcItemFk);
						}
					});

					var filter = {
						IsCanceled: false,
						IsDelivered: false,
						ContractId: conHeaderId,
						InvHeaderId: parentSeleted.Id,
					};

					$http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getitems4create', filter).then(function (result) {
						var foundPrcItems = result.data;

						if (!angular.isArray(foundPrcItems)) {
							return;
						}

						lookupDescriptorService.updateData('PrcItemMergedLookup', foundPrcItems);

						var allPrcItemIds = [];
						_.forEach(foundPrcItems, function (item) {
							allPrcItemIds.push(item.Id);
						});

						var remainingIds = _.difference(allPrcItemIds, prcItemIds);

						if (remainingIds.length > 0) {
							var invHeader = parentService.getSelected();
							if (invHeader && invHeader.Id) {
								var creationData = {
									mainItemId: invHeader.Id,
									conHeaderId: conHeaderId,
									prcItemIds: remainingIds,
									exchangeRate: invHeader.ExchangeRate,
									headerConfigurationFk: invHeader.PrcConfigurationFk
								};

								var ValidateService = $injector.get('procurementInvoiceContractValidationService');
								$http.post(globals.webApiBaseUrl + 'procurement/invoice/contract/createcontracts', creationData
								).then(function (response) {
									if (angular.isArray(response.data) && response.data.length > 0) {
										var GrpSetDTLDataService = $injector.get('procurementInvGrpSetDTLByContractDataService');
										// eslint-disable-next-line no-unused-vars
										var refreshGrid = false, toFillItems = [];
										_.forEach(response.data, function (entity) {
											var item = entity.InvContract;
											toFillItems = _.filter(items, {PrcItemFk: null, PrcBoqFk: null});
											if (toFillItems.length > 0) {
												setGross(item);
												service.overrideDataItem(toFillItems[0], item);
												initprjstockReadOnly(toFillItems[0]);
												refreshGrid = true;
												GrpSetDTLDataService.roadData(item, entity.controllingStructureGrpSetDTLToSave);
												ValidateService.asyncValidateControllingUnitFk(toFillItems[0], toFillItems[0].ControllingUnitFk, 'ControllingUnitFk');
											} else {
												serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, {});
												/** @namespace entity.controllingStructureGrpSetDTLToSave */
												GrpSetDTLDataService.roadData(item, entity.controllingStructureGrpSetDTLToSave);

												ValidateService.asyncValidateControllingUnitFk(item, item.ControllingUnitFk, 'ControllingUnitFk');
											}
										});
									}
								}
								);
							}
						}
					});
				};

				service.overrideDataItem = function (source, target) {
					var keep = {
						Id: source.Id,
						InvHeaderFk: source.InvHeaderFk,
						InsertedAt: source.InsertedAt,
						InsertedBy: source.InsertedBy,
						UpdatedAt: source.UpdatedAt,
						UpdatedBy: source.UpdatedBy,
						Version: source.Version
					};
					angular.extend(source, target);
					angular.extend(source, keep);
					var controllingUnits = basicsLookupdataLookupDescriptorService.getData('Controllingunit');
					if (controllingUnits && source.ControllingUnitFk) {
						var controllingUnit = _.find(controllingUnits, {Id: source.ControllingUnitFk});
						if (controllingUnit) {
							platformRuntimeDataService.readonly(source, [{
								field: 'IsAssetManagement',
								readonly: !controllingUnit.Isassetmanagement
							}]);
						}
					}
					service.markItemAsModified(source);
				};

				// service.setBaseNChangeOrderPrcHeaderIdsByConHeaderId = setBaseNChangeOrderPrcHeaderIdsByConHeaderId;
				// service.getBaseNChangeOrderPrcHeaderIds = getBaseNChangeOrderPrcHeaderIds;
				// service.registerSelectionChanged(onSelectionChanged);
				service.getLookupValue = getLookupValue;

				function onModuleReadonlyStatusChange(key) {
					if (key !== moduleContext.moduleStatusKey) {
						return;
					}

					angular.forEach(service.getList(), function (item) {
						readonlyProcessor.processItem(item);
					});
				}

				var refreshData = function refreshData() {
					service.gridRefresh();
				};

				// noinspection JSUnusedLocalSymbols
				function exchangeUpdated(e, args) {
					var exchangeRate = args.ExchangeRate;
					var list = service.getList();
					_.forEach(list, function (item) {
						let constant = getContractRoundingMethod(item);
						item.TotalValue = itemCalculationHelper.getAmountNonOcByOc(item.TotalValueOc, exchangeRate, constant);
						item.TotalPrice = itemCalculationHelper.getAmountNonOcByOc(item.TotalPriceOc, exchangeRate, constant, roundingType.Inv2Con_TotalPrice);// specific
						item.Price = itemCalculationHelper.getUnitRateNonOcByOc(item.PriceOc, exchangeRate, constant);

						var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
						item.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.Price, vatPercent, constant);
						item.PrcItemTotalGross = exchangeRate === 0 ? 0 : itemCalculationHelper.getTotalGrossForInv(item.Price, item.OrderQuantity, 0, 0, vatPercent, 1, 1, item.PrcItemTotalGrossOc, exchangeRate, constant);
						item.TotalValueGross = round(roundingType.TotalValueGross, math.bignumber(item.Quantity).mul(item.PriceGross).toNumber(), constant);
						service.markItemAsModified(item);
					});

					service.recalcuteContract();
				}

				function setConHeaderToCertificate() {
					procurementInvoiceCertificateDataService.setConHeaderFromItems(_.map(service.getList(), 'ConHeaderFk'));
				}

				procurementInvoiceCertificateDataService.getConHeaderDataFromItems.register(setConHeaderToCertificate);
				moduleContext.moduleValueChanged.register(onModuleReadonlyStatusChange);
				parentService.refreshContractItems.register(refreshData);
				parentService.exchangeRateChangedEvent.register(exchangeUpdated);


				function setReadonlyor() {
					var Isreadonly = true;
					var selectedItem = parentService.getSelected();
					/** @namespace selectedItem.InvStatus */
					if (selectedItem && selectedItem.InvStatus) {
						Isreadonly = !selectedItem.InvStatus.IsReadOnly;
					}
					return Isreadonly;
				}

				service.canCreate = function () {
					var rightByStatus = parentService.haveRightByStatus('InvStatusCreateRightToContract');
					var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToContract');
					if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
						return true;
					}
					var notReadonly = setReadonlyor();
					return notReadonly && rightByStatus.right;
				};
				service.canDelete = function () {
					var rightByStatus = parentService.haveRightByStatus('InvStatusDeleteRightToContract');
					var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToContract');
					if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
						return true;
					}
					var notReadonly = setReadonlyor();
					return notReadonly && rightByStatus.right;
				};
				service.canCreateContractItem = function () {
					return service.canCreate();
				};
				service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					return parentService.getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk);
				};

				service.refreshAccountInfo = function (items) {
					let dtos = [];

					if (items) {
						dtos = items;
					} else {
						dtos = service.getList();
					}

					if (dtos.length) {
						$http.post(globals.webApiBaseUrl + 'procurement/invoice/contract/refreshaccount', {
							Dtos: dtos
						}).then(res => {
							res.data.Dtos.forEach(item => {
								const target = _.find(dtos, {
									Id: item.Id
								});

								if (target) {
									target.Account = item.Account;
									target.AccountDesc = item.AccountDesc;
								}
							});
							service.gridRefresh();
						});
					}
				};

				parentService.onUpdateSucceeded.register(()=> {
					service.refreshAccountInfo();
				});

				function vatGroupChanged() {
					var list = service.getList();
					if (list && list.length) {
						setGross(list);
						serviceContainer.service.gridRefresh();
					}
					service.recalcuteContract();
				}

				service.canReadonlyByPrcItemBasItemType=(entity,isReadonly=false)=> {
					let columns = Object.keys(entity);
					entity.AlternativeUomFk = 0;
					entity.AlternativeQuantity = 0;
					entity.Quantity = 0;
					entity.Price = 0;
					entity.PriceOc = 0;
					entity.PriceGross = 0;
					entity.TotalPrice = 0;
					entity.TotalPriceOc = 0;
					entity.PriceExtra = 0;
					entity.DiscountSplit = 0;
					entity.DiscountSplitOc = 0;
					entity.ProvisionPercent = 0;
					entity.TotalValue = 0;
					entity.ProvisionTotal = 0;
					entity.TotalValueOc = 0;
					entity.TotalValueGross = 0;
					entity.TotalValueGrossOc = 0;
					entity.OrderQuantity = 0;
					entity.OrderQuantityConverted = 0;
					entity.PrcItemQuantity = 0;
					entity.PrcItemTotalGross = 0;
					entity.PrcItemTotalGrossOc = 0;
					entity.PriceOcGross = 0;
					_.forEach(columns, (item) => {
						if (item === 'Itemno' || item === 'Description1' || item === 'Description2' || item === 'PrcItemSpecification' || item === 'UserDefined1'
							|| item === 'UserDefined2'|| item === 'UserDefined3'|| item === 'UserDefined4'|| item === 'UserDefined5') {
							isReadonly = false;
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: isReadonly}]);
						}
						platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
					});
				};

				service.readBasItemTypeFk = (parentItem)=> {
					return $q.when($http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/getbyid?id=' + parentItem.PrcItemFk));
				};

				parentService.vatGroupChanged.register(vatGroupChanged);
				return service;

				function getLookupValue(item, typeKeys) {
					var tks = typeKeys.split(',');
					while (item && Object.getOwnPropertyNames(item).length && tks.length) {
						var typeKey = tks.shift().split(':');
						if (typeKey.length === 2) {
							var key = platformObjectHelper.getValue(item, typeKey[0]);
							var items = basicsLookupdataLookupDescriptorService.getData(typeKey[1]);
							if (!key || !items || !items[key]) {
								item = {};
							} else {
								item = items[key] || {};
							}
						}
					}
					return item;
				}

				function setAdditionalGross(items) {
					if (!items) {
						return;
					}
					if (!_.isArray(items)) {
						items = [items];
					}

					var exchangeRate = 1;
					var parentSelected = parentService.getSelected();
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (parentSelected && parentSelected.ExchangeRate) {
						exchangeRate = parentSelected.ExchangeRate;
					}
					_.forEach(items, function (item) {
						var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
						let constant = getContractRoundingMethod(item);
						item.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.Price, vatPercent, constant);
						item.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.PriceOc, vatPercent, constant);
						if (item.PrcItemFk) {
							var prcItem = service.getLookupValue(item, 'PrcItemFk:PrcItemMergedLookup');
							if (prcItem) {
								if (isOverGross) {
									item.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGross, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
									item.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGrossOc, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
								}
							}
							item.PrcItemTotalGross = item.PrcItemTotalGross ? item.PrcItemTotalGross : 0;
							item.PrcItemTotalGrossOc = item.PrcItemTotalGrossOc ? item.PrcItemTotalGrossOc : 0;
						} else {
							item.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(item.PriceOc, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, constant);
							item.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(item.Price, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, item.PrcItemTotalGrossOc, exchangeRate, constant);
						}
					});
				}

				function setGross(items) {
					if (!items) {
						return;
					}
					if (!_.isArray(items)) {
						items = [items];
					}

					var exchangeRate = 1;
					var parentSelected = parentService.getSelected();
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					if (parentSelected && parentSelected.ExchangeRate) {
						exchangeRate = parentSelected.ExchangeRate;
					}
					_.forEach(items, function (item) {
						var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
						let constant = getContractRoundingMethod(item);
						item.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.Price, vatPercent, constant);
						item.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.PriceOc, vatPercent, constant);
						if (item.PrcItemFk) {
							var prcItem = service.getLookupValue(item, 'PrcItemFk:PrcItemMergedLookup');
							if (prcItem) {
								if (isOverGross) {
									item.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGross, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
									item.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGrossOc, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
								}
							}
							item.PrcItemTotalGross = item.PrcItemTotalGross ? item.PrcItemTotalGross : 0;
							item.PrcItemTotalGrossOc = item.PrcItemTotalGrossOc ? item.PrcItemTotalGrossOc : 0;
							item.TotalValueGross = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValue, vatPercent, constant);
							item.TotalValueGrossOc = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValueOc, vatPercent, constant);
						} else {
							item.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(item.PriceOc, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, constant);
							item.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(item.Price, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, item.PrcItemTotalGrossOc, exchangeRate, constant);
							item.TotalValueGross = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValue, vatPercent, constant);
							item.TotalValueGrossOc = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValueOc, vatPercent, constant);
						}
					});
				}

				function getContractRoundingMethod(entity) {
					if (entity && entity.PrcBoqFk) {
						return contractRoundingMethod.ForBoq;
					}
					if (entity && entity.PrcItemFk) {
						return contractRoundingMethod.ForPrcItem;
					}
					return contractRoundingMethod.ForNull;
				}

				function round(roundingField, value, constant) {
					return _.isNaN(value) ? 0 : itemCalculationHelper.round(roundingField, value, constant);
				}
			}]);
})(angular);
