/**
 * Created by baf on 29.12.2016.
 */
(function (angular) {
	'use strict';
	var schedulingModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainRequiredByActivityContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingModule.service('schedulingMainRequiredByActivityContainerService', SchedulingMainRequiredByActivityContainerService);

	SchedulingMainRequiredByActivityContainerService.$inject = ['platformModuleInitialConfigurationService', 'schedulingMainRequiredByActivityLayoutServiceFactory'];

	function SchedulingMainRequiredByActivityContainerService(platformModuleInitialConfigurationService, schedulingMainRequiredByActivityLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Scheduling.Main');

			var config = schedulingMainRequiredByActivityLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Scheduling.Main');

			var config = schedulingMainRequiredByActivityLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);