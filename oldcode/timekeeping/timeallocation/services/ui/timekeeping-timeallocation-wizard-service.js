/**
 * Created by welss on 27/10/2021
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc factory
	 * @name timekeepingTimeallocationSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of timekeeping allocation module
	 */

	let moduleName = 'timekeeping.timeallocation';
	angular.module(moduleName).factory('timekeepingTimeallocationSideBarWizardService', TimekeepingTimeallocationSideBarWizardService);

	TimekeepingTimeallocationSideBarWizardService.$inject = ['_', 'moment', '$http', '$injector', '$q', 'platformSidebarWizardConfigService', 'platformModalService',
		'basicsCommonChangeStatusService', 'timekeepingTimeallocationHeaderDataService', 'platformTranslateService', 'platformModalFormConfigService',
		'platformLayoutHelperService', 'platformSidebarWizardCommonTasksService', '$translate', 'timekeepingRecordingDataService',
		'timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory', 'basicsLookupdataConfigGenerator', 'timekeepingTimeallocationItemDataService', 'platformRuntimeDataService'];

	function TimekeepingTimeallocationSideBarWizardService(_, moment, $http, $injector, $q, platformSidebarWizardConfigService, platformModalService,
	                                                       basicsCommonChangeStatusService, timekeepingTimeallocationHeaderDataService, platformTranslateService, platformModalFormConfigService,
	                                                       platformLayoutHelperService, platformSidebarWizardCommonTasksService, $translate, timekeepingRecordingDataService,
	                                                       timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory, basicsLookupdataConfigGenerator, timekeepingTimeallocationItemDataService, platformRuntimeDataService) {

		let service = {};
		let basicsWizardID = 'timekeepingTimeallocationSideBarWizardService';

		service.createDispatchingRecords = function createDispatchingRecords() {
			let selected = timekeepingTimeallocationHeaderDataService.getSelected();

			if (!selected) {
				let modalOptions;
				modalOptions = {
					showGrouping: true,
					headerText: 'Create Dispatching Header',
					bodyText: 'Please select a Result Header first!',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
				return;
			}
			// Server call für rubric default
			let defaultrubric;
			$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/getdefaultrubriccategory').then(function (response) {
				if (response.data) {
					defaultrubric = response.data;
				}

				let startTransactionConfig = {
					title: $translate.instant('timekeeping.timeallocation.createDispatchingRecords'),
					dataItem: {
						job1fk: selected.JobFk,
						job2fk: selected.JobFk,
						rubric: defaultrubric,
						code: null,
						desc: null,
						IsCreatePES: true,
					},
					formConfiguration: {
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						rows: [
							getJobRow('job1fk', 'Performing Job', 'timekeeping.timeallocation.performingJob', 1, true),
							getJobRow('job2fk', 'Receiving Job', 'timekeeping.timeallocation.receivingJob', 2, true),
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
								{
									dataServiceName: 'basicsMasterDataRubricCategoryLookupDataService',
									cacheEnable: true,
									additionalColumns: false,
									showClearButton: true,
									filter: function () {
										// RubricFk for Dispatching
										return 34;
									},
								},
								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Rubric Category',
									label$tr$: 'cloud.common.entityBasRubricCategoryFk',
									type: 'lookup',
									validator: validateSelectedRubricCatForDispatch,
									model: 'rubric',
									required: true,
									sortOrder: 3,
								}), {
								gid: 'baseGroup',
								rid: 'code',
								label: 'Type',
								label$tr$: 'timekeeping.timeallocation.code',
								type: 'code',
								model: 'code',
								required: true,
								sortOrder: 4,
							},
							{
								gid: 'baseGroup',
								rid: 'desc',
								label: 'Type',
								label$tr$: 'timekeeping.timeallocation.desciption',
								type: 'description',
								model: 'desc',
								required: false,
								sortOrder: 5,
							},
							{
								gid: 'baseGroup',
								rid: 'IsCreatePES',
								label$tr$: 'timekeeping.timeallocation.createpes',
								type: 'boolean',
								visible: true,
								sortOrder: 6,
								model: 'IsCreatePES'
							}
						]
					},
					// Logic in OK Button
					handleOK: function handleOK(result) {
						if (!result.data.job1fk) {
							let modalOptions;
							modalOptions = {
								showGrouping: true,
								headerText: 'Create Dispatching Header',
								bodyText: 'Please select a Performing Job!',
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
							return;
						}
						if (!result.data.job2fk) {
							let modalOptions;
							modalOptions = {
								showGrouping: true,
								headerText: 'Create Dispatching Header',
								bodyText: 'Please select a Receiving Job!',
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
							return;
						}
						//
						let data = {
							PKey: selected.Id,
							perfJob: result.data.job1fk,
							receivJob: result.data.job2fk,
							rubric: result.data.rubric,
							code: result.data.code,
							desc: result.data.desc,
							IsCreatePES: result.data.IsCreatePES
						};
						$http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/createDispatchingRecords', data).then(function (response) {
							if (response.data) {
								let modalOptions;
								modalOptions = {
									showGrouping: true,
									headerText: 'Create Dispatching Header',
									bodyText: response.data.message,
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
							}
						});

					},
					// Option for cancel button
					dialogOptions: {
						disableOkButton: function () {
							return;
						}
					}

				};
				platformTranslateService.translateFormConfig(startTransactionConfig.formConfiguration);
				platformModalFormConfigService.showDialog(startTransactionConfig);
				validateSelectedRubricCatForDispatch(startTransactionConfig.dataItem, defaultrubric);
			});
		};

		function validateSelectedRubricCatForDispatch(entity, value) {

			const infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', 34);
			if (infoService.hasToGenerateForRubricCategory(value)) {
				platformRuntimeDataService.readonly(entity, [{field: 'code', readonly: true}]);
				entity.code = infoService.provideNumberDefaultText(value, entity.code);
			} else {
				entity.code = '';
				platformRuntimeDataService.readonly(entity, [{field: 'code', readonly: false}]);
			}
		}

		function getJobRow(model, label, label$tr$, sortOrder, required) {
			let jobRow = platformLayoutHelperService.provideJobLookupOverload().detail;
			angular.extend(jobRow, {
				sortOrder: sortOrder,
				required: required,
				gid: 'baseGroup',
				rid: model,
				label: label,
				label$tr$: label$tr$,
				model: model
			});
			return jobRow;
		}

		service.createResult = function createResult() {
			let selectedHeaders = timekeepingTimeallocationHeaderDataService.getSelectedEntities();

			if (!selectedHeaders || selectedHeaders.length === 0) {
				return;
			}
			let selectedHeaderIds = selectedHeaders.map(header => header.Id);

			$http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/createresult', {headerIds: selectedHeaderIds})
				.then(function (response) {
					if (response && response.data.newEntities && response.data.newEntities.length > 0){
						let modalOptions = {
							showGrouping: true,
							bodyText: $translate.instant('timekeeping.timeallocation.createResultSuccessful') + response.data.message,
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					} else if (response && response.data.message) {
						let modalOptions = {
							showGrouping: true,
							bodyText: response.data.message,
							iconClass: 'ico-error'
						};
						platformModalService.showDialog(modalOptions);
					} else {
						let modalOptions = {
							showGrouping: true,
							bodyText: $translate.instant('timekeeping.timeallocation.createResultFailed'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				})
				.catch(function (error) {
					// Handle HTTP request errors
				});
		};


		let setTimeAllocationStatus = function setTimeAllocationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: timekeepingTimeallocationHeaderDataService,
					statusField: 'TimeAllocationStatusFk',
					projectField: '',
					title: 'timekeeping.timeallocation.timekeepingallocstatus',
					statusName: 'timeallocationstatus',
					id: 1
				}
			);
		};
		service.setTimeAllocationStatus = setTimeAllocationStatus().fn;

		let setReportStatus = function setReportStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: timekeepingTimeallocationHeaderDataService,
					dataService: timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory.createDataService(),
					statusField: 'ReportStatusFk',
					codeField: 'Code',
					descField: 'DescriptionInfo.Translated',
					projectField: '',
					title: 'basics.customize.timekeepingreportstatus',
					statusName: 'recordingreportstatus',
					id: 2
				}
			);
		};
		service.setReportStatus = setReportStatus().fn;

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(basicsWizardID /* , basicsWizardConfig */);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(basicsWizardID);
		};

		service.levelAllocatedTimes = function levelAllocatedTimes() {
			let header = timekeepingTimeallocationHeaderDataService.getSelected().Id;
			let selectedAllocations = timekeepingTimeallocationItemDataService.getSelectedEntities();
			// server call with allocationList --> server side sorting of employees and working with result
			let data = {
				selectedHeaderId: header,
				selectedAllocations: selectedAllocations
			};
			$http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/item/levelallocatedtimes', data).then(function (response) {
				if (response.data) {
					let modalOptions;
					if (response.data.recordsCreateFor.length !== 0) {
						modalOptions = {
							showGrouping: true,
							bodyText: $translate.instant('timekeeping.timeallocation.levelAllocationTimesError0') + response.data.recordsCreateFor.toString(),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
					if (response.data.noAllocationDate.length !== 0) {
						modalOptions = {
							showGrouping: true,
							bodyText: $translate.instant('timekeeping.timeallocation.levelAllocationTimesError2'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
					if (response.data.noDataForEmployeeAlloc.length !== 0) {
						modalOptions = {
							showGrouping: true,
							bodyText: $translate.instant('timekeeping.timeallocation.levelAllocationTimesError3'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				}
			});
		};

		service.createResultHeaders = function createResultHeaders(options) {
			let descriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
			let runtimeService = $injector.get('platformRuntimeDataService');
			let platformDialogService = $injector.get('platformDialogService');
			let isValid = true;

			function showErrorMessage(errorMsg) {
				platformDialogService.showMsgBox(errorMsg, 'timekeeping.timeallocation.createResultHeaders', 'info');
			}

			function validateDate(entity, value, model) {
				isValid = true;
				let result = true;
				if (_.isNil(value)){
					showErrorMessage('timekeeping.timeallocation.wizardMsgGenerateResultHeaders');
					isValid = false;
				} else {
					if (model === 'createTo') {
						result = value.isBefore(entity.createFrom, 'day');
					} else {
						result = value.isAfter(entity.createTo, 'day');
					}
					if (result) {
						showErrorMessage('timekeeping.timeallocation.wizardMsgGenerateResultHeadersDate');
						isValid = false;
					}
				}
			}

			let entity = {
				createHeadersDaily: options && options.CreateHeadersDaily ? options.CreateHeadersDaily.toLowerCase() === 'true' : false,
				useLogisticJob: options && options.LogisticJob ? options.LogisticJob.toLowerCase() === 'true' : false,
				createFrom: moment(),
				createTo: moment(),
				runInUserContext: true,
				onlyCurrentUser: true
			};
			let modalOptions = {
				title: $translate.instant('timekeeping.timeallocation.createResultHeaders'),
				dataItem: entity,
				formConfiguration: {
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'createHeadersDaily',
							label: 'Create Headers Daily',
							label$tr$: 'timekeeping.timeallocation.createHeadersDaily',
							type: 'boolean',
							model: 'createHeadersDaily',
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'useLogisticJob',
							label: 'boolean',
							label$tr$: 'timekeeping.timeallocation.useLogisticJob',
							type: 'boolean',
							model: 'useLogisticJob',
							sortOrder: 2
						},
						{
							gid: 'baseGroup',
							rid: 'createFrom',
							label: 'Create From',
							label$tr$: 'timekeeping.timeallocation.createFrom',
							type: 'dateutc',
							model: 'createFrom',
							sortOrder: 3,
							validator: validateDate
						},
						{
							gid: 'baseGroup',
							rid: 'createTo',
							label: 'Create To',
							label$tr$: 'timekeeping.timeallocation.createTo',
							type: 'dateutc',
							model: 'createTo',
							sortOrder: 4,
							validator: validateDate
						}, {
							gid: 'baseGroup',
							rid: 'runInUserContext',
							label: 'runInUserContext',
							label$tr$: 'timekeeping.timeallocation.runInUserContext',
							type: 'boolean',
							model: 'runInUserContext',
							sortOrder: 5
						},
						{
							gid: 'baseGroup',
							rid: 'onlyCurrentUser',
							label: 'Only for clerks of current user',
							label$tr$: 'timekeeping.timeallocation.onlyCurrentUser',
							type: 'boolean',
							model: 'onlyCurrentUser',
							sortOrder: 6
						}
					]
				},
				// Logic in OK Button
				handleOK: function handleOK(result) {
					let data = {
						CreateFrom: entity.createFrom,
						CreateTo: entity.createTo,
						CreateDailyResultHeaders: entity.createHeadersDaily,
						UseLogisticJob: entity.useLogisticJob,
						RunInUserContext: entity.runInUserContext,
						OnlyClerksOfCurrentUser: entity.onlyCurrentUser
					};
					$http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/createresultheader', data).then(function (response) {
						let modalOptions;
						let bodyText = response && response.data && response.data.length > 0 ? 'timekeeping.timeallocation.wizardInfoOkGenerateResultHeaders' : 'timekeeping.timeallocation.wizardInfoNonGenerateResultHeaders';
						modalOptions = {
							showGrouping: true,
							headerText: $translate.instant('timekeeping.timeallocation.createResultHeaders'),
							bodyText: $translate.instant(bodyText),
							iconClass: 'ico-info'
						};
						if (response && response.data && response.data.length > 0) {
							timekeepingTimeallocationHeaderDataService.refresh();
						}
						platformModalService.showDialog(modalOptions);
					});

				},
				// Option for cancel button
				dialogOptions: {
					disableOkButton: function () {
						return !entity.createFrom || !entity.createTo || !isValid;
					}
				}
			};
			platformTranslateService.translateFormConfig(modalOptions.formConfiguration);
			platformModalFormConfigService.showDialog(modalOptions);
		};
		return service;
	}

})(angular);
