/**
 * Created by zwz on 8/5/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemBundleValidationService', BundleValidationService);

	BundleValidationService.$inject = ['transportplanningBundleValidationServiceFactory', 'productionplanningItemBundleDataService'];

	function BundleValidationService(serviceFactory, dataService) {
		return serviceFactory.createService(dataService);
	}
})(angular);
