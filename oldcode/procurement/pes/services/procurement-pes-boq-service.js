/**
 * Created by reimer on 24.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	var procurementPesModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name procurementCommonMainService
	 * @function
	 *
	 * @description
	 * procurementCommonMainService is the data service for all common related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	procurementPesModule.factory('procurementPesBoqService',
		['$http','_','$q', 'globals','platformDataServiceFactory', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
			'procurementCommonDataNewDataService', 'prcBoqMainService', 'procurementPesHeaderService', 'ServiceDataProcessDatesExtension',
			'procurementCommonDataEnhanceProcessor', 'procurementPesBoqValidationService', 'platformRuntimeDataService',
			'platformDataServiceModificationTrackingExtension', 'platformObjectHelper','procurementPesEnhanceBoqMainService',
			'procurementContextService','procurementCommonInputArgumentDialog','basicsLookupdataLookupDataService','platformModalService' ,'platformDataValidationService',
			'basicsLookupdataLookupDefinitionService', 'prcBaseBoqLookupService', 'PlatformMessenger', 'platformPermissionService', '$injector',
			'platformLayoutByDataService', 'platformValidationByDataService', '$timeout',
			function ($http, _, $q,globals, platformDataServiceFactory, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService,
				dataDataServiceFactory, prcBoqMainService, parentService, ServiceDataProcessDatesExtension,
				procurementCommonDataEnhanceProcessor, procurementPesBoqValidationService, platformRuntimeDataService,
				platformDataServiceModificationTrackingExtension, platformObjectHelper,procurementPesEnhanceBoqMainService,
				procurementContextService,procurementCommonInputArgumentDialog,basicsLookupdataLookupDataService,platformModalService,platformDataValidationService,
				basicsLookupdataLookupDefinitionService, prcBaseBoqLookupService, PlatformMessenger, platformPermissionService, $injector,
				platformLayoutByDataService, platformValidationByDataService, $timeout) {

				var doesRegisterLayoutAndValidationService = false;
				var factoryOptions = {
					flatNodeItem: {
						module: procurementPesModule,
						serviceName: 'procurementPesBoqService',
						httpCRUD: { route: globals.webApiBaseUrl + 'procurement/pes/boq/', endCreate: 'createnew'},
						actions: {
							create: 'flat',  // set status for the create button
							canCreateCallBackFunc: function canCreateCallBackFunc() {
								var headerSelectedItem = parentService.getSelected();
								return !parentService.validateItemIsReadOnly(headerSelectedItem);
							},
							delete: {},  // set status for the delete button
							canDeleteCallBackFunc: function canDeleteCallBackFunc() {
								var headerSelectedItem = parentService.getSelected();
								return !parentService.validateItemIsReadOnly(headerSelectedItem);
							}
						},
						presenter: {list: {incorporateDataRead: incorporateDataRead}},
						entityRole: {node: {itemName: 'PesBoq', parentService: parentService,
							doesRequireLoadAlways: platformPermissionService.hasRead('d12d2da2967e4c4f808e757c5a3f91a5')}},
						dataProcessor: [dataProcessItem(), new ServiceDataProcessDatesExtension(['PerformedFrom', 'PerformedTo'])]
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
				serviceContainer.service.data = serviceContainer.data;

				// overwrite the doClearModifications method
				var oldDoClearModifications = serviceContainer.data.doClearModifications;
				serviceContainer.data.doClearModifications = doClearModificationsInNode;
				function doClearModificationsInNode(entities, data) {
					oldDoClearModifications(entities[0], data);
				}
				initialize(serviceContainer.service,serviceContainer.data);

				var onItemSelectionChanged = function onItemSelectionChanged() {
					var selected = serviceContainer.service.getSelected();
					var currentMainItem = parentService.getSelected();
					var isMainItemReadOnly = parentService.validateItemIsReadOnly(currentMainItem);
					var isReadOnly = isMainItemReadOnly || (selected && selected.BoqHeader && selected.BoqHeader.IsReadOnly);
					var boqMainService = prcBoqMainService.getService(serviceContainer.service);
					if(boqMainService && boqMainService.setReadOnly && boqMainService.setCurrentExchangeRate) {
						// noinspection JSCheckFunctionSignattures

						boqMainService.setCallingContext({PrcPesHeader: currentMainItem});
						boqMainService.setReadOnly(isReadOnly);
						boqMainService.setCurrentExchangeRate(currentMainItem ? currentMainItem.ExchangeRate : 1);
					}
				};

				parentService.registerSelectionChanged(onParentItemSelectionChanged);
				parentService.registerExchangeRateChanged(onParentItemExchangerateChanged);
				serviceContainer.service.registerSelectionChanged(onItemSelectionChanged);

				var validationService = procurementPesBoqValidationService(serviceContainer.service.name, serviceContainer.service);
				var entityCreating = new PlatformMessenger();
				var isCreating = false;
				serviceContainer.service.entityCreating = entityCreating;
				serviceContainer.service.getEntityCreatingStatus = getEntityCreatingStatus;
				serviceContainer.service.reSetVatFinalpriceFinalgross = reSetVatFinalpriceFinalgross;
				serviceContainer.service.getModuleState = function getModuleState() {
					var state, status, parentItem = serviceContainer.service.parentService() ? serviceContainer.service.parentService().getSelected() : null;
					status = basicsLookupdataLookupDescriptorService.getData('PesStatus');

					if (parentItem && parentItem.Id) {
						state = _.find(status, { Id: parentItem.PesStatusFk });
					} else {
						state = { IsReadonly: true };
					}
					return state;
				};

				if (parentService.onRecalculationItemsAndBoQ) {
					parentService.onRecalculationItemsAndBoQ.register(loadList);
				}

				return serviceContainer.service;

				function dataProcessItem() {
					var isReadonly = function (item, model) {
						switch (model) {
							case 'ConHeaderFk':
								if(serviceContainer.service.isDialog) {  // when show the dialog care for the status for the conHeader
									return parentService.validateItemIsReadOnly(parentService.getSelected());// || item.ConHeaderFk === null;
								}
								return true;
							case 'PrcBoqFk':
								if(serviceContainer.service.isDialog) {
									return !item.PackageFk || !item.ConHeaderFk;// || item.PrcBoqFk > 0;
								}
								return true;
							case 'PackageFk':
								return !serviceContainer.service.isDialog || !item.ConHeaderFk;
							case 'ControllingUnitFk':
							case 'PerformedFrom':
							case 'PerformedTo':
							case 'MdcTaxCodeFk':
							case 'PrcStructureFk':
								return parentService.validateItemIsReadOnly(parentService.getSelected());
						}
						return parentService.validateItemIsReadOnly(parentService.getSelected());
					};
					var dataProcessService = function () {
						serviceContainer.service.updateReadOnly = serviceContainer.service.updateReadOnly || function (item, model) {
							platformRuntimeDataService.readonly(item, [{
								field: model,
								readonly: isReadonly(item, model)
							}]);
						};
						return {
							dataService: serviceContainer.service,
							validationService: validationService
						};
					};

					if(!dataProcessItem.noly){
						dataProcessItem.noly = procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementPesBoqUIStandardService', isReadonly);
					}
					if (!doesRegisterLayoutAndValidationService) {
						doesRegisterLayoutAndValidationService = true;
						$timeout(function () {
							var tempConfig = $injector.get('procurementPesBoqUIStandardService');
							platformLayoutByDataService.registerLayout(tempConfig, serviceContainer.service);
							platformValidationByDataService.registerValidationService(validationService, serviceContainer.service);
						});
					}
					return dataProcessItem.noly;
				}

				function incorporateDataRead(responseData, data) {
					basicsLookupdataLookupDescriptorService.attachData(responseData || {});
					_.forEach(responseData.Main, function(resData) {
						if (resData.BoqRootItem) {
							reSetVatFinalpriceFinalgross(resData);
						}
					});

					var result = data.handleReadSucceeded(responseData.Main, data, true);
					serviceContainer.service.goToFirst();
					/* var headerSelectedItem = parentService.getSelected(); */
					return result;
				}

				function checkRequiredField(value){
					return !(angular.isUndefined(value) || value === null || value === -1 || value === 0);
				}
				// for create other items.
				function doCreateItems(updateItemList, selectedItem){

					var creationData = [];
					_.forEach(updateItemList, function (item) {
						var mainItem = {};
						mainItem.parent = angular.copy(selectedItem);
						mainItem.parent.PrcBoqFk = item.Id;
						mainItem.parent.PrcItemStatusFk = item.PrcItemStatusFk;
						mainItem.MainItemId = parentService.getSelected().Id;
						mainItem.parent.BoqItemPrjBoqFk = item.BoqItemPrjBoqFk;
						mainItem.parent.ControllingUnitFk = item.ControllingUnitFk;
						mainItem.parent.IsIncludeNotContractedItem = true;
						creationData.push(mainItem);
					});

					$http.post(globals.webApiBaseUrl + 'procurement/pes/boq/createitems', creationData).then(function (response) {
						basicsLookupdataLookupDescriptorService.attachData(response.data || {});
						var newList = response.data;
						if (angular.isArray(newList) && newList.length > 0) {
							_.forEach(newList, function (item) {
								serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, creationData);
							});
						}
					})
						.finally(function () {
							isCreating = false;
							entityCreating.fire(null, isCreating);
						});
				}

				function initialize(service,data) {
					service.name = 'procurement.pes.boq';
					service.isDialog = false;

					service.getUrl = function(end){return data.httpReadRoute + end;};

					service.getItemServiceName = function () {
						return 'procurementPesItemDataService';
					};

					service.upServiceAboutBoq = function(){
						prcBoqMainService.getService(service, procurementPesEnhanceBoqMainService);
						dataDataServiceFactory.getService(parentService).registerWithChange('BOQ', service);
					};

					service.getLookupValue = function (item, typeKeys) {
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
					};

					service.updateRowStatus = dataProcessItem().processItem;

					service.createOtherItems = function createOtherItems(currentItem, autoCreate) {
						isCreating = true;
						entityCreating.fire(null, isCreating);
						var headerSelectedItem = parentService.getSelected();
						var filter = basicsLookupdataLookupFilterService.getFilterByKey('pes-boq-con-merge-boq-filter');
						if (parentService.validateItemIsReadOnly(headerSelectedItem) || currentItem.ConHeaderFk === null) {
							isCreating = false;
							entityCreating.fire(null, isCreating);
							return;
						}

						// var conHeaderFk = parentService.getSelected().ConHeaderFk;

						/* parentService.setBaseNChangeOrderPrcHeaderIdsByConHeaderId(conHeaderFk, true).then(function() { */
						var additionalParameters = filter.fn(currentItem);
						var filterKey = filter.serverKey;
						var pageState = {
							PageNumber: 0,
							PageSize: 100
						};
						var request = {
							AdditionalParameters: additionalParameters,
							FilterKey: filterKey,
							PageState: pageState
						};

						basicsLookupdataLookupDataService.getSearchList('PrcMergeBoqView', request).then(function (prcboqs) {

							var items = prcboqs.items;

							var currentItemList = serviceContainer.service.getList();
							if (!items || !items.length) {
								isCreating = false;
								entityCreating.fire(null, isCreating);
								// noinspection JSCheckFunctionSignatures
								if (!autoCreate) {
									platformModalService.showMsgBox('procurement.pes.createPesBoqNoCopy', 'procurement.pes.createPesBoq');
								}

							} else {
								var updateItemList = [];

								items = _.uniqBy(_.filter(items, function (value) {
									return value.BoqItemPrjBoqFk !== null && angular.isDefined(value.BoqItemPrjBoqFk);
								}), 'BoqItemPrjBoqFk');

								basicsLookupdataLookupDescriptorService.updateData('PrcMergeBoqView', items);

								_.forEach(items, function (prcboq) {
									var current = _.filter(currentItemList, function (item) {
										return item.PrcBoqFk === prcboq.Id;
									});
									if (current && current.length <= 0) {
										updateItemList.push(prcboq);
									}
								});

								if (updateItemList && updateItemList.length > 0) {
									var selectedItem = null;
									var parentSelected = parentService.getSelected();
									var controllingUnitFk = null;
									var hasNoControllingUnit = false;
									if (!data.selectedItem) {
										selectedItem = dataProcessItem().updateValue({ConHeaderFk: parentService.getSelected().ConHeaderFk});
									}
									else {
										selectedItem = {
											ConHeaderFk: data.selectedItem.ConHeaderFk,
											MdcTaxCodeFk: data.selectedItem.MdcTaxCodeFk,
											PackageFk: data.selectedItem.PackageFk,
											PrcStructureFk: data.selectedItem.PrcStructureFk
										};
									}

									// if the contract boq has controling unit, copy this value to corresponding pes boq
									// else if the contract has controlling unit, copy the contract's
									// else if the selected pes boq has controlling unit, copy the pes boq's
									// else copy the controlling unit which is set by the user via dialog.

									controllingUnitFk = parentSelected.ControllingUnitFk || (data.selectedItem ? data.selectedItem.ControllingUnitFk : null);
									if (!controllingUnitFk) {
										hasNoControllingUnit = _.some(updateItemList, function (item) {
											return !item.ControllingUnitFk;
										});
									}

									if (autoCreate && (!checkRequiredField(selectedItem.MdcTaxCodeFk) || !checkRequiredField(selectedItem.PrcStructureFk) || hasNoControllingUnit)) {

										service.isDialog = true;
										var tempSelectedItem = angular.copy(selectedItem);
										var controllerOptions = {
											currentItem: tempSelectedItem,
											validationService: validationService,
											canStructureShow: !checkRequiredField(selectedItem.PrcStructureFk),
											canTaxCodeShow: !checkRequiredField(selectedItem.MdcTaxCodeFk),
											canControllingUnitShow: hasNoControllingUnit
										};
										var config = {
											templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-auto-create-boq-validation-dialog.html',
											controller: 'procurementPesBoqCreationDialogController',
											// backdrop: false,
											// width: '750px',
											resolve: {
												controllerOptions: function () {
													return controllerOptions;
												}
											}
										};
										platformModalService.showDialog(config).then(function (result) {
											var resCurrentItem = result && result.currentItem;
											if (resCurrentItem) {
												if (data.selectedItem) {
													if (!checkRequiredField(data.selectedItem.MdcTaxCodeFk)) {
														data.selectedItem.MdcTaxCodeFk = resCurrentItem.MdcTaxCodeFk;
													}

													if (!checkRequiredField(data.selectedItem.PrcStructureFk)) {
														data.selectedItem.PrcStructureFk = resCurrentItem.PrcStructureFk;
													}

													if (!checkRequiredField(data.selectedItem.ControllingUnitFk)) {
														data.selectedItem.ControllingUnitFk = resCurrentItem.PrcStructureFk;
													}
												}

												if (!checkRequiredField(selectedItem.MdcTaxCodeFk)) {
													selectedItem.MdcTaxCodeFk = resCurrentItem.MdcTaxCodeFk;
												}

												if (!checkRequiredField(selectedItem.PrcStructureFk)) {
													selectedItem.PrcStructureFk = resCurrentItem.PrcStructureFk;
												}

												selectedItem.WicBoqReference = resCurrentItem.WicBoqReference;

												if (hasNoControllingUnit) {
													_.forEach(updateItemList, function (item) {
														if (!item.ControllingUnitFk) {
															item.ControllingUnitFk = resCurrentItem.ControllingUnitFk;
														}
													});
												}
												doCreateItems(updateItemList, selectedItem);
											}
											isCreating = false;
											entityCreating.fire(null, isCreating);
										}, function () {
											isCreating = false;
											entityCreating.fire(null, isCreating);
										});

										return;
									}

									_.forEach(updateItemList, function (item) {
										if (!item.ControllingUnitFk) {
											item.ControllingUnitFk = controllingUnitFk;
										}
									});
									doCreateItems(updateItemList, selectedItem);
								}
								else {
									isCreating = false;
									entityCreating.fire(null, isCreating);
								}
							}
						}, function () {
							isCreating = false;
							entityCreating.fire(null, isCreating);
						});
						// });
					};

					service.createItem = function() {
						service.registerEntityCreated(onEntityCreated);
						var qDef = $q.defer();
						var parentSelected = parentService.getSelected();
						var conHeaderFk = parentSelected.ConHeaderFk;
						var controllingUnitFk = parentSelected.ControllingUnitFk;
						if (!conHeaderFk) {
							platformModalService.showMsgBox('procurement.pes.boqCreationDialog.error.noContract', 'procurement.pes.createPesBoq');
							closeDialog(false, true);
							return;
						}

						var boqSource = 1; // 1: contract; 2: package; 3: wic
						$http.get(globals.webApiBaseUrl + 'procurement/contract/conheaderlookup/getitembykey', {
							params: {
								id: conHeaderFk
							}
						}).then(function (response) {
							var conHeader = response.data;
							if (!conHeader) {
								// noinspection JSCheckFunctionSignatures
								platformModalService.showMsgBox('procurement.pes.createPesBoqNoContract', 'procurement.pes.createPesBoq');
								closeDialog(false, true);
								return;
							}
							service._currentSelected = service.getSelected();
							data.selectedItem = dataProcessItem().updateValue({ConHeaderFk: conHeaderFk});
							data.selectedItem.ControllingUnitFk = controllingUnitFk;

							if (!data.selectedItem.PackageFk) {
								platformModalService.showMsgBox('procurement.pes.boqCreationDialog.error.noPackage', 'procurement.pes.createPesBoq');
								closeDialog(false, true);
								return;
							}

							var copyMode = conHeader.PrcCopyModeFk;

							if (!copyMode) {
								closeDialog(false, true);
								return;
							}

							var contractBoqs = [];
							var packageBoqs = [];
							var wicBoqs = [];
							var contractBoqPromise = null;
							var packageBoqPromise = null;
							var wicBoqPromise = null;
							var options = {
								enableUseContactBoq: false,
								enableUsePackageBoq: false,
								enableUseWicBoq: false,
								boqSource: boqSource
							};

							switch (copyMode) {
								case 1:
								case 4: {
									contractBoqPromise = getContractBoqs();
									packageBoqPromise = getPackageBoqs(data.selectedItem.PackageFk);
									wicBoqPromise = getWicBoqs(data.selectedItem.ConHeaderFk);
								}
									break;
								case 2: {
									contractBoqPromise = getContractBoqs();
									packageBoqPromise = getPackageBoqs(data.selectedItem.PackageFk);
									wicBoqPromise = $q.when(wicBoqs);
								}
									break;
								case 3: {
									contractBoqPromise = getContractBoqs();
									packageBoqPromise = getPackageBoqs(data.selectedItem.PackageFk);// $q.when(packageBoqs);
									wicBoqPromise = getWicBoqs(data.selectedItem.ConHeaderFk);
								}
									break;
								default:
									break;
							}

							$q.all([contractBoqPromise, packageBoqPromise, wicBoqPromise])
								.then(function (res) {
									if (!res) {
										closeDialog(false, true);
										return;
									}

									contractBoqs = res[0];
									packageBoqs = res[1];
									wicBoqs = res[2];

									if (contractBoqs.length === 0 && packageBoqs.length === 0 && wicBoqs.length === 0) {
										platformModalService.showMsgBox('procurement.pes.createPesBoqNoCopy', 'procurement.pes.createPesBoq');
										closeDialog(false, true);
										return;
									}

									if (contractBoqs.length > 0) {
										options.enableUseContactBoq = true;
									}

									if (packageBoqs.length > 0) {
										options.enableUsePackageBoq = true;
									}

									if (wicBoqs.length > 0) {
										options.enableUseWicBoq = true;
									}

									if (options.enableUseContactBoq) {
										options.boqSource = 1;
									} else if (options.enableUsePackageBoq) {
										options.boqSource = 2;
									} else if (options.enableUseWicBoq) {
										options.boqSource = 3;
									}

									showDialog(options, conHeader);
								});
						});

						return qDef.promise;

						// /////////////////////////////

						function getContractBoqs() {
							var defer = $q.defer();
							var filter = basicsLookupdataLookupFilterService.getFilterByKey('pes-boq-con-merge-boq-filter');
							var additionalParameters = filter.fn();
							var filterKey = filter.serverKey;
							var pageState = {
								PageNumber: 0,
								PageSize: 100
							};
							var request = {
								AdditionalParameters: additionalParameters,
								FilterKey: filterKey,
								PageState: pageState
							};
							var contractBoqs = [];
							basicsLookupdataLookupDataService.getSearchList('PrcMergeBoqView', request).then(function (prcboqs) {
								contractBoqs = prcboqs.items || [];
							}).finally(function () {
								defer.resolve(contractBoqs);
							});

							return defer.promise;
						}

						function getPackageBoqs(packageId) {
							var packageBoqs = [];
							if (!packageId) {
								return $q.when(packageBoqs);
							}
							var defer = $q.defer();
							var filter = basicsLookupdataLookupFilterService.getFilterByKey('pes-boq-prc-base-boq-filter');
							prcBaseBoqLookupService.clearBaseBoqList();
							prcBaseBoqLookupService.setCurrentPrcPackage(packageId);
							var promise = prcBaseBoqLookupService.getPrcBaseBoqList();
							promise.then(function (data) {
								if (angular.isArray(data)) {
									_.forEach(data, function (item) {
										if (filter.fn(item)) {
											packageBoqs.push(item);
										}
									});
								}
							})
								.finally(function () {
									defer.resolve(packageBoqs);
								});
							return defer.promise;
						}

						function getWicBoqs(contractId) {
							var wicBoqs = [];
							if (!contractId) {
								return $q.when(wicBoqs);
							}
							var defer = $q.defer();
							$http.get(globals.webApiBaseUrl + 'boq/wic/boq/getwicboqsbycontractid?contractId=' + contractId)
								.then(function (response) {
									if (response && angular.isArray(response.data)) {
										wicBoqs = response.data;
									}
								})
								.finally(function () {
									defer.resolve(wicBoqs);
								});
							return defer.promise;
						}

						function showDialog(options) {
							service.isDialog = true;
							var controllerOptions = {
								currentItem: data.selectedItem,
								validationService: validationService
							};

							if (options) {
								angular.extend(controllerOptions, options);
							}

							if (controllerOptions) {
								var config = {
									templateUrl: globals.appBaseUrl + 'procurement.pes/partials/procurement-pes-boq-creation-dialog.html',
									controller: 'procurementPesBoqCreationDialogController',
									backdrop: false,
									width: '750px',
									resolve: {
										controllerOptions: function () {
											return controllerOptions;
										}
									}
								};
								platformModalService.showDialog(config)
									.then(function(result){
										if (!result){
											closeDialog(false, true);
											return;
										}

										if (result.isOk) {
											closeDialog(result.currentItem);
										}
										else {
											closeDialog(result.isOk, true);
										}
									}, function () {
										closeDialog(false, true);
									});
							}
						}

						function closeDialog(result, withoutRefresh) {
							if (result) {
								isCreating = true;
								entityCreating.fire(null, isCreating);
								boqSource = result.BoqSource;
								angular.extend(data.selectedItem, result);
								/* if (result.BoqSource === 1) {
									var prcBoqList = basicsLookupdataLookupDescriptorService.getData('PrcMergeBoqView');
								} */

								var parentItem = data.selectedItem;
								var parentHeaderItem = data.parentService.getSelected();
								parentItem.PesHeaderFk = parentHeaderItem.Id;
								parentItem.CurrencyFk = parentHeaderItem.CurrencyFk;
								// when the PES_BOQ contract change
								if(data.selectedItem.ConHeaderFk !== parentService.getSelected().ConHeaderFk){
									parentService.changeBoqConHeader(data.selectedItem.ConHeaderFk);
								}
								/* parentService.updateAndExecute(function(){
									data.doCallHTTPCreate({
										MainItemId: parentService.getSelected().Id,
										parent: parentItem  //data.selectedItem
									}, data, data.onCreateSucceeded);
								}); */
								/* var headerSelectedItem = parentService.getSelected();
								if(headerSelectedItem && !parentItem.ControllingUnitCode){
									parentItem.ControllingUnitFk = headerSelectedItem.ControllingUnitFk;
								} */

								var prcBoqLookups = basicsLookupdataLookupDescriptorService.getData('PrcMergeBoqView');

								if (prcBoqLookups && data.selectedItem.PrcBoqFk && data.selectedItem.BoqSource === 1) {
									var currentPrcBoq = prcBoqLookups[data.selectedItem.PrcBoqFk];
									if (currentPrcBoq) {
										parentItem.BoqItemPrjBoqFk = currentPrcBoq.BoqItemPrjBoqFk;
									}
								}

								parentService.update().then(function (response) {
									if(response){
										data.doCallHTTPCreate({
											MainItemId: parentService.getSelected().Id,
											parent: parentItem  // data.selectedItem
										}, data, null)
											.then(function (newItems) {
												if (angular.isArray(newItems) && newItems.length > 0) {
													var lookupData = [];
													_.forEach(newItems, function(item) {
														if (item.PrcBoqLookup) {
															lookupData.push(item.PrcBoqLookup);
														}
														data.handleCreateSucceededWithoutSelect(item, data);
													});
													basicsLookupdataLookupDescriptorService.updateData('PrcMergeBoqView', lookupData);
												}
											})
											.finally(function(){
												isCreating = false;
												entityCreating.fire(null, isCreating);
											});
									}
								}, function() {
									isCreating = false;
									entityCreating.fire(null, isCreating);
								});
							}else {
								if (!withoutRefresh) {
									// If user cancel create,we need clear related validate errors.Otherwise it will show a validate dialog when save main entity.
									platformDataValidationService.removeDeletedEntitiesFromErrorList([data.selectedItem], service);
									// When create item there overwrite the selected item,we reset select item back.
									if (service._currentSelected) {
										service.setSelected(service._currentSelected);
										service._currentSelected = null;
									}
								}
							}
							service.isDialog = false;
							qDef.resolve(result);
						}

						function onEntityCreated(e, newItem) {
							if (boqSource === 1) {
								service.unregisterEntityCreated(onEntityCreated);
								return;
							}
							$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getprcboqextendeditem?prcBoqId=' + newItem.PrcBoqFk)
								.then(function (response) {
									if (!response && response.data && response.data.PrcBoq && response.data.BoqRootItem) {
										return;
									}
									var lookupData = response.data.PrcBoq;
									lookupData.Reference = response.data.BoqRootItem.Reference;
									lookupData.BriefInfo = response.data.BoqRootItem.BriefInfo;
									lookupData.BoqItemPrjBoqFk = response.data.BoqRootItem.BoqItemPrjBoqFk;
									basicsLookupdataLookupDescriptorService.updateData('PrcMergeBoqView', [lookupData]);
									service.gridRefresh();
								})
								.finally(function () {
									service.unregisterEntityCreated(onEntityCreated);
								});
						}
					};

					service.updateRootRow = function(){
						var selected = serviceContainer.service.getSelected();
						if (selected !== null) {
							parentService.updateHeaderConHeader(selected.ConHeaderFk);
						}
					};

					service.getVatGroupFk = function getVatGroupFk() {
						var vatGroupFk = null;
						var selectePackge = parentService.getSelected();
						if(selectePackge){
							vatGroupFk = selectePackge.BpdVatGroupFk;
						}
						return vatGroupFk;
					};

					service.canCreate = function () {
						var headerSelectedItem = parentService.getSelected();
						if (procurementContextService.canAddDeleteItemByConfiguration(service) === false || parentService.validateItemIsReadOnly(headerSelectedItem)) {
							return false;
						}
						return !!parentService.getSelected() && !parentService.noCreateOrDeleteAboutBoq;
					};
					service.canDelete = function () {
						var headerSelectedItem = parentService.getSelected();
						if (procurementContextService.canAddDeleteItemByConfiguration(service) === false || parentService.validateItemIsReadOnly(headerSelectedItem)) {
							return false;
						}
						return service.hasSelection();
					};

					basicsLookupdataLookupFilterService.registerFilter([
						{
							key: 'pes-boq-con-merge-boq-filter',
							serverSide: true,
							serverKey: 'pes-boq-con-merge-boq-filter',
							fn: function(item){
								var currentList = service.getList();
								var selectedItem = serviceContainer.service.getSelected();
								var currentItem = item ? item : selectedItem;
								// var value = service.getLookupValue(currentItem, 'ConHeaderFk:ConHeaderView');
								var notPrcBoqIds = [];
								var notBoqItemPrjBoqIds = [];
								// var prcHeaderIds = parentService.getBaseNChangeOrderPrcHeaderIds();

								var headerSelectedItem = parentService.getSelected();
								var pesHeaderId = headerSelectedItem !== null ? headerSelectedItem.Id : null;

								if(currentList) {
									var prcBoqs = basicsLookupdataLookupDescriptorService.getData('PrcMergeBoqView');
									if (prcBoqs) {
										_.forEach(currentList, function (value) {
											if (!value.PrcBoqFk){
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
									contractId: currentItem.ConHeaderFk,
									pesHeaderId: pesHeaderId
								};
							}
						},
						{
							key: 'pes-boq-package-for-pes-filter',
							serverSide: true,
							fn: function () {
								var filter = {};
								var currentItem = serviceContainer.service.getSelected();

								if (!currentItem) {
									return filter;
								}

								if (currentItem.PackageFk) {
									filter.Id = currentItem.PackageFk;
								} else if (currentItem.ConHeaderFk) { // if the packageFk is null, set the data according to conHeaderFk
									var conHeaderView = service.getLookupValue({ConHeaderFk: currentItem.ConHeaderFk}, 'ConHeaderFk:ConHeaderView');
									if (conHeaderView.PrcPackageFk) {
										filter.Id = conHeaderView.PrcPackageFk;
									}
								} else {
									filter.Id = -1;
								}

								var targetProject = service.getSelected().ProjectFk || procurementContextService.loginProject;
								if (targetProject) {
									filter.ProjectFk = targetProject;
								}

								return filter;
							}
						},
						{
							key: 'prc-boq-con-for-pes-filter',
							serverSide: true,
							fn: function(){
								var filter = 'StatusIsInvoiced = false and StatusIsCanceled = false and StatusIsVirtual = false and StatusIsOrdered = true and StatusIsDelivered = false';
								var parentPes = parentService.getSelected();

								if(!parentPes){
									return '';
								}

								if (parentPes.BusinessPartnerFk !== null && parentPes.BusinessPartnerFk !== -1 && parentPes.BusinessPartnerFk !== 0) {
									filter += ' And BusinessPartnerFk=' + parentPes.BusinessPartnerFk;
								}
								if (parentPes.ProjectFk !== null) {
									filter += ' And ProjectFk=' + parentPes.ProjectFk;
								}

								return {
									filterString: '',
									customerFilter: filter
								};
							}
						},
						{
							key: 'pes-boq-controlling-unit-filter',
							serverSide: true,
							serverKey: 'prc.con.controllingunit.by.prj.filterkey',
							fn: function () {
								var currentItem =  parentService.getSelected();
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
							key: 'pes-boq-prc-base-boq-filter',
							fn: function (item) {
								return validateBoqs(item.BoqHeader.Id, 'BoqItemPrjBoqFk', service);
							}
						}
					]);

					service.registerEntityCreated(onEntityCreated);

					// //////////////////////////

					function onEntityCreated() {
						setExchangeRate();
					}
				}

				function validateBoqs(boqHeaderId, model, service) {
					var prcBoqLookups = basicsLookupdataLookupDescriptorService.getData('PrcMergeBoqView');
					var currentPesBoqs = service.getList();
					var found = _.find(currentPesBoqs, function(pesBoq) {
						var existPrcBoq = _.find(prcBoqLookups, {Id: pesBoq.PrcBoqFk});
						if (existPrcBoq) {
							if (existPrcBoq[model]) {
								return existPrcBoq[model] === boqHeaderId;
							} else {
								return existPrcBoq.BoqHeaderFk === boqHeaderId;
							}
						}
						return false;
					});
					return !found;
				}

				function onParentItemSelectionChanged() {
					setExchangeRate();
				}

				function onParentItemExchangerateChanged(e, args) {
					var service = serviceContainer.service;
					var boqservice = prcBoqMainService.getService();

					if (boqservice && args) {
						var listItems = service.getList();
						var boqHeaderIds = _.map(listItems, 'BoqHeaderFk');
						var currentMainItem = parentService.getSelected();
						var prcBoqItem = service.getSelected();

						if(currentMainItem) {
							var exchangeRate = args.ExchangeRate;
							var newCurrencyFk = currentMainItem.CurrencyFk;
							boqservice.setCurrentExchangeRate(args.ExchangeRate);

							$http.post(globals.webApiBaseUrl + 'boq/main/recalculateboqs' + '?exchangeRate=' + exchangeRate + '&currencyFk=' + newCurrencyFk + '&doSave=true', boqHeaderIds).then(function () {
								// Before refreshing the corresponding boqs we save all other changes
								// parentService.updateAndExecute(function () {
								if (prcBoqItem) {
									boqservice.reloadBasedOnNewRoot(prcBoqItem);
								}
								// });
							});
						}
					}
				}

				function setExchangeRate() {
					var currentMainItem = parentService.getSelected();
					if(prcBoqMainService) {
						var boqservice = prcBoqMainService.getService(serviceContainer.service);
						if (boqservice && boqservice.setCurrentExchangeRate) {
							boqservice.setCurrentExchangeRate(currentMainItem ? currentMainItem.ExchangeRate : 1.0);
						}
					}
				}

				function getEntityCreatingStatus() {
					return isCreating;
				}

				function reSetVatFinalpriceFinalgross(item) {
					item.Finalprice = item.BoqRootItem.Finalprice;
					item.FinalpriceOc = item.BoqRootItem.FinalpriceOc;
					item.Vat = item.BoqRootItem.Finalgross - item.BoqRootItem.Finalprice;
					item.VatOc = item.BoqRootItem.FinalgrossOc - item.BoqRootItem.FinalpriceOc;
					item.Finalgross = item.BoqRootItem.Finalgross;
					item.FinalgrossOc = item.BoqRootItem.FinalgrossOc;
				}

				function loadList() {
					var list = serviceContainer.service.getList();
					if (list && list.length) {
						serviceContainer.service.load();
					}
				}
			}
		]);
})(window.angular);
