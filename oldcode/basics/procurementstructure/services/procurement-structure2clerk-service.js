(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName)
		.factory('basicsProcurement2ClerkService',
			['platformDataServiceFactory', 'basicsProcurementStructureService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
				function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService) {

					var serviceOption = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCreate: {route: globals.webApiBaseUrl + 'basics/procurementstructure/clerk/'},
							httpRead: {route: globals.webApiBaseUrl + 'basics/procurementstructure/clerk/'},
							presenter: {
								list: {
									incorporateDataRead: incorporateDataRead,
									initCreationData: initCreationData
								}
							},
							entityRole: {
								leaf: {
									itemName: 'PrcStructure2clerk',
									parentService: parentService
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
					var service = serviceContainer.service;

					return service;

					function incorporateDataRead(readData, data) {
						basicsLookupdataLookupDescriptorService.attachData(readData);
						return serviceContainer.data.handleReadSucceeded(readData.Main, data);
					}

					function initCreationData(creationData) {
						creationData.PKey1 = parentService.getSelected().Id;
					}

				}]);
})(angular);