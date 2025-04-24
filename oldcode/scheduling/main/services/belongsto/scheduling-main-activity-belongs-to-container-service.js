/**
 * Created by baf on 29.12.2016.
 */
(function (angular) {
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityBelongsToContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingMainModule.service('schedulingMainActivityBelongsToContainerService', SchedulingMainActivityBelongsToContainerService);

	SchedulingMainActivityBelongsToContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'schedulingMainActivityBelongsToLayoutServiceFactory'];

	function SchedulingMainActivityBelongsToContainerService(_, $injector, platformModuleInitialConfigurationService, schedulingMainActivityBelongsToLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Scheduling.Main');

			var config = schedulingMainActivityBelongsToLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Scheduling.Main');

			var config = schedulingMainActivityBelongsToLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);