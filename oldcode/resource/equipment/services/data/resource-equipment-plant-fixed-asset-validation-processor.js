(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	
	angular.module(moduleName).factory('resourceEquipmentPlantFixedAssetValidationProcessor', ResourceEquipmentPlantFixedAssetValidationProcessor);
	ResourceEquipmentPlantFixedAssetValidationProcessor.$inject = ['$injector'];
	function ResourceEquipmentPlantFixedAssetValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['resourceEquipmentPlantFixedAssetValidationService', function (resourceEquipmentPlantFixedAssetValidationService) {
					resourceEquipmentPlantFixedAssetValidationService.validateValidFrom(items, null, 'ValidFrom');
					resourceEquipmentPlantFixedAssetValidationService.validateValidTo(items, null, 'ValidTo');
				}]);
			}
		};
		return service;
	}
})(angular);