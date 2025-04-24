/**
 * Created by Shankar on 28.09.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc controller
	 * @name logisticPlantSupplyItemLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping settlement entity.
	 **/
	angular.module(moduleName).service('logisticPlantSupplyItemLayoutService', LogisticPlantSupplyItemLayoutService);

	LogisticPlantSupplyItemLayoutService.$inject = ['platformUIConfigInitService', 'logisticPlantsupplierContainerInformationService', 'logisticPlantSupplierConstantValues', 'logisticPlantSupplierTranslationService'];

	function LogisticPlantSupplyItemLayoutService(platformUIConfigInitService, logisticPlantsupplierContainerInformationService, logisticPlantSupplierConstantValues, logisticPlantSupplierTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPlantsupplierContainerInformationService.getPlantSupplyItemLayout(),
			dtoSchemeId: logisticPlantSupplierConstantValues.schemes.plantSupplyItem,
			translator: logisticPlantSupplierTranslationService
		});
	}
})(angular);