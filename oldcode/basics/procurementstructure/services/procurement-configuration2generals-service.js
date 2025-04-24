(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).factory('basicsProcurementConfiguration2GeneralsService', [
		'$http', 'platformDataServiceFactory', 'basicsProcurementStructureService',
		'basicsLookupdataLookupDescriptorService', 'basicsLookupdataSimpleLookupService',
		function ($http, dataServiceFactory, parentService, lookupDescriptorService, simpleLookupService) {

			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsProcurementConfiguration2GeneralsService',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/procurementstructure/general/', endCreate: 'creategeneral'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/procurementstructure/general/'},
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
							itemName: 'PrcConfiguration2generals',
							parentService: parentService
						}
					}
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;

			getDefaultLookUpValue();

			function initCreationData(creationData) {
				var defaultItem;
				if (service.defaultConfiguration && service.defaultGeneralsType) {
					defaultItem = _.find(serviceContainer.data.itemList,
						{
							PrcConfigurationFk: service.defaultConfiguration.Id,
							PrcGeneralsTypeFk: service.defaultGeneralsType.Id
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
					lookupModuleQualifier: 'basics.procurementstructure.generalstype',
					filter: {
						customIntegerProperty: 'MDC_LEDGER_CONTEXT_FK',
						field: 'LedgerContextFk',
					}
				};

				simpleLookupService.getDefault(lookupOptions).then(function (data) {
					service.defaultGeneralsType = data;
				});
				simpleLookupService.getList(lookupOptions).then(function (list) {
					service.generalsTypeList = list;
				});
			}

			return service;
		}
	]);
})(angular);