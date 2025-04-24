(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	let moduleName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoiceGeneralDataService',
		['$injector', 'platformDataServiceFactory', 'procurementInvoiceHeaderDataService', '$http', '_', '$q', '$translate', 'basicsLookupdataLookupDataService',
			'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'procurementContextService',
			'procurementInvoiceValidationDataService', 'platformTranslateService',
			'platformModalGridConfigService', 'procurementInvoiceGeneralReadOnlyProcessor', 'procurementInvoiceReconciliationReference',
			'PlatformMessenger', 'basicsCommonReadDataInterceptor', 'basicsCommonMandatoryProcessor', 'basicsBillingSchemaBillingLineType',
			function ($injector, dataServiceFactory, parentService, $http, _, $q, $translate, lookupDataService,
				lookupDescriptorService, lookupFilterService, moduleContext,
				validationDataService, platformTranslateService, platformModalGridConfigService,
				readonlyProcessor, reconciliationReference, PlatformMessenger, readDataInterceptor, basicsCommonMandatoryProcessor, billingSchemaBillingLineType) {

				let onGeneralsCreated = new PlatformMessenger();
				let onGeneralsDelete = new PlatformMessenger();
				let onControllingUnitOrTaxCodeChange = new PlatformMessenger();
				let self = this, parentItem;
				let serviceContainer;
				let service;
				let serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementInvoiceGeneralDataService',
						httpCRUD: {route: globals.webApiBaseUrl + 'procurement/invoice/general/'},
						dataProcessor: [readonlyProcessor],
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									return serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
								},
								initCreationData: function initCreationData(creationData) {
									let parentItem = parentService.getSelected();
									creationData.MainItemId = parentItem.Id;
									if (self.isAutoCreate) {
										creationData.PrcGeneralId = self.prcGeneralsId;
										self.prcGeneralsId = 0;
										self.isAutoCreate = false;
									}
								},
								handleCreateSucceeded: function (item) {
									let defaultItem = _.find(service.getList(), {PrcGeneralstypeFk: item.PrcGeneralstypeFk});
									if (defaultItem) {
										item.PrcGeneralstypeFk = null;
										return;
									}
									service.fireGeneralCreated(item);
								}
							}
						},
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							},
							canDeleteCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							}
						},
						entityRole: {
							leaf: {
								itemName: 'InvGenerals',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				service = serviceContainer.service;
				service.isFromContract = false;

				readDataInterceptor.init(service, serviceContainer.data);

				let filters = [
					{
						key: 'inv-generals-controlling-unit-filter',
						serverSide: true,
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						fn: function () {
							let currentItem = parentService.getSelected();
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
						key: 'procurement-invoice-generals-type-lookup',
						serverSide: true,
						fn: function () {
							return 'IsProcurement = true';
						}
					}

				];

				lookupFilterService.registerFilter(filters);

				service.init = function () {
					lookupDataService.getList('PrcGeneralsType').then(function (data) {
						if (!data) {
							return;
						}
						self.GeneralsTypes = data;
						lookupDescriptorService.updateData('PrcGeneralsType', data);
					});

				};

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				let onEntityDeleted = function onEntityDeleted(e, deletedItems) {
					let deleteEntities = [];
					if (deletedItems) {
						if (deletedItems instanceof Array) {
							deleteEntities = deletedItems;
						} else {
							deleteEntities = [deletedItems];
						}
						angular.forEach(deleteEntities, function () {
							let message = $translate.instant('procurement.invoice.reconciliationRemark',
								{
									field1: '{1}',
									field2: '{2}',
									field3: '{3}'
								}, null, 'en');
							validationDataService.deleteItemByMessage(message);

						});
						onGeneralsDelete.fire(null, deletedItems);
					}
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				let prcGeneralsTypeIds = [];
				let prcGeneralsIds = [];

				let createItems = function createItems() {
					if (prcGeneralsIds.length === 0) {
						return;
					}
					let theQ = $q.defer();
					let creationParams = {};
					parentItem = parentService.getSelected();
					if (!parentItem) {
						return;
					}
					creationParams.MainItemId = parentItem.Id;
					creationParams.PrcGeneralsIds = prcGeneralsIds;
					$http.post(serviceContainer.data.httpCreateRoute + 'createitems', creationParams).then(function (response) {
						if (serviceContainer.data.handleCreateSucceededWithoutSelect && response.data) {
							angular.forEach(response.data, function (newItem) {
								if (serviceContainer.data.handleCreateSucceededWithoutSelect && !_.find(service.getList(), {PrcGeneralstypeFk: newItem.PrcGeneralstypeFk})) {
									serviceContainer.data.handleCreateSucceededWithoutSelect(newItem, serviceContainer.data, service);
								}
							});
						}
					}).then(function () {
						service.isFromContract = false;
					});
				};

				service.registerGeneralCreated = function registerPropertyChanged(func) {
					onGeneralsCreated.register(func);
				};
				service.unregisterGeneralCreated = function unregisterPropertyChanged(func) {
					onGeneralsCreated.unregister(func);
				};
				service.fireGeneralCreated = function firePropertyChanged(entity) {
					onGeneralsCreated.fire(null, entity);
				};
				service.registerGeneralDeleted = function registerGeneralDeleted(func) {
					onGeneralsDelete.register(func);
				};
				service.unregisterGeneralDeleted = function unregisterGeneralDeleted(func) {
					onGeneralsDelete.unregister(func);
				};
				service.registerControllingUnitOrTaxCodeChange = function registerControllingUnitOrTaxCodeChange(func) {
					onControllingUnitOrTaxCodeChange.register(func);
				};
				service.unregisterControllingUnitOrTaxCodeChange = function unregisterControllingUnitOrTaxCodeChange(func) {
					onControllingUnitOrTaxCodeChange.unregister(func);
				};
				service.fireControllingUnitOrTaxCodeChange = function fireControllingUnitOrTaxCodeChange(result) {
					onControllingUnitOrTaxCodeChange.fire(null, result);
				};

				service.autoReloadGeneralsByBusinessPartnerFk = async function autoReloadGeneralsByBusinessPartnerFk() {
					const parentItem = parentService.getSelected();

					let contractData = _.find(lookupDescriptorService.getData('ConHeaderView'), {Id: parentItem.ConHeaderFk});
					if (contractData) {
						await onCopyInvGenerals(null, contractData, true);
						return;
					}
					const dataEntity = {
						MainItemId: parentItem.Id,
						ControllingunitFk: parentItem.ControllingUnitFk,
						TaxCodeFk: parentItem.TaxCodeFk,
						BusinessPartnerFk: parentItem.BusinessPartnerFk
					};

					reloadGeneralsByBusinessPartnerFk(dataEntity);
				};

				let reloadGeneralsByBusinessPartnerFk = service.reloadGeneralsByBusinessPartnerFk = function reloadGeneralsByBusinessPartnerFk(dataEntity) {
					$http.post(globals.webApiBaseUrl + 'procurement/invoice/general/reloadbybp', dataEntity).then(function (res) {
						if (res && res.data) {
							let originalTypes = res.data.OriginalGeneralTypes;
							if (originalTypes) {
								_.forEach(service.getList(), function (item) {
									if (item.PrcGeneralstypeFk && _.includes(originalTypes, item.PrcGeneralstypeFk)) {
										serviceContainer.data.deleteItem(item, serviceContainer.data);
									}
								});
							}

							let fixGenerals = matchGeneralsByBillingSchemas(service.getList(), res.data.Main);
							if (fixGenerals) {
								_.forEach(fixGenerals, function (item) {
									if (serviceContainer.data.handleCreateSucceededWithoutSelect && !_.find(service.getList(), {PrcGeneralstypeFk: item.PrcGeneralstypeFk})) {
										serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
									}
								});
							}

							deleteItemByUnMatchGeneralType(fixGenerals);
						}
					});
				};

				function getAllBillingSchemas() {
					let items = $injector.get('invoiceBillingSchemaDataService').getList();
					let hiddenItems = $injector.get('invoiceBillingSchemaDataService').getHiddenItems();
					return  _.union(items, hiddenItems);
				}

				function matchGeneralsByBillingSchemas(OriginalGeneral, NewGeneral) {
					let generalTypeIds = _.uniq(_.map(getAllBillingSchemas(), 'GeneralsTypeFk'));
					let list = [];

					if (OriginalGeneral) {
						let _OriginalGeneral = angular.copy(OriginalGeneral);
						_.forEach(_OriginalGeneral, function (item) {
							if (_.includes(generalTypeIds, item.PrcGeneralstypeFk)) {
								let _item = _.find(NewGeneral, {PrcGeneralstypeFk: item.PrcGeneralstypeFk});
								if (_item) {
									item.Value = _item.Value;
									item.MdcControllingunitFk = _item.MdcControllingunitFk;
									item.MdcTaxCodeFk = _item.MdcTaxCodeFk;
								}
								list.push(item);
							}
						});
					}
					if (NewGeneral) {
						_.forEach(NewGeneral, function (item) {
							if (_.includes(generalTypeIds, item.PrcGeneralstypeFk) && !_.find(list, {PrcGeneralstypeFk: item.PrcGeneralstypeFk})) {
								list.push(item);
							}
						});
					}
					return list;
				}

				function processGeneralsByBillingSchemas(newGeneral) {
					let generalTypeIds = _.uniq(_.map(getAllBillingSchemas(), 'GeneralsTypeFk'));
					let list = [];
					if (newGeneral) {
						newGeneral.forEach(r => {
							if (_.includes(generalTypeIds, r.PrcGeneralstypeFk)) {
								list.push(r);
							}
						});
					}
					return list;
				}

				function deleteItemByUnMatchGeneralType(fixGenerals) {
					let generalTypeIds = _.uniq(_.map(fixGenerals, 'PrcGeneralstypeFk'));
					_.forEach(service.getList(), function (item) {
						if (item.PrcGeneralstypeFk && !_.includes(generalTypeIds, item.PrcGeneralstypeFk)) {
							serviceContainer.data.deleteItem(item, serviceContainer.data);
						}
					});
				}

				let copyPrcGenerals = function copyPrcGenerals(prcHeaderId, conCode, conDesc,is4billingSchemas) { // jshint ignore:line
					if (!prcHeaderId) {
						return;
					}
					let url = globals.webApiBaseUrl + 'procurement/common/prcgenerals/getlist?mainItemId=' + prcHeaderId;
					$http.get(url).then(function (response) {
						if (response.data && response.data.length > 0) {
							let invBillingSchemaService = $injector.get('invoiceBillingSchemaDataService');
							let invBillingSchemas = invBillingSchemaService.getList();
							let invGeneralTypeBillingSchemas = _.filter(invBillingSchemas, {BillingLineTypeFk: billingSchemaBillingLineType.generals});
							angular.forEach(invGeneralTypeBillingSchemas, function (bs) {
								let relativeGenerals = _.filter(response.data, {PrcGeneralstypeFk: bs.GeneralsTypeFk});
								let sortingGenerals = _.orderBy(relativeGenerals, ['Id'], ['asc']);
								if (sortingGenerals && sortingGenerals.length) {
									if (sortingGenerals[0].MdcTaxCodeFk) {
										bs.TaxCodeFk = sortingGenerals[0].MdcTaxCodeFk;
									}
									if (sortingGenerals[0].MdcControllingunitFk) {
										bs.ControllingUnitFk = sortingGenerals[0].MdcControllingunitFk;
									}
									if (sortingGenerals[0].MdcTaxCodeFk || sortingGenerals[0].ControllingUnitFk) {
										invBillingSchemaService.markItemAsModified(bs);
									}
								}
							});

							let generalsList = service.getList();
							let fixGenerals = is4billingSchemas ? matchGeneralsByBillingSchemas(generalsList, response.data)
								: processGeneralsByBillingSchemas(response.data);

							angular.forEach(fixGenerals, function (prcGeneral) {
								let item = _.find(generalsList, {PrcGeneralstypeFk: prcGeneral.PrcGeneralstypeFk});
								if (!item) {
									if (prcGeneralsTypeIds.indexOf(prcGeneral.PrcGeneralstypeFk) === -1) {
										prcGeneralsTypeIds.push(prcGeneral.PrcGeneralstypeFk);
										prcGeneralsIds.push(prcGeneral.Id);
									}
								} else {
									let IsModified = false;

									if (prcGeneral.MdcTaxCodeFk) {
										item.TaxCodeFk = prcGeneral.MdcTaxCodeFk;
										IsModified = true;
									}
									if (prcGeneral.MdcControllingunitFk) {
										item.ControllingUnitFk = prcGeneral.MdcControllingunitFk;
										IsModified = true;
									}
									if (item.Value !== prcGeneral.Value) {
										let generalsTypeItem = _.find(self.GeneralsTypes, {Id: prcGeneral.PrcGeneralstypeFk});
										if (!generalsTypeItem) {
											return;
										}
										item.Value = prcGeneral.Value;
										IsModified = true;
									}
									if (IsModified) {
										service.markItemAsModified(item);
									}
								}
							});

							deleteItemByUnMatchGeneralType(fixGenerals);
							createItems();
							service.isFromContract = true;
						}
					});
				};

				/**
				 * @param {*} e
				 * @param {*} contractData
				 * @param {*} is4billingSchemas  Judge from the billingSchemas refresh button??
				 */
				let onCopyInvGenerals = function onCopyInvGenerals(e, contractData,is4billingSchemas) {
					validationDataService.initDialogItems();
					prcGeneralsTypeIds.length = 0;
					prcGeneralsIds.length = 0;

					if (!self.GeneralsTypes) {
						lookupDataService.getList('PrcGeneralsType').then(function (data) {
							if (!data) {
								return;
							}
							self.GeneralsTypes = data;
							copyPrcGenerals(contractData.PrcHeaderId, contractData.Code, contractData.Description,is4billingSchemas);
						});
					} else {
						copyPrcGenerals(contractData.PrcHeaderId, contractData.Code, contractData.Description,is4billingSchemas);
					}
				};


				function onModuleReadonlyStatusChange(key) {
					if (key !== moduleContext.moduleStatusKey) {
						return;
					}

					angular.forEach(service.getList(), function (item) {
						readonlyProcessor.processItem(item);
					});
				}

				moduleContext.moduleValueChanged.register(onModuleReadonlyStatusChange);
				parentService.onCopyInvGenerals.register(onCopyInvGenerals);

				let onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
					/** @namespace completeData.InvGenerals */
					let items = completeData.InvGenerals || [];
					service.setCreatedItems(items);
					_.forEach(items, function (item) {// copy generals value to billingSchema
						service.fireGeneralCreated(item);
					});
				};

				parentService.completeEntityCreateed.register(onCompleteEntityCreated);

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'InvGeneralsDto',
					moduleSubModule: 'Procurement.Invoice',
					validationService: 'procurementInvoiceGeneralsValidationService',
					mustValidateFields: ['PrcGeneralstypeFk', 'Value']
				});

				return service;
			}]);
})(angular);