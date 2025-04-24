(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.schedule';
	var schedulingScheduleModule = angular.module(moduleName);
	schedulingScheduleModule.factory('schedulingScheduleCodeGenerationService', ['_', 'platformDataServiceFactory',

		function (_, platformDataServiceFactory) {

			var projectNumberGenerationSettingInfo = {
				module: schedulingScheduleModule,
				serviceName: 'schedulingScheduleCodeGenerationService',
				presenter: {list: {}},
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/schedule/codegeneration/', endRead: 'list'}
			};

			var container = platformDataServiceFactory.createNewComplete(projectNumberGenerationSettingInfo);
			var service = container.service;

			var data = container.data;

			service.hasToGenerate = function hasToGenerate() {
				var defaultSetting = data.itemList[0];
				return defaultSetting && defaultSetting.HasToCreate;
			};

			return service;

		}]);
})(angular);
