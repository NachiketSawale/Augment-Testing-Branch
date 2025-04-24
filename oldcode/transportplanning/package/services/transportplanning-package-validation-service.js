/**
 * Created by las on 7/10/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningPackageValidationService', service);
	service.$inject = ['transportplanningPackageValidationServiceFactory', 'transportplanningPackageMainService'];
	function service(validationSeviceFactory, dataService) {
		return validationSeviceFactory.createService(dataService);
	}

})(angular);