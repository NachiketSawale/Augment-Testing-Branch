/**
 * Created by leo on 18.09.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var scheduleModule = angular.module('scheduling.schedule');

	/**
	 * @ngdoc service
	 * @name schedulingScheduleEditService
	 * @function
	 *
	 * @description
	 * schedulingScheduleEditService is a data service for managing schedules in the project main module.
	 */
	scheduleModule.factory('schedulingScheduleEditService', ['$q', '$injector', 'projectMainService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceMandatoryFieldsValidatorFactory',
		'platformRuntimeDataService', 'schedulingScheduleCodeGenerationService', 'platformTranslateService',
		'cloudDesktopPinningContextService', 'basicsLookupdataLookupFilterService', 'platformDeleteSelectionDialogService',
		'platformCreateUuid', 'platformDialogService', '$http','projectMainConstantValues','platformPermissionService','permissions',

		function ($q, $injector, projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceMandatoryFieldsValidatorFactory, platformRuntimeDataService, codeGenerationService, platformTranslateService, cloudDesktopPinningContextService, basicsLookupdataLookupFilterService,
			platformDeleteSelectionDialogService, platformCreateUuid, platformDialogService, $http,projectMainConstantValues,platformPermissionService,permissions) {
			var schedulingScheduleEditServiceOption = {
				flatNodeItem: {
					module: scheduleModule,
					serviceName: 'schedulingScheduleEditService',
					entityNameTranslationID: 'scheduling.schedule.entitySchedule',
					httpCreate: {route: globals.webApiBaseUrl + 'scheduling/schedule/'},
					httpRead: {route: globals.webApiBaseUrl + 'scheduling/schedule/', endRead: 'listmasterschedules'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ScheduleDto',
						moduleSubModule: 'Scheduling.Schedule'
					}), {
						processItem: function (item) {
							if (item.IsReadOnly) {
								setReadOnly(item);
							}
							if (item.Version === 0 && codeGenerationService.hasToGenerate()) {
								platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
								var translationObject = platformTranslateService.instant('cloud.common.isGenerated');
								item.Code = translationObject.cloud.common.isGenerated;
							}
						}
					}],
					actions: {delete: true, create: 'flat',canDeleteCallBackFunc: canDelete},
					entityRole: {node: {itemName: 'Schedules', parentService: projectMainService}},
					translation: {
						uid: 'schedulingScheduleEditService',
						title: 'scheduling.calendar.translationDescSchedule',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: {
							typeName: 'ScheduleDto',
							moduleSubModule: 'Scheduling.Schedule'
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var prj = projectMainService.getSelected();
								creationData.PKey1 = prj.Id;
								creationData.PKey2 = prj.CalendarFk;
							}
						}
					}
				}
			};

			let isReadOnly = false;
			let deleteDialogId = platformCreateUuid();

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingScheduleEditServiceOption);
			serviceContainer.data.newEntityValidator = platformDataServiceMandatoryFieldsValidatorFactory.createValidator('schedulingScheduleValidationService', 'Code');
			let service = serviceContainer.service;

			service.prepareGoto = function prepareGoto() {
				let deferred = $q.defer();
				if (angular.isObject(serviceContainer.data) && angular.isObject(serviceContainer.data.parentService)) {
					serviceContainer.data.parentService.updateAndExecute(function () {
						deferred.resolve();
					});
				}
				return deferred.promise;
			};

			function canDelete() {
				let result = true;
				let selected = service.getSelected();
				if (selected && selected.IsReadOnly) {
					result = false;
				}
				// setReadOnly(selected);

				return result;
			}

			function setCurrentPinningContext(dataService) {

				function setCurrentProjectToPinnningContext(dataService) {
					var currentItem = dataService.getSelected();
					if (currentItem) {
						var projectPromise = $q.when(true);
						var pinningContext = [];

						if (angular.isNumber(currentItem.Id)) {
							if (angular.isNumber(currentItem.ProjectFk)) {
								projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.ProjectFk).then(function (pinningItem) {
									pinningContext.push(pinningItem);
								});
							}
							pinningContext.push(
								new cloudDesktopPinningContextService.PinningItem('scheduling.main', currentItem.Id,
									cloudDesktopPinningContextService.concate2StringsWithDelimiter(currentItem.Code, currentItem.Description, ' - '))
							);
						}

						return $q.all([projectPromise]).then(
							function () {
								if (pinningContext.length > 0) {
									cloudDesktopPinningContextService.setContext(pinningContext, dataService);
								}
							});
					}
				}

				setCurrentProjectToPinnningContext(dataService);
			}

			serviceContainer.service.getPinningOptions = function () {
				return {
					isActive: true,
					setContextCallback: setCurrentPinningContext // may own context service
				};
			};

			serviceContainer.service.showPinningDocuments = {
				active: true,
				moduleName: 'scheduling.main'
			};

			var schedulingScheduleFilters = [
				{
					key: 'scheduling-schedule-status-by-rubric-category-filter',
					fn: function (status, schedule) {
						return status.RubricCategoryFk === schedule.RubricCategoryFk;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(schedulingScheduleFilters);


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

			serviceContainer.service.createDeepCopy = function createDeepCopy() {
				let schedule = serviceContainer.service.getSelected();
				let command = {
					Action: 3 /* scheduleDeepCopyOfSchedule = 3 */,
					Schedule: schedule,
					copySuccessCallback: function (data) {
						serviceContainer.service.load();
					}
				};

				$injector.get('schedulingScheduleDeepCopyService').copySchedule(command);
			};

			serviceContainer.service.deleteEntities = function deleteEntities(entities){
				return deleteItems(entities);
			};
			// let service= serviceContainer.service;
			serviceContainer.service.registerSelectionChanged(function (e, entity) {
				if(entity){
					setReadOnly(entity);
				}
			});

			function setReadOnly(entity) {
				if (entity.IsReadOnly) {
					let fields = [];
					let readOnlyFlag = !!entity.IsReadOnly;
					if (entity){
						fields.push({field: 'Code', readonly: readOnlyFlag});
						fields.push({field: 'ScheduleMasterFk', readonly: readOnlyFlag});
						fields.push({field: 'Remark', readonly: readOnlyFlag});
						fields.push({field: 'CommentText', readonly: readOnlyFlag});
						fields.push({field: 'ProjectFk', readonly: readOnlyFlag});
						fields.push({field: 'CompanyFk', readonly: readOnlyFlag});
						fields.push({field: 'ScheduleTypeFk', readonly: readOnlyFlag});
						fields.push({field: 'ScheduleStatusFk', readonly: readOnlyFlag});
						fields.push({field: 'TargetStart', readonly: readOnlyFlag});
						fields.push({field: 'TargetEnd', readonly: readOnlyFlag});
						fields.push({field: 'PerformanceSheetFk', readonly: readOnlyFlag});
						fields.push({field: 'ProgressReportingMethod', readonly: readOnlyFlag});
						fields.push({field: 'CalendarFk', readonly: readOnlyFlag});
						fields.push({field: 'IsLocationMandatory', readonly: readOnlyFlag});
						fields.push({field: 'CodeFormatFk', readonly: readOnlyFlag});
						fields.push({field: 'IsLive', readonly: readOnlyFlag});
						fields.push({field: 'IsFinishedWith100Percent', readonly: readOnlyFlag});
						fields.push({field: 'UseCalendarForLagtime', readonly: readOnlyFlag});
						fields.push({field: 'InitWithTargetStart', readonly: readOnlyFlag});
						fields.push({field: 'ScheduleChartIntervalFk', readonly: readOnlyFlag});
						fields.push({field: 'ChartIntervalStartDate', readonly: readOnlyFlag});
						fields.push({field: 'ChartIntervalEndDate', readonly: readOnlyFlag});
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
						fields.push({field: 'ScheduleVersion', readonly: readOnlyFlag});
						fields.push({field: 'IsActive', readonly: readOnlyFlag});
						fields.push({field: 'BlobsFk', readonly: readOnlyFlag});
						fields.push({field: 'DescriptionInfo', readonly: readOnlyFlag});
						platformRuntimeDataService.readonly(entity, fields);
					}
					if (!isReadOnly) {
						platformPermissionService.restrict(
							[
								'd11b8a235a8646b4af9c7d317f192973'
							],
							permissions.read);
						isReadOnly = true;
					}
				}else{
					if (isReadOnly) {
						platformPermissionService.restrict(
							[
								'd11b8a235a8646b4af9c7d317f192973'
							], false);
						isReadOnly = false;
					}
				}
			}
			return serviceContainer.service;
		}
	]);
})();
