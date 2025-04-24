/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc service
	 * @name resourceProjectValidationService
	 * @description provides validation methods for resource project  entities
	 */
	angular.module(moduleName).service('resourceProjectValidationService', ResourceProjectValidationService);

	// ResourceProjectValidationService.$inject = ['platformDataValidationService', 'resourceProjectDataService'];

	function ResourceProjectValidationService() {
	}

})(angular);
