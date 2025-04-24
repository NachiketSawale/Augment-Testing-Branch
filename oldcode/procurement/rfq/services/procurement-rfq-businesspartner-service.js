(function (angular) {
	'use strict';
	const moduleName = 'procurement.rfq';

	/**
	 * @ngdoc service
	 * @name procurementRfqBusinessPartnerService
	 * @function
	 * @requireds platformDataServiceFactory
	 * @description
	 * #
	 * data service of rfq bidder container.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRfqBusinessPartnerService',
		['platformDataServiceFactory', 'procurementRfqMainService', 'basicsLookupdataLookupDescriptorService',
			'procurementRfqBusinessPartnerValidationService', 'basicsLookupdataLookupFilterService', 'platformRuntimeDataService',
			'ServiceDataProcessDatesExtension', 'procurementCommonDataEnhanceProcessor', 'platformDataServiceDataProcessorExtension', 'platformPermissionService',
			'PlatformMessenger', 'businesspartnerContactPortalUserManagementService', '_', '$http', 'globals', '$injector',
			function (platformDataServiceFactory, procurementRfqMainService, basicsLookupdataLookupDescriptorService,
				validationService, basicsLookupdataLookupFilterService, platformRuntimeDataService,
				ServiceDataProcessDatesExtension, procurementCommonDataEnhanceProcessor, platformDataServiceDataProcessorExtension, platformPermissionService,
				PlatformMessenger, businesspartnerContactPortalUserManagementService, _, $http, globals, $injector) {

				let serviceOption = {
					flatNodeItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementRfqBusinessPartnerService',
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/rfq/businesspartner/',
							endCreate: 'createnew'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/rfq/businesspartner/',
							endRead: 'getlist',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.Value = procurementRfqMainService.getIfSelectedIdElse(-1);
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['DateRequested', 'DateRejected', 'FirstQuoteFrom']), dataProcessItem()],
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.Value = procurementRfqMainService.getSelected().Id;
								},
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							node: {
								itemName: 'RfqBusinessPartner',
								parentService: procurementRfqMainService,
								doesRequireLoadAlways: platformPermissionService.hasRead('a2f96b998a304eecadbc246514c4089a')
							}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				let service = serviceContainer.service;
				initialize(service);

				// for sidebar info find bidder disable prev btn and next btn
				service.disablePrev = function () {
					return service.getList().indexOf(service.getSelected()) <= 0;
				};
				service.disableNext = function () {
					let list = service.getList();
					let index = list.indexOf(service.getSelected());
					return index >= (list.length - 1);
				};

				// we must not overwrite the onDeleteDone method, instead of use the
				// serviceContainer.service.registerEntityDeleted(onEntityDeleted); by stone.

				// overwrite the onDeleteDone method
				// var oldDeleteDone = serviceContainer.data.onDeleteDone;
				// serviceContainer.data.onDeleteDone = onDeleteDoneInList;
				// overwrite the oldFindItemToMerge method
				let oldFindItemToMerge = service.findItemToMerge;
				service.findItemToMerge = newFindItemToMerge;

				function newFindItemToMerge(item2Merge) {
					let itemList = service.getList();
					let findByRfq = _.find(itemList, function (list) {
						return list.RfqHeaderFk === item2Merge.RfqHeaderFk;
					});
					if (findByRfq) {
						let item = _.filter(itemList, function (list) { // find the update data
							return list.Id === item2Merge.Id;
						});
						// the update data is not in the currency item list, set it in the list
						if (item !== null && item.length <= 0) {
							itemList.push(item2Merge);
							service.gridRefresh(); // refresh the container
						}
					}
					return oldFindItemToMerge(item2Merge, serviceContainer.data, service);
				}

				service.updateReadOnly = updateReadOnly;
				service.updateContactHasPortalUser = updateContactHasPortalUser;

				return service;

				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData || {});

					_.forEach(readData.Main, function (item) {
						item.ContactHasPortalUser = false;
					});

					let dataRead = data.handleReadSucceeded(readData.Main, data, true);
					service.goToFirst(data);

					updateContactHasPortalUser(dataRead, service);

					return dataRead;
				}

				function dataProcessItem() {
					let isReadonly = function isReadonly(currentItem, model) {
						let readonly = isReadonlyByParentStatus();

						if (model === 'SubsidiaryFk') {
							if (!(currentItem.BusinessPartnerFk && currentItem.BusinessPartnerFk !== -1)) {
								readonly = true;
							}
						}
						if (model === 'RfqBusinesspartnerStatusFk') {
							readonly = true;
						}
						return readonly;
					};

					let dataProcessService = function () {
						// return {dataService: service, validationService: validationService(service)};
						return {dataService: service, validationService: null}; // disable validation
					};

					return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementRfqBusinessPartnerUIStandardService', isReadonly);
				}

				function initialize(service) {
					let filters = [
						{
							key: 'procurement-rfq-businesspartner-businesspartner-filter',
							serverSide: true,
							serverKey: 'procurement-rfq-businesspartner-businesspartner-filter',
							fn: function () {
								let filter = {ApprovalBPRequired: true};
								let rfqHeaderItem = procurementRfqMainService.getSelected();
								if (rfqHeaderItem && rfqHeaderItem.RfqHeaderFk) {
									filter.RfqHeaderFk = rfqHeaderItem.RfqHeaderFk;
								}
								return filter;
							}
						},
						{
							key: 'procurement-rfq-businesspartner-subsidiary-filter',
							serverSide: true,
							serverKey: 'businesspartner-main-subsidiary-common-filter',
							fn: function () {
								let currentItem = service.getSelected();
								return {
									BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
									SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
								};
							}
						},
						{
							key: 'procurement-rfq-businesspartner-supplier-filter',
							serverSide: true,
							serverKey: 'businesspartner-main-supplier-common-filter',
							fn: function () {
								let currentItem = service.getSelected();
								return {
									BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
									SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
								};
							}
						},
						{
							key: 'procurement-rfq-businesspartner-contact-filter',
							serverSide: true,
							serverKey: 'procurement-rfq-businesspartner-contact-filter',
							fn: function () {
								let genericWizardService = $injector.get('genericWizardService');
								let genericWizardBusinessPartnerService = genericWizardService ? genericWizardService.getDataServiceByName('procurementRfqBusinessPartnerService') : null;
								let currentItem = genericWizardBusinessPartnerService ? genericWizardBusinessPartnerService.getSelected() : null;

								if (!currentItem) {
									currentItem = service.getSelected();
								}
								return {
									BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
									SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
								};
							}
						}
					];
					basicsLookupdataLookupFilterService.registerFilter(filters);

					service.canDelete = function canDelete() {
						if (service.getList().length <= 0) {
							return false;
						}
						return !isReadonlyByParentStatus();
					};

					service.canCreate = function canCreate() {
						let rfqItem = procurementRfqMainService.getSelected();
						if (!rfqItem || angular.isUndefined(rfqItem.Id)) {
							return false;
						}

						return !isReadonlyByParentStatus();
					};

					// used in wizard 'get bidder' to update UI data after requested data saved.
					service.doProcessData = function doProcessData(items) {
						platformDataServiceDataProcessorExtension.doProcessData(items, serviceContainer.data);
					};

					procurementRfqMainService.refreshRfqBusinessPartner.register(service.load);

					service.businessPartnerFkChanged = new PlatformMessenger();
				}

				function isReadonlyByParentStatus() {
					let readonly = false;
					let headerStatus = procurementRfqMainService.getStatus();
					if (!headerStatus || headerStatus.IsReadonly) {
						readonly = true;
					}
					return readonly;
				}

				function updateReadOnly(entity, model/* , value */) {
					let flag = true;
					let fields = [];
					if (model === 'SubsidiaryFk'){
						flag = entity.BusinessPartnerFk <= 0;
					}

					fields.push({field: model, readonly: flag});
					platformRuntimeDataService.readonly(entity, fields);
				}

				function updateContactHasPortalUser(list, service, needRefresh) {
					if (!angular.isArray(list) || list.length === 0) {
						return;
					}

					let contacts = [];
					let doesUpdate = false;
					_.forEach(list, function (item) {
						if (!item.ContactFk) {
							item.ContactHasPortalUser = false;
							doesUpdate = true;
							return;
						}
						contacts.push({Id: item.ContactFk});
					});
					businesspartnerContactPortalUserManagementService.getAndMapProviderInfo(contacts).then(function (contacts) {
						if (!angular.isArray(contacts)) {
							contacts = [];
						}

						_.forEach(list, function (item) {
							if (!item.ContactFk) {
								return;
							}
							let found = _.find(contacts, {Id: item.ContactFk});
							if (found) {
								item.ContactHasPortalUser = found.LogonName !== null && angular.isDefined(found.LogonName);
								doesUpdate = true;
							}
						});
						needRefresh = angular.isUndefined(needRefresh) ? true : needRefresh;
						if (doesUpdate && service && angular.isFunction(service.gridRefresh) && needRefresh) {
							service.gridRefresh();
						}
					});
				}
			}
		]);
})(angular);