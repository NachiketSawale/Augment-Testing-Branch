/**
 * Created by leo on 09.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingPlannedAbsenceValidationService
	 * @description provides validation methods for timekeeping planned absence entities
	 */
	angular.module(moduleName).service('timekeepingPlanningAbsenceDialogValidationService', TimekeepingPlannedAbsenceDialogValidationService);

	TimekeepingPlannedAbsenceDialogValidationService.$inject = ['_', 'platformDataValidationService', 'timekeepingEmployeePlanningAbsenceDialogDataService', 'timekeepingEmployeeConstantValues',
		'platformValidationServiceFactory', 'timekeepingPlannedAbsenceValidationServiceFactory'];

	function TimekeepingPlannedAbsenceDialogValidationService(_, platformDataValidationService, timekeepingEmployeePlanningAbsenceDialogDataService, timekeepingEmployeeConstantValues,
		platformValidationServiceFactory, timekeepingPlannedAbsenceValidationServiceFactory) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.plannedAbsence, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingEmployeeConstantValues.schemes.plannedAbsence)
		}, self, timekeepingEmployeePlanningAbsenceDialogDataService);

		timekeepingPlannedAbsenceValidationServiceFactory.createTimekeepingPlannedAbsenceValidationService(this, timekeepingEmployeePlanningAbsenceDialogDataService);

		// function setTimeReadonly(entity, readOnly) {
		// 	if (readOnly) {
		// 		entity.FromTime = null;
		// 		entity.ToTime = null;
		// 		let result = {apply: true, valid: true, error:''};
		// 		platformRuntimeDataService.applyValidationResult(result, entity, 'FromTime');
		// 		platformRuntimeDataService.applyValidationResult(result, entity, 'ToTime');
		//
		// 	}
		// 	let fields = [
		// 		{field: 'FromTime', readonly: readOnly},
		// 		{field: 'ToTime', readonly: readOnly},
		// 		{field: 'AbsenceDay', readonly: !readOnly}];
		// 	platformRuntimeDataService.readonly(entity, fields);
		// }
		//
		// function isTimeOverlapping (startTime, endTime, item){
		// 	if (item.FromTime === null && item.ToTime === null){
		// 		return true;
		// 	} else  {
		// 		if (startTime && startTime.isBetween(item.FromTime, item.ToTime, undefined,'[]')) {
		// 			return true
		// 		} else if (endTime && endTime.isBetween(item.FromTime, item.ToTime, undefined,'[]')) {
		// 			return true;
		// 		}
		// 		return false;
		// 	}
		// }
		// function isOverlapping(startDate, endDate, startTime, endTime, id ){
		// 	let itemList = timekeepingPlannedAbsenceDataService.getList();
		// 	let isOverlapping = false;
		// 	if (startDate && endDate){
		// 		let filteredList = _.filter(itemList, function(item){
		// 			if (item.Id !== id && startDate.isBetween(item.FromDateTime, item.ToDateTime, undefined,'[]')){
		// 				return isTimeOverlapping(startTime, endTime, item);
		// 			} else if (item.Id !== id && endDate.isBetween(item.FromDateTime, item.ToDateTime, undefined,'[]')) {
		// 				return isTimeOverlapping(startTime, endTime, item);
		// 			}
		// 			return false;
		// 		});
		// 		if (filteredList.length > 0){
		// 			isOverlapping = true;
		// 		}
		// 		return isOverlapping;
		// 	}
		// 	return false;
		// }
		// self.validateFromDateTime = function (entity, value, model) {
		// 	let res = platformDataValidationService.validateMandatory(entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// 	if (!res.valid) {
		// 		return res;
		// 	}
		// 	let result = platformDataValidationService.validatePeriod(value, entity.ToDateTime, entity, model, self, timekeepingPlannedAbsenceDataService, 'ToDateTime');
		// 	if ( _.isBoolean(result) && !result || !_.isBoolean(result) && !result.valid) {
		// 		return result;
		// 	}
		// 	// overlapping
		// 	if (isOverlapping(value, entity.ToDateTime, entity.FromTime, entity.ToTime, entity.Id )){
		// 		res.valid = false;
		// 		res.error$tr$ = 'timekeeping.employee.errorMsgOverlappingAbsence';
		// 	}
		// 	return platformDataValidationService.finishValidation(res, entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// };
		//
		// self.validateToDateTime = function (entity, value, model) {
		// 	let res = platformDataValidationService.validateMandatory(entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// 	if (!res.valid) {
		// 		return res;
		// 	}
		// 	let result = platformDataValidationService.validatePeriod(entity.FromDateTime, value, entity, model, self, timekeepingPlannedAbsenceDataService, 'FromDateTime');
		// 	if ( _.isBoolean(result) && !result || !_.isBoolean(result) && !result.valid) {
		// 		return result;
		// 	}
		// 	// overlapping
		// 	if (isOverlapping(entity.FromDateTime, value, entity.FromTime, entity.ToTime, entity.Id )){
		// 		res.valid = false;
		// 		res.error$tr$ = 'timekeeping.employee.errorMsgOverlappingAbsence';
		// 	}
		// 	return platformDataValidationService.finishValidation(res, entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// };
		//
		// function giveAbsencedays(fromDateTime, toDateTime) {
		// 	let diffDays = Math.abs(toDateTime.valueOf() - fromDateTime.valueOf());
		// 	return diffDays / 1000 / 60 / 60 / 24;
		// }
		//
		// self.validateFromTime = function (entity, value, model) {
		// 	if (!_.isNil(value)) {
		// 		if (isOverlapping(entity.FromDateTime, entity.ToDateTime, value, entity.ToTime, entity.Id )){
		// 			let result = {apply: true, valid: false, error$tr$: 'timekeeping.employee.errorMsgOverlappingAbsence'};
		// 			return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// 		}
		// 		if (_.isNil(entity.ToTime)) {
		// 			return addMandatory(entity, 'ToTime', self, timekeepingPlannedAbsenceDataService);
		// 		} else {
		// 			entity.Absenceday = giveAbsencedays(value, entity.ToTime);
		// 			removeMandatory(entity, 'ToTime', self, timekeepingPlannedAbsenceDataService);
		// 		}
		// 	} else {
		// 		if (!_.isNil(entity.ToTime)) {
		// 			return addMandatory(entity, 'FromTime', self, timekeepingPlannedAbsenceDataService);
		// 		}
		// 	}
		// 	return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// };
		//
		// self.validateToTime = function (entity, value, model) {
		// 	if (!_.isNil(value)) {
		// 		if (isOverlapping(entity.FromDateTime, entity.ToDateTime, entity.FromTime, value, entity.Id )){
		// 			let result = {apply: true, valid: false, error$tr$: 'timekeeping.employee.errorMsgOverlappingAbsence'};
		// 			return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// 		}
		// 		if (_.isNil(entity.FromTime)) {
		// 			return addMandatory(entity, 'FromTime', self, timekeepingPlannedAbsenceDataService);
		// 		} else {
		// 			entity.Absenceday = giveAbsencedays(value, entity.FromTime);
		// 			removeMandatory(entity, 'FromTime', self, timekeepingPlannedAbsenceDataService);
		// 		}
		// 	} else {
		// 		if (!_.isNil(entity.FromTime)) {
		// 			return addMandatory(entity, 'ToTime', self, timekeepingPlannedAbsenceDataService);
		// 		}
		// 	}
		// 	return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPlannedAbsenceDataService);
		// };
		//
		// function removeMandatory(entity, model, validationService, dataService) {
		// 	let result = {apply: true, valid: false};
		// 	result.apply = true;
		// 	result.valid = true;
		// 	platformRuntimeDataService.applyValidationResult(result, entity, model);
		// 	return platformDataValidationService.finishValidation(result, entity, true, model, validationService, dataService);
		// }
		//
		// function addMandatory(entity, model, validationService, dataService) {
		// 	let result = {apply: true, valid: false};
		// 	result.apply = true;
		// 	result.valid = false;
		// 	result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
		// 	platformRuntimeDataService.applyValidationResult(result, entity, model);
		// 	return platformDataValidationService.finishValidation(result, entity, false, model, validationService, dataService);
		// }
		//
		//
		// function doValidateAbsenceDay(entity, value, model){
		// 	let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingPlannedAbsenceDataService);
		// 	let item = _.cloneDeep(entity);
		// 	if (model !== 'AbsenceDay') {
		// 		item[model] = value;
		// 	}
		// 	timekeepingPlannedAbsenceDataService.revertProcessItem(item);
		// 	return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/plannedabsence/calculateabsenceday', item
		// 	).then(function (response) {
		// 		let result = {apply: true, valid: true, error: ''}
		// 		if (model !== 'AbsenceDay') {
		// 			entity.Absenceday = response.data.Absenceday;
		// 		} else {
		// 			if (value > response.data.Absenceday){
		// 				result.valid = false;
		// 				result.error$tr$ = 'timekeeping.employee.errorMsgAbsenceday';
		// 			}
		// 		}
		// 		return platformDataValidationService.finishAsyncValidation(result, entity,
		// 			value, model, asyncMarker, this, timekeepingPlannedAbsenceDataService);
		// 	}, function () {
		// 		return platformDataValidationService.finishAsyncValidation({apply: false, valid: true, error: ''}, entity,
		// 			value, model, asyncMarker, this, timekeepingPlannedAbsenceDataService);
		// 	});
		// }
		// self.asyncValidateFromDateTime = function asyncValidateFromDateTime(entity, value, model){
		// 	if (!_.isNil(entity.ToDateTime)) {
		// 		if (entity.ToDateTime.isSame(value,'year') && entity.ToDateTime.isSame(value,'month') && entity.ToDateTime.isSame(value,'day')){
		// 			setTimeReadonly(entity, true);
		// 		} else {
		// 			setTimeReadonly(entity, true);
		// 		}
		// 		return doValidateAbsenceDay(entity, value, model);
		// 	}
		// 	return $q.when(true);
		// };
		//
		// self.asyncValidateToDateTime = function asyncValidateToDateTime(entity, value, model){
		// 	if (!_.isNil(entity.FromDateTime)) {
		// 		if (entity.FromDateTime.isSame(value,'year') && entity.FromDateTime.isSame(value,'month') && entity.FromDateTime.isSame(value,'day')){
		// 			setTimeReadonly(entity, false);
		// 		} else {
		// 			setTimeReadonly(entity, true);
		// 		}
		// 		return doValidateAbsenceDay(entity, value, model);
		// 	}
		// 	return $q.when(true);
		// };
		//
		// self.asyncValidateAbsenceday = function asyncValidateAbsenceday(entity, value, model){
		// 	if (!_.isNil(entity.FromDateTime && !_.isNil(entity.ToDateTime))) {
		// 		return doValidateAbsenceDay(entity, value, model);
		// 	}
		// 	return $q.when(true);
		// };
	}

})(angular);
