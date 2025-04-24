/**
 * Created by baf on 16.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.componenttype';

	/**
	 * @ngdoc service
	 * @name resourceComponentTypeValidationService
	 * @description provides validation methods for resource componenttype  entities
	 */
	angular.module(moduleName).service('resourceComponentTypeValidationService', ResourceComponentTypeValidationService);

	ResourceComponentTypeValidationService.$inject = [/* 'platformDataValidationService', 'resourceCatalogDataService' */];

	function ResourceComponentTypeValidationService() {
	}

})(angular);
