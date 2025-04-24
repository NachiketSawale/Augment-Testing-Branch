(function (angular) {
	'use strict';
	let myModule = angular.module('timekeeping.employee');

	myModule.factory('timekeepingEmployeePlanningAbsenceDialogDataService', TimekeepingEmployeePlanningAbsenceDialogDataService);

	TimekeepingEmployeePlanningAbsenceDialogDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'PlatformMessenger', 'basicsCostGroupAssignmentService', 'basicsCommonMandatoryProcessor', 'timekeepingEmployeeDataService', 'permissions',
		'platformRuntimeDataService', 'platformPermissionService', 'timekeepingEmployeeConstantValues', 'SchedulingDataProcessTimesExtension',
		'platformDataServiceDataProcessorExtension', 'ServiceDataProcessDatesExtension', 'basicsWorkflowInstanceService'];

	function TimekeepingEmployeePlanningAbsenceDialogDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		PlatformMessenger, basicsCostGroupAssignmentService, mandatoryProcessor, timekeepingEmployeeDataService, permissions,
		platformRuntimeDataService, platformPermissionService, timekeepingEmployeeConstantValues, SchedulingDataProcessTimesExtension,
		platformDataServiceDataProcessorExtension, ServiceDataProcessDatesExtension, basicsWorkflowInstanceService) {
		let self = this;
		let service= {}
		let connectedEmployee = {};
		let itemList = [];
		let timeProcess = new SchedulingDataProcessTimesExtension(['FromTime', 'ToTime']);
		let dateProcess =	new ServiceDataProcessDatesExtension(['FromDateTime', 'ToDateTime']);
		let toDelete = [];

		service.onListLoaded = new PlatformMessenger();
		service.onCreated = new PlatformMessenger();

		let newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'PlannedAbsenceDto',
			moduleSubModule: 'Timekeeping.Employee',
			validationService: 'timekeepingPlanningAbsenceDialogValidationService'
		});

		function setReadonly(entity) {
			if (!entity) {
				return;
			}
			let fields = [];

			if (entity.IsReadOnly /*|| entity.Version > 0*/) {
				platformRuntimeDataService.readonly(entity, true);
			} else {
				// If IsFromToTimeReadOnly is true, explicitly set FromTime and ToTime as read-only
				if (entity.IsFromToTimeReadOnly) {
					// Ensure that FromTime and ToTime are set as read-only, but only if they weren't already set
					fields.push({field: 'FromTime', readonly: true});
					fields.push({field: 'ToTime', readonly: true});
				} else {
					if (!_.isNil(entity.FromTime) || _.isNil(entity.ToTime)) {
						fields.push({field: 'AbsenceDay', readonly: true})
					}
				}
				if (fields.length > 0) {
					platformRuntimeDataService.readonly(entity, fields);
				}
			}
		}

		service.load = function load(){
			itemList = [];
			return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/plannedabsence/listbyparentforcurrentyear', {PKey1: connectedEmployee.Id}).then(function(response){
				if (response && response.data){
					_.forEach(response.data,function(item){
						timeProcess.processItem(item);
						dateProcess.processItem(item);
						setReadonly(item);
						item.VacationBalance = connectedEmployee.VacationBalance;
						item.NewVacationBalance = connectedEmployee.VacationBalance;
						item.isModified = false;
						itemList.push(item)
					});
					service.onListLoaded.fire(itemList);
				}
			});
		}
		service.getList = function(){
			return itemList;
		};
		service.getModule = function(){
			return 'desktop.menu';
		};

		service.revertProcessItem = function revertProcessItem(item){
			timeProcess.revertProcessItem(item);
			dateProcess.revertProcessItem(item);
		};

		service.setEmployee = function setEmployee(employee)
		{
			connectedEmployee = employee;
		};
		service.getEmployee = function getEmployee()
		{
			return connectedEmployee;
		};

		service.update = function update(entities){
			let toSave = _.filter(entities, function(item){
				return item.Version === 0 || item.isModified;
			});
			if (toSave.length > 0) {
				_.forEach(toSave, function (item) {
					service.revertProcessItem(item);
				});
				$http.post(globals.webApiBaseUrl + 'timekeeping/employee/plannedabsence/updateabsence', toSave).then(function(){
					_.forEach(toSave, function (item) {
						basicsWorkflowInstanceService.startWorkflowByEvent('367a166e55b140a9894c893b7fbcf92d', item.Id, null);
					});
				});
			}
			if (toDelete.length > 0) {
				_.forEach(toDelete, function (item) {
					service.revertProcessItem(item);
				});
				$http.post(globals.webApiBaseUrl + 'timekeeping/employee/plannedabsence/multidelete', toDelete);
				toDelete = [];
			}
		};

		service.createItem = function createItem(){
			return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/plannedabsence/create', {PKey1: connectedEmployee.Id}).then(function (response) {
				if (response && response.data){
					timeProcess.processItem(response.data);
					dateProcess.processItem(response.data);
					setReadonly(response.data);
					response.data.VacationBalance = connectedEmployee.VacationBalance;
					response.data.NewVacationBalance = connectedEmployee.VacationBalance;
					response.data.isModified = true;
					newEntityValidator.validate(response.data);
					itemList.push(response.data)
					platformRuntimeDataService.applyValidationResult({apply: true, valid: false, error: ''}, response.data, 'TimeSymbolFk')
					service.onCreated.fire(response.data);
				}
			});
		};

		service.getCreatedEvent = function(){
			return service.onCreated;
		};
		service.getDeletedEvent = function(){
			return service.onListLoaded;
		};

		service.deleteEntities = function deleteEntities(entities){
			if (entities) {
				_.forEach(entities, function (item) {
					if (!item.IsReadOnly) {
						toDelete.push(item);
					}
				});
				itemList = _.filter(itemList, function (item) {
					return !_.find(toDelete, function (delEntity) {
						return item.Id === delEntity.Id;
					});
				});
				service.onListLoaded.fire(itemList);
				toDelete = _.filter(toDelete, function (entity) {
					return entity.Version !== 0;
				})
				return itemList;
			}
		};

		service.reset = function reset() {
			toDelete = [];
		};
		return service;
	}
})(angular);