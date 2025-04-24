/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/* global angular */
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc service
	 * @name basicsCostGroupCatalogValidationService
	 * @description provides validation methods for basics costGroupCatalog entities
	 */
	angular.module(moduleName).service('basicsCostGroupCatalogValidationService', BasicsCostGroupCatalogValidationService);

	BasicsCostGroupCatalogValidationService.$inject = ['platformValidationServiceFactory', 'basicsCostGroupsConstantValues', 'basicsCostGroupCatalogDataService'];

	function BasicsCostGroupCatalogValidationService(platformValidationServiceFactory, basicsCostGroupsConstantValues, basicsCostGroupCatalogDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(basicsCostGroupsConstantValues.schemes.costGroupCatalog, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(basicsCostGroupsConstantValues.schemes.costGroupCatalog),
			uniques: ['Code']
		},
		self,
		basicsCostGroupCatalogDataService);
	}
})(angular);