/**
 * Created by sandu on 27.01.2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardGroupValidationService
	 * @description provides validation methods for wizard group entities
	 */
	angular.module(moduleName).factory('basicsConfigWizardGroupValidationService', basicsConfigWizardGroupValidationService);

	basicsConfigWizardGroupValidationService.$inject = ['platformDataValidationService'];

	function basicsConfigWizardGroupValidationService(){
		var service = {};
		return service;
	}


})(angular);