/**
 * Created by baf on 06.02.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardPlantCompatibleMaterialLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card plantCompatibleMaterial entity.
	 **/
	angular.module(moduleName).service('logisticCardPlantCompatibleMaterialLayoutService', LogisticCardPlantCompatibleMaterialLayoutService);

	LogisticCardPlantCompatibleMaterialLayoutService.$inject = ['_', 'platformUIConfigInitService', 'logisticCardContainerInformationService',
		'logisticCardConstantValues', 'logisticCardTranslationService', 'resourceEquipmentContainerInformationService'];

	function LogisticCardPlantCompatibleMaterialLayoutService(_, platformUIConfigInitService, logisticCardContainerInformationService,
		logisticCardConstantValues, logisticCardTranslationService, resourceEquipmentContainerInformationService) {
		function getPlantCompatibleMaterialLayout() {
			let orig = resourceEquipmentContainerInformationService.getResourceEquipmentCompatibleMaterialLayout();
			var layout = _.cloneDeep(orig);

			layout.overloads.materialfk.readonly = true;
			layout.overloads.commenttext = { readonly: true };

			return layout;
		}
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: getPlantCompatibleMaterialLayout(),
			dtoSchemeId: logisticCardConstantValues.schemes.plantCompatibleMaterial,
			translator: logisticCardTranslationService
		});
	}
})(angular);