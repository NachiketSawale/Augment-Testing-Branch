/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationValidationService
	 * @description provides validation methods for timekeeping timeallocation timeallocationheader entities
	 */
	angular.module(moduleName).service('timekeepingTimeallocationHeaderValidationService', TimekeepingTimeallocationHeaderValidationService);

	TimekeepingTimeallocationHeaderValidationService.$inject = ['_', 'platformValidationServiceFactory', 'timekeepingTimeallocationConstantValues', 'timekeepingTimeallocationHeaderDataService','$injector', 'platformDataValidationService', '$q', '$http', 'globals'];

	function TimekeepingTimeallocationHeaderValidationService(_, platformValidationServiceFactory, timekeepingTimeallocationConstantValues, timekeepingTimeallocationHeaderDataService, $injector, platformDataValidationService, $q, $http, globals) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingTimeallocationConstantValues.schemes.timeallocationheader, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingTimeallocationConstantValues.schemes.timeallocationheader)
		},
		self,
		timekeepingTimeallocationHeaderDataService);

		function doValidateEntity(entity, value, model){
			let item = _.cloneDeep(entity);
			item[model] = value;
			if (item.ProjectFk > 0 && !_.isNil(item.AllocationDate)) {

				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeallocationHeaderDataService);
				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/isunique', item).then(function (response) {
					if (!response.data) {
						let errObj =platformDataValidationService.createErrorObject('timekeeping.timeallocation.errorSameResultHeader');
						return platformDataValidationService.finishAsyncValidation(errObj, entity, value, model, asyncMarker, self, timekeepingTimeallocationHeaderDataService);
					}
					platformDataValidationService.ensureNoRelatedError(entity, model,['ProjectFk', 'PeriodFk', 'JobFk', 'AllocationDate'], self, timekeepingTimeallocationHeaderDataService);
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, timekeepingTimeallocationHeaderDataService);
				});
				return asyncMarker.myPromise;
			} else {
				if(item.ProjectFk>0){
					return $q.when(true);
				}
				return $q.when(false);
			}
		}
		self.asyncValidateProjectFk = function asyncValidateProjectFk(entity, value, model) {
			entity.JobFk = null;
			if (value === null){
				return $q.when(false);
			}
			return doValidateEntity(entity, value, model).then(function(response) {
				if (response === true || response && response.valid) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeallocationHeaderDataService);
					let headerDto = entity;
					headerDto.ProjectFk = value;
					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/getprojectactions', headerDto).then(function (result) {
						entity.ProjectActions = result.data.ProjectActions;
						let colService = $injector.get('timekeepingTimeallocationActionColumnService');
						colService.appendActionCols(result.data.ProjectActions, value, entity.JobFk);
						return platformDataValidationService.finishAsyncValidation(true, result, value, model, asyncMarker, self, timekeepingTimeallocationHeaderDataService);
					});
					return asyncMarker.myPromise;
				} else {
					return response;
				}
			});
		};

		/*self.asyncValidatePeriodFk = function asyncValidatePeriodFk(entity, value, model) {

			return doValidateEntity(entity, value, model).then(function(response){
				if ((response === true || response && response.valid) && entity.AllocationDate !== null) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity,  value, model, timekeepingTimeallocationHeaderDataService);
					let item = _.cloneDeep(entity);
					item[model] = value;
					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/validateallocationdate', item).then(function (response) {
						if (response && response.data) {
							response.valid = true;
							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, timekeepingTimeallocationHeaderDataService);
						} else {
							let errObj = platformDataValidationService.createErrorObject('timekeeping.timeallocation.errorAllocDate');
							return platformDataValidationService.finishAsyncValidation(errObj, entity, value, model, asyncMarker, self, timekeepingTimeallocationHeaderDataService);
						}
					});
					return asyncMarker.myPromise;
				} else
				{
					return response;
				}
			});
		};*/

		self.asyncValidateAllocationDate = function asynValidateAllocationDate(entity, value, model){
			return doValidateEntity(entity, value, model).then(function(response){
				return response;
			});

			/*
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeallocationHeaderDataService);
						let item = _.cloneDeep(entity);
						item.AllocationDate = value;
						asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/validateallocationdate', item).then(function (response) {
							if (response && response.data) {
								response.valid = true;
								return doValidateEntity(entity, value, model);
							} else {
								let errObj = platformDataValidationService.createErrorObject('timekeeping.timeallocation.errorAllocDate');
								return platformDataValidationService.finishAsyncValidation(errObj, entity, value, model, asyncMarker, self, timekeepingTimeallocationHeaderDataService);
							}
						});
						return asyncMarker.myPromise;
			*/
		};

		self.asyncValidateJobFk = function asyncValidateJobFk(entity, value, model) {
			if (value === null) {
				return doValidateEntity(entity, value, model).then(function(response){
					if (response === true || response && response.valid) {
						let colService = $injector.get('timekeepingTimeallocationActionColumnService');
						colService.appendActionCols(entity.ProjectActions, entity.ProjectFk, value);
					}
					return response;
				});
			}
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeallocationHeaderDataService);

			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + value).then(function (response) {
				if (response && response.data) {
					response.valid = true;
					if (response.data.ProjectFk === null) {
						return $q.when(false);
					}
					let isProjectChanged = false;
					if (response.data.ProjectFk !== entity.ProjectFk) {
						entity.ProjectFk = response.data.ProjectFk;
						isProjectChanged = true;
					}
					return doValidateEntity(entity, value, model).then(function(response){
						if (response === true || response && response.valid) {
							if (isProjectChanged){
									let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimeallocationHeaderDataService);
									let headerDto = entity;
									asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/header/getprojectactions', headerDto).then(function (result) {
										entity.ProjectActions = result.data.ProjectActions;
										let colService = $injector.get('timekeepingTimeallocationActionColumnService');
										colService.appendActionCols(result.data.ProjectActions, entity.ProjectFk, value);
										return platformDataValidationService.finishAsyncValidation(true, result, value, model, asyncMarker, self, timekeepingTimeallocationHeaderDataService);
									});
									return asyncMarker.myPromise;
							} else {
								let colService = $injector.get('timekeepingTimeallocationActionColumnService');
								colService.appendActionCols(entity.ProjectActions, entity.ProjectFk, value);
								return response;
							}
						} else {
							return response;
						}
					});
				}
			});
			return asyncMarker.myPromise;
		};
		self.validateAllocationenddate = function validateAllocationenddate(entity, value, model){
			if (!_.isNil(value)) {
				return platformDataValidationService.validatePeriod(entity.AllocationDate, value, entity, model, self, timekeepingTimeallocationHeaderDataService, 'AllocationDate');
			}
		};
		self.validateAllocatioDate = function validateAllocationDate(entity, value){
			if (!_.isNil(entity.Allocationenddate)) {
				return platformDataValidationService.validatePeriod(value, entity.Allocationenddate, entity, model, self, timekeepingTimeallocationHeaderDataService, 'Allocationenddate');
			}
		};
		self.asyncValidateAllocationenddate = function asyncValidateAllocationEndDate(entity, value, model) {
			return doValidateEntity(entity, value, model).then(function (response) {
				return response;
			});
		};
	}
})(angular);
