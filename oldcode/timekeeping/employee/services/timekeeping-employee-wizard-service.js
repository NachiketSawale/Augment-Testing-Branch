/**
 * Created by leo on 02.05.2018.
 */
(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.employee';
	angular.module(moduleName).service('timekeepingEmployeeSidebarWizardService', TimekeepingEmployeeSidebarWizardService);

	TimekeepingEmployeeSidebarWizardService.$inject = ['platformSidebarWizardCommonTasksService', 'timekeepingEmployeeDataService', 'timekeepingPlannedAbsenceDataService', 'basicsCommonChangeStatusService', 'platformModalService', 'timekeepingEmployeeSkillDataService', '$translate', '$http',
		'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalFormConfigService', '_', 'platformLayoutHelperService', 'globals'];

	function TimekeepingEmployeeSidebarWizardService(platformSidebarWizardCommonTasksService, timekeepingEmployeeDataService, timekeepingPlannedAbsenceDataService, basicsCommonChangeStatusService, platformModalService, timekeepingEmployeeSkillDataService, $translate, $http, basicsLookupdataConfigGenerator, platformTranslateService, platformModalFormConfigService, _, platformLayoutHelperService, globals) {

		let disableEmployee = function disableEmployee() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(timekeepingEmployeeDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
				'timekeeping.employee.disableDone', 'timekeeping.employee.alreadyDisabled', 'code', 1);
		};
		this.disableEmployee = disableEmployee().fn;

		let enableEmployee = function enableEmployee() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(timekeepingEmployeeDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
				'timekeeping.employee.enableDone', 'timekeeping.employee.alreadyEnabled', 'code', 2);
		};
		this.enableEmployee = enableEmployee().fn;

		let setPlannedAbsenceStatus = function setPlannedAbsenceStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: true,
					mainService: timekeepingEmployeeDataService,
					dataService: timekeepingPlannedAbsenceDataService,
					statusField: 'PlannedAbsenceStatusFk',
					projectField: '',
					title: 'basics.customize.plannedabsencestatus',
					statusName: 'plannedabsencestatus',
					id: 1
				}
			);
		};
		this.setPlannedAbsenceStatus = setPlannedAbsenceStatus().fn;

		let setEmployeeStatus = function setEmployeeStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: true,
					mainService: timekeepingEmployeeDataService,
					statusField: 'EmployeeStatusFk',
					projectField: '',
					title: 'timekeeping.employee.employeeStatusWizard',
					statusName: 'employeestatus',
					id: 2
				}
			);
		};
		this.setEmployeeStatus = setEmployeeStatus().fn;

		let setEmployeeSkillStatus = function setEmployeeSkillStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: true,
					mainService: timekeepingEmployeeDataService,
					dataService: timekeepingEmployeeSkillDataService,
					statusField: 'EmployeeSkillStatusFk',
					title: 'timekeeping.employee.employeeSkillStatusWizard',
					statusName: 'employeeskillstatus',
					id: 3
				}
			);
		};
		this.setEmployeeSkillStatus = setEmployeeSkillStatus().fn;

		this.generatePlannedAbsences = function generatePlannedAbsences() {
			let modalCreateConfig = null;
			let dataItem = {TimesymbolFk: null};
			let dataItem2 = {EmployeeFk: null};
			let dataItem3 = {SkillId: null};
			let getEmpFk = timekeepingEmployeeSkillDataService.getSelected().EmployeeFk;
			let getSkillIds = timekeepingEmployeeSkillDataService.getSelectedEntities();
			let skillIds = _.map(getSkillIds, 'Id');

			modalCreateConfig = {
				dataItem: dataItem,
				dataItem2: dataItem2,
				dataItem3: dataItem3,

				formConfiguration: {
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
						}
					],
					rows: [

						getTimesymbol({
							gid: 'baseGroup',
							rid: 'timesymbolfk',
							label: 'Time Symbol',
							label$tr$: 'timekeeping.timesymbol.dTimesymbolFkspatchingWizard.entityId',
							model: 'TimesymbolFk'
						})
					]
				},

				handleOK: function handleOK(result) {
					// let dialogResource = modalCreateConfig.dataItem;
					if (result.data.TimesymbolFk === null) {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							headerText: 'Select Timesymbol',
							bodyText: 'No Default Timesymbol selected. Please select one.',
							iconClass: 'ico-info'
						};
						// platformModalService.showDialog(modalOptions);
						return;
					}
					let data = result.data.TimesymbolFk;
					let sendType = {timesymbolFk: data, employeeFk: getEmpFk, skillId: skillIds};
					$http.post(globals.webApiBaseUrl + 'timekeeping/employee/generateplannedabsences', sendType).then(function (response) {

						if (response) {
							let modalOptions;

							if (response.data) {
								modalOptions = {
									showGrouping: true,
									bodyText: response.data.LogMsg,
									iconClass: 'ico-info'
								};
							} else {
								modalOptions = {
									showGrouping: true,
									bodyText: $translate.instant('timekeeping.employee.generateplannedabsences.generatedInfo'),
									iconClass: 'ico-info'
								};
							}
							platformModalService.showDialog(modalOptions);
						}
					});
				},

				dialogOptions: {
					disableOkButton: function () {
					}
				},
			};
			platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
			platformModalFormConfigService.showDialog(modalCreateConfig);

		};
		// this.generatePlannedAbsences = generatePlannedAbsences().fn;

		this.createReservation = function createReservation() {
			let modalCreateConfig = null;
			let title = $translate.instant('timekeeping.employee.createReservationByEmployeesWizard.title');
			let dataItem = {JobFk: null};

			modalCreateConfig = {
				title: title,
				dataItem: dataItem,

				formConfiguration: {
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
						}
					],
					rows: [

						getJobRow({
							gid: 'baseGroup',
							rid: 'job',
							label: 'Job',
							label$tr$: 'resource.requisition.dispatchingWizard.entityPerformingJob',
							model: 'JobFk'
						})
					]
				},

				// action for OK button

				handleOK: function handleOK(result) {
					// let dialogResource = modalCreateConfig.dataItem;
					if (result.data.JobFk === null) {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							headerText: 'Select Job',
							bodyText: 'No Default Job selected. Please select one.',
							iconClass: 'ico-info'
						};
						// platformModalService.showDialog(modalOptions);
						return;
					}
					let data = result.data.JobFk;

					$http.get(globals.webApiBaseUrl + 'timekeeping/employee/createreservations?jobId=' + data).then(function (response) {
						if (response) {
							let modalOptions;

							if (response.data) {
								modalOptions = {
									showGrouping: true,
									bodyText: response.data,
									iconClass: 'ico-info'
								};
							} else {
								modalOptions = {
									showGrouping: true,
									bodyText: $translate.instant('timekeeping.employee.createReservationByEmployeesWizard.generatedInfo'),
									iconClass: 'ico-info'
								};
							}
							platformModalService.showDialog(modalOptions);
						}
					});
				},
				dialogOptions: {
					disableOkButton: function () {
					}
				},
			};
			platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
			platformModalFormConfigService.showDialog(modalCreateConfig);
		};

		function getJobRow(options, sortOrder) {
			let jobRow = platformLayoutHelperService.provideJobLookupOverload().detail;
			angular.extend(jobRow, {
				sortOrder: sortOrder, required: true,
				gid: options.gid,
				rid: options.rid,
				label: options.label,
				label$tr$: options.label$tr$,
				model: options.model
			});
			return jobRow;
		}

		function getTimesymbol(options, sortOrder) {
			let timesymbol = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'timekeepingTimeSymbolLookupDataService'
			}).detail;
			angular.extend(timesymbol, {
				sortOrder: sortOrder, required: true,
				gid: options.gid,
				rid: options.rid,
				label: options.label,
				label$tr$: options.label$tr$,
				model: options.model
			});
			return timesymbol;
		}
	}

})(angular);