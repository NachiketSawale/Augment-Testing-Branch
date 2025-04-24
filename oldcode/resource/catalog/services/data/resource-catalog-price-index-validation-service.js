/**
 * Created by baf on 07.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc service
	 * @name resourceCatalogPriceIndexValidationService
	 * @description provides validation methods for resource catalog priceIndex entities
	 */
	angular.module(moduleName).service('resourceCatalogPriceIndexValidationService', ResourceCatalogPriceIndexValidationService);

	ResourceCatalogPriceIndexValidationService.$inject = ['platformValidationServiceFactory', 'resourceCatalogConstantValues', 'resourceCatalogPriceIndexDataService'];

	function ResourceCatalogPriceIndexValidationService(platformValidationServiceFactory, resourceCatalogConstantValues, resourceCatalogPriceIndexDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceCatalogConstantValues.schemes.priceIndex, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceCatalogConstantValues.schemes.priceIndex)
		},
		self,
		resourceCatalogPriceIndexDataService);
	}
})(angular);
