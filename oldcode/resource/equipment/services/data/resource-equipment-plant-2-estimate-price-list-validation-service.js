/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlant2EstimatePriceListValidationService
	 * @description provides validation methods for resource equipment Plant2EstimatePriceList entities
	 */
	myModule.service('resourceEquipmentPlant2EstimatePriceListValidationService', ResourceEquipmentPlant2EstimatePriceListValidationService);

	ResourceEquipmentPlant2EstimatePriceListValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentConstantValues', 'resourceEquipmentPlant2EstimatePriceListDataService'];

	function ResourceEquipmentPlant2EstimatePriceListValidationService(platformValidationServiceFactory, resourceEquipmentConstantValues, resourceEquipmentPlant2EstimatePriceListDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			resourceEquipmentConstantValues.schemes.plant2EstimatePriceList, 
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.plant2EstimatePriceList)
			},
			self,
			resourceEquipmentPlant2EstimatePriceListDataService);
	}
})(angular);