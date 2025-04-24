/**
 * Created by jhe on 7/23/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.regionCatalog';

	/**
     * @ngdoc service
     * @name basicsRegionCatalogValidationService
     * @description provides validation methods for unit instances
     */
	angular.module(moduleName).service('basicsRegionCatalogValidationService', BasicsRegionCatalogValidationService);

	BasicsRegionCatalogValidationService.$inject = ['platformDataValidationService', 'basicsRegionCatalogService'];

	function BasicsRegionCatalogValidationService() {
	}
})(angular);
