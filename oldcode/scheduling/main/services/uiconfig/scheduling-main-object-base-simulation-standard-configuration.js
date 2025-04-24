/**
 * Created by Mohit on 03.01.2023.
 */
(function () {
	'use strict';
	const moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainObjectBaseSimulationStandardConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainObjectBaseSimulationStandardConfigurationService', ['platformUIStandardConfigService', 'schedulingMainTranslationService', 'schedulingMainUIConfigurationService', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingMainTranslationService, schedulingMainUIConfigurationService, platformSchemaService) {

			let BaseService = platformUIStandardConfigService;

			let simulationObject = platformSchemaService.getSchemaFromCache({
				typeName: 'Activity2ModelObjectDto',
				moduleSubModule: 'Scheduling.Main'
			});
			if (simulationObject) {
				simulationObject = simulationObject.properties;
			}

			let schedulingMainSimulationLayout = schedulingMainUIConfigurationService.getObjectSimulationLayout();

			return new BaseService(schedulingMainSimulationLayout, simulationObject, schedulingMainTranslationService);
		}
	]);
})();

