(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.plantestimate';
	angular.module(moduleName).service('resourcePlantEstimateSpecificValueWizardService', ResourcePlantEstimateSpecificValueWizardService);

	ResourcePlantEstimateSpecificValueWizardService.$inject = ['$http', '$translate', 'platformSidebarWizardCommonTasksService', 'resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimateSpecificValueWizardService($http, $translate, platformSidebarWizardCommonTasksService, resourcePlantEstimateEquipmentDataService) {

		this.takeoverGroupSpecificValues = function takeoverGroupSpecificValues() {
			const selected = resourcePlantEstimateEquipmentDataService.getSelected();
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
