(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.plantestimate';
	angular.module(moduleName).service('resourcePlantEstimateRecalcAssemblyWizardService', ResourcePlantEstimateRecalcAssemblyWizardService);

	ResourcePlantEstimateRecalcAssemblyWizardService.$inject = ['$http', '$translate', 'platformSidebarWizardCommonTasksService', 'resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimateRecalcAssemblyWizardService($http, $translate, platformSidebarWizardCommonTasksService, resourcePlantEstimateEquipmentDataService) {

		this.recalcPlantAssemblies = function recalcPlantAssemblies() {
			const selected = resourcePlantEstimateEquipmentDataService.getSelectedEntities();
			if (!selected || !selected.length) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('resource.plantestimate.recalculatePlantAssemblies');
			} else {
				$http.post(globals.webApiBaseUrl + 'resource/equipment/plant/execute', { Action: 7, Plants: selected }).then(function (response) {
					let title = $translate.instant('resource.plantestimate.recalculatePlantAssemblies');
					platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
				});
			}
		};
	}
})(angular);
