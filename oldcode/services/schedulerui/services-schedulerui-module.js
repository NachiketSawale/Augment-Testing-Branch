/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'services.schedulerui';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'JobDto', moduleSubModule: 'Services.Schedulerui'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', 'servicesSchedulerUIJobStateValues', 'servicesSchedulerUIFrequencyValues', 'servicesSchedulerUIPriorityValues', 'servicesSchedulerUILogLevelValues', function (platformTranslateService, servicesSchedulerUIJobStateValues, servicesSchedulerUIFrequencyValues, servicesSchedulerUIPriorityValues, servicesSchedulerUILogLevelValues) {
						return platformTranslateService.registerModule([moduleName], true)
							.then(function () {
								platformTranslateService.translateObject(servicesSchedulerUIJobStateValues, ['description']);
								platformTranslateService.translateObject(servicesSchedulerUIFrequencyValues, ['description']);
								platformTranslateService.translateObject(servicesSchedulerUIPriorityValues, ['description']);
								platformTranslateService.translateObject(servicesSchedulerUILogLevelValues, ['description']);
								return true;
							});
					}],
					'preLoadJobTasks': ['servicesSchedulerUIJobDataService',
						function (servicesSchedulerUIJobDataService) {
							servicesSchedulerUIJobDataService.getAllTasks();
							return true;
						}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
