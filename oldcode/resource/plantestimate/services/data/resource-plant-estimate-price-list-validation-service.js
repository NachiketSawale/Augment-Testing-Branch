/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.plantestimate');

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimatePriceListValidationService
	 * @description provides validation methods for resource equipment Plant2EstimatePriceList entities
	 */
	myModule.service('resourcePlantEstimatePriceListValidationService', ResourcePlantEstimatePriceListValidationService);

	ResourcePlantEstimatePriceListValidationService.$inject = ['platformValidationServiceFactory', 'resourcePlantEstimateConstantValues', 'resourcePlantEstimatePriceListDataService'];

	function ResourcePlantEstimatePriceListValidationService(platformValidationServiceFactory, resourcePlantEstimateConstantValues, resourcePlantEstimatePriceListDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			resourcePlantEstimateConstantValues.schemes.plantEstimatePriceList,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourcePlantEstimateConstantValues.schemes.plantEstimatePriceList)
			},
			self,
			resourcePlantEstimatePriceListDataService);
	}
})(angular);