/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingReportDataService
	 * @description pprovides methods to access, create and update timekeeping recording report entities
	 */
	myModule.service('timekeepingRecordingReportDataService', TimekeepingRecordingReportDataService);

	TimekeepingRecordingReportDataService.$inject = [
		'_',
		'$http',
		'$injector',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor',
		'timekeepingRecordingConstantValues',
		'timekeepingRecordingSheetDataService',
		'timekeepingRecordingDataService',
		'platformRuntimeDataService',
		'SchedulingDataProcessTimesExtension',
		'platformDataServiceDataProcessorExtension',
		'platformDataServiceActionExtension',
		'timekeepingRecordingRoundingDataService', 'moment',
		'platformDeleteSelectionDialogService', 'platformCreateUuid',
		'platformDialogService', 'platformPermissionService', 'permissions'
	];

	function TimekeepingRecordingReportDataService(
		_,
		$http,
		$injector,
		platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor,
		timekeepingRecordingConstantValues,
		timekeepingRecordingSheetDataService,
		timekeepingRecordingDataService,
		platformRuntimeDataService,
		SchedulingDataProcessTimesExtension,
		platformDataServiceDataProcessorExtension,
		platformDataServiceActionExtension,
		timekeepingRecordingRoundingDataService, moment,
		platformDeleteSelectionDialogService, platformCreateUuid,
		platformDialogService, platformPermissionService, permissions
	) {
		let self = this;
		let deleteDialogId = platformCreateUuid();
		let administrationProjectId = null;
		let showInactiveItems = false;
		let requestData = {};
		let isBreakContainerReadonly = false;
		let timekeepingRecordingReportServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingRecordingReportDataService',
				entityNameTranslationID: 'timekeeping.recording.timekeepingRecordingReportEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/report/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						if (showInactiveItems) {
							readData.PKey3 = 1;
						} else {
							readData.PKey3 = 0;
						}
						let selected = timekeepingRecordingSheetDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canDelete},
				dataProcessor: [
					new SchedulingDataProcessTimesExtension(['BreakTo', 'BreakFrom', 'FromTimePartTime', 'ToTimePartTime']),
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingRecordingConstantValues.schemes.report),
					{processItem: setReadonly},
					{
						processItem: function (item) {
							if (_.isNil(item.Weekday)) {
								let myitem = $injector.get('timekeepingRecordingReportDataService').getItemById(item.Id);
								if (myitem) {
									item.Weekday = myitem.Weekday;
									if (moment.isMoment(item.From)) {
										item.FromTimePartDate = myitem.FromTimePartDate.clone();
										item.FromTimePartTime = myitem.FromTimePartTime.clone();
									}
									if (moment.isMoment(item.To)) {
										item.ToTimePartDate = myitem.ToTimePartDate.clone();
										item.ToTimePartTime = myitem.ToTimePartTime.clone();
									}
								}
							}
						}
					}
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selectedSheet = timekeepingRecordingSheetDataService.getSelected();
							let selectedRecord = timekeepingRecordingDataService.getSelected();
							creationData.PKey1 = selectedSheet.Id;
							creationData.PKey2 = selectedRecord.Id;
							creationData.PKey3 = selectedSheet.EmployeeFk;
						},
					},
				},
				entityRole: {
					node: {itemName: 'Reports', parentService: timekeepingRecordingSheetDataService},
				},
			},
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingRecordingReportServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(
			_.assignIn(
				{
					mustValidateFields: true,
					validationService: 'timekeepingRecordingReportValidationService',
				},
				timekeepingRecordingConstantValues.schemes.report
			)
		);

		let service = serviceContainer.service;
		service.administrationProjectId = administrationProjectId;
		setAdministrationProjectId();

		function setAdministrationProjectId() {
			service.administrationProjectId = $http.get(globals.webApiBaseUrl + 'timekeeping/recording/report/getadministrationproject').then(
				function (response) {
					service.administrationProjectId = response.data;
				},
				function (/* error */) {
				}
			);
		}

		service.getAdministrationProject = function getAdministrationProject() {
			return service.administrationProjectId;
		};

		service.createDeepCopy = function createDeepCopy() {
			let command = service.getSelectedEntities();

			let postData = {
				reportIds: [],
				isTimecontrolling: false
			};
			angular.forEach(command, function (value, key) {
				postData.reportIds.push(value.Id);
			});
			$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/deepcopy', postData)
				.then(function (response) {
					service.takeOverReports(response.data);
				});
		};

		service.refresh = function () {
			service.load();
		};

		function setReadonly(entity) {
			const writeRecording= platformPermissionService.hasWrite(timekeepingRecordingConstantValues.permissionUuid.recordings, false);
			if (writeRecording) {
				let readonly = entity.ProjectActionFk !== null;
				let transactionreadonly = entity.UsedForTransaction;

				if (transactionreadonly || entity.IsReadOnly) {
					platformRuntimeDataService.readonly(entity, true);
				} else {
					platformRuntimeDataService.readonly(entity, false);
					if (entity.IsBreaksAvailable) {
						if (!entity.IsOnlyOneBreak) {
							if (entity.BreakFrom !== null && entity.BreakTo !== null) {
								entity.BreakFrom = null;
								entity.BreakTo = null;
							}
						}
						let fields = [
							{field: 'BreakFrom', readonly: true},
							{field: 'BreakTo', readonly: true}
						];
						platformRuntimeDataService.readonly(entity, fields);
					} else {
						let fields = [
							{field: 'BreakFrom', readonly: false},
							{field: 'BreakTo', readonly: false}
						];
						platformRuntimeDataService.readonly(entity, fields);
						if (entity.breakFrom === null && entity.breakTo === null) {
							entity.Duration = calculateHours(entity.FromTimePartTime, entity.ToTimePartTime);
						}
					}
				}
				let fields = [
					{
						field: 'Duration',
						readonly: entity.IsReadOnly || transactionreadonly || (entity.Version !== 0 && entity.From !== null && entity.To !== null && !entity.From.isSame(entity.To)) || (entity.BreakFrom !== null && entity.BreakTo !== null && !entity.BreakFrom.isSame(entity.BreakTo))
					},
				];
				platformRuntimeDataService.readonly(entity, fields);
			}
		}

		service.setAllFieldsReadonly = function setAllFieldsReadonly(entity) {
			platformRuntimeDataService.readonly(entity, entity.IsReadOnly);
		};

		service.showInactiveRecords = function showInactiveRecords(value) {
			showInactiveItems = value;
			loadData(showInactiveItems);
		};

		function loadData(filter) {
			if (filter) {
				requestData.PKey3 = 1;
			} else {
				requestData.PKey3 = 0;
			}
			service.load();
		}

		service.registerItemModified(function (e, item) {
			if (item) {
				item.IsModified = true;
			}
		});

		function setBreakContainer(selectedItem){
			const writeRecording = platformPermissionService.hasWrite(timekeepingRecordingConstantValues.permissionUuid.recordings, false);
			if (writeRecording) {
				const write = platformPermissionService.hasWrite(timekeepingRecordingConstantValues.permissionUuid.breaks, false);
				if (selectedItem && (selectedItem.UsedForTransaction || selectedItem.IsReadOnly)) {
					if (!isBreakContainerReadonly || write) {
						platformPermissionService.restrict(
							[timekeepingRecordingConstantValues.permissionUuid.breaks], permissions.read);
						isBreakContainerReadonly = true;
					}
				} else if (isBreakContainerReadonly || !write) {
					isBreakContainerReadonly = false;
					platformPermissionService.restrict(
						[timekeepingRecordingConstantValues.permissionUuid.breaks], false);
				}
			}
		}
		service.registerSelectionChanged(function (e, selectedItem) {
			setBreakContainer(selectedItem);
		});

		service.takeOverReports = function takeOverReports(reports) {
			_.forEach(reports, function (report) {
				serviceContainer.data.itemList.push(report);
			});
			platformDataServiceDataProcessorExtension.doProcessData(serviceContainer.data.itemList, serviceContainer.data);
			serviceContainer.data.listLoaded.fire(serviceContainer.data.itemList);
		};

		service.resetBreakContainer = function resetBreakContainer(){
			let selected = service.getSelected();
			setBreakContainer(selected);
		}

		function canDelete() {
			let result = true;
			let selected = service.getSelected();
			if (selected && selected.IsReadOnly || selected && selected.UsedForTransaction) {
				result = false;
			}
			return result;
		}

		function calculateHours(FromTime, ToTime, FromDate, ToDate) {
			let fromTimeString = moment(FromTime).format('HH:mm') + ':00';
			let toTimeString = moment(ToTime).format('HH:mm') + ':00';
			let fromDateString = moment(FromDate).format('YYYY-MM-DD');
			let toDateString = moment(ToDate).format('YYYY-MM-DD');
			let dt1 = new Date(fromDateString + ' ' + fromTimeString);
			let dt2 = new Date(toDateString + ' ' + toTimeString);
			return hoursDiff(dt1, dt2);
		}

		function hoursDiff(dt1, dt2) {
			let diffTime = (dt2.getTime() - dt1.getTime());
			let hoursDiff = diffTime / (1000 * 3600);
			return hoursDiff;
		}

		function deleteItems(entities) {

			let reports = _.cloneDeep(entities);
			_.forEach(reports, function (item) {
				_.forEach(serviceContainer.data.processor, function (proc) {
					if (proc.revertProcessItem) {
						proc.revertProcessItem(item);
					}
				});
			});

			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/canbedeleted', reports).then(function (response) {
				if (response && response.data) {
					if (response.data.canBeDeleted) {
						platformDeleteSelectionDialogService.showDialog({dontShowAgain: true, id: deleteDialogId}).then(result => {
							if (result.ok || result.delete) {
								serviceContainer.data.deleteEntities(entities, serviceContainer.data);
							}
						});
					} else {

						let modalOptions = {
							width: '700px',
							headerText$tr$: 'timekeeping.recording.infoDeleteReports',
							iconClass: 'ico-info',
							bodyText$tr$: 'timekeeping.recording.infoDeleteReportsBody',
							details: {
								type: 'grid',
								options: {
									id: platformCreateUuid(),
									columns: [{id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode'},
										{id: 'Description', field: 'Description', name: 'Description', width: 300, formatter: 'description', name$tr$: 'cloud.common.entityDescription'}],
									options: {
										idProperty: 'Code'
									}
								},
								value: response.data.errorMsg
							}
						};

						platformDialogService.showDetailMsgBox(modalOptions).then(
							function (result) {
								if (result.ok || result.yes) {
									console.log(result.value);
								}
							}
						);
						//platformDialogService.errorMsg(modalOptions);
					}
				}
			});
		}

		serviceContainer.service.deleteItem = function deleteItem(entity) {
			return deleteItems([entity]);
		};

		serviceContainer.service.deleteEntities = function deleteEntities(entities) {
			return deleteItems(entities);
		};
	}
})(angular);
