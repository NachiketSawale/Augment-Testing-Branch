/**
 * Created by Mohit on 12.09.2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.timesymbols';
	angular.module(moduleName).service('timekeepingTimeSymbolsSidebarWizardService', TimekeepingTimeSymbolsSidebarWizardService);

	TimekeepingTimeSymbolsSidebarWizardService.$inject = ['timekeepingTimeSymbolsDataService','platformSidebarWizardCommonTasksService'];

	function TimekeepingTimeSymbolsSidebarWizardService(timekeepingTimeSymbolsDataService,platformSidebarWizardCommonTasksService) {
		let disableTimeSymbol = function disableTimeSymbol() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(
				timekeepingTimeSymbolsDataService,
				'Disable Record',
				'cloud.common.disableRecord',
				'Code',
				'timekeeping.timesymbols.disableDone',
				'timekeeping.timesymbols.alreadyDisabled',
				'code',
				1
			);
		};
		this.disableTimeSymbol = disableTimeSymbol().fn;

		let enableTimeSymbol = function enableTimeSymbol() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(
				timekeepingTimeSymbolsDataService,
				'Enable Record',
				'cloud.common.enableRecord',
				'Code',
				'timekeeping.timesymbols.enableDone',
				'timekeeping.timesymbols.alreadyEnabled',
				'code',
				2
			);
		};
		this.enableTimeSymbol = enableTimeSymbol().fn;


	}

})(angular);