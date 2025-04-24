/**
 * Created by shen on 7/1/2021
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc factory
	 * @name timeKeepingRecordingSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of timekeeping recording module
	 */

	let moduleName = 'timekeeping.recording';
	angular.module(moduleName).factory('timeKeepingRecordingSideBarWizardService', TimeKeepingRecordingSideBarWizardService);

	TimeKeepingRecordingSideBarWizardService.$inject = [
		'_',
		'$http',
		'$timeout',
		'$translate',
		'$injector',
		'platformSidebarWizardConfigService',
		'timekeepingRecordingResultDataService',
		'timekeepingRecordingSheetDataService',
		'platformModalService',
		'timekeepingRecordingDataService',
		'timekeepingRecordingReportDataService',
		'basicsCommonChangeStatusService',
		'platformWizardDialogService',
		'basicsCommonWizardHelper',
		'platformLayoutHelperService',
		'timekeepingEmployeeDataService',
		'platformSidebarWizardCommonTasksService',
		'platformPermissionService',
		'platformTranslateService',
		'platformModalGridConfigService',
		'platformModalFormConfigService',
		'platformGridAPI',
		'platformGridDialogService'
	];

	function TimeKeepingRecordingSideBarWizardService(
		_,
		$http,
		$timeout,
		$translate,
		$injector,
		platformSidebarWizardConfigService,
		timekeepingRecordingResultDataService,
		timekeepingRecordingSheetDataService,
		platformModalService,
		timekeepingRecordingDataService,
		timekeepingRecordingReportDataService,
		basicsCommonChangeStatusService,
		platformWizardDialogService,
		basicsCommonWizardHelper,
		platformLayoutHelperService,
		timekeepingEmployeeDataService,
		platformSidebarWizardCommonTasksService,
		platformPermissionService,
		platformTranslateService,
		platformModalGridConfigService,
		platformModalFormConfigService,
		platformGridAPI,
		platformGridDialogService
	) {
		let service = {};
		let basicsWizardID = 'timeKeepingRecordingSideBarWizardService';
		let reports = [];
		let matchedReports = [];
		service.setReports = function (data) {
			reports = data;
		};

		service.getReports = function () {
			return reports;
		};

		service.setMatchedReports = function (data) {
			matchedReports = data;
		};

		service.getMatchedReports = function () {
			return matchedReports;
		};

		service.calculateOvertime = function calculateOvertime() {
			let recordings = timekeepingRecordingDataService.getSelectedEntities();
			let recordingIds = _.map(recordings, 'Id');
			let sheets = timekeepingRecordingSheetDataService.getSelectedEntities();
			let sheetsIds = _.map(sheets, 'Id');
			let sendIdData = { sheets: sheetsIds, recordings: recordingIds };
			$http.post(globals.webApiBaseUrl + 'timekeeping/recording/sheet/calculateOvertime', sendIdData).then(function (response) {
				if (response && response.data.newEntities) {
					if (response.data.newEntities.length > 0) {
						let modalOptions;
						var modalOptionsErrorReturn;
						modalOptions = {
							showGrouping: true,
							bodyText: 'new records were generated in report successfully!',
							iconClass: 'ico-info',
						};
						if (response.data.faultyEmployeeList.length > 0){
							 modalOptionsErrorReturn = {
								showGrouping: true,
								bodyText: response.data.faultyEmployeeList.toString(),
								iconClass: 'ico-info',
							};
							platformModalService.showDialog(modalOptionsErrorReturn);
						}
						platformModalService.showDialog(modalOptions);
						// timekeepingRecordingReportDataService.takeOverReports(response.data.newEntities);
						timekeepingRecordingReportDataService.load();
					} else {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							bodyText: 'No new records generated!',
							iconClass: 'ico-info',
						};
						if (response.data.faultyEmployeeList.length > 0){
							modalOptionsErrorReturn = {
								showGrouping: true,
								bodyText: response.data.faultyEmployeeList.toString(),
								iconClass: 'ico-info',
							};
							platformModalService.showDialog(modalOptionsErrorReturn);
						}
						platformModalService.showDialog(modalOptions);
					}
				} else {
					let modalOptions;
					modalOptions = {
						showGrouping: true,
						bodyText: response.data.message,
						iconClass: 'ico-error',
					};
					platformModalService.showDialog(modalOptions);
					if (response.data.faultyEmployeeList > 0){
						modalOptionsErrorReturn = {
							showGrouping: true,
							bodyText: response.data.faultyEmployeeList,
							iconClass: 'ico-info',
						};
					}
					platformModalService.showDialog(modalOptionsErrorReturn);
				}
			});
		};

		service.calculateOtherDerivations = function calculateOtherDerivations() {
			let recordings = timekeepingRecordingDataService.getSelectedEntities();
			let recordingIds = _.map(recordings, 'Id');
			let sheets = timekeepingRecordingSheetDataService.getSelectedEntities();
			let sheetsIds = _.map(sheets, 'Id');
			let sendIdData = { sheets: sheetsIds, recordings: recordingIds };
			$http.post(globals.webApiBaseUrl + 'timekeeping/recording/sheet/calculateOtherDerivations', sendIdData).then(function (response) {
				if (response && response.data.newEntities) {
					if (response.data.newEntities.length > 0) {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							bodyText: 'new records have been generated in report successfully',
							iconClass: 'ico-info',
						};
						platformModalService.showDialog(modalOptions);
						timekeepingRecordingReportDataService.load();
						// timekeepingRecordingReportDataService.takeOverReports(response.data.newEntities);
					} else {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							bodyText: 'There is no new record generated',
							iconClass: 'ico-info',
						};
						platformModalService.showDialog(modalOptions);
					}
				} else {
					let modalOptions;
					modalOptions = {
						showGrouping: true,
						bodyText: response.data.message,
						iconClass: 'ico-info',
					};
					platformModalService.showDialog(modalOptions);
				}
			});
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(basicsWizardID /* , basicsWizardConfig */);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(basicsWizardID);
		};

		let disableReports = function disableReports() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(
				timekeepingRecordingReportDataService,
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
				timekeepingRecordingReportDataService,
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

		let setRecordingStatus = function setRecordingStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
				refreshMainService: false,
				mainService: timekeepingRecordingDataService,
				statusField: 'RecordingStatusFk',
				codeField: 'Code',
				descField: 'DescriptionInfo.Translated',
				projectField: '',
				title: 'basics.customize.timekeepingrecordingstatus',
				statusName: 'timekeepingrecordingstatus',
				id: 1,
			});
		};
		service.setRecordingStatus = setRecordingStatus().fn;

		let setReportStatus = function setReportStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
				refreshMainService: false,
				mainService: timekeepingRecordingDataService,
				dataService: timekeepingRecordingReportDataService,
				statusField: 'ReportStatusFk',
				codeField: 'Code',
				descField: 'DescriptionInfo.Translated',
				projectField: '',
				title: 'basics.customize.timekeepingreportstatus',
				statusName: 'recordingreportstatus',
				id: 2,
			});
		};
		service.setReportStatus = setReportStatus().fn;

		service.setBulkReportStatus = function setBulkReportStatus() {
			let modalBulkReportStatus;
			let title = 'timekeeping.recording.bulkemployeereportstatus';
			modalBulkReportStatus = {
				dialogOptions: {height: '600px', width: '450px',resizeable: true},
				title: $translate.instant(title),
				dataItem: {
					fromDate: null,
					toDate: null,
					remark: ''
				},
				formConfiguration: {
					fid: 'timekeeping.recording.bulkemployeereportstatus',
					version: '0.2.4',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['setAlternativeActive']
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'status',
							label$tr$: $translate.instant('timekeeping.recording.bulkemployeereportstatus'),
							type: 'directive',
							directive: 'report-status-list-directive',
							model: 'status',
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'fromDate',
							label: 'From Date',
							label$tr$: 'timekeeping.recording.fromDate',
							type: 'dateutc',
							model: 'fromDate',
							sortOrder: 2,
						},
						{
							gid: 'baseGroup',
							rid: 'toDate',
							label: 'To Date',
							label$tr$: 'timekeeping.recording.toDate',
							type: 'dateutc',
							model: 'toDate',
							sortOrder: 3,
						},
						{
							gid: 'baseGroup',
							rid: 'remark',
							label: 'Remark',
							label$tr$: 'timekeeping.recording.remark',
							type: 'description',
							model: 'remark',
							sortOrder: 4,
						}
					]
				},
				handleOK: function handleOK(result) {
					if (result) {
						let statusData = platformGridAPI.rows.selection({gridId: 'e6f3fbcf3c8b4247baa9c18a521a2b1c'});
						if (!statusData || statusData.length === 0) {
							platformModalService.showDialog({
								bodyText:  $translate.instant('timekeeping.recording.sellectstatus'),
								iconClass: 'ico-warning'
							});
							return;
						}
						if (!result.data.fromDate || !result.data.toDate) {
							platformModalService.showDialog({
								bodyText:  $translate.instant('timekeeping.recording.selectdates'),
								iconClass: 'ico-warning'
							});
							return;
						}
						const postData = {
							fromDate: result.data.fromDate,
							toDate: result.data.toDate,
							remark: result.data.remark,
							status: statusData
						};

						// Step 1: Fetch reports from the date interval
						$http.get(globals.webApiBaseUrl + 'timekeeping/recording/report/getreportfromdatesinterval?fromDate='
							+ new Date(postData.fromDate).toISOString()
							+ '&toDate='
							+ new Date(postData.toDate).toISOString()
						).then(function (response) {
							if (response && response.data !== null) {
								const reports = response.data;
								service.setReports(reports);
								let gridPopupConfig;
								gridPopupConfig = {
									dialogOptions: { resizeable: true},
									title: $translate.instant('timekeeping.recording.fetchedreport'),
									dataItem: {
										bulkpreport: reports
									},
									formConfiguration: {
										fid: 'timekeeping.recording.bulkreport',
										version: '0.2.4',
										showGrouping: false,
										groups: [
											{
												gid: 'baseGroup',
												attributes: ['setAlternativeActive']
											}
										],
										rows: [
											{
												gid: 'baseGroup',
												rid: 'bulkrepots',
												label$tr$: 'timekeeping.recording.bulkemployeereportstatus',
												type: 'directive',
												directive: 'bulk-report-list-directive',
												model: 'bulkpreport',
												sortOrder: 1
											}
										]
									},
									handleOK: function handleOK() {
										// Step 2: Fetch current statuses for the reports
										const statusCheckPayload = reports.map(report => ({
											Id: report.Id,
											StatusField: 'ReportStatusFk'
										}));
										$http.post(globals.webApiBaseUrl + 'basics/common/status/getcurrentstatuses?statusName=recordingreportstatus', statusCheckPayload)
											.then(function (statusResponse) {
												if (statusResponse && statusResponse.data !== null) {
													const currentStatuses = statusResponse.data;

													const matchingReports = [];
													const nonMatchingReports = [];

													// Step 3: Divide reports into matching and non-matching
													reports.forEach(report => {
														const currentStatus = currentStatuses.find(cStatus => cStatus.CurrentStatusId === report.ReportStatusFk);
														if (currentStatus && currentStatus.CurrentStatusId === postData.status.Id) {
															matchingReports.push(report);
														} else {
															nonMatchingReports.push(report);
														}
													});
													service.setMatchedReports(matchingReports);
													// Step 4: Show matching reports in a grid popup
													if (matchingReports.length > 0) {
														let matchedGridPopupConfig;
														matchedGridPopupConfig = {
															dialogOptions: {resizeable: true},
															title: $translate.instant('timekeeping.recording.matchedreport'),
															dataItem: {
																matchingReports: matchingReports
															},
															formConfiguration: {
																fid: 'timekeeping.recording.matchingreport',
																version: '0.2.4',
																showGrouping: false,
																groups: [
																	{
																		gid: 'baseGroup',
																		attributes: ['setAlternativeActive']
																	}
																],
																rows: [
																	{
																		gid: 'baseGroup',
																		rid: 'matchedrepots',
																		label$tr$: 'timekeeping.recording.bulkemployeereportstatus',
																		type: 'directive',
																		directive: 'matched-report-list-directive',
																		model: 'matchingReports',
																		sortOrder: 1
																	}
																]
															},
														};
														matchedGridPopupConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
														platformModalFormConfigService.showDialog(matchedGridPopupConfig);
													}
													//Step 5: Change the status of non-matching records via API
													if (nonMatchingReports.length > 0) {
														const nonMatchingPayload = nonMatchingReports.map(report => ({
															Id: report.Id,
															Status: postData.status.Id,
															Remark: postData.remark
														}));

														$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/bulkchangestatus', nonMatchingPayload)
															.then(function () {
																let modalOptions = {
																	showGrouping: true,
																	bodyText: $translate.instant('timekeeping.recording.reportStatusSuccess'),
																	iconClass: 'ico-info'
																};
																platformModalService.showDialog(modalOptions);
															});
													}else{
														let modalOptions = {
															showGrouping: true,
															bodyText: $translate.instant('timekeeping.recording.noReportsToUpdate'),
															iconClass: 'ico-info'
														};
														platformModalService.showDialog(modalOptions);
													}
												}
											});
									}
								};

								gridPopupConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
								platformModalFormConfigService.showDialog(gridPopupConfig);
							}
						});
					}
				}
			};

			modalBulkReportStatus.scope = platformSidebarWizardConfigService.getCurrentScope();
			platformModalFormConfigService.showDialog(modalBulkReportStatus);
		};

		let setSheetStatus = function setSheetStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
				refreshMainService: false,
				mainService: timekeepingRecordingDataService,
				dataService: timekeepingRecordingSheetDataService,
				statusField: 'SheetStatusFk',
				codeField: 'Code',
				descField: 'DescriptionInfo.Translated',
				projectField: '',
				title: 'basics.customize.timekeepingsheetstatus',
				statusName: 'timekeepingsheetstatus',
				id: 3,
			});
		};
		service.setSheetStatus = setSheetStatus().fn;

		let setResultStatus = function setResultStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
				refreshMainService: false,
				mainService: timekeepingRecordingDataService,
				dataService: timekeepingRecordingResultDataService,
				statusField: 'ResultStatusFk',
				codeField: 'Code',
				descField: 'DescriptionInfo.Translated',
				projectField: '',
				title: 'basics.customize.timekeepingresultstatus',
				statusName: 'timekeepingresultstatus',
				id: 4,
			});
		};
		service.setResultStatus = setResultStatus().fn;

		service.createReportsFromCrewLeader = function createReportsFromCrewLeader() {
			// Get all neccessary selected lines --> recording, reports and define all necessary variables
			if (timekeepingRecordingDataService.getSelected() === null) {
				let modalOptions = {
					showGrouping: true,
					bodyText: $translate.instant('timekeeping.recording.missingRecordingSelection'),
					iconClass: 'ico-info',
				};
				platformModalService.showDialog(modalOptions);
				return;
			}
			let recordingId = timekeepingRecordingDataService.getSelected().Id;

			let selectedReports = _.cloneDeep(timekeepingRecordingReportDataService.getSelectedEntities());
			let title = 'timekeeping.recording.createReportsFromCrewLeader';
			let _gid = 'group';
			let gridStepUuid = 'gridStep';
			let employeeServiceName = 'timekeepingEmployeeDataService';
			let translationNamespace = 'timekeeping.recording.createReportsFromCrewLeader.';

			// get columns --> with UIStandart service for custome fields or just layout service for all fields

			// let employeeGridLayout = $injector.get('timekeepingEmployeeLayoutService').getStandardConfigForListView().columns;
			let timekeepingEmployeeUIStandartService = $injector.get('timekeepingEmployeeUIStandardService');
			let employeeGridLayout = _.cloneDeep(timekeepingEmployeeUIStandartService.getStandardConfigForListView().columns);

			// dynamicly created checkbox for selection of employees
			let checkBoxColumn = {
				editor: 'boolean',
				editorOptions: {},
				field: 'isSelectedForRecordCreation',
				formatter: 'boolean',
				fixed: true,
				width: 150,
				formatterOptions: {},
				id: 'SelectedForRecordCreation-checkbox',
				name: translationNamespace + 'isSelectedForRecordCreation',
				name$tr$: translationNamespace + 'isSelectedForRecordCreation',
				toolTip: translationNamespace + 'isSelectedForRecordCreationToolTip',
				toolTip$tr$: translationNamespace + 'isSelectedForRecordCreationToolTip',
			};
			employeeGridLayout.unshift(checkBoxColumn);

			// object for data handling with included gridstep definition
			let employeesToChoose = {
				selectionStep: {
					selectedOption: null, // Possible options: all --> 0, recording --> 1, project --> 2 and job --> 3 || 4 => create Reports --> at the end
				},
				gridStep: {
					items: [],
					selectionListConfig: {
						multiSelect: false,
						idProperty: 'Id',
						columns: employeeGridLayout,
					},
				},
				IsPresence:true
			};

			// create Step 1
			let stepOne = {
				id: 'selection',
				title$tr$: 'timekeeping.recording.createReportsFromCrewLeader.step1Title',
				form: {
					fid: 'timekeeping.recording.createReportsFromCrewLeader',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['createReportsFromCrewLeader'],
						},
					],
					rows: [
						{
							id: 'multioption',
							gid: 'baseGroup',
							rid: 'selection',
							label: 'Select where to choose the employee from',
							type: 'radio',
							model: 'selection',
							required: true,
							canFinish: true,
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'createReportsFromCrewLeader',
								items: [
									{
										Id: 0,
										Description: $translate.instant('timekeeping.recording.createReportsFromCrewLeader.allemployees'),
										Value: 0,
									},
									{
										Id: 1,
										Description: $translate.instant('timekeeping.recording.createReportsFromCrewLeader.fromrecording'),
										Value: 1,
									},
									{
										Id: 2,
										Description: $translate.instant('timekeeping.recording.createReportsFromCrewLeader.fromprojectandjob'),
										Value: 2,
									}
								],
							},
						},
						{
							gid: 'baseGroup',
							rid: 'IsPresence',
							label: 'Overwrite only IsPresence records',
							type: 'boolean',
							visible: true,
							sortOrder: 1,
							model: 'IsPresence'
						}
					],

				},
				disallowBack: true,
				disallowNext: true,
				canFinish: false,
			};
			// create Step 2
			let stepTwo = {
				id: 'lookups',
				title$tr$: 'timekeeping.recording.createReportsFromCrewLeader.step1Title',
				form: {
					fid: 'timekeeping.recording.createReportsFromCrewLeader',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['createReportsFromCrewLeader'],
						},
					],
					rows: [
						getJobRow('project', 'ProjectFk', 'Project', 'Project', 2, false, 'project'),
						getJobRow('job', 'JobFk', 'Job', 'Job', 2, false, 'job'),
					],
				},
				disallowBack: false,
				disallowNext: false,
				canFinish: true,
			};

			// create Step 3
			let gridStep = platformWizardDialogService.createListStep({
				title: $translate.instant('timekeeping.recording.createReportsFromCrewLeader.step2Title'),
				stepId: 'gridStep',
				model: 'gridStep',
			});

			stepTwo.prepareStep = function(info){
				if (employeesToChoose.selectionStep.selectedOption !== 2 && info.previousStepIndex===0) {
					info.commands.goToNext();
				}
				if(info.previousStepIndex===2){
					info.commands.goToPrevious();
				}
			};

			// Pre step for filling in the grid with employees
			gridStep.prepareStep = function (info) {
				let projectfk = info.model.ProjectFk;
				let jobfk = info.model.JobFk;
				let projectOrjob;

				// Error prevention with check for selected project or job in according lookups
				if ((employeesToChoose.selectionStep.selectedOption === 2) && (!info.model.ProjectFk || !info.model.JobFk)) {
					if (!info.model.ProjectFk) {
						// No Prject set
						let errorMessage = {
							showGrouping: true,
							bodyText: 'There is no Project selected please select one',
							iconClass: 'ico-info',
						};
						platformModalService.showDialog(errorMessage).then(function () {
							info.commands.goToPrevious();
						});
					}
				}
				// set projectOrjob --> only one variable for both project or job needed
				if (projectfk !== undefined) {
					projectOrjob = projectfk;
				} else {
					if (jobfk !== undefined) {
						projectOrjob = jobfk;
					} else {
						projectOrjob = null;
					}
				}
				let isPresence = employeesToChoose.IsPresence;
				getFilteredList(employeesToChoose.selectionStep.selectedOption, recordingId, projectOrjob,isPresence).then(function (filteredEmployees) {
					employeesToChoose.gridStep.items = filteredEmployees;
					markItemsAsModified(employeesToChoose.gridStep.items);
					gridStep.canFinish = true;
					gridStep.cssClass = '';
				});
			};

			// Updating the dataservice with list to trigger internal grid watch --> updates grid in ui on call
			function markItemsAsModified(filteredEmployeesList) {
				let areNewItems = true;
				if (_.isArray(filteredEmployeesList) && !_.isEmpty(filteredEmployeesList)) {
					_.each(filteredEmployeesList, function (employee) {
						if (employee.Version !== 0) {
							areNewItems = false;
							return areNewItems;
						}
					});
				}
				if (areNewItems) {
					timekeepingEmployeeDataService.setList(filteredEmployeesList);
				}
			}

			// START wizard config
			let createReportsFromCrewLeaderWizard = {
				id: 'jpfriedelwizard',
				title$tr$: $translate.instant('timekeeping.recording.createReportsFromCrewLeader.title'),
				steps: [stepOne, stepTwo,gridStep],
				watches: [
					{
						expression: 'selection',
						fn: function (info) {
							let filteredStep = _.find(info.wizard.steps, { id: 'selection' });
							// Set next step table with employees according to selection of radio button
							switch (info.newValue) {
								case 0:
									filteredStep.disallowNext = false;
									employeesToChoose.selectionStep.selectedOption = 0;
									break;
								case 1:
									filteredStep.disallowNext = false;
									employeesToChoose.selectionStep.selectedOption = 1;
									break;
								case 2:
									filteredStep.disallowNext = false;
									employeesToChoose.selectionStep.selectedOption = 2;
									break;
								case 3:
									filteredStep.disallowNext = false;
									employeesToChoose.selectionStep.selectedOption = 3;
									break;
								default:
									console.log('Unexpected createReportsFromCrewLeader Value in radio button "${info.newValue}"');
							}
						},
					},
				],
				height:'800px'
			};
			// END wizard config

			// create wizard in ui and manage onFinish call to server for report creation with selected employees
			platformWizardDialogService.translateWizardConfig(createReportsFromCrewLeaderWizard);
			platformWizardDialogService.showDialog(createReportsFromCrewLeaderWizard, employeesToChoose).then(function (result) {
				if (result.success) {
					const selectedEmployees = _.filter(employeesToChoose.gridStep.items, { isSelectedForRecordCreation: true });
					let isPresence = employeesToChoose.IsPresence;
					// TODO call server and create Records/Delete existing
					manageRecordCreationAndDeletion(selectedEmployees, recordingId, selectedReports,isPresence);
				}
			});
		};

		service.unlockUsedForTransaction = function unlockUsedForTransaction() {
					let listResult = timekeepingRecordingResultDataService.getSelectedEntities();
					let listReport = timekeepingRecordingReportDataService.getSelectedEntities();

					if (listReport.length === 0 && listResult.length === 0) {
						let modalOptions = {
							showGrouping: true,
							headerText: 'UnLock readonly records',
							bodyText: 'please select record first.',
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
						return false;
					}

					let modifyResult = false;
					let modifyReport = false;

					function unlockItems(list, dataService) {
						if (list && list.length > 0) {
							list.forEach(item => {
									item.UsedForTransaction = false;
									dataService.markItemAsModified(item);
									modifyResult = modifyReport = true;
							});
						}
					}
					unlockItems(listResult, timekeepingRecordingResultDataService);
					unlockItems(listReport, timekeepingRecordingReportDataService);

					if (modifyResult || modifyReport) {
						let modalOptions = {
							showGrouping: true,
							headerText: 'UnLock readonly records',
							bodyText: 'Records Unlocked Successfully.',
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
					timekeepingRecordingReportDataService.gridRefresh();
					return timekeepingRecordingResultDataService.gridRefresh();
		};




		// gets a filtered employee list from server with the filter typ explained in definition, recordingID determined on start and projectorjob --> nullable
		function getFilteredList(filterTyp, recordingId, projectOrjob,isPresence) {
			let sendType;
			if (projectOrjob !== null) {
				sendType = { isFilterStep: true, filterTyp: filterTyp, RecordingId: recordingId, ProjectOrJob: projectOrjob,isPresenceTimeSymbol:isPresence };
			} else {
				sendType = { isFilterStep: true, filterTyp: filterTyp, RecordingId: recordingId ,isPresenceTimeSymbol:isPresence};
			}
			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/createReportsFromCrewLeaderWizard', sendType).then(function (response) {
				if (response && response.data.Employees !== null) {
					return response.data.Employees;
				}
			});
		}

		// Create and delete Reports in final step
		function manageRecordCreationAndDeletion(selectedEmployees, recordingId, selectedReports,isPresence) {
			// Moments need formating --> Time fields only get Times and not full moments
			selectedReports.forEach(function (report) {
				if (report.FromTimePartTime) {
					report.FromTimePartTime = report.FromTimePartTime.format('HH:mm:ss').toString();
				}
				if (report.ToTimePartTime) {
					report.ToTimePartTime = report.ToTimePartTime.format('HH:mm:ss').toString();
				}
				//report.FromTimePartTime = report.FromTimePartTime.format('HH:mm:ss').toString();
				//report.ToTimePartTime = report.ToTimePartTime.format('HH:mm:ss').toString();
				if (report.BreakFrom && report.BreakTo) {
					report.BreakFrom = report.BreakFrom.format('HH:mm:ss').toString();
					report.BreakTo = report.BreakTo.format('HH:mm:ss').toString();
				}
			});
			let selectedRecording = timekeepingRecordingDataService.getSelected();
			let sendType = { isFilterStep: false, RecordingId: recordingId, Reports: selectedReports, Employees: selectedEmployees,isPresenceTimeSymbol:isPresence };
			$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/createReportsFromCrewLeaderWizard', sendType).then(function(result){
				// Reloead both

				timekeepingRecordingDataService.load().then(function(){
					setTimeout(() => {
						timekeepingRecordingDataService.setSelected(selectedRecording);
					}, 1000);
				});
				let modalOptions;
				modalOptions = {
					showGrouping: true,
					bodyText: 'Reports copied. Employee sheets and employee reports refreshed.',
					iconClass: 'ico-info',
				};
				platformModalService.showDialog(modalOptions);
			});
		}

		// creates lookup rows in a short and easy way
		function getJobRow(id, model, label, label$tr$, sortOrder, required, jobOrProject) {
			let Row;
			if (jobOrProject === 'job') {
				Row = platformLayoutHelperService.provideJobLookupOverload().detail;
			}
			if (jobOrProject === 'project') {
				Row = platformLayoutHelperService.provideProjectLookupOverload().detail;
			}
			angular.extend(Row, {
				id: id,
				sortOrder: sortOrder,
				required: required,
				gid: 'baseGroup',
				rid: model,
				label: label,
				label$tr$: label$tr$,
				model: model,
			});
			return Row;
		}

		return service;
	}
})(angular);
