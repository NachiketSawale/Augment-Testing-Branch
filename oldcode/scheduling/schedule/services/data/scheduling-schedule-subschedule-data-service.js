/**
 * Created by leo on 02.03.2021
 */

((angular) => {
	'use strict';
	/* global globals */
	let myModule = angular.module('scheduling.schedule');

	/*
	 * @ngdoc service
	 * @name schedulingScheduleSubScheduleDataService
	 * @description pprovides methods to access, create and update schedule subschedule  entities
	 */
	myModule.service('schedulingScheduleSubScheduleDataService', ScheduleSubscheduleDataService);

	ScheduleSubscheduleDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService', 'platformTranslateService',
		'platformDataServiceMandatoryFieldsValidatorFactory', 'schedulingScheduleEditService', 'schedulingScheduleCodeGenerationService', 'platformDeleteSelectionDialogService',
		'platformCreateUuid', 'platformDialogService', '$http','platformPermissionService','projectMainConstantValues','permissions'];

	function ScheduleSubscheduleDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService, platformTranslateService, platformDataServiceMandatoryFieldsValidatorFactory,
		schedulingScheduleEditService, schedulingScheduleCodeGenerationService, platformDeleteSelectionDialogService, platformCreateUuid, platformDialogService, $http,platformPermissionService,projectMainConstantValues,permissions) {
		let self = this;
		let scheduleSubscheduleServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'scheduleSubScheduleDataService',
				entityNameTranslationID: 'scheduling.schedule.entitySubSchedule',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'scheduling/schedule/',
					endRead: 'listsubschedules'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ScheduleDto',
					moduleSubModule: 'Scheduling.Schedule'
				}), {
					processItem: function (item) {
						setReadonly(item);
						if (item.Version === 0 && schedulingScheduleCodeGenerationService.hasToGenerate()) {
							platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
							let translationObject = platformTranslateService.instant('cloud.common.isGenerated');
							item.Code = translationObject.cloud.common.isGenerated;
						}

					}
				}],
				actions: {delete: true, create: 'flat',canDeleteCallBackFunc:canDelete,canCreateCallBackFunc:canCreate},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = schedulingScheduleEditService.getSelected();
							creationData.PKey3 = selected.Id;
							creationData.PKey2 = selected.CalendarFk;
							creationData.PKey1 = selected.ProjectFk;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'SubSchedules',
						parentService: schedulingScheduleEditService,
						parentFilter: 'scheduleId'
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(scheduleSubscheduleServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = platformDataServiceMandatoryFieldsValidatorFactory.createValidator('schedulingScheduleValidationService', 'Code');

		let deleteDialogId = platformCreateUuid();
		function canDelete() {

			let selectedSchedule = schedulingScheduleEditService.getSelected();
			if(selectedSchedule.IsReadOnly!==false){
				return false;
			}else{
				return true;
			}
		}
		function canCreate(){
			let selectedSchedule = schedulingScheduleEditService.getSelected();
			if(selectedSchedule.IsReadOnly!==false){
				return false;
			}else{
				return true;
			}
		}
		function  setReadonly(entity)
		{
			let selectedSchedule = schedulingScheduleEditService.getSelected();
			if(selectedSchedule.IsReadOnly===true)
			{
				let fields = [];
				let readOnlyFlag = !!selectedSchedule.IsReadOnly;
				if (entity){
					fields.push({field: 'Code', readonly: readOnlyFlag});
					fields.push({field: 'DescriptionInfo', readonly: readOnlyFlag});
					fields.push({field: 'CommentText', readonly: readOnlyFlag});
					fields.push({field: 'ScheduleTypeFk', readonly: readOnlyFlag});
					fields.push({field: 'ScheduleStatusFk', readonly: readOnlyFlag});
					fields.push({field: 'CalendarFk', readonly: readOnlyFlag});
					fields.push({field: 'PerformanceSheetFk', readonly: readOnlyFlag});
					fields.push({field: 'TargetStart', readonly: readOnlyFlag});
					fields.push({field: 'TargetEnd', readonly: readOnlyFlag});
					fields.push({field: 'CodeFormatFk', readonly: readOnlyFlag});
					fields.push({field: 'Remark', readonly: readOnlyFlag});
					fields.push({field: 'ScheduleVersion', readonly: readOnlyFlag});
					fields.push({field: 'IsFinishedWith100Percent', readonly: readOnlyFlag});
					fields.push({field: 'InitWithTargetStart', readonly: readOnlyFlag});
					fields.push({field: 'ScheduleChartIntervalFk', readonly: readOnlyFlag});
					fields.push({field: 'ChartIntervalStartDate', readonly: readOnlyFlag});
					fields.push({field: 'ChartIntervalEndDate', readonly: readOnlyFlag});
					fields.push({field: 'ScheduleMasterFk', readonly: readOnlyFlag});
					fields.push({field: 'UseCalendarForLagtime', readonly: readOnlyFlag});
					fields.push({field: 'IsActive', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText01', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText02', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText03', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText04', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText05', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText06', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText07', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText08', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText09', readonly: readOnlyFlag});
					fields.push({field: 'UserDefinedText10', readonly: readOnlyFlag});
					platformRuntimeDataService.readonly(entity, fields);
				}

			}
		}
		function deleteItems(entities){
			return $http.post(globals.webApiBaseUrl + 'scheduling/schedule/canbedeleted',entities).then(function (response) {
				if (response && response.data){
					if (response.data.canBeDeleted) {
						platformDeleteSelectionDialogService.showDialog({dontShowAgain: true, id: deleteDialogId}).then(result => {
							if (result.ok || result.delete) {
								serviceContainer.data.deleteEntities(entities, serviceContainer.data);
							}
						});
					} else {

						let modalOptions = {
							width: '700px',
							headerText$tr$: 'scheduling.schedule.infoDeleteSchedule',
							iconClass: 'ico-info',
							bodyText$tr$: 'scheduling.schedule.infoDeleteBody',
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
								if (result.ok) {
									console.log(result.value);
								}
							}
						);

						// platformDialogService.showMsgBox( response.data.errorMsg,  'scheduling.schedule.infoDeleteSchedule', 'info');
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
