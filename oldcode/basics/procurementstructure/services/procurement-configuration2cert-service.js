(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).factory('basicsProcurementConfiguration2CertService', [
		'$http', 'platformDataServiceFactory', 'basicsProcurementStructureService',
		'basicsLookupdataLookupDescriptorService', 'basicsLookupdataSimpleLookupService', 'ServiceDataProcessDatesExtension',
		function ($http, dataServiceFactory, parentService, lookupDescriptorService, simpleLookupService, ServiceDataProcessDatesExtension) {
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsProcurementConfiguration2CertService',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/procurementstructure/certificate/', endCreate: 'createconfig2cert'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/procurementstructure/certificate/'},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								lookupDescriptorService.attachData(readData);
								return data.handleReadSucceeded(readData.Main, data);
							},
							initCreationData: initCreationData
						}
					},
					entityRole: {
						leaf: {
							itemName: 'PrcConfiguration2cert',
							parentService: parentService
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])]
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;

			getDefaultLookUpValue();

			function initCreationData(creationData) {
				var defaultItem;
				if (service.defaultConfiguration && service.defaultCertificateType) {
					defaultItem = _.find(serviceContainer.data.itemList,
						{
							PrcConfigurationFk: service.defaultConfiguration.Id,
							BpdCertificateTypeFk: service.defaultCertificateType.Id
						});
				}
				creationData.mainItemId = parentService.getSelected().Id;
				creationData.setDefault = !defaultItem;
			}

			function getDefaultLookUpValue() {
				$http.post(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/default', {}).then(function (response) {
					service.defaultConfiguration = response.data;
				});

				var lookupOptions = {
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'businesspartner.main.certificatetype'
				};

				simpleLookupService.getDefault(lookupOptions).then(function (data) {
					service.defaultCertificateType = data;
				});
			}

			return service;
		}
	]);
})(angular);