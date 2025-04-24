/**
 * Created by baf on 29.12.2016.
 */
(function (angular) {
	'use strict';
	var schedulingModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainReservedForActivityContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingModule.service('schedulingMainReservedForActivityContainerService', SchedulingMainReservedForActivityContainerService);

	SchedulingMainReservedForActivityContainerService.$inject = ['platformModuleInitialConfigurationService', 'schedulingMainReservedForActivityLayoutServiceFactory'];

	function SchedulingMainReservedForActivityContainerService(platformModuleInitialConfigurationService, schedulingMainReservedForActivityLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Scheduling.Main');

			var config = schedulingMainReservedForActivityLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Scheduling.Main');

			var config = schedulingMainReservedForActivityLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);