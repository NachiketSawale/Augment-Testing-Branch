/**
 * Created by chi on 11.03.2021.
 */
(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('procurementRfqBusinessPartner2ContactService', procurementRfqBusinessPartner2ContactService);

	procurementRfqBusinessPartner2ContactService.$inject = [
		'_',
		'platformDataServiceFactory',
		'globals',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'platformContextService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService',
		'procurementRfqBusinessPartnerService',
		'procurementRfqMainService',
		'procurementCommonDataEnhanceProcessor',
		'$http',
		'$q',
		'businesspartnerContactPortalUserManagementService',
		'procurementRfqBpContactExcludeModelValue',
		'ServiceDataProcessDatesExtension'
	];

	function procurementRfqBusinessPartner2ContactService(
		_,
		platformDataServiceFactory,
		globals,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		platformContextService,
		platformRuntimeDataService,
		basicsLookupdataLookupFilterService,
		procurementRfqBusinessPartnerService,
		procurementRfqMainService,
		procurementCommonDataEnhanceProcessor,
		$http,
		$q,
		businesspartnerContactPortalUserManagementService,
		procurementRfqBpContactExcludeModelValue,
		ServiceDataProcessDatesExtension
	) {

		var options = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'procurementRfqBusinessPartner2ContactService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'procurement/rfq/businesspartner2contact/',
					endRead: 'getbyparentid'
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var textModule = procurementRfqBusinessPartnerService.getSelected();
							if (textModule) {
								creationData.PKey1 = textModule.Id;
							}
						},
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'RfqBusinessPartner2Contact',
						parentService: procurementRfqBusinessPartnerService
					}
				},
				dataProcessor: [processItem()],
				actions: {
					create: 'flat',
					delete: true
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(options);
		var service = serviceContainer.service;
		let data = serviceContainer.data;
		let dateProcessor = new ServiceDataProcessDatesExtension(['BirthDate', 'LastLogin', 'SetInactiveDate']);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'RfqBusinessPartner2ContactDto',
			moduleSubModule: 'Procurement.RfQ',
			validationService: 'procurementRfqBusinessPartner2ContactValidationService',
			mustValidateFields: ['ContactFk']
		});

		var filters = [
			{
				key: 'procurement-rfq-businesspartner-2contact-filter',
				serverKey: 'procurement-rfq-businesspartner-2contact-filter',
				serverSide: true,
				fn: function () {
					var parentItem = procurementRfqBusinessPartnerService.getSelected();
					if (parentItem) {
						return {
							BusinessPartnerFk: parentItem.BusinessPartnerFk,
							mustFilterByBp: true
						};
					}
					return {mustFilterByBp: true};
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);
		procurementRfqBusinessPartnerService.businessPartnerFkChanged.register(onParentBusinessPartnerFkChanged);

		service.canDelete = canDelete;
		service.canCreate = canCreate;
		service.updateWithContacts = updateWithContacts;
		return service;

		// //////////////////////////
		function incorporateDataRead(readData, data) {
			let dataRead = null;
			if (angular.isArray(readData)) {
				dataRead = data.handleReadSucceeded(readData, data, true);
			}
			else if (angular.isObject(readData)) {
				basicsLookupdataLookupDescriptorService.attachData(readData || {});
				dataRead = data.handleReadSucceeded(readData.Main, data, true);
			}

			service.goToFirst(data);

			let contactIds = _.uniq(_.map(_.filter(dataRead || [], function (contact) {
				return !!contact.ContactFk;
			}), 'ContactFk'));
			if (angular.isArray(contactIds) && contactIds.length > 0) {
				updateWithContacts(dataRead, contactIds);
			}
			return dataRead || [];
		}

		function onParentBusinessPartnerFkChanged(pItem) {
			let parentItem = procurementRfqBusinessPartnerService.getSelected();
			if (parentItem && ((pItem && parentItem.Id === pItem.Id) || !pItem)) {
				let list = service.getList();
				service.deleteEntities(list);
			} else if (pItem && angular.isFunction(data.doClearModificationsForItemFromCache)) {
				var listToDeleteInCache = data.provideCacheFor(pItem.Id, data);
				service.deleteEntities(listToDeleteInCache);
			}
		}

		function isReadonlyByMainStatus() {
			var readonly = false;
			var headerStatus = procurementRfqMainService.getStatus();
			if (!headerStatus || headerStatus.IsReadonly) {
				readonly = true;
			}
			return readonly;
		}

		function canDelete() {
			if (service.getList().length <= 0) {
				return false;
			}
			return !isReadonlyByMainStatus();
		}

		function canCreate() {
			var rfqItem = procurementRfqMainService.getSelected();
			if (!rfqItem || angular.isUndefined(rfqItem.Id)) {
				return false;
			}

			return !isReadonlyByMainStatus();
		}

		function processItem() {
			var isReadonly = function isReadonly() {
				return isReadonlyByMainStatus();
			};

			var dataProcessService = function () {
				// return {dataService: service, validationService: validationService(service)};
				// execute validation logic in procurementRfqRequisitionValidationService (not in procurementCommonDataEnhanceProcessor).
				return {dataService: service, validationService: null};
			};

			return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementRfqBusinessPartner2ContactUIStandardService', isReadonly);
		}

		function updateWithContacts(list, contactIds) {
			if (!angular.isArray(list) || list.length === 0 || !angular.isArray(contactIds) || contactIds.length === 0) {
				return;
			}
			getContactsByIds(contactIds)
				.then(function(contacts) {
					if (!angular.isArray(contacts) || contacts.length === 0) {
						return;
					}
					mergeWithContacts(list, contacts);
					service.gridRefresh();
				});
		}

		function getContactsByIds(contactIds) {
			if (angular.isArray(contactIds) && contactIds.length > 0) {
				return $http.post(globals.webApiBaseUrl + 'businesspartner/contact/getbyids', contactIds)
					.then(function (response) {
						if (!response || !response.data || !angular.isArray(response.data.Main) || response.data.Main.length === 0) {
							return [];
						}
						let contacts = response.data.Main;
						basicsLookupdataLookupDescriptorService.attachData(response.data || {});
						_.forEach(contacts, function (contact) {
							dateProcessor.processItem(contact);
						});
						return businesspartnerContactPortalUserManagementService.getAndMapProviderInfo(contacts);
					});
			}

			return $q.when([]);
		}

		function mergeWithContacts(list, contacts) {
			if (!angular.isArray(list) || list.length === 0 || !angular.isArray(contacts) || contacts.length === 0) {
				return;
			}

			_.forEach(contacts, function (contact) {
				let item = _.find(list, {ContactFk: contact.Id});
				if (!item) {
					return;
				}

				for (let prop in contact) {
					if (Object.prototype.hasOwnProperty.call(contact,prop) && !_.includes(procurementRfqBpContactExcludeModelValue, prop)) {
						item[prop] = contact[prop];
					}
				}
			});
		}
	}

})(angular);