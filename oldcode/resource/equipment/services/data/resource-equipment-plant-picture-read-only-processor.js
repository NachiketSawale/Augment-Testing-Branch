/**
 * Created by baf on 22.01.2025
 */

(function (angular) {
	'use strict';
	const plantModule = angular.module('resource.equipment');

	plantModule.service('resourceEquipmentPlantPictureReadOnlyProcessor', ResourceEquipmentPlantPictureReadOnlyProcessor);

	ResourceEquipmentPlantPictureReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceEquipmentPlantPictureReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processPlantPicture(plantPicture) {
			if(plantPicture.FromPlantGroup) {
				platformRuntimeDataService.readonly(plantPicture, true);
			}
		};
	}
})(angular);
