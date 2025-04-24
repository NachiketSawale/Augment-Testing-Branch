(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.equipment';
	angular.module(moduleName).service('resourceEquipmentSpecificValueWizardService', ResourceEquipmentSpecificValueWizardService);

	ResourceEquipmentSpecificValueWizardService.$inject = ['$http', 'platformSidebarWizardCommonTasksService', 'resourceEquipmentPlantDataService'];

	function ResourceEquipmentSpecificValueWizardService($http, platformSidebarWizardCommonTasksService, resourceEquipmentPlantDataService) {

		this.takeoverGroupSpecificValues = function takeoverGroupSpecificValues() {
			const selected = resourceEquipmentPlantDataService.getSelected();
			if (!selected) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('resource.equipment.takeoverGroupSpecValues');
			} else {
				$http.post(globals.webApiBaseUrl + 'resource/equipment/plantspecificvalue/takeover', { Id: 0, PKey1: selected.Id, PKey2: selected.PlantGroupFk }).then(function (response) {
					let title = $translate.instant('resource.equipment.takeoverGroupSpecValues');
					platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
				});
			}
		};
	}
})(angular);
