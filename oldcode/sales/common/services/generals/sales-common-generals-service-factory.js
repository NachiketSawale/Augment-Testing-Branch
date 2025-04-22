/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'sales.common';

	angular.module(moduleName).factory('salesCommonGeneralsServiceFactory',
		['_', '$injector', function (_, $injector) {
			var serviceContainer = {};

			var factory = {};

			factory.getServiceContainer = getServiceContainer;

			factory.registerServiceContainer = registerServiceContainer;

			return factory;

			function getServiceContainer(key) {
				if (_.has(serviceContainer, key)) {
					var generalsContainerObject = serviceContainer[key];

					if (!_.has(generalsContainerObject, 'services')) {
						var generalsValues = generalsContainerObject.generalsValues;
						var salesCommonGeneralsService = $injector.get('salesCommonGeneralsService');
						var salesCommonGeneralsValidationService = $injector.get('salesCommonGeneralsValidationService');
						var salesCommonGeneralsUIStandardService = $injector.get('salesCommonGeneralsUIStandardService');
						var dataService = $injector.get(generalsValues.parentService);

						$injector.get('salesCommonGeneralsFilterService').registerFilters(key, dataService);

						var services = {};
						services.salesCommonGeneralsService = salesCommonGeneralsService.getService(dataService, generalsValues.apiUrl);
						services.salesCommonGeneralsValidationService = salesCommonGeneralsValidationService(services.salesCommonGeneralsService);
						services.salesCommonGeneralsUIStandardService = salesCommonGeneralsUIStandardService(generalsValues.moduleName);
						serviceContainer[key].services = services;
					}
					return serviceContainer[key].services;
				}
				return null;
			}

			function registerServiceContainer(key, generalsValues) {
				if (!_.has(serviceContainer, key)) {
					serviceContainer[key] = {
						generalsValues: generalsValues
					};
				}
			}
		}]);

})(angular);
