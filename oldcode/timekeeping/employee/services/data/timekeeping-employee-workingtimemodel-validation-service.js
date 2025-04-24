/**
 * Created by shen on 9/20/2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeWorkingTimeModelValidationService
	 * @description provides validation methods for timekeeping employee working time model entities
	 */
	angular.module(moduleName).service('timekeepingEmployeeWorkingTimeModelValidationService', TimekeepingEmployeeWorkingTimeModelValidationService);

	TimekeepingEmployeeWorkingTimeModelValidationService.$inject = ['_', '$http', '$injector', 'moment', '$q', 'platformDataValidationService', 'platformValidationServiceFactory', 'timekeepingEmployeeWorkingTimeModelDataService', 'platformDataServiceModificationTrackingExtension'];

	function TimekeepingEmployeeWorkingTimeModelValidationService(_, $http, $injector, moment, $q, platformDataValidationService, platformValidationServiceFactory, timekeepingEmployeeWorkingTimeModelDataService, platformDataServiceModificationTrackingExtension) {
		let self = this;

		self.validateValidFrom = function (entity, value, model) {
			let res = platformDataValidationService.validateMandatory(entity, value, model, self, timekeepingEmployeeWorkingTimeModelDataService);
			if (!res.valid) {
				return res;
			}
			if(!entity.ValidTo)
			{
				return true;
			}

			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, timekeepingEmployeeWorkingTimeModelDataService, 'ValidTo');
		};

		self.asyncValidateValidFrom = function (entity, value, model) {
			return self.validatePeriod(entity, value, model).then(function (data) {
				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		self.validateValidTo = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, timekeepingEmployeeWorkingTimeModelDataService, 'ValidFrom');
		};

		self.asyncValidateValidTo = function (entity, value, model) {
			if(entity.ValidTo !== null || value !== null) {
				return self.validatePeriod(entity, value, model).then(function (data) {
					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when({valid: true, error: '', error$tr$: ''});
			}
		};

		this.validatePeriod = function validatePeriod(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingEmployeeWorkingTimeModelDataService);

			let params = {};
			let to;
			let from;
			params.EmployeeWTMToValidate = _.cloneDeep(entity);
			if (model === 'ValidFrom') {
				from = moment.isMoment(value) ? value : moment.utc(value);
				from = from.format();
				params.EmployeeWTMToValidate.ValidFrom = from;
				if (entity.ValidTo) {
					to = moment.isMoment(entity.ValidTo) ? entity.ValidTo : moment.utc(entity.ValidTo);
					to = to.format();
					params.EmployeeWTMToValidate.ValidTo = to;
				}
			}
			if (model === 'ValidTo') {
				from = moment.isMoment(entity.ValidFrom) ? entity.ValidFrom : moment.utc(entity.ValidFrom);
				from = from.format();
				params.EmployeeWTMToValidate.ValidFrom = from;
				if(value){
					to = moment.isMoment(value) ? value : moment.utc(value);
					to = to.format();
					params.EmployeeWTMToValidate.ValidTo = to;
				}
				else
				{
					params.EmployeeWTMToValidate.ValidTo = null;
				}
			}

			let updateData = platformDataServiceModificationTrackingExtension.getModifications(timekeepingEmployeeWorkingTimeModelDataService);
			if (updateData && updateData.EmployeeWTMToSave) {
				params.EmployeeWTMToSave = updateData.EmployeeWTMToSave;
			}
			if (updateData && updateData.EmployeeWTMToDelete) {
				params.EmployeeWTMToDelete = updateData.EmployeeWTMToDelete;
			}

			asyncMarker.myPromise = $http.post(
				globals.webApiBaseUrl + 'timekeeping/employee/employeewtm/validateperiod', params)
				.then(function (response) {
					platformDataValidationService.finishAsyncValidation({
						valid: response.data.Valid,
						error: response.data.ValidError
					}, entity, value, model, asyncMarker, self, timekeepingEmployeeWorkingTimeModelDataService);
					if (response && response.data && response.data.Valid) {
						platformDataValidationService.ensureNoRelatedError(entity, model, [model], self, timekeepingEmployeeWorkingTimeModelDataService);
						if (response.data.ChangedEmployeeWTM) {
							timekeepingEmployeeWorkingTimeModelDataService.takeOverItem(response.data.ChangedEmployeeWTM);
						}
						return {
							valid: response.data.Valid,
							apply: true,
							invalidFields: [model]
						};
					}
					else {
						return {
							valid: response.data.Valid,
							error: response.data.ValidError,
							apply: true,
							invalidFields: [model]
						};
					}
				}, function () {
					platformDataValidationService.finishAsyncValidation({
						valid: false,
						error: 'Unknown issue'
					}, entity, value, model, asyncMarker, self, timekeepingEmployeeWorkingTimeModelDataService);
					return {valid: false, error: 'Unknown issue', error$tr$: 'Unknown issue'};
				});

			return asyncMarker.myPromise;
		};

		self.validateTimesymbolFk = function(entity, value, model) {

			if (entity.TimesymbolFk && entity.HasOptedPayout === true) {
				let res = platformDataValidationService.validateMandatory(entity, value, model, self, timekeepingEmployeeWorkingTimeModelDataService);
				if (!res.valid) {
					return res;
				}
				return true;
			}
		};
		self.asyncValidateEmployeeWorkingTimeModelFk=function asyncValidateEmployeeWorkingTimeModelFk(entity, value){
				const updatedValue =  value || entity.EmployeeWorkingTimeModelFk;
				if(updatedValue){
					let postData ={PKey1:updatedValue};
					let employee = timekeepingEmployeeWorkingTimeModelDataService.parentService().getSelected();
					employee.WorkingTimeModelFk = updatedValue;
					timekeepingEmployeeWorkingTimeModelDataService.parentService().markItemAsModified(employee);
					return $http.post(globals.webApiBaseUrl + 'timekeeping/worktimemodel/getWorkTimeModelList',postData).then(function (result) {
						if (result.data !== undefined && result.data !== null && result.data.length > 0) {
							// entity.IsFallbackWTMActive = result.data[0].IsFallback;
							entity.EmployeeFallbackWTM = result.data[0].WorkingTimeModelFbFk;
						}
					});
				}
		};

		self.validateEmployeeWorkingTimeModelFk = function validateEmployeeWorkingTimeModelFk(entity, value,model){
			const updatedValue =  value || entity.EmployeeWorkingTimeModelFk;
			let hasValue = true;
			if(!updatedValue){
				hasValue = false;
			}
			return platformDataValidationService.finishValidation(hasValue,entity,updatedValue,model,self,timekeepingEmployeeWorkingTimeModelDataService);
		};
	}

})(angular);
