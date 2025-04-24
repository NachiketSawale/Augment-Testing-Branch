/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc service
	 * @name resourceEnterpriseDispatcherValidationService
	 * @description provides validation methods for resource enterprise dispatcher entities
	 */
	angular.module(moduleName).service('resourceEnterpriseDispatcherValidationService', ResourceEnterpriseDispatcherValidationService);

	// ResourceEnterpriseDispatcherValidationService.$inject = ['platformDataValidationService', 'resourceEnterpriseDispatcherDataService'];

	function ResourceEnterpriseDispatcherValidationService() {
	}

})(angular);
