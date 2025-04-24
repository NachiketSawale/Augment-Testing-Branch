(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name procurementCommonTotalDataService
	 * @function
	 * @requires procurementCommonDataServiceFactory,basicsCommonReadDataInterceptor, $q, procurementContractTotalHttpService
	 *
	 * description data service of total container
	 */
	angular.module('procurement.common').factory('procurementCommonTotalDataService',
		['$injector', '$translate', '_', 'procurementCommonDataServiceFactory', 'basicsCommonReadDataInterceptor', '$q', '$http', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
			'platformRuntimeDataService', 'procurementContextService', 'basicsLookupdataLookupDataService', 'PlatformMessenger', 'procurementCommonTotalReadonlyProcessor',
			'basicsProcurementConfigurationTotalKinds', 'basicsCommonMandatoryProcessor', 'prcCommonCalculationHelper', 'platformPermissionService', 'prcCommonGetVatPercent', '$timeout',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($injector, $translate, _, dataServiceFactory, readDataInterceptor, $q, $http, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService,
				runtimeDataService, moduleContext, lookupDataService, PlatformMessenger, ReadonlyProcessor, totalKinds, mandatoryProcessor, prcCommonCalculationHelper, platformPermissionService, prcCommonGetVatPercent, $timeout) {

				// create a new data service object
				function constructorFn(parentService) {
					if (parentService.name === 'procurement.pes.boq') {
						return {};
					}
					// properties
					var route, isPackage;
					var showAll = true;
					var isLoad = true;
					var getSameTotalsFromContractsCach = {};
					var getSameTotalsFromPackagesCach = {};
					// there has different service route in different module
					switch (parentService.name) {
						case 'procurement.contract':
							route = 'procurement/contract/total/';
							isPackage = false;
							isLoad = platformPermissionService.hasRead('b19c1f681eee490ebb3ac023854db68d');
							break;
						case 'procurement.requisition':
						case 'procurement.pricecomparison.quote.requisition':
						case 'procurement.quote.requisition':
							route = 'procurement/requisition/total/';
							isPackage = false;
							isLoad = platformPermissionService.hasRead('985f496b39eb4cd08d9cd4f9f3c8d1e4');
							break;
						case 'procurement.package':
							route = 'procurement/package/total/';
							parentService = moduleContext.getLeadingService();
							isPackage = true;
							isLoad = platformPermissionService.hasRead('35dbeb11e37b46869a4decc4fd01f56e');
							break;
					}

					var readonlyProcessor = new ReadonlyProcessor(parentService);
					var service;
					var getConfigurationFK;
					// service configuration
					var serviceOptions = {
						flatLeafItem: {
							module: angular.module('procurement.common'),
							serviceName: 'procurementCommonTotalDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + route,
								initReadData: function initReadData(readData) {
									let selectedParentItem = parentService.getSelected();
									let mainItemId = selectedParentItem.Id;
									let parentName = parentService.name;
									if (_.includes(['procurement.pricecomparison.quote.requisition', 'procurement.quote.requisition'], parentName)) {
										mainItemId = selectedParentItem.ReqHeaderFk;
									}
									readData.filter = '?MainItemId=' + mainItemId + '&ConfigurationFk=' + getConfigurationFK() + '&showAll=' + showAll;
								}
							},
							entityRole: {
								leaf: {
									itemName: 'Total',
									parentService: parentService,
									doesRequireLoadAlways: isLoad
								}
							},
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										var header = parentService.getSelected();
										creationData.MainItemId = header.Id;
										creationData.PrcConfigurationFk = getConfigurationFK();
										creationData.ExistsTypes = service.getList().map(function (item) {
											return item.TotalTypeFk;
										});
									}
								}
							},
							actions: {
								canCreateCallBackFunc: function (/* item */) {
									var parentItem = parentService.getSelected();
									return !moduleContext.isReadOnly && !!parentItem && !!parentItem.Id;
								},
								canDeleteCallBackFunc: function () {
									// TODO We need to enable delete total type because when we delete reqheader we need to delete all children belongs to it.
									// TODO We need to enable cascade delete in database later
									var item = service.getSelected();
									var configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: getConfigurationFK()});
									var totalType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
										Id: item.TotalTypeFk,
										PrcConfigHeaderFk: configuration.PrcConfigHeaderFk
									});
									// if has error then allow delete
									if (item.__rt$data && item.__rt$data.errors) {
										return true;
									}
									if (totalType) {
										return !moduleContext.isReadOnly && totalType.PrcTotalKindFk !== 1;
									} else {
										return !moduleContext.isReadOnly;
									}

									// return !moduleContext.isReadOnly;
								},
								delete: true, create: 'flat',
								suppressAutoCreate: true
							},
							dataProcessor: [readonlyProcessor],
							entitySelection: {}
						}
					};

					if (parentService.name === 'procurement.contract') {
						serviceOptions.flatLeafItem.presenter.list.incorporateDataRead = function incorporateDataRead(responseData, data) {
							basicsLookupdataLookupDescriptorService.removeData('ConMainAndChangeOrder');
							if (responseData.ConMainAndChangeOrder) {
								responseData.ConMainAndChangeOrder.Id= -1;
								basicsLookupdataLookupDescriptorService.addData('ConMainAndChangeOrder', [responseData.ConMainAndChangeOrder]);
							}
							var selected = service.getSelected();
							var result = data.handleReadSucceeded(responseData.Main, data, true);
							handleSelection(responseData, selected, data);
							service.resetIsDisableRecaculate();
							return result;
						};
					}
					if (parentService.name === 'procurement.requisition') {
						serviceOptions.flatLeafItem.presenter.list.incorporateDataRead = function incorporateDataRead(responseData, data) {
							basicsLookupdataLookupDescriptorService.removeData('ReqMainAndChangeOrder');
							if (responseData.ReqMainAndChangeOrder) {
								responseData.ReqMainAndChangeOrder.Id = -1;
								basicsLookupdataLookupDescriptorService.addData('ReqMainAndChangeOrder', [responseData.ReqMainAndChangeOrder]);
							}
							return data.handleReadSucceeded(responseData.Main, data, true);
						};
					}

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions, {
						readonly: ['ValueNet', 'ValueNetOc', 'ValueTax', 'ValueTaxOc', 'Gross', 'GrossOc']
					});

					// read service from serviceContainer
					service = serviceContainer.service;

					readDataInterceptor.init(serviceContainer.service, serviceContainer.data);
					service.totalTypeChanged = new PlatformMessenger();
					service.isPackage = isPackage;
					// set status properties
					service.isDirty = false;
					service.getShowAllStatus = function () {
						return showAll;
					};

					// reset recaculate button for procurement contract
					if (parentService.name === 'procurement.contract') {
						service.resetIsDisableRecaculate = function () {
						};

						service.resetSameTotalsFromContractsCach = function resetSameTotalsFromContractsCach() {
							getSameTotalsFromContractsCach = {};
						};
						service.getSameTotalsFromContracts = function getSameTotalsFromContracts(ids, entities) {
							var idStr = ids.sort().join(',');
							if (getSameTotalsFromContractsCach[idStr]) {
								return getSameTotalsFromContractsCach[idStr];
							}
							else {
								if (!entities) {
									entities = parentService.getSelectedEntities();
								}
								getSameTotalsFromContractsCach[idStr] = (function () {
									return $http.post(globals.webApiBaseUrl + 'procurement/contract/total/GetSameTotalsFromContracts', ids).then(function (res) {
										let data = res.data;
										var mainAndChangeOrderText = $translate.instant('procurement.common.paymentSchedule.mainAndChangeOrder');
										_.forEach(entities, function(e) {
											data.unshift({
												Code: mainAndChangeOrderText,
												CommentText: mainAndChangeOrderText,
												GrossOc: e.GrandGrossOc,
												Gross: e.GrandGross,
												HeaderFk: e.Id,
												Id: -1,
												TotalKindFk: -1,
												ValueNet: e.GrandNet,
												ValueNetOc: e.GrandNetOc,
												ValueTax: e.GrandVat,
												ValueTaxOc: e.GrandVatOc
											});
										});
										return data;
									});
								})();
								return getSameTotalsFromContractsCach[idStr];
							}
						};
					}
					if (parentService.name === 'procurement.package') {
						service.resetSameTotalsFromPackagesCach = function resetSameTotalsFromPackagesCach() {
							getSameTotalsFromPackagesCach = {};
						};
						service.getSameTotalsFromPackages = function getSameTotalsFromPackages(ids) {
							var idStr = ids.sort().join(',');
							if (getSameTotalsFromPackagesCach[idStr]) {
								return getSameTotalsFromPackagesCach[idStr];
							}
							else {
								getSameTotalsFromPackagesCach[idStr] = (function () {
									return $http.post(globals.webApiBaseUrl + 'procurement/package/total/getsametotalsfrompackages', ids).then(function (res) {
										return res.data;
									});
								})();
								return getSameTotalsFromPackagesCach[idStr];
							}
						};
					}

					getConfigurationFK = readonlyProcessor.getConfigurationFk;

					/**
					 * @ngdoc function
					 * @name getCellEditable
					 * @function
					 * @methodOf procurement.common.procurementCommonTotalDataService
					 * @description get editable of model
					 * @returns bool
					 */
					service.getCellEditable = readonlyProcessor.getCellEditable;

					service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
						var selectedItem = parentService.getSelected();
						taxCodeFk = (taxCodeFk === undefined && selectedItem) ? selectedItem.TaxCodeFk : taxCodeFk;
						vatGroupFk = (vatGroupFk === undefined && selectedItem) ? selectedItem.BpdVatGroupFk : vatGroupFk;
						return prcCommonGetVatPercent.getVatPercent(taxCodeFk, vatGroupFk);
					};

					service.refreshTotal = function () {
						showAll = !showAll;
						parentService.updateAndExecute(service.loadSubItemList);
					};

					// do create the total item when parent created
					var onParentItemCreated = function onParentItemCreated(e, args) {
						service.setCreatedItems(args.totalItems);
					};

					// recalculate total by do save the module
					service.updateCalculation = function updateCalculation() {
						let leadingService = moduleContext.getLeadingService();
						const updateData = $injector.get('platformDataServiceModificationTrackingExtension').getModifications(leadingService);
						if (updateData && updateData.EntitiesCount >= 1) {
							leadingService.update();
						} else {
							let header = leadingService.getSelected();
							if (header) {
								$http.get(globals.webApiBaseUrl + 'procurement/common/headertotals/recalculate?headerId=' + header.Id + '&moduleName=' + moduleContext.getModuleName()).then(function (response) {
									let result = _.isObject(response) ? response.data : false;
									if (result) {
										service.load();
									}
								});
							}
						}
						parentService.isTotalDirty = false;
					};

					// service.calculateFreeTotalOnExchangeRateChange = function calculateFreeTotalOnExchangeRateChange() {
					service.calculateTotalOnExchangeRateChange = function calculateTotalOnExchangeRateChange() {
						angular.forEach(service.getList(), function (item) {
							var entity = parentService.getSelected();
							var totalType = getTotalType(item);
							if (_.isEmpty(totalType)) {
								return true;
							}
							// if ((totalType.PrcTotalKindFk === totalKinds.freeTotal || totalType.PrcTotalKindFk === totalKinds.calculatedCost) &&
							// entity.ExchangeRate !== 0) {
							if (totalType.PrcTotalKindFk === totalKinds.freeTotal && entity.ExchangeRate !== 0) {
								parentService.isTotalDirty = true;
								item.ValueNet = prcCommonCalculationHelper.round(item.ValueNetOc / parseFloat(entity.ExchangeRate));
								item.GrossOc = prcCommonCalculationHelper.round(item.ValueNetOc + parseFloat(item.ValueTaxOc));
								item.ValueTax = prcCommonCalculationHelper.round(item.ValueTaxOc / parseFloat(entity.ExchangeRate));
								item.Gross = prcCommonCalculationHelper.round(item.ValueNet + parseFloat(item.ValueTax));
								service.markItemAsModified(item);
								service.gridRefresh();
							}
							if (totalType.PrcTotalKindFk === totalKinds.calculatedCost || totalType.PrcTotalKindFk === totalKinds.estimateTotal) {
								item.ValueNetOc = prcCommonCalculationHelper.round(item.ValueNet * parseFloat(entity.ExchangeRate));
								item.ValueTaxOc = prcCommonCalculationHelper.round(item.ValueTax * parseFloat(entity.ExchangeRate));
								item.GrossOc = prcCommonCalculationHelper.round(item.ValueNetOc + parseFloat(item.ValueTaxOc));
								item.Gross = prcCommonCalculationHelper.round(item.ValueNet + parseFloat(item.ValueTax));
								service.markItemAsModified(item);
								service.gridRefresh();
								parentService.isTotalDirty = true;
							}
							// if the entity never been saved, then need to set as modified
							if (entity.Version === 0) {
								service.markItemAsModified(item);
								service.gridRefresh();
							}
						});

					};

					function getTotalType(item) {
						var configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: getConfigurationFK()});
						if (configuration === null || configuration === undefined) {
							return;
						}
						return _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
							Id: item.TotalTypeFk,
							PrcConfigHeaderFk: configuration.PrcConfigHeaderFk
						});
					}

					function handleSelection(responseData, selected, data) {
						if (selected) {
							var item = _.find(responseData.Main, { Id: selected.Id });
							if (item) {
								service.setSelected();
								$timeout(function() {
									service.setSelected(item);
								}, 200);
							} else {
								service.goToFirst(data);
							}
						} else {
							service.goToFirst(data);
						}
					}

					service.getTotalType = getTotalType;

					service.getNetTotalItem = function getNetTotalItem() {
						return _.find(service.getList(), function (item) {
							var totalType = service.getTotalType(item);
							if (_.isEmpty(totalType)) {
								return false;
							}
							if (totalType.PrcTotalKindFk === totalKinds.netTotal) {
								return true;
							}
						});
					};

					service.getNetTotalNoDiscountSplitItem = function getNetTotalItem(isDirectiveFromItemAndBoq) {
						var result = isDirectiveFromItemAndBoq ? null : _.find(service.getList(), function (item) {
							var totalType = service.getTotalType(item);
							if (_.isEmpty(totalType)) {
								return false;
							}
							if (totalType.PrcTotalKindFk === totalKinds.netTotalNoDiscountSplit) {
								return true;
							}
						});
						if (!result) {
							var prcItemServiceFactory = $injector.get('procurementCommonPrcItemDataService');
							var prcItemService = prcItemServiceFactory.getService(parentService);
							var prcBoqServiceFactory = $injector.get('procurementCommonPrcBoqService');
							var prcBoqService = prcBoqServiceFactory.getService(parentService);
							var prcItemNetTotalNoDiscountSplit, boqItemNetTotalNoDiscountSplit;
							var subPackages = isPackage ? $injector.get('procurementPackagePackage2HeaderService').getList() : [];
							if (isPackage && subPackages && subPackages.length > 1) {
								prcItemNetTotalNoDiscountSplit = prcItemService.getNetTotalNoDiscountSplit();
								result = {
									ValueNet: prcItemNetTotalNoDiscountSplit.netTotal,
									ValueNetOc: prcItemNetTotalNoDiscountSplit.netTotalOc,
									Gross: prcItemNetTotalNoDiscountSplit.gross,
									GrossOc: prcItemNetTotalNoDiscountSplit.grossOc,
								};
								boqItemNetTotalNoDiscountSplit = prcBoqService.getNetTotalNoDiscountSplit();
								result.ValueNet += boqItemNetTotalNoDiscountSplit.netTotal;
								result.ValueNetOc += boqItemNetTotalNoDiscountSplit.netTotalOc;
								result.Gross += boqItemNetTotalNoDiscountSplit.gross;
								result.GrossOc += boqItemNetTotalNoDiscountSplit.grossOc;

								var selectedSupPackage = $injector.get('procurementPackagePackage2HeaderService').getSelected();
								_.forEach(subPackages, function (sp) {
									if (sp.Id !== selectedSupPackage.Id || (prcItemNetTotalNoDiscountSplit.netTotalOc === 0 && prcItemNetTotalNoDiscountSplit.grossOc === 0)) {
										result.ValueNet += sp.PrcItemValueNet;
										result.ValueNetOc += sp.PrcItemValueNetOc;
										result.Gross += sp.PrcItemGross;
										result.GrossOc += sp.PrcItemGrossOc;
									}
									if (sp.Id !== selectedSupPackage.Id || (boqItemNetTotalNoDiscountSplit.netTotalOc === 0 && boqItemNetTotalNoDiscountSplit.grossOc === 0)) {
										result.ValueNet += sp.PrcBoqValueNet;
										result.ValueNetOc += sp.PrcBoqValueNetOc;
										result.Gross += sp.PrcBoqGross;
										result.GrossOc += sp.PrcBoqGrossOc;
									}
								});
							}
							else {
								prcItemNetTotalNoDiscountSplit = prcItemService.getNetTotalNoDiscountSplit();
								boqItemNetTotalNoDiscountSplit = prcBoqService.getNetTotalNoDiscountSplit();
								result = {
									ValueNet: prcItemNetTotalNoDiscountSplit.netTotal + boqItemNetTotalNoDiscountSplit.netTotal,
									ValueNetOc: prcItemNetTotalNoDiscountSplit.netTotalOc + boqItemNetTotalNoDiscountSplit.netTotalOc,
									Gross: prcItemNetTotalNoDiscountSplit.gross + boqItemNetTotalNoDiscountSplit.gross,
									GrossOc: prcItemNetTotalNoDiscountSplit.grossOc + boqItemNetTotalNoDiscountSplit.grossOc
								};
							}
						}
						return result;
					};

					// service.calculateFreeTotalOnTaxCodeFkChange = function calculateFreeTotalOnTaxCodeFkChange() {
					service.calculateTotalOnTaxCodeFkOrVatgroupChange = function calculateTotalOnTaxCodeFkOrVatgroupChange() {
						angular.forEach(service.getList(), function (item) {
							var entity = parentService.getSelected();
							var totalType = getTotalType(item);
							if (_.isEmpty(totalType)) {
								return true;
							}

							// if ((totalType.PrcTotalKindFk === totalKinds.freeTotal || totalType.PrcTotalKindFk === totalKinds.calculatedCost) &&
							// entity.ExchangeRate !== 0) {
							if (totalType.PrcTotalKindFk === totalKinds.freeTotal && entity.ExchangeRate !== 0) {
								item.ValueTaxOc = prcCommonCalculationHelper.round(item.ValueNetOc * (service.getVatPercentWithTaxCodeMatrix()) / 100);
								item.GrossOc = prcCommonCalculationHelper.round(item.ValueNetOc + parseFloat(item.ValueTaxOc));
								item.ValueTax = prcCommonCalculationHelper.round(item.ValueTaxOc / parseFloat(entity.ExchangeRate));
								item.Gross = prcCommonCalculationHelper.round(item.ValueNet + parseFloat(item.ValueTax));
								service.markItemAsModified(item);
								service.gridRefresh();
							}
							if (totalType.PrcTotalKindFk === totalKinds.calculatedCost || totalType.PrcTotalKindFk === totalKinds.estimateTotal) {
								item.ValueTax = prcCommonCalculationHelper.round(item.ValueNet * (service.getVatPercentWithTaxCodeMatrix()) / 100);
								item.ValueTaxOc = prcCommonCalculationHelper.round(item.ValueTax * parseFloat(entity.ExchangeRate));
								item.Gross = prcCommonCalculationHelper.round(item.ValueNet + parseFloat(item.ValueTax));
								item.GrossOc = prcCommonCalculationHelper.round(item.ValueNetOc + parseFloat(item.ValueTaxOc));
								service.markItemAsModified(item);
								service.gridRefresh();
							}
						});
					};

					service.markCalculationDirty = function markCalculationDirty() {

					};
					var totalTypeFilter;

					service.reload = function reload() {
						lookupDataService.getSearchList('PrcTotalType', totalTypeFilter()).then(function (totalTypes) {
							angular.forEach(service.getList(), function (item) {
								var itemTotalType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {Id: item.TotalTypeFk});
								var newTotalType = _.find(totalTypes, {PrcTotalKindFk: itemTotalType.PrcTotalKindFk});
								if (newTotalType) {
									item.TotalTypeFk = newTotalType.Id;
								} else {
									service.deleteItem(item);
								}
							});
						});
					};

					totalTypeFilter = function () {
						var configurationFk = getConfigurationFK();
						if (configurationFk) {
							var configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: configurationFk});
							return 'PrcConfigHeaderFk=' + (configuration ? configuration.PrcConfigHeaderFk : 0);
						}
						return 'PrcConfigHeaderFk=0';
					};

					service.registerLookupFilters({
						'procurement-common-total-type-filter': {
							serverSide: true,
							fn: totalTypeFilter
						}
					});

					service.copyTotalsFromPackage = function (packageItem) {
						/** @namespace packageItem.PrcPackageConfigurationFk */
						var parentItem = parentService.getSelected();
						if (parentItem === null || parentItem === undefined) {
							return;
						}
						var postData = {
							MainItemId: parentItem.Id,
							PrcConfigurationFk: getConfigurationFK(),
							PkgConfigurationFk: packageItem.PrcPackageConfigurationFk,
							TotalHeaderInfo: {
								Id: parentItem.Id,
								PackageFk: parentItem.PackageFk,
								PrcHeaderFk: parentItem.PrcHeaderFk,
								ExchangeRate: parentItem.ExchangeRate,
								TaxCodeFk: parentItem.TaxCodeFk
							}
						};

						$http.post(globals.webApiBaseUrl + route + 'copyfrompackage', postData)
							.then(function (res) {
								var itemList = service.getList();
								angular.forEach(res.data, function (newItem) {
									var oldItem = _.find(itemList, {TotalTypeFk: newItem.TotalTypeFk});
									if (oldItem) {
										angular.extend(oldItem, newItem);
										service.markItemAsModified(oldItem);
									} else if (serviceContainer.data.handleCreateSucceededWithoutSelect) {
										serviceContainer.data.handleCreateSucceededWithoutSelect(newItem, serviceContainer.data, service);
									}
								});
								service.gridRefresh();
							});
					};

					service.asyncCopyTotalsFromConfiguration = function(prcConfigFk){
						const deferred = $q.defer();
						var parentItem = parentService.getSelected();
						if(_.isNil(parentItem)){
							return deferred.resolve(true);
						}
						var postData = {
							MainItemId: parentItem.Id,
							PrcConfigurationFk: prcConfigFk ? prcConfigFk : getConfigurationFK(),
							TotalHeaderInfo: {
								Id: parentItem.Id,
								PackageFk: parentItem.PackageFk,
								PrcHeaderFk: parentItem.PrcHeaderFk,
								ExchangeRate: parentItem.ExchangeRate,
								TaxCodeFk: parentItem.TaxCodeFk
							}
						};
						const copyConfigurationPromise=$http.post(globals.webApiBaseUrl + route + 'copyfromconfiguration', postData);
						const getTotalPromise=$http.get(globals.webApiBaseUrl + route + 'gettotal?headId=' + parentItem.Id);
						$q.all([copyConfigurationPromise, getTotalPromise]).then(function (res) {
							if (res && res.length === 2) {
								let deleteItems = _.union(_.filter(service.getList(), {Version: 0}), res[1].data);
								angular.forEach(deleteItems, function (item) {
									service.deleteItem(item);
								});
								service.setCreatedItems(res[0].data);
							}
							deferred.resolve(true);
						});
						return deferred.promise;
					};

					service.copyTotalsFromConfiguration = function () {
						var parentItem = parentService.getSelected();
						if (_.isNil(parentItem)) {
							return;
						}
						var postData = {
							MainItemId: parentItem.Id,
							PrcConfigurationFk: getConfigurationFK(),
							TotalHeaderInfo: {
								Id: parentItem.Id,
								PackageFk: parentItem.PackageFk,
								PrcHeaderFk: parentItem.PrcHeaderFk,
								ExchangeRate: parentItem.ExchangeRate,
								TaxCodeFk: parentItem.TaxCodeFk
							}
						};
						// fixed defect: #99057, Duplicate Total Issue in Procurement
						var oldlist = service.getList();
						angular.forEach(oldlist, function (item) {
							if (item.Version === 0) {
								service.deleteItem(item);
							}
						});

						$http.post(globals.webApiBaseUrl + route + 'copyfromconfiguration', postData)
							.then(function (res) {

								service.setCreatedItems(res.data);
							});

						$http.get(globals.webApiBaseUrl + route + 'gettotal?headId=' + parentItem.Id)
							.then(function (res) {
								angular.forEach(res.data, function (item) {
									service.deleteItem(item);
								});

							});
					};
					service.currentItem = null;
					service.copyTotalFromPackage = function () {
						var parentItem = parentService.getSelected();

						if (parentItem.PackageFk < 1) {
							return;
						}
						// var currentItem = service.getSelected(),
						var creationData = {
							MainItemId: parentItem.Id,
							TotalInfo: {
								Id: service.currentItem.Id,
								TotalTypeFk: service.currentItem.TotalTypeFk,
								ValueNet: service.currentItem.ValueNet
							},
							TotalHeaderInfo: {
								Id: parentItem.Id,
								PackageFk: parentItem.PackageFk,
								PrcHeaderFk: parentItem.PrcHeaderFk,
								ExchangeRate: parentItem.ExchangeRate,
								TaxCodeFk: parentItem.TaxCodeFk
							}
						};

						$http({
							method: 'post',
							url: globals.webApiBaseUrl + route + 'recalculate',
							data: creationData
						}).then(function (res) {
							if (!res.data) {
								return;
							}
							var itemList = service.getList(), newItem = res.data;
							var oldItem = _.find(itemList, {TotalTypeFk: newItem.TotalTypeFk});
							if (oldItem) {
								angular.extend(oldItem, newItem);
								service.markItemAsModified(oldItem);
								service.gridRefresh();
							}
						});
					};

					if (parentService.completeItemCreated) {
						parentService.completeItemCreated.register(onParentItemCreated);
					}
					service.registerFilters();

					if (parentService.exchangeRateChanged) {
						// parentService.exchangeRateChanged.register(service.calculateFreeTotalOnExchangeRateChange);
						parentService.exchangeRateChanged.register(service.calculateTotalOnExchangeRateChange);
					}
					if (parentService.taxCodeFkChanged) {
						// parentService.taxCodeFkChanged.register(service.calculateFreeTotalOnTaxCodeFkChange);
						parentService.taxCodeFkChanged.register(service.calculateTotalOnTaxCodeFkOrVatgroupChange);
					}
					if (parentService.vatGroupChanged) {
						parentService.vatGroupChanged.register(service.calculateTotalOnTaxCodeFkOrVatgroupChange);
					}
					if (parentService.onParentUpdated) {
						parentService.onParentUpdated.register(service.loadSubItemList);
					}

					service.loadSubItemsList = function () {
						serviceContainer.data.doesRequireLoadAlways = true;// Baf. Otherwise the service.loadSubItemList will not work correctly.
						serviceContainer.data.loadSubItemList.apply(this, arguments);
						serviceContainer.data.doesRequireLoadAlways = false;
					};

					basicsLookupdataLookupDescriptorService.loadData('PrcTotalType');

					service.isTotalTypeUnique = function (headId, totalTypeId) {
						// TODO: .Net Core Porting: yew 2020-11-25 change '//' to '/'.
						return $http.get(globals.webApiBaseUrl + route + 'isunique', {
							params: {
								headId: headId,
								totalTypeId: totalTypeId
							}
						});
					};

					service.newEntityValidator = function (validateService) {
						if (serviceContainer.data.newEntityValidator && serviceContainer.data.newEntityValidator.validate) {
							return;
						}
						serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
							typeName: 'ConTotalDto',
							moduleSubModule: 'Procurement.Contract',
							validationService: angular.copy(validateService),
							mustValidateFields: ['TotalTypeFk']
						});
					};

					function loadList() {
						var list = service.getList();
						if (list && list.length) {
							service.load();
						}
					}

					if (parentService.onRecalculationItemsAndBoQ) {
						parentService.onRecalculationItemsAndBoQ.register(loadList);
					}

					return service;
				}

				return dataServiceFactory.createService(constructorFn, 'procurementCommonTotalDataService');
			}
		]);

})(angular);
