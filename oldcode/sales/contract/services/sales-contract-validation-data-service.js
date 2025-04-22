(function (angular) {
	'use strict';

	var moduleName = 'sales.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('salesContractValidationDataService',
		['globals', '$translate', 'platformDataServiceFactory', 'salesContractService', 'platformDataServiceProcessDatesBySchemeExtension',
			function (globals, $translate, dataServiceFactory, parentService, platformDataServiceProcessDatesBySchemeExtension) {
				var serviceContainer;
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'OrdValidationDto',
						moduleSubModule: 'Sales.Contract'
					}
				);

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'salesContractValidationDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/contract/validation/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						dataProcessor: [dateProcessor],
						actions: {delete: false, create: false, bulk: false},
						entityRole: {
							node: {
								itemName: 'OrdValidation',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				return service;
			}]);
})(angular);
