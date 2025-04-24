/**
 * Created by chi on 2/7/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.certificate';

	/* jshint -W072 */// has too many parameters
	angular.module(moduleName).factory('businessPartnerCertificate2SubsidiaryDataServiceFactory', businessPartnerCertificate2SubsidiaryDataServiceFactory);

	businessPartnerCertificate2SubsidiaryDataServiceFactory.$inject = [
		'globals',
		'platformDataServiceFactory',
		'basicsLookupdataLookupFilterService',
		'_'
	];

	function businessPartnerCertificate2SubsidiaryDataServiceFactory(
		globals,
		platformDataServiceFactory,
		basicsLookupdataLookupFilterService,
		_
	) {

		let cache = {};

		return {
			create: create
		};

		function create(execModuleName, certificateDataService) {
			if (cache[execModuleName]) {
				let serviceCache = cache[execModuleName];
				registerLookupFilterService(serviceCache);
				return serviceCache;
			}

			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businessPartnerCertificate2SubsidiaryDataServiceFactory',
					entityRole: {
						leaf: {
							itemName: 'Certificate2Subsidiary',
							parentService: certificateDataService,
							doesRequireLoadAlways: true
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate2subsidiary/',
						endCreate: 'create'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate2subsidiary/',
						endRead: 'list'
					},
					presenter: {list: {initCreationData: initCreationData}}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = container.service;
			let data = container.data;

			service.doAfterCreation = doAfterCreation;
			service.storeCacheFor = storeCacheFor;

			cache[execModuleName] = service;
			registerLookupFilterService(service);
			return service;

			function initCreationData(creationData) {
				let selected = certificateDataService.getSelected();
				creationData.PKey1 = selected.Id;
			}

			function doAfterCreation(newData) {
				container.data.onCreateSucceeded(newData, container.data);
			}

			function registerLookupFilterService(service) {
				let filters = [
					{
						key: 'businesspartner-main-certificate-to-subsidiary-common-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-certificate-to-subsidiary-common-filter',
						fn: function () {
							let parentService = service.parentService();
							let selectedItem = parentService.getSelected();
							return {
								BusinessPartnerFk: selectedItem ? selectedItem.BusinessPartnerFk :  -1
							};
						}
					}
				];

				_.forEach(filters, function (filter) {
					if (basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.unregisterFilter(filter);
					}

					basicsLookupdataLookupFilterService.registerFilter(filter);
				});
			}

			function storeCacheFor() {
				if (data.usesCache && data.currentParentItem && data.currentParentItem.Id) {
					data.storeCacheFor(data.currentParentItem, data);
				}
			}
		}
	}
})(angular);