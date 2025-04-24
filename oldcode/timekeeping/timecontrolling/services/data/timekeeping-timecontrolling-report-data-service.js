/**
 * Created by leo on 15.08.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.timecontrolling');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingReportDataService
	 * @description pprovides methods to access, create and update timekeeping timecontrolling report entities
	 */
	myModule.service('timekeepingTimecontrollingReportDataService', TimekeepingTimeControllingReportDataService);

	TimekeepingTimeControllingReportDataService.$inject = [
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
		'timekeepingRecordingRoundingDataService', 'moment','platformDialogService', '$translate', 'platformCreateUuid', 'platformDeleteSelectionDialogService',
		'platformPermissionService', 'permissions', 'timekeepingTimeControllingConstantValues'
	];

	function TimekeepingTimeControllingReportDataService(
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
		timekeepingRecordingRoundingDataService, moment, platformDialogService, $translate, platformCreateUuid, platformDeleteSelectionDialogService,
		platformPermissionService, permissions, timekeepingTimeControllingConstantValues
	) {
		let self = this;
		let timekeepingGroupId = null;
		let deleteDialogId = platformCreateUuid();
		let isBreakContainerReadonly = false;
		let timekeepingControllingReportServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'timekeepingTimecontrollingReportDataService',
				entityNameTranslationID: 'timekeeping.timecontrolling.reportEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/controlling/report/',
					endRead: 'filtered',
					usePostForRead: true,
					endDelete: 'multidelete'
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canDelete},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingRecordingConstantValues.schemes.report),
					new SchedulingDataProcessTimesExtension(['BreakFrom', 'BreakTo', 'FromTimePartTime', 'ToTimePartTime']),
					{ processItem: setReadonly },
					{ processItem: function(item) {
						if (_.isNil(item.Employee) || _.isNil(item.Weekday)) {
							let myitem = $injector.get('timekeepingTimecontrollingReportDataService').getItemById(item.Id);
							if (myitem) {
								item.Weekday = myitem.Weekday;
								item.Employee = myitem.Employee;
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
				}}
				],
				presenter: {
					list: {}
				},
				entityRole: {
					root: { itemName: 'Reports', moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingTimeControlling', useIdentification: true}
				},
				entitySelection: { supportsMultiSelection: true },
				sidebarSearch: {
					options: {
						moduleName: 'timekeeping.timecontrolling',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			},
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingControllingReportServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(
			_.assignIn(
				{
					mustValidateFields: true,
					validationService: 'timekeepingTimeControllingReportValidationService',
				},
				timekeepingRecordingConstantValues.schemes.report
			)
		);

		let service = serviceContainer.service;

		function canDelete() {
			let result = true;
			let selected = service.getSelected();
			if (selected && selected.IsReadOnly || selected && selected.UsedForTransaction) {
				result = false;
			}
			return result;
		}
		function setReadonly(entity) {
			const writeReport = platformPermissionService.hasWrite(timekeepingTimeControllingConstantValues.permissionUuid.reports, false);
			if (writeReport) {
				let readonly = entity.ProjectActionFk !== null;
				let fields = [
					{field: 'Duration', readonly: entity.IsReadOnly || (entity.Version !== 0 && entity.From !== null && entity.To !== null && !entity.From.isSame(entity.To))},
					{field: 'ControllingUnitFk', readonly: entity.IsReadOnly || readonly},
					{field: 'ProjectFk', readonly: entity.IsReadOnly || readonly},
					{field: 'JobFk', readonly: entity.IsReadOnly || readonly},
				];
				platformRuntimeDataService.readonly(entity, fields);

				if (entity.UsedForTransaction || entity.IsReadOnly) {
					platformRuntimeDataService.readonly(entity, true);
				}

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
		}

		service.registerItemModified(function (e, item) {
			if (item) {
				item.IsModified = true;
			}
		});

		service.takeOverReports = function takeOverReports(reports) {
			_.forEach(reports, function (report) {
				serviceContainer.data.itemList.push(report);
			});
			platformDataServiceDataProcessorExtension.doProcessData(serviceContainer.data.itemList, serviceContainer.data);
			serviceContainer.data.listLoaded.fire(serviceContainer.data.itemList);
		};
		function setBreakContainer(selected){
			const writeReport = platformPermissionService.hasWrite(timekeepingTimeControllingConstantValues.permissionUuid.reports, false);
			if (writeReport) {
				const write = platformPermissionService.hasWrite(timekeepingTimeControllingConstantValues.permissionUuid.breaks, false);
				if (selected && (selected.UsedForTransaction || selected.IsReadOnly)) {
					if (!isBreakContainerReadonly || write) {
						isBreakContainerReadonly = true;
						platformPermissionService.restrict([timekeepingTimeControllingConstantValues.permissionUuid.breaks], permissions.read);
					}
				} else if (isBreakContainerReadonly || !write) {
					isBreakContainerReadonly = false;
					platformPermissionService.restrict([timekeepingTimeControllingConstantValues.permissionUuid.breaks], false);
				}
			}
		}
		service.registerSelectionChanged(function (e, selected){
			setBreakContainer(selected);
			if (selected && selected.RoundingConfigDetail && selected.TimekeepingGroupId !== timekeepingGroupId){
				timekeepingGroupId = selected.TimekeepingGroupId;
				timekeepingRecordingRoundingDataService.setRoundingConfigDetails(selected.RoundingConfigDetail);
			} else if (selected && (!selected.RoundingConfigDetail || selected.TimekeepingGroupId === 0)) {
				timekeepingRecordingRoundingDataService.setRoundingConfigDetailDefault(selected.RoundingConfigDetail);
			}
		});
		service.createDeepCopy = function createDeepCopy() {

			let command = service.getSelectedEntities();
			let postData = {
				reportIds: [],
				isTimecontrolling: true
			};
			angular.forEach(command, function(value){
				postData.reportIds.push(value.Id);
			});


			$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/deepcopy', postData)
				.then(function(response) {
					service.takeOverReports(response.data);
				});
		};
		serviceContainer.service.resetBreakContainer = function resetBreakContainer(){
			let selected = service.getSelected();
			setBreakContainer(selected);
		}

		serviceContainer.service.revertProcessItem = function revertProcessItem(item){
			let dateProcessor = $injector.get('platformDataServiceDataProcessorExtension');
			dateProcessor.revertProcessItem(item, serviceContainer.data);
		}
		function calculateHours(FromTime,ToTime,FromDate,ToDate){
			let fromTimeString = moment(FromTime).format('HH:mm')+':00';
			let toTimeString = moment(ToTime).format('HH:mm')+':00';
			let fromDateString = moment(FromDate).format('YYYY-MM-DD');
			let toDateString = moment(ToDate).format('YYYY-MM-DD');
			let dt1 = new Date(fromDateString + ' ' + fromTimeString);
			let dt2 = new Date(toDateString + ' ' + toTimeString);
			return hoursDiff(dt1,dt2);
		}
		function hoursDiff(dt1, dt2)
		{
			let diffTime =(dt2.getTime() - dt1.getTime());
			return diffTime / (1000 * 3600);
		}

		service.refresh = function(){
			service.load();
		};
		function deleteItems(entities){

			let reports = _.cloneDeep(entities);
			_.forEach(reports, function (item){
				_.forEach(serviceContainer.data.processor, function (proc) {
					if(proc.revertProcessItem){
						proc.revertProcessItem(item);
					}
				});});

			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/canbedeleted',reports).then(function (response) {
				if (response && response.data){
					if (response.data.canBeDeleted) {
						platformDeleteSelectionDialogService.showDialog({dontShowAgain: true, id: deleteDialogId}).then(result => {
							if (result.ok || result.delete) {
								serviceContainer.data.deleteEntities(reports, serviceContainer.data);
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
									columns: [{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
										{ id: 'Description', field: 'Description', name: 'Description', width: 300, formatter: 'description', name$tr$: 'cloud.common.entityDescription' }],
									options: {
										idProperty: 'Code'
									}
								},
								value: response.data.errorMsg
							}
						};

						platformDialogService.showDetailMsgBox(modalOptions).then(
							function (result) {
								if (result.ok|| result.yes){
									console.log(result.value);
								}
							}
						);
						//platformDialogService.errorMsg(modalOptions);
					}
				}
			});
		}
		serviceContainer.service.deleteItem = function deleteItem(entity){
			return deleteItems([entity]);
		};

		serviceContainer.service.deleteEntities = function deleteEntities(entities){
			return deleteItems(entities);
		};

	}
})(angular);
