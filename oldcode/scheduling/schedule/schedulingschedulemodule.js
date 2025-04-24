(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'scheduling.schedule';

	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	angular.module(moduleName).constant('schedulingMainContainers', [
		{
			'containerId': 'schedulelist', 'template': '/scheduling.schedule/partials/schedulelist.html'
		},
		{
			'containerId': 'scheduledetail', 'template': '/scheduling.schedule/partials/scheduledetail.html'
		}
	]);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'ScheduleDto', moduleSubModule: 'Scheduling.Schedule'},
							{typeName: 'Schedule2ClerkDto', moduleSubModule: 'Scheduling.Schedule'},
							{typeName: 'TimelineDto', moduleSubModule: 'Scheduling.Schedule'}
						]);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
