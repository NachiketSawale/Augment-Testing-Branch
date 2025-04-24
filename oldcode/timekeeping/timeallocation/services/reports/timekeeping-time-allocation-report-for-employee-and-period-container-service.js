/**
 * Created by baf on 2021-10-08.
 */
(function (angular) {
	'use strict';
	let timeAllocationModule = angular.module('timekeeping.timeallocation');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	timeAllocationModule.service('timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService', TimekeepingTimeAllocationReportForEmployeeAndPeriodContainerService);

	TimekeepingTimeAllocationReportForEmployeeAndPeriodContainerService.$inject = ['platformModuleInitialConfigurationService', 'timekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory'];

	function TimekeepingTimeAllocationReportForEmployeeAndPeriodContainerService(platformModuleInitialConfigurationService, timekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Timekeeping.TimeAllocation');

			let config = timekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Timekeeping.TimeAllocation');

			let config = timekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);