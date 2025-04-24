/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantGroup2EstimatePriceListValidationService
	 * @description provides validation methods for resource equipment PlantGroup2EstimatePriceList entities
	 */
	myModule.service('resourceEquipmentGroupPlantGroup2EstimatePriceListValidationService', ResourceEquipmentGroupPlantGroup2EstimatePriceListValidationService);

	ResourceEquipmentGroupPlantGroup2EstimatePriceListValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupPlantGroup2EstimatePriceListDataService'];

	function ResourceEquipmentGroupPlantGroup2EstimatePriceListValidationService(platformValidationServiceFactory, resourceEquipmentGroupConstantValues, resourceEquipmentGroupPlantGroup2EstimatePriceListDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			resourceEquipmentGroupConstantValues.schemes.plantGroup2EstimatePriceList, 
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentGroupConstantValues.schemes.plantGroup2EstimatePriceList)
			},
			self,
			resourceEquipmentGroupPlantGroup2EstimatePriceListDataService);
	}
})(angular);