/**
 * Created by wui on 5/15/2015.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Platform */

	var moduleName = 'businesspartner.certificate';

	/* jshint -W072 */// has too many parameters
	angular.module(moduleName).factory('businesspartnerCertificateCertificateDataServiceFactory',
		['platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupFilterService', 'platformRuntimeDataService',
			'basicsLookupdataLookupDescriptorService', '$q', 'ServiceDataProcessDatesExtension', 'businessPartnerHelper',
			'procurementContractHeaderDataService', 'procurementInvoiceHeaderDataService', 'procurementCommonSubcontractorDataService',
			'procurementContextService', '$timeout', 'basicsCommonMandatoryProcessor', '$http', '_', '$injector', 'businesspartnerStatusRightService',
			'salesBidService', 'salesContractService', 'salesBillingService', 'cloudDesktopSidebarService',
			function (platformDataServiceFactory, platformContextService, basicsLookupdataLookupFilterService, platformRuntimeDataService,
				basicsLookupdataLookupDescriptorService, $q, ServiceDataProcessDatesExtension, businessPartnerHelper,
				procurementContractHeaderDataService, procurementInvoiceHeaderDataService, procurementCommonSubcontractorDataService,
				procurementContextService, $timeout, basicsCommonMandatoryProcessor, $http, _, $injector, businesspartnerStatusRightService,
				salesBidService, salesContractService, salesBillingService, cloudDesktopSidebarService) {
				var factory = {};
				var loginCompany = platformContextService.clientId;
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					// orderBy: [{Field: 'BusinessPartnerName1'}],
					useCurrentClient: true,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					withExecutionHints: true,
					enhancedSearchVersion: '2.0',
					includeDateSearch:true
				};
				var lookupFilters = [
					{
						key: 'businesspartner-certificate-certificate-contract-filter',
						serverKey: 'businesspartner-certificate-certificate-contract-filter',
						serverSide: true,
						fn: function (entity) {
							// return entity.BusinessPartnerFk >= 0 && entity.BusinessPartnerFk ? ('BusinessPartnerFk = ' + entity.BusinessPartnerFk) : '';
							return {BusinessPartnerFk: entity.BusinessPartnerFk, ProjectFk: entity.ProjectFk};
						}
					},
					{
						key: 'businesspartner-certificate-contract-bp-filter',
						serverSide: true,
						serverKey: 'businesspartner-certificate-contract-bp-filter',
						fn: function () {
							var contract = procurementContractHeaderDataService.getSelected(),
								subContractors = procurementCommonSubcontractorDataService.getService(procurementContextService.getMainService()).getList();
							var bpfks = [];

							if (contract) {
								if (contract.BusinessPartnerFk) {
									bpfks.push(contract.BusinessPartnerFk);
								}
								if (subContractors && subContractors.length) {
									subContractors.forEach(function (item) {
										bpfks.push(item.BpdBusinesspartnerFk);
									});
								}
							}

							return {
								Ids: bpfks
							};
						}
					},
					{
						key: 'businesspartner-certificate-invoice-bp-filter',
						serverSide: true,
						serverKey: 'businesspartner-certificate-invoice-bp-filter',
						fn: function () {
							var currentItem = procurementInvoiceHeaderDataService.getSelected();
							if (currentItem) {
								return {
									Ids: currentItem !== null ? [currentItem.BusinessPartnerFk] : null
								};
							}
						}
					},
					{
						key: 'businesspartner-certificate-sales-bp-filter',
						serverSide: true,
						serverKey: 'businesspartner-certificate-sales-bp-filter',
						fn: function () {
							var currentItem = salesContractService.getSelected();
							if (currentItem) {
								return {
									Ids: currentItem !== null ? [currentItem.BusinesspartnerFk] : null
								};
							}
						}
					},
					{
						key: 'businesspartner-main-subsidiary-common-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity.BusinessPartnerFk
							};
						}
					}
				];
				var dateProcessor = new ServiceDataProcessDatesExtension(['CertificateDate', 'ValidFrom', 'ValidTo', 'ReferenceDate', 'ExpirationDate', 'RequiredDate', 'DischargedDate', 'ValidatedDate', 'ReclaimDate1', 'ReclaimDate2', 'ReclaimDate3', 'CostReimbursedDate']);

				basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

				basicsLookupdataLookupDescriptorService.loadData(['company', 'CertificateStatus', 'CertificateType', 'currency']);

				factory.options = {
					'businesspartner.certificate': {
						flatRootItem: {
							module: angular.module(moduleName),
							serviceName: 'businesspartnerCertificateDataService',
							entityRole: {
								root: {
									itemName: 'Certificates',
									moduleName: 'cloud.desktop.moduleDisplayNameCertificate',
									codeField: 'Code',
									descField: 'Reference',
									addToLastObject: true,
									lastObjectModuleName: moduleName,
									useIdentification: true
								}
							},
							entitySelection: {supportsMultiSelection: true},
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								usePostForRead: true,
								endRead: 'listdata'
							},
							httpCreate: {
								route: globals.webApiBaseUrl +'businesspartner/certificate/certificate/',
								endCreate: 'createdata'
							},
							httpUpdate: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endUpdate: 'updatedata'
							},
							httpDelete: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endDelete: 'deletedatalist'
							},

							modification: {
								multi: function () {
								}
							},
							sidebarSearch: {options: sidebarSearchOptions},
							sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
							dataProcessor: [dateProcessor]
						}
					},
					'businesspartner.main': {
						flatNodeItem: {
							serviceName: 'businesspartnerMainCertificateDataService',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtobp'
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endCreate: 'createtobp'
							},
							dataProcessor: [dateProcessor]
						}
					},
					'project.main': {
						flatLeafItem: {
							serviceName: 'businesspartnerCertificateCertificateDataServiceFactory',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtoproject'
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endCreate: 'createtoproject'
							},
							dataProcessor: [dateProcessor]
						}
					},
					'procurement.contract': {
						flatLeafItem: {
							serviceName: 'businesspartnerCertificateCertificateDataServiceFactory',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtocontract'
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endCreate: 'createtocontract'
							},
							dataProcessor: [dateProcessor]
						}
					},
					'procurement.quote': {
						flatLeafItem: {
							serviceName: 'businesspartnerCertificateCertificateDataServiceFactory',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtoquote'
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endCreate: 'createtoquote'
							},
							dataProcessor: [dateProcessor]
						}
					},
					'procurement.invoice': {
						flatLeafItem: {
							serviceName: 'businesspartnerCertificateCertificateDataServiceFactory',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtoinvoice'
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endCreate: 'createtoinvoice'
							},
							dataProcessor: [dateProcessor]
						}
					},
					'sales.bid': {
						flatLeafItem: {
							serviceName: 'businesspartnerCertificateCertificateDataServiceFactory',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtosalesbid',
								initReadData: function initReadData(readData) {
									var selectedHeader = salesBidService.getSelected();
									if (selectedHeader) {
										readData.filter = '?bidHeaderId=' + selectedHeader.Id;
									} else {
										readData.filter = '?bidHeaderId=-1';
									}
									return readData;
								}
							},
							dataProcessor: [dateProcessor],
							actions: {
								delete: true, create: 'flat',
								canCreateCallBackFunc: function () {
									return false;
								},
								canDeleteCallBackFunc: function () {
									return false;
								}
							}
						}
					},
					'sales.contract': {
						flatLeafItem: {
							serviceName: 'businesspartnerCertificateCertificateDataServiceFactory',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtosalescontract'
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endCreate: 'createtosalescontract'
							},
							dataProcessor: [dateProcessor],
							actions: {
								delete: true, create: 'flat'
							}
						}
					},
					'sales.billing': {
						flatLeafItem: {
							serviceName: 'businesspartnerCertificateCertificateDataServiceFactory',
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate/',
								endRead: 'listtosalescontract',
								initReadData: function initReadData(readData) {
									var selectedHeader = salesBillingService.getSelected();
									if (selectedHeader && selectedHeader.OrdHeaderFk !== null && selectedHeader.OrdHeaderFk !== undefined && selectedHeader.OrdHeaderFk > -1) {
										readData.filter = '?mainItemId=' + selectedHeader.OrdHeaderFk;
									} else {
										readData.filter = '?mainItemId=-1';
									}
									return readData;
								}
							},
							dataProcessor: [dateProcessor],
							actions: {
								delete: true, create: 'flat',
								canCreateCallBackFunc: function () {
									return false;
								},
								canDeleteCallBackFunc: function () {
									return false;
								}
							}
						}
					}
				};

				factory.create = function (moduleId, options) {
					var readOnlyFields = ['BusinessPartnerFk', 'ConHeaderFk', 'CompanyFk', 'CertificateStatusFk', 'CertificateTypeFk',
						'Code', 'CertificateDate', 'Issuer', 'BusinessPartnerIssuerFk', 'ValidFrom', 'ValidTo', 'Reference',
						'ReferenceDate', 'ProjectFk', 'Amount', 'CurrencyFk', 'ExpirationDate', 'RequiredDate', 'DischargedDate',
						'ValidatedDate', 'CommentText',  'OrdHeaderFk', 'SubsidiaryFk'];
					var otherReadOnlyFields = ['RequiredDate', 'GuaranteeCost', 'GuaranteeCostPercent', 'ReclaimDate1', 'ReclaimDate2',
						'ReclaimDate3', 'Islimited', 'CostReimbursable', 'CostReimbursedDate', 'Userdefined1', 'Userdefined2',
						'Userdefined3', 'Userdefined4', 'Userdefined5'];

					var serviceOptions = factory.options[moduleId];
					// var itemName = serviceOptions.flatRootItem ? 'flatRootItem' : 'flatLeafItem';
					var itemName = serviceOptions.flatRootItem ? 'flatRootItem' : (serviceOptions.flatNodeItem ? 'flatNodeItem' : 'flatLeafItem');

					if (options && options[itemName]) {
						angular.extend(serviceOptions[itemName], options[itemName]);
					}

					serviceOptions[itemName].dataProcessor.push({processItem: processItem});

					serviceOptions[itemName].presenter = {
						list: {
							incorporateDataRead: getIncorporateDataRead(moduleId),
							handleCreateSucceeded: handleCreateSucceeded
						}
					};

					var container = platformDataServiceFactory.createNewComplete(serviceOptions);

					// noinspection JSUnresolvedVariable
					container.service.requiredValidationEvent = new Platform.Messenger();

					container.service.onCertificateTypeChanged = function (entity, value) {
						var callBack = function (typeItem) {
							/** @namespace typeItem.HasCompany */
							entity.CompanyFk = typeItem && typeItem.HasCompany ? loginCompany : null;
						};

						updateReadonlyFields(entity, value, entity.CertificateStatusFk, {
							isRefreshGrid: true,
							callBack: callBack
						});
						container.service.requiredValidationEvent.fire(null, entity);
					};

					container.service.onCertificateStatusChanged = function (entity, value) {
						updateReadonlyFields(entity, entity.CertificateTypeFk, value, {isRefreshGrid: true});
						container.service.requiredValidationEvent.fire(null, entity);
					};

					container.service.onContractChanged = function (entity, value) {
						return basicsLookupdataLookupDescriptorService.loadItemByKey('conheader', value).then(function (lookupItem) {
							if (lookupItem) {
								entity.ProjectFk = lookupItem.ProjectFk;
								entity.BusinessPartnerFk = lookupItem.BusinessPartnerFk;
							}
							container.service.gridRefresh();
							provideLookupData(entity);
						});
					};

					container.service.navigateTo = function (item, triggerField) {
						var data = getNavData(item, triggerField);
						if (angular.isNumber(data)) {
							cloudDesktopSidebarService.filterSearchFromPKeys([data]);
						} else if (angular.isString(data)) {
							cloudDesktopSidebarService.filterSearchFromPattern(data);
						} else if (angular.isArray(data)) {
							cloudDesktopSidebarService.filterSearchFromPKeys(data);
						} else {
							$http.post(container.data.httpReadRoute + 'navigation', data).then(function (response) {
								cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
							});
						}
					};

					container.service.onBusinessPartnerChanged = function (entity, value) {
						if (entity.BusinessPartnerFk !== value) {
							entity.ConHeaderFk = null;
						}
					};

					if (moduleId === 'businesspartner.certificate' || moduleId === 'businesspartner.main') {
						container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
							typeName: 'CertificateDto',
							moduleSubModule: 'BusinessPartner.Certificate',
							validationService: 'businesspartnerCertificateCertificateValidationService',
							mustValidateFields: ['BusinessPartnerFk', 'Code']
						});
						var originalValidate = container.data.newEntityValidator.validate;
						container.data.newEntityValidator.validate = function ( item ) {
							originalValidate( item );
							container.service.requiredValidationEvent.fire(null, item);
						};
					}
					if (moduleId === 'procurement.contract') {
						container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
							typeName: 'CertificateDto',
							moduleSubModule: 'BusinessPartner.Certificate',
							validationService: 'businesspartnerCertificateCertificateValidationService',
							mustValidateFields: ['ConHeaderFk']
						});
						var originalValidate = container.data.newEntityValidator.validate;
						container.data.newEntityValidator.validate = function ( item ) {
							originalValidate( item );
							container.service.requiredValidationEvent.fire(null, item);
						};
					}

					if (!container.data.newEntityValidator) {
						container.data.newEntityValidator = {
							validate: function ( item ) {
								container.service.requiredValidationEvent.fire(null, item);
							}
						};
					}

					function updateReadonlyFields(entity, typeId, statusId, options) {

						if (moduleId === 'sales.billing' || moduleId === 'sales.bid') {
							var allReadOnlyArr = readOnlyFields.concat(otherReadOnlyFields).map(function (field) {
								return {
									field: field,
									readonly: true
								};
							});
							return platformRuntimeDataService.readonly(entity, allReadOnlyArr);
						}
						var certificateType = basicsLookupdataLookupDescriptorService.getData('certificatetype');
						var certificateStatus = basicsLookupdataLookupDescriptorService.getData('certificatestatus');

						var readonlyArray = [];

						entity._typeItem = _.find(certificateType, {Id: typeId});
						entity._statusItem = _.find(certificateStatus, {Id: statusId});
						if (!hasRightForCerType('hasWriteAccessResult', typeId) && entity.Version !== 0) {
							readonlyArray = readOnlyFields.concat(otherReadOnlyFields).map(function (field) {
								return {
									field: field,
									readonly: true
								};
							});
						} else if (entity._statusItem.IsReadonly && entity.Version !== 0) {
							readonlyArray = readOnlyFields.concat(otherReadOnlyFields).map(function (field) {
								return {
									field: field,
									readonly: true
								};
							});
						}
						// need the same company can change the data
						else if (entity.CompanyFk) {
							var NowCompany = platformContextService.getContext();
							if (entity.CompanyFk !== NowCompany.clientId) {
								readonlyArray = readOnlyFields.concat(otherReadOnlyFields).map(function (field) {
									return {
										field: field,
										readonly: true
									};
								});
							}

						} else if (moduleId === 'sales.contract') {
							readonlyArray.push({field: 'OrdHeaderFk', readonly: true});
						}
						// container.service.requiredValidationEvent.fire(null, entity);
						if (readonlyArray.length > 0) {
							platformRuntimeDataService.readonly(entity, readonlyArray);
						}

						if (options) {
							if (options.callBack) { // execute call back
								options.callBack(entity._typeItem, entity._statusItem);
							}
							if (options.isRefreshGrid) { // refresh grid ui
								container.service.gridRefresh();
							}
						}
					}

					function processItem(entity) {
						updateReadonlyFields(entity, entity.CertificateTypeFk, entity.CertificateStatusFk);
						// container.service.requiredValidationEvent.fire(null,entity);
					}

					function getNavData(item) {
						if (angular.isDefined(item.Id)) {
							return item.Id !== null ? item.Id : -1;
						} else if (angular.isDefined(item.Code)) {
							return item.Code !== null ? item.Code : '-1';
						}
					}

					// todo livia
					// register basics.company-certificate navigation before navigate to basics.company.
					// so get basicsCompanyMainService to init it although do nothing here with it.
					$injector.get('basicsCompanyMainService');

					function getIncorporateDataRead(moduleId) {
						if (moduleId === 'businesspartner.certificate') {
							return incorporateDataReadWithRight;
						} else if (moduleId === 'businesspartner.main') {
							return function (readItems, data) {
								var parentService = container.service.parentService();
								var status = parentService.getItemStatus();
								if (status.IsReadonly === true) {
									businesspartnerStatusRightService.setListDataReadonly(readItems.dtos, true);
								}

								return incorporateDataRead(readItems, data);
							};
						} else {
							return incorporateDataRead;
						}
					}

					function incorporateDataReadWithRight(readItems, data) {
						return incorporateDataRead(readItems, data);
					}

					function incorporateDataRead(readItems, data) {
						basicsLookupdataLookupDescriptorService.attachData(readItems || {});
						var dataRead = data.handleReadSucceeded(readItems, data);

						if (readItems.dtos && readItems.dtos.length === 0) {
							container.data.selectionChanged.fire();
						}

						return dataRead;
					}

					function provideLookupData(entity) {
						var lookupCollector = {
								collect: function (field) {
									var isLookup;
									switch (field) {
										case 'BusinessPartnerFk':
										case 'CertificateStatusFk':
										case 'CompanyFk':
										case 'CertificateTypeFk':
										case 'ProjectFk':
										case 'CurrencyFk':
											isLookup = true;
											break;
										case 'BusinessPartnerIssuerFk':
											isLookup = 'BusinessPartner';
											break;
									}
									return isLookup;
								}
							},
							result = basicsLookupdataLookupDescriptorService.provideLookupData(entity, lookupCollector);

						if (!result.dataReady) {
							result.dataPromise.then(function () {
								container.service.gridRefresh();
							});
						}
					}

					function handleCreateSucceeded(newItem, data) {
						setInitBusinessPartnerFk(newItem, data);
						if (moduleId === 'procurement.invoice') {
							basicsLookupdataLookupDescriptorService.loadItemByKey('CertificateType', newItem.CertificateTypeFk).then(function (certificateType) {
								if (certificateType.HasProject) {
									newItem.ProjectFk = data.currentParentItem.ProjectFk;
								}
								if (certificateType.HasContract) {
									newItem.ConHeaderFk = data.currentParentItem.ConHeaderFk;
								}
							});
						}
						if (moduleId === 'sales.contract') {
							newItem.BusinessPartnerFk = newItem.BusinessPartnerFk && newItem.BusinessPartnerFk > -1 ? newItem.BusinessPartnerFk : data.currentParentItem.BusinesspartnerFk;
							newItem.CompanyFk = newItem.CompanyFk && newItem.CompanyFk > -1 ? newItem.CompanyFk : data.currentParentItem.CompanyFk;
							newItem.ProjectFk = newItem.ProjectFk && newItem.ProjectFk > -1 ? newItem.ProjectFk : data.currentParentItem.ProjectFk;



							var readOnlyMap = [];
							readOnlyMap.push({
								field: 'OrdHeaderFk',
								readonly: true
							});
							platformRuntimeDataService.readonly(newItem, readOnlyMap);
						}
						provideLookupData(newItem);
					}

					function setInitBusinessPartnerFk(newItem, data) {
						newItem.BusinessPartnerFk = newItem.BusinessPartnerFk && newItem.BusinessPartnerFk > -1 ? newItem.BusinessPartnerFk :
							((data.currentParentItem && (data.currentParentItem.BusinessPartnerFk || data.currentParentItem.BusinesspartnerFk)) || -1);
					}
					// user for reloading items after required certificates wizard runed.
					container.service.callRefresh = container.service.refresh || container.data.onRefreshRequested;

					function getCertificateTypesWithAccessRight() {

						$http.get(globals.webApiBaseUrl + 'businesspartner/certificate/certificate/getaccessright2certificatetype').then(function (response) {
							if (response) {
								container.service.certificateTypesWithAccessRight = response.data || {};
							}
						});
					}

					function hasRightForCerType(rightType, typeId) {
						var obj = container.service.certificateTypesWithAccessRight;
						if (obj && rightType) {
							var rightObj = obj[rightType];
							if (rightObj && typeId) {
								if (_.find(rightObj, {Id: typeId})) {
									return true;
								}
							}
						}
						return false;
					}

					var setReadonlyor = function () {
						var name = container.service.parentService().getModule().name;
						if (_.startsWith(name, 'procurement')) {
							var getModuleStatusFn = container.service.parentService().getItemStatus || container.service.parentService().getModuleState;
							if (getModuleStatusFn) {
								var status = getModuleStatusFn();
								return !(status.IsReadOnly || status.IsReadonly);
							}
							return false;
						}
						return true;
					};

					var canCreate = container.service.canCreate;
					var canDelete = container.service.canDelete;
					container.service.canDelete = function () {
						var selectedItem = container.service.getSelected();
						if (moduleId === 'procurement.contract') {
							var parentService = container.service.parentService();
							var parentSelectedItem = parentService.getSelected();
							if (parentSelectedItem && parentSelectedItem.ConStatus&&parentSelectedItem.ConStatus.IsReadonly) {
								return false;
							}
						}
						if (moduleId === 'procurement.invoice') {
							return canDelete() && setReadonlyor();
						}
						if (moduleId === 'sales.billing' || moduleId === 'sales.bid') {
							return false;
						}
						if (moduleId === 'sales.contract' && salesContractService.isReadStatusOnly()) {
							return false;
						}
						if (selectedItem) {
							var isCan = hasRightForCerType('hasDeleteAccessResult', selectedItem.CertificateTypeFk);
							if (isCan && moduleId === 'businesspartner.main') {
								var bpService = container.service.parentService();
								isCan = !bpService.getItemStatus().IsReadonly;
							}
							if (isCan && moduleId === 'businesspartner.certificate' && selectedItem.BusinessPartnerFk) {
								const bpItems = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
								const bpItem = _.find(bpItems, {Id: selectedItem.BusinessPartnerFk});
								const flag = businesspartnerStatusRightService.isBpStatusReadOnly(bpItem);
								isCan = !flag;
								if (isCan && !!serviceOptions.actions && !!serviceOptions.actions.canDelete) {
									isCan = serviceOptions.actions.canDelete();
								}
								if (isCan && !!serviceOptions.actions && !!serviceOptions.actions.canDeleteCallBackFunc) {
									isCan = serviceOptions.actions.canDeleteCallBackFunc(selectedItem);
								}
							}
							return isCan;
						}
						return false;
					};

					if (moduleId === 'procurement.contract') {
						container.service.canCreate = function () {
							var parentService = container.service.parentService();
							var parentSelectedItem = parentService.getSelected();
							if (parentSelectedItem && parentSelectedItem.ConStatus&&parentSelectedItem.ConStatus.IsReadonly) {
								return false;
							} else {
								return true;
							}
						};
					}
					if (moduleId === 'procurement.invoice') {
						container.service.canCreate = function () {
							return canCreate() && setReadonlyor();
						};
					}
					if (moduleId === 'sales.contract') {
						container.service.canCreate = function () {
							if (salesContractService.isReadStatusOnly()) {
								return false;
							}

							return true;
						};
					}

					if (moduleId === 'businesspartner.main') {
						container.service.canCreate = function () {
							var parentService = container.service.parentService();
							return canCreate() && !parentService.getItemStatus().IsReadonly;
						};
					}
					if (angular.isFunction(container.service.parentService) && container.service.parentService()) {
						var parentService = container.service.parentService();
						if (angular.isFunction(parentService.registerRefreshRequested)) {
							parentService.registerRefreshRequested(function () {
								getCertificateTypesWithAccessRight();
							});
						}
					} else if (angular.isFunction(container.service.registerRefreshRequested)) {
						container.service.registerRefreshRequested(function () {
							getCertificateTypesWithAccessRight();
						});
					}
					getCertificateTypesWithAccessRight();
					basicsLookupdataLookupDescriptorService.loadData('BusinessPartnerStatus');
					return container.service;
				};

				return factory;
			}
		]);

})(angular);