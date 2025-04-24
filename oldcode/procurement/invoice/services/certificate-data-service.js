(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global globals, angular */
	// jshint -W072
	// jshint -W074
	var moduleName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoiceCertificateDataService',
		['platformDataServiceFactory', 'procurementInvoiceHeaderDataService', 'procurementContextService',
			'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'platformRuntimeDataService',
			'procurementInvoiceCertificateReadOnlyProcessor', 'basicsLookupdataLookupDescriptorService', '$http',
			'procurementInvoiceValidationDataService', 'basicsLookupdataLookupDataService', '$translate',
			'procurementInvoiceReconciliationReference', 'basicsCommonReadDataInterceptor', 'PlatformMessenger', 'ServiceDataProcessDatesExtension',
			'_', 'procurementCommonHelperService',
			function (dataServiceFactory, parentService, moduleContext, lookupDescriptorService, basicsLookupdataLookupFilterService,
				runtimeDataService, readonlyProcessor, basicsLookupdataLookupDescriptorService, $http, validationDataService,
				basicsLookupdataLookupDataService, $translate, reconciliationReference, readDataInterceptor, PlatformMessenger, ServiceDataProcessDatesExtension,
				_, procurementCommonHelperService) {

				var serviceContainer;
				var service;
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementInvoiceCertificateDataService',
						httpCRUD: {route: globals.webApiBaseUrl + 'procurement/invoice/certificate/'},
						dataProcessor: [readonlyProcessor, new ServiceDataProcessDatesExtension(['RequiredBy'])],
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									var dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
									serviceContainer.service.containerData = data; // jshint ignore : line

									return dataRead;
								},
								initCreationData: function (creationData) {
									creationData.mainItemId = parentService.getSelected().Id;
									var certificateTypeIds = [];
									_.forEach(service.getList(), function (item) {
										if (item.BpdCertificateTypeFk) {
											certificateTypeIds.push(item.BpdCertificateTypeFk);
										}
									});
									creationData.certificateTypeIds = certificateTypeIds;
								}
							}
						},
						actions: {
							delete: true, create: false,
							canCreateCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							},
							canDeleteCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							}
						},
						entityRole: {
							leaf: {
								itemName: 'InvCertificate',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				serviceContainer.data.entityCreated = new PlatformMessenger();

				service = serviceContainer.service;
				readDataInterceptor.init(service, serviceContainer.data);

				service.updateReadOnly = function (item) {
					readonlyProcessor.processItem(item);
				};

				service.deleteAll = () => {
					serviceContainer.data.supportUpdateOnSelectionChanging = false;
					service.deleteEntities(service.getList());
					serviceContainer.data.supportUpdateOnSelectionChanging = true;
				};

				service.copyAndUpdateCertificates = function copyAndUpdateCertificates(invConHeaderResponse, conHeaderId) { // todo livia
					var parentItem = angular.copy(parentService.getSelected());
					if (parentItem !== null && parentItem !== undefined) {
						parentItem.ProjectFk = invConHeaderResponse.ProjectFk;
						parentItem.ControllingUnitFk = invConHeaderResponse.ControllingUnitFk;
						parentItem.PrcStructureFk = invConHeaderResponse.PrcStructureFk;
						parentItem.ClerkPrcFk = invConHeaderResponse.ClerkPrcFk;
						parentItem.ClerkReqFk = invConHeaderResponse.ClerkReqFk;
					} else {
						return;
					}

					var requestData = {
						prcHeaderId: invConHeaderResponse.PrcHeaderId,
						parentItem: parentItem,
						conHeaderId: conHeaderId,
						businessPartnerId: invConHeaderResponse.BusinessPartnerFk
					};

					$http.post(globals.webApiBaseUrl + 'procurement/invoice/certificate/copycertificates', requestData
					).then(function (response) {
							if (response.data) {
								let copiedCertificates = response.data.CopiedCertificates;
								service.deleteAll();

								angular.forEach(copiedCertificates, function (item) {
									if (serviceContainer.data.handleCreateSucceededWithoutSelect) {
										serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
									}
								});
								service.gridRefresh();

								createReconciliations();
							}
						}
					);
				};

				var conHeaderDataFromItems,
					conHeaderDataFromPes;

				service.refreshItem = function () {
					var parentItem = parentService.getSelected();
					var certificatesList = service.getList();
					var requestData = {
						invHeader: parentItem,
						invCertificates: certificatesList
					};
					service.getConHeaderDataFromItems.fire();
					service.getConHeaderDataFromPes.fire();
					requestData.conHeaderFromItems = conHeaderDataFromItems;
					if (conHeaderDataFromPes.length) {
						$http.post(globals.webApiBaseUrl + 'procurement/pes/header/getConHeaderIds', conHeaderDataFromPes).then(function (response) {
							if (response.data && response.data.length) {
								requestData.conHeaderFromPes = _.map(response.data, 'ConHeaderFk');
							} else {
								requestData.conHeaderFromPes = [];
							}
							refresh();
						}, function () {
							requestData.conHeaderFromPes = [];
							refresh(); // jshint ignore:line
						});
					} else {
						refresh();
					}

					function refresh() {
						$http.post(globals.webApiBaseUrl + 'procurement/invoice/certificate/refresh', requestData
						).then(function (response) {
							if (response.data) {
								let foundCertificates = response.data.FoundCertificates;
								service.setList(foundCertificates);
								createReconciliations();
								service.gridRefresh();
							}
						});
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


				let certificateTypes = [];

				function createReconciliations() {
					_.forEach(service.getList(), function (certificateItem) {
						let remark = '';
						let certificateType = certificateItem.BpdCertificateTypeFk ? _.find(certificateTypes, {Id: certificateItem.BpdCertificateTypeFk}) : null;
						if (certificateItem.BpdCertificateFk === null && certificateType) {// there is some problems
							remark = $translate.instant('procurement.invoice.reconciliationWarning',
								{
									description: certificateType.Description
								}, null, 'en');
							let messageFormat = $translate.instant('procurement.invoice.reconciliationWarning',
								{
									description: '{1}'
								}, null, 'en');
							validationDataService.checkValidation(remark, reconciliationReference.certificate, messageFormat, certificateType.Description);
						} else {
							certificateType = _.find(certificateTypes, {Id: certificateItem.BpdCertificateTypeFk});
							if (certificateType) {
								remark = $translate.instant('procurement.invoice.reconciliationWarning',
									{
										description: certificateType.Description
									}, null, 'en');
								validationDataService.deleteItemByMessage(remark);
							}
						}
					});
					validationDataService.createValidations();
				}

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
						angular.forEach(deleteEntities, function (entity) {
							let certificateType = _.find(certificateTypes, {Id: entity.BpdCertificateTypeFk});
							if (certificateType) {
								const remark = $translate.instant('procurement.invoice.reconciliationWarning', {description: certificateType.Description}, null, 'en');
								validationDataService.deleteItemByMessage(remark);
							}
						});
					}
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				let onEntityCreated = function onCompleteEntityCreated(e, item) {
					service.setCreatedItems(item || []);
				};

				serviceContainer.data.entityCreated.register(onEntityCreated);

				moduleContext.moduleValueChanged.register(onModuleReadonlyStatusChange);


				basicsLookupdataLookupDataService.getList('CertificateType').then(function (response) {
					certificateTypes = response;
				});

				var onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
					/** @namespace completeData.InvCertificates */
					service.setCreatedItems(completeData.InvCertificates || []);
				};

				conHeaderDataFromItems = [];
				conHeaderDataFromPes = [];
				service.getConHeaderDataFromItems = new PlatformMessenger();
				service.getConHeaderDataFromPes = new PlatformMessenger();

				service.setConHeaderFromItems = function (data) {
					conHeaderDataFromItems = data;
				};

				service.setConHeaderFromPes = function (data) {
					conHeaderDataFromPes = data;
				};
				parentService.completeEntityCreateed.register(onCompleteEntityCreated);

				service.copyCertificatesFromOtherModule = function copyCertificatesFromOtherModule(options) {
					procurementCommonHelperService.copyCertificatesFromOtherModule(options);
				};

				service.createCertificates = function (items) {
					if (serviceContainer.data.onCreateSucceeded && angular.isArray(items)) {
						_.forEach(items, function (item) {
							serviceContainer.data.onCreateSucceeded(item, serviceContainer.data, {});
						});
					}
				};

				return service;
			}]);
})(angular);