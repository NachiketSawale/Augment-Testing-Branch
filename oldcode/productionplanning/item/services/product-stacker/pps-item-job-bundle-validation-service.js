/**
 * Created by zwz on 8/5/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemJobBundleValidationService', BundleValidationService);

	BundleValidationService.$inject = ['transportplanningBundleValidationServiceFactory', 'productionplanningItemJobBundleDataService'];

	function BundleValidationService(serviceFactory, dataService) {
		return serviceFactory.createService(dataService);
	}
})(angular);
