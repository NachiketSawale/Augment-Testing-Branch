(function (angular) {
	'use strict';

	var moduleName = 'sales.wip';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('salesWipValidationDataService',
		['globals', '$translate', 'platformDataServiceFactory', 'salesWipService', 'platformDataServiceProcessDatesBySchemeExtension',
			function (globals, $translate, dataServiceFactory, parentService, platformDataServiceProcessDatesBySchemeExtension) {
				var serviceContainer;
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'WipValidationDto',
						moduleSubModule: 'Sales.Wip'
					}
				);

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'salesWipValidationDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/wip/validation/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						dataProcessor: [dateProcessor],
						actions: {delete: false, create: false, bulk: false},
						entityRole: {
							node: {
								itemName: 'WipValidation',
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
