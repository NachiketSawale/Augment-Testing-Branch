/**
 * Created by baf on 02.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc service
	 * @name resourceCatalogRecordValidationService
	 * @description provides validation methods for resource catalog record entities
	 */
	angular.module(moduleName).service('resourceCatalogRecordValidationService', ResourceCatalogRecordValidationService);

	ResourceCatalogRecordValidationService.$inject = ['platformDataValidationService', 'resourceCatalogRecordDataService'];

	function ResourceCatalogRecordValidationService() {
	}

})(angular);
