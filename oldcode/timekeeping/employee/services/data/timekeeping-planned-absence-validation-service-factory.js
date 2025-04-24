(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingPlannedAbsenceValidationService
	 * @description provides validation methods for timekeeping planned absence entities
	 */
	angular.module(moduleName).service('timekeepingPlannedAbsenceValidationServiceFactory', TimekeepingPlannedAbsenceValidationServiceFactory);

	TimekeepingPlannedAbsenceValidationServiceFactory.$inject = ['_', 'platformDataValidationService', 'timekeepingPlannedAbsenceDataService', 'timekeepingEmployeeConstantValues',
		'platformValidationServiceFactory', 'platformRuntimeDataService', '$translate', '$http', '$q'];

	function TimekeepingPlannedAbsenceValidationServiceFactory(_, platformDataValidationService, timekeepingPlannedAbsenceDataService, timekeepingEmployeeConstantValues,
		platformValidationServiceFactory, platformRuntimeDataService, $translate, $http, $q) {
		let self = this;

		self.createTimekeepingPlannedAbsenceValidationService = function createTimekeepingPlannedAbsenceValidationService(validationService, dataService) {
			validationService.validateFromDateTime = function validateFromDateTime(entity, value, model) {
				return self.validateFromDateTime(entity, value, model, dataService, validationService);
			};
			validationService.validateToDateTime = function validateToDateTime(entity, value, model) {
				return self.validateToDateTime(entity, value, model, dataService, validationService);
			};
			validationService.validateFromTime = function validateFromTime(entity, value, model) {
				return self.validateFromTime(entity, value, model, dataService, validationService);
			};
			validationService.validateToTime = function validateToTime(entity, value, model) {
				return self.validateToTime(entity, value, model, dataService, validationService);
			};

			validationService.asyncValidateFromDateTime = function asyncValidateFromDateTime(entity, value, model) {
				return self.asyncValidateFromDateTime(entity, value, model, dataService, validationService);
			};
			validationService.asyncValidateToDateTime = function asyncValidateToDateTime(entity, value, model) {
				return self.asyncValidateToDateTime(entity, value, model, dataService, validationService);
			};
			validationService.asyncValidateFromTime = function asyncValidateFromDateTime(entity, value, model) {
				return self.asyncValidateFromTime(entity, value, model, dataService, validationService);
			};
			validationService.asyncValidateToTime = function asyncValidateToDateTime(entity, value, model) {
				return self.asyncValidateToTime(entity, value, model, dataService, validationService);
			};
			validationService.asyncValidateAbsenceday = function asyncValidateAbsenceday(entity, value, model) {
				return self.asyncValidateAbsenceday(entity, value, model, dataService, validationService);
			};

		}

		function setTimeReadonly(entity, readOnly) {
			if (readOnly) {
				entity.FromTime = null;
				entity.ToTime = null;
				let result = {apply: true, valid: true, error:''};
				platformRuntimeDataService.applyValidationResult(result, entity, 'FromTime');
				platformRuntimeDataService.applyValidationResult(result, entity, 'ToTime');

			}
			let fields = [
				{field: 'FromTime', readonly: readOnly},
				{field: 'ToTime', readonly: readOnly},
				{field: 'AbsenceDay', readonly: !readOnly}];
			platformRuntimeDataService.readonly(entity, fields);
		}

		function isTimeOverlapping (startTime, endTime, item){
			if (item.FromTime === null && item.ToTime === null){
				return true;
			} else  {
				if (startTime === null && endTime === null){
					return true;
				}
				if (startTime && startTime.isBetween(item.FromTime, item.ToTime, undefined,'[]')) {
					return true
				} else if (endTime && endTime.isBetween(item.FromTime, item.ToTime, undefined,'[]')) {
					return true;
				}
				return false;
			}
		}
		function isOverlapping(startDate, endDate, startTime, endTime, id, dataService){
			let itemList = dataService.getList();
			let isOverlapping = false;
			if (startDate && endDate){
				let filteredList = _.filter(itemList, function(item){
					if (item.Id !== id && startDate.isBetween(item.FromDateTime, item.ToDateTime, undefined,'[]')){
						if (!startDate.isSame(endDate, 'day')) {
							return true;
						} else {
							return isTimeOverlapping(startTime, endTime, item);
						}
					} else if (item.Id !== id && endDate.isBetween(item.FromDateTime, item.ToDateTime, undefined,'[]')) {
						if (!startDate.isSame(endDate, 'day')) {
							return true;
						} else {
							return isTimeOverlapping(startTime, endTime, item);
						}
					} else if (item.Id !== id && item.FromDateTime.isBetween(startDate, endDate, undefined, '[]')) {
						if (!startDate.isSame(endDate, 'day')) {
							return true;
						} else {
							return isTimeOverlapping(startTime, endTime, item);
						}
					} else if (item.Id !== id && item.ToDateTime.isBetween(startDate, endDate, undefined, '[]')) {
						if (!startDate.isSame(endDate, 'day')) {
							return true;
						} else {
							return isTimeOverlapping(startTime, endTime, item);
						}
					}
					return false;
				});
				if (filteredList.length > 0){
					isOverlapping = true;
				}
				return isOverlapping;
			}
			return false;
		}
		self.validateFromDateTime = function (entity, value, model, dataService, validationService) {
			let res = platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
			if (!res.valid) {
				return res;
			}
			let result = platformDataValidationService.validatePeriod(value, entity.ToDateTime, entity, model, validationService, dataService, 'ToDateTime');
			if ( _.isBoolean(result) && !result || !_.isBoolean(result) && !result.valid) {
				return result;
			}
			// overlapping
			if (isOverlapping(value, entity.ToDateTime, entity.FromTime, entity.ToTime, entity.Id, dataService )){
				res.valid = false;
				res.error = $translate.instant('timekeeping.employee.errorMsgOverlappingAbsence');
				res.error$tr$ = 'timekeeping.employee.errorMsgOverlappingAbsence';
			} else {
				res.valid = true;
				res.error = '';
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, validationService, dataService);
		};

		self.validateToDateTime = function (entity, value, model, dataService, validationService) {
			let res = platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
			if (!res.valid) {
				return res;
			}
			let result = platformDataValidationService.validatePeriod(entity.FromDateTime, value, entity, model, validationService, dataService, 'FromDateTime');
			if ( _.isBoolean(result) && !result || !_.isBoolean(result) && !result.valid) {
				return result;
			}
			// overlapping
			if (isOverlapping(entity.FromDateTime, value, entity.FromTime, entity.ToTime, entity.Id, dataService )){
				res.valid = false;
				res.error = $translate.instant('timekeeping.employee.errorMsgOverlappingAbsence');
				res.error$tr$ = 'timekeeping.employee.errorMsgOverlappingAbsence';
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, validationService, dataService);
		};

		function giveAbsencedays(fromDateTime, toDateTime) {
			let diffDays = Math.abs(toDateTime.valueOf() - fromDateTime.valueOf());
			return diffDays / 1000 / 60 / 60 / 24;
		}

		self.validateFromTime = function (entity, value, model, dataService, validationService) {
			if (!_.isNil(value)) {
				platformRuntimeDataService.applyValidationResult({apply: true, valid: true}, entity, 'ToDateTime');
				if (isOverlapping(entity.FromDateTime, entity.ToDateTime, value, entity.ToTime, entity.Id, dataService )){
					let result = {apply: true, valid: false,
						error: $translate.instant('timekeeping.employee.errorMsgOverlappingAbsence'),
						error$tr$: 'timekeeping.employee.errorMsgOverlappingAbsence'};
					return platformDataValidationService.finishValidation(result, entity, value, model, validationService, dataService);
				}
				if (_.isNil(entity.ToTime)) {
					return addMandatory(entity, 'ToTime', validationService, dataService);
				} else {
					// entity.Absenceday = giveAbsencedays(value, entity.ToTime);
					removeMandatory(entity, 'ToTime', validationService, dataService);
				}
			} else {
				if (!_.isNil(entity.ToTime)) {
					return addMandatory(entity, 'FromTime', validationService, dataService);
				} else {
					removeMandatory(entity, 'ToTime', validationService, dataService);
				}
			}
			return platformDataValidationService.finishValidation(true, entity, value, model, validationService, dataService);
		};

		self.validateToTime = function (entity, value, model, dataService, validationService) {
			if (!_.isNil(value)) {
				platformRuntimeDataService.applyValidationResult({apply: true, valid: true}, entity, 'ToDateTime');
				if (isOverlapping(entity.FromDateTime, entity.ToDateTime, entity.FromTime, value, entity.Id, dataService)){
					let result = {apply: true, valid: false,
						error: $translate.instant('timekeeping.employee.errorMsgOverlappingAbsence'),
						error$tr$: 'timekeeping.employee.errorMsgOverlappingAbsence'};
					return platformDataValidationService.finishValidation(result, entity, value, model, validationService, dataService);
				}
				if (_.isNil(entity.FromTime)) {
					return addMandatory(entity, 'FromTime', validationService, dataService);
				} else {
					// entity.Absenceday = giveAbsencedays(value, entity.FromTime);
					removeMandatory(entity, 'FromTime', validationService, dataService);
				}
			} else {
				if (!_.isNil(entity.FromTime)) {
					return addMandatory(entity, 'ToTime', validationService, dataService);
				} else {
					removeMandatory(entity, 'FromTime', validationService, dataService);
				}
			}
			return platformDataValidationService.finishValidation(true, entity, value, model, validationService, dataService);
		};

		function removeMandatory(entity, model, validationService, dataService) {
			let result = {apply: true, valid: false};
			result.apply = true;
			result.valid = true;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result, entity, true, model, validationService, dataService);
		}

		function addMandatory(entity, model, validationService, dataService) {
			let result = {apply: true, valid: false};
			result.apply = true;
			result.valid = false;
			result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result, entity, false, model, validationService, dataService);
		}


		function doValidateAbsenceDay(entity, value, model, dataService, validationService){
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			let item = _.cloneDeep(entity);
			if (model !== 'AbsenceDay') {
				item[model] = value;
			}
			dataService.revertProcessItem(item);
			return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/plannedabsence/calculateabsenceday', item
			).then(function (response) {
				let result = {apply: true, valid: true, error: ''}
				if (model !== 'AbsenceDay') {
					entity.Absenceday = response.data.Absenceday;
				} else {
					if (value > response.data.Absenceday){
						result.valid = false;
						result.error$tr$ = 'timekeeping.employee.errorMsgAbsenceday';
						result.error = $translate.instant('timekeeping.employee.errorMsgAbsenceday');
					}
				}
				return platformDataValidationService.finishAsyncValidation(result, entity,
					value, model, asyncMarker, validationService, dataService);
			}, function () {
				return platformDataValidationService.finishAsyncValidation({apply: false, valid: true, error: ''}, entity,
					value, model, asyncMarker, validationService, dataService);
			});
		}
		self.asyncValidateFromDateTime = function asyncValidateFromDateTime(entity, value, model, dataService, validationService){
			if (!_.isNil(entity.ToDateTime)) {
				if (entity.ToDateTime.isSame(value,'year') && entity.ToDateTime.isSame(value,'month') && entity.ToDateTime.isSame(value,'day')){
					setTimeReadonly(entity, false);
				} else {
					setTimeReadonly(entity, true);
				}
				return doValidateAbsenceDay(entity, value, model, dataService, validationService);
			}
			return $q.when(true);
		};

		self.asyncValidateToDateTime = function asyncValidateToDateTime(entity, value, model, dataService, validationService){
			if (!_.isNil(entity.FromDateTime)) {
				if (entity.FromDateTime.isSame(value,'year') && entity.FromDateTime.isSame(value,'month') && entity.FromDateTime.isSame(value,'day')){
					setTimeReadonly(entity, false);
				} else {
					setTimeReadonly(entity, true);
				}
				return doValidateAbsenceDay(entity, value, model, dataService, validationService);
			}
			return $q.when(true);
		};

		self.asyncValidateAbsenceday = function asyncValidateAbsenceday(entity, value, model, dataService, validationService){
			if (!_.isNil(entity.FromDateTime && !_.isNil(entity.ToDateTime))) {
				return doValidateAbsenceDay(entity, value, model, dataService, validationService);
			}
			return $q.when(true);
		};

		self.asyncValidateFromTime = function asyncValidateFromTime(entity, value, model, dataService, validationService){
			if (!_.isNil(entity.ToTime) && !_.isNil(value) || !_.isNil(entity.FromDateTime) && !_.isNil(entity.ToDateTime)) {
				return doValidateAbsenceDay(entity, value, model, dataService, validationService);
			}
			return $q.when(true);
		};

		self.asyncValidateToTime = function asyncValidateToTime(entity, value, model, dataService, validationService){
			if (!_.isNil(entity.FromTime) && !_.isNil(value) || !_.isNil(entity.FromDateTime) && !_.isNil(entity.ToDateTime)) {
				return doValidateAbsenceDay(entity, value, model, dataService, validationService);
			}
			return $q.when(true);
		};

	}

})(angular);
