/**
 * Created by baf on 22.01.2025
 */

(function (angular) {
	'use strict';
	const plantModule = angular.module('resource.equipment');

	plantModule.service('resourceEquipmentPlantDocumentReadOnlyProcessor', ResourceEquipmentPlantDocumentReadOnlyProcessor);

	ResourceEquipmentPlantDocumentReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceEquipmentPlantDocumentReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processPlantPicture(document) {
			if(document.FromPlantGroup) {
				platformRuntimeDataService.readonly(document, true);
			}
		};
	}
})(angular);
