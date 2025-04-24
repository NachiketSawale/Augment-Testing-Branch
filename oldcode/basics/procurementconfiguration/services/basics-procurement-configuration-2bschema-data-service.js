/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName)
		.factory('basicsProcurementConfiguration2BSchemaDataService',
			['platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService',
				function (dataServiceFactory, parentService) {
					var serviceOptions = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCRUD: {
								route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2bschema/'
							},
							entityRole: {
								leaf: {
									itemName: 'PrcConfiguration2BSchema',
									parentService: parentService
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

					return serviceContainer.service;
				}]);
})(angular);