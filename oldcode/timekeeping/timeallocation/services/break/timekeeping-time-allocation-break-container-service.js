/**
 * Created by Sudarshan on 2023-07-12.
 */
(function (angular) {
	'use strict';
	let timeAllocationModule = angular.module('timekeeping.timeallocation');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeAllocationBreakContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	timeAllocationModule.service('timekeepingTimeAllocationBreakContainerService', TimekeepingTimeAllocationBreakContainerService);

	TimekeepingTimeAllocationBreakContainerService.$inject = ['platformModuleInitialConfigurationService', 'timekeepingTimeAllocationBreakLayoutServiceFactory'];

	function TimekeepingTimeAllocationBreakContainerService(platformModuleInitialConfigurationService, timekeepingTimeAllocationBreakLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Timekeeping.TimeAllocation');

			let config = timekeepingTimeAllocationBreakLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Timekeeping.TimeAllocation');

			let config = timekeepingTimeAllocationBreakLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);