/**
 * Created by baf on 27.10.2017
 */

(function (angular) {
	'use strict';
	var module = angular.module('resource.catalog');

	/**
	 * @ngdoc service
	 * @name resourceCatalogValidationService
	 * @description provides validation methods for information request entities
	 */
	module.service('resourceCatalogValidationService', ResourceCatalogValidationService);

	ResourceCatalogValidationService.$inject = ['platformDataValidationService', 'resourceCatalogDataService'];

	function ResourceCatalogValidationService(platformDataValidationService, resourceCatalogDataService ) {

		var self = this;

		self.validateCode = function validateCode(entity, value) {

			return platformDataValidationService.validateMandatory(entity, value, 'code', self, resourceCatalogDataService);
		};
	}

})(angular);
