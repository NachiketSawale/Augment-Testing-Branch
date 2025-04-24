(() => {
	'use strict';

	angular.module('timekeeping.employee').factory('timekeepingEmployeePlanningAbsenceDialogService', TimekeepingEmployeePlanningAbsenceDialogService);

	TimekeepingEmployeePlanningAbsenceDialogService.$inject = ['_', '$http', 'platformDialogDefaultButtonIds', 'platformModalFormConfigService','platformTranslateService',
		'platformDialogService', 'platformModalGridConfigService', '$translate', '$injector', 'platformCreateUuid', 'basicsLookupdataLookupFilterService',
		'basicsLookupdataConfigGenerator', 'platformSchemaService', 'basicsWorkflowEventService'];

	function TimekeepingEmployeePlanningAbsenceDialogService(_, $http, defaultButtonIds, platformModalFormConfigService, platformTranslateService,
		platformDialogService, platformModalGridConfigService, $translate, $injector, platformCreateUuid, basicsLookupdataLookupFilterService,
		basicsLookupdataConfigGenerator,	platformSchemaService, basicsWorkflowEventService) {
		let connectedEmployee = {};
		let timeSymbolForVacation = [];
		let filters = [
			{
				key: 'timekeeping-planned-absence-filter',
				serverSide: false,
				fn: function (item, entity) {
					return item.IsAbsence;
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		function getTimeSymbolForVacation() {
			return $http.post(globals.webApiBaseUrl + 'timekeeping/timesymbols/listbysymbol', {PKey1: connectedEmployee.Id, ByTimeAllocation: false})
				.then(function (response) {
					if (response.data) {
						timeSymbolForVacation = _.filter(response.data, function (item) {
							return item.IsVacation && item.IsLive;
						});
					}
				});
		}
		function planningAbsence(employee) {
			getTimeSymbolForVacation();
			basicsWorkflowEventService.registerEvent('367a166e55b140a9894c893b7fbcf92d', 'Approve Planned Absence');
			platformSchemaService.getSchemas([{typeName: 'PlannedAbsenceDto', moduleSubModule: 'Timekeeping.Employee'}]).then(function(){
				let timekeepingEmployeePlanningAbsenceDialogDataService = $injector.get('timekeepingEmployeePlanningAbsenceDialogDataService')
				let timekeepingPlanningAbsenceDialogValidationService = $injector.get('timekeepingPlanningAbsenceDialogValidationService')
				connectedEmployee = employee;

				timekeepingEmployeePlanningAbsenceDialogDataService.setEmployee(connectedEmployee);
				timekeepingEmployeePlanningAbsenceDialogDataService.load().then(function(){

					let timeReadonly = true;
					let platformGrid;
					let gridUid;

					function saveRequest(entities){
						timekeepingEmployeePlanningAbsenceDialogDataService.update(entities);
					}

					function unregisterMessengers(){
						timekeepingEmployeePlanningAbsenceDialogDataService.onListLoaded.unregisterAll();
						timekeepingEmployeePlanningAbsenceDialogDataService.onCreated.unregisterAll();
					}
					function createAbsence(platformGridAPI, gridId){
						platformGrid = platformGridAPI;
						gridUid = gridId;
						timekeepingEmployeePlanningAbsenceDialogDataService.createItem();
					}

					function deleteAbsence(entities, platformGridAPI, gridId){
						platformGrid = platformGridAPI;
						gridUid = gridId;
						timekeepingEmployeePlanningAbsenceDialogDataService.deleteEntities(entities);
					}

					function setAbsenceday(entity, value, model) {
						if (entity[model] !== value) {
							entity.isModified = true;
						}
						if (entity.Absenceday >= 1 ) {
							let hasVacationTS = _.find(timeSymbolForVacation, function (ts){
								return ts.Id === entity.TimeSymbolFk;
							})
							if (hasVacationTS) {
								entity.NewVacationBalance = entity.VacationBalance - entity.Absenceday;
								if (platformGrid && gridUid) {
									platformGrid.grids.refresh(gridUid, true);
								}
							}
						}
					}
					function asyncValidateFromDateTime(entity, value, model) {
						return timekeepingPlanningAbsenceDialogValidationService.asyncValidateFromDateTime(entity, value, model).then(function(){
							setAbsenceday(entity, value, model);
						});
					}

					function asyncValidateToDateTime(entity, value, model) {
						return timekeepingPlanningAbsenceDialogValidationService.asyncValidateToDateTime(entity, value, model).then(function(){
							setAbsenceday(entity, value, model);
						});
					}
					function validateFromTime(entity, value, model){
						if (entity[model] !== value) {
							entity.isModified = true;
						}
						timekeepingPlanningAbsenceDialogValidationService.validateFromTime(entity, value, model);
					}
					function validateToTime(entity, value, model){
						if (entity[model] !== value) {
							entity.isModified = true;
						}
						timekeepingPlanningAbsenceDialogValidationService.validateToTime(entity, value, model);
					}
					function validateComment(entity, value, model){
						if (entity[model] !== value) {
							entity.isModified = true;
						}
					}
					function validateTimeSymbolFk(entity, value, model){
						if (entity[model] !== value) {
							entity.isModified = true;
						}
						timekeepingPlanningAbsenceDialogValidationService.validateTimeSymbolFk(entity, value, model);
					}

					let overloadTs = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						dataServiceName: 'timekeepingTimeSymbol2GroupLookupDataService',
						filterKey: 'timekeeping-planned-absence-filter',
						filter: function (entity) {
							return entity;
						}
					});

					let config = {
						title: $translate.instant('cloud.desktop.employeeAbsence.planningAbsence'),
						showOkButton: false,
						getDataItems: function() {
							return timekeepingEmployeePlanningAbsenceDialogDataService.getList();
						},
						gridConfiguration: {
							uuid: platformCreateUuid(),
							tools: {
								entityCreatedEvent: timekeepingEmployeePlanningAbsenceDialogDataService.getCreatedEvent(),
								entityDeletedEvent: timekeepingEmployeePlanningAbsenceDialogDataService.getDeletedEvent()
							},
							version: '0.1.0',
							columns: [
								{id: 'Status', field: 'PlannedAbsenceStatusFk', width: 100, formatter: 'lookup',
									formatterOptions: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plannedabsencestatus', null, {showIcon: true}).grid.formatterOptions,
									name$tr$: 'cloud.desktop.employeeAbsence.PlannedAbsenceStatusFk', name: 'Status'},
								{id: 'Type', field: 'TimeSymbolFk', name: 'Time Symbol', name$tr$: 'cloud.desktop.employeeAbsence.entityTimeSymbol', width: 50,
									formatter: 'lookup',	formatterOptions: overloadTs.formatterOptions,
									editor: 'lookup', editorOptions: overloadTs.editorOptions, validator: validateTimeSymbolFk},
								{id: 'fromdatetime', field: 'FromDateTime', name: 'FromTime', name$tr$: 'cloud.desktop.employeeAbsence.entityFromDateTime', width: 100,
									formatter: 'dateutc', editor: 'dateutc',
									asyncValidator: asyncValidateFromDateTime,
									validator: timekeepingPlanningAbsenceDialogValidationService.validateFromDateTime},
								{id: 'todatetime', field: 'ToDateTime', name: 'ToTime', name$tr$: 'cloud.desktop.employeeAbsence.entityToDateTime', width: 100,
									formatter: 'dateutc', editor: 'dateutc',
									asyncValidator: asyncValidateToDateTime,
									validator: timekeepingPlanningAbsenceDialogValidationService.validateToDateTime
								},
								{id: 'fromtime', field: 'FromTime', readonly: timeReadonly, name: 'From', name$tr$: 'cloud.desktop.employeeAbsence.entityFromTime', width: 70,
									formatter: 'time', editor: 'time', validator: validateFromTime},
								{id: 'totime', field: 'ToTime', readonly: timeReadonly, name: 'To', name$tr$: 'cloud.desktop.employeeAbsence.entityToTime', width: 70,
									formatter: 'time', editor: 'time', validator: validateToTime},
								{id: 'comment', field: 'Comment', name: 'Comment', name$tr$: 'cloud.common.entityComment', with: 300, formatter: 'comment', editor: 'comment', validator: validateComment },
								{id: 'vacationBalance', field: 'VacationBalance', name: 'Vacation Balance', name$tr$: 'cloud.desktop.employeeAbsence.entityVacationBalance', with: 30, formatter: 'decimal' }
							]
						},
						handleOK: function (result) {
							saveRequest(result.data);
						},
						handleCancel: function (){
							timekeepingEmployeePlanningAbsenceDialogDataService.reset();
						},
						btn1Enable: {
							show: true,
							customBtn1Label: $translate.instant('cloud.desktop.employeeAbsence.createAbsence'),
							handleCustomBtn1: function(platformGridAPI, gridId){
								// create new item
								createAbsence(platformGridAPI, gridId);
							}
						},
						btn2Enable: {
							show: true,
							customBtn2Label: $translate.instant('cloud.desktop.employeeAbsence.deleteAbsence'),
							handleCustomBtn2: function(platformGridAPI, gridId){
								let selectedItems = platformGridAPI.rows.selection({
									gridId: gridId,
									wantsArray: true
								});
								deleteAbsence(selectedItems, platformGridAPI, gridId);
							}
						},
						dialogOptions: {
							customTemplate: globals.appBaseUrl + 'cloud.desktop/templates/timekeeping-employee-planning-absence-grid.html',
							disableOkButton: function () {
								let res = true;
								let list = timekeepingEmployeePlanningAbsenceDialogDataService.getList();
								if (list.length > 0) {
									res = _.some(list, function (item) {
										let isDisabled = false;
										if (item && item.__rt$data && item.__rt$data.errors && !_.isEmpty(item.__rt$data.errors)) {
											_.forOwn(item.__rt$data.errors, function (value, key) {
												if (value) {
													isDisabled = true;
												}
											})
										}
										return isDisabled;
									});
								}
								return res;
							}
						}
					}
					platformTranslateService.translateGridConfig(config.gridConfiguration.columns);
					platformModalGridConfigService.showDialog(config);
				});
			});
		}

		let service = {
			planningAbsence: planningAbsence
		};
		return service;
	}
})();