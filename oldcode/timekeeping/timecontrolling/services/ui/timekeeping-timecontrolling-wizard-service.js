(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc factory
	 * @name timeKeepingRecordingSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of timekeeping recording module
	 */

	let moduleName = 'timekeeping.timecontrolling';
	angular.module(moduleName).factory('timekeepingTimeControllingSideBarWizardService', TimekeepingControllingSideBarWizardService);

	TimekeepingControllingSideBarWizardService.$inject = ['_','$http','$timeout','$translate','$injector', 'platformSidebarWizardConfigService', 'timekeepingRecordingResultDataService', 'timekeepingRecordingSheetDataService', 'platformModalService',
		'timekeepingTimecontrollingReportDataService', 'basicsCommonChangeStatusService', 'platformSidebarWizardCommonTasksService'];

	function TimekeepingControllingSideBarWizardService(_,$http,$timeout, $translate,$injector,platformSidebarWizardConfigService, timekeepingRecordingResultDataService, timekeepingRecordingSheetDataService, platformModalService,
		timekeepingTimecontrollingReportDataService, basicsCommonChangeStatusService, platformSidebarWizardCommonTasksService) {

		let service = {};

		function doCalculation(route, title){
			let reports = timekeepingTimecontrollingReportDataService.getSelectedEntities();
			let entity = reports !== null ? reports[0] : null;
			if (platformSidebarWizardCommonTasksService.assertSelection(entity, title)) {
				let sheetIds = _.map(reports, 'SheetFk');
				let uniquesheetIds = [...new Set(sheetIds)];
				let sendIdData = {sheets: uniquesheetIds, recordings: null};
				$http.post(globals.webApiBaseUrl + route, sendIdData).then(function (response) {
					if (response && response.data.newEntities) {
						if (response.data.newEntities.length > 0) {
							let modalOptions;
							modalOptions = {
								showGrouping: true,
								bodyText: 'new records were generated in report successfully!',
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
							timekeepingTimecontrollingReportDataService.takeOverReports(response.data.newEntities);
						} else {
							let modalOptions;
							modalOptions = {
								showGrouping: true,
								bodyText: 'No new records generated!',
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
						}
					} else {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							bodyText: response.data.message,
							iconClass: 'ico-error'
						};
						platformModalService.showDialog(modalOptions);
					}

				});
			}
		}
		service.calculateOvertime = function calculateOvertime() {
			doCalculation('timekeeping/recording/sheet/calculateOvertime','timekeeping.timeControlling.wizardCalculateOvertime');
		};

		service.calculateOtherDerivations = function calculateOtherDerivations() {
			doCalculation('timekeeping/recording/sheet/calculateOtherDerivations', 'timekeeping.timeControlling.wizardCalculateDerivations');
		};

		let setReportStatus = function setReportStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: timekeepingTimecontrollingReportDataService,
					statusField: 'ReportStatusFk',
					codeField: 'Code',
					descField: 'DescriptionInfo.Translated',
					projectField: '',
					title: 'basics.customize.timekeepingreportstatus',
					statusName: 'recordingreportstatus',
					id: 2
				});
		};
		service.setReportStatus = setReportStatus().fn;

		let disableReports = function disableReports() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(
				timekeepingTimecontrollingReportDataService,
				'Disable Record',
				'cloud.common.disableRecord',
				'Code',
				'timekeeping.recording.disableDone',
				'timekeeping.recording.alreadyDisabled',
				'code',
				1
			);
		};
		service.disableReports = disableReports().fn;

		let enableReports = function enableReports() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(
				timekeepingTimecontrollingReportDataService,
				'Enable Record',
				'cloud.common.enableRecord',
				'Code',
				'timekeeping.recording.enableDone',
				'timekeeping.recording.alreadyEnabled',
				'code',
				2
			);
		};
		service.enableReports = enableReports().fn;

		return service;
	}

})(angular);
