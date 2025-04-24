/**
 * Created by Mohit on 22.12.2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.worktimemodel';
	angular.module(moduleName).service('timekeepingWorkTimeModelSidebarWizardService', TimekeepingWorkTimeModelSidebarWizardService);

	TimekeepingWorkTimeModelSidebarWizardService.$inject = ['timekeepingWorkTimeModelDataService','platformSidebarWizardCommonTasksService'];

	function TimekeepingWorkTimeModelSidebarWizardService(timekeepingWorkTimeModelDataService,platformSidebarWizardCommonTasksService) {
		let disableWorkTimeModel = function disableWorkTimeModell() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(
				timekeepingWorkTimeModelDataService,
				'Disable Record',
				'cloud.common.disableRecord',
				'Code',
				'timekeeping.worktimemodel.disableDone',
				'timekeeping.worktimemodel.alreadyDisabled',
				'code',
				1
			);
		};
		this.disableWorkTimeModel = disableWorkTimeModel().fn;

		let enableWorkTimeModel = function enableWorkTimeModel() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(
				timekeepingWorkTimeModelDataService,
				'Enable Record',
				'cloud.common.enableRecord',
				'Code',
				'timekeeping.worktimemodel.enableDone',
				'timekeeping.worktimemodel.alreadyEnabled',
				'code',
				2
			);
		};
		this.enableWorkTimeModel = enableWorkTimeModel().fn;


	}

})(angular);