(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningTransportPackageValidationService', service);

	service.$inject = ['transportplanningPackageValidationServiceFactory', 'transportplanningTransportPackageDataService'];
	function service(validationSeviceFactory, dataService) {
		return validationSeviceFactory.createService(dataService);
	}

})(angular);