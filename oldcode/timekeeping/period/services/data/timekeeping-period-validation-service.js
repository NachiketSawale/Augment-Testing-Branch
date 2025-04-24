/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.period';

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodValidationService
	 * @description provides validation methods for timekeeping period period entities
	 */
	angular.module(moduleName).service('timekeepingPeriodValidationService', TimekeepingPeriodValidationService);

	TimekeepingPeriodValidationService.$inject = ['_','$q','$http','platformValidationServiceFactory', 'timekeepingPeriodConstantValues', 'timekeepingPeriodDataService','platformDataValidationService'];

	function TimekeepingPeriodValidationService(_,$q,$http,platformValidationServiceFactory, timekeepingPeriodConstantValues, timekeepingPeriodDataService,platformDataValidationService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingPeriodConstantValues.schemes.period, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingPeriodConstantValues.schemes.period)
			},
			self,
			timekeepingPeriodDataService);

		self.validateTimekeepingGroupFk = function validateTimekeepingGroupFk(entity, value, model){

			if (_.isNull(value) || value === 0)
			{
				return platformDataValidationService.finishValidation(false, entity, value, model, self, timekeepingPeriodDataService);
			}

			const listPeriods = timekeepingPeriodDataService.getList();
			let isOverlap = false;
			_.forEach(listPeriods, function (item) {
				if(item.TimekeepingGroupFk>0 && value>0 && item.TimekeepingGroupFk===value && item.Id!==entity.Id){
					if((item.StartDate.isSameOrBefore(entity.StartDate, 'day') && item.EndDate.isSameOrAfter(entity.StartDate, 'day')) || (item.StartDate.isSameOrBefore(entity.EndDate, 'day') && item.EndDate.isSameOrAfter(entity.EndDate, 'day'))){
						isOverlap = true;
					}
				}
			});

			if (isOverlap === true) {
				const result = platformDataValidationService.createErrorObject('timekeeping.period.overlaps', {object: model.toLowerCase()});
				return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingPeriodDataService);
			}
			return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPeriodDataService);
		};

		this.validateStartDate = function validateStartDate(entity, value, model) {

			// check overlap
			const listPeriods = timekeepingPeriodDataService.getList();
			let isOverlap = false;
			_.forEach(listPeriods, function (item) {
				if(item.TimekeepingGroupFk>0 && entity.TimekeepingGroupFk>0 && item.TimekeepingGroupFk===entity.TimekeepingGroupFk && item.Id!==entity.Id) {
					if (item.StartDate.isSameOrBefore(value, 'day') && item.EndDate.isSameOrAfter(value, 'day')) {
						isOverlap = true;
					}
				}
			});

			if (isOverlap === true) {
				const result = platformDataValidationService.createErrorObject('timekeeping.period.overlaps', {object: model.toLowerCase()});
				return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingPeriodDataService);
			}

			return platformDataValidationService.validatePeriod(value, entity.EndDate, entity, model, self, timekeepingPeriodDataService, 'EndDate');
		};

		this.validateEndDate = function validateEndDate(entity, value, model,arg) {
			// check overlap
			const listPeriods = timekeepingPeriodDataService.getList();
			var isOverlap = false;
			_.forEach(listPeriods, function (item) {
				if(item.TimekeepingGroupFk>0 && entity.TimekeepingGroupFk>0 && item.TimekeepingGroupFk===entity.TimekeepingGroupFk && item.Id!==entity.Id) {
					if (item.StartDate.isSameOrBefore(value, 'day') && item.EndDate.isSameOrAfter(value, 'day')) {
						isOverlap = true;
					}
				}
			});

			if (isOverlap === true) {
				const result = platformDataValidationService.createErrorObject('timekeeping.period.overlaps', {object: model.toLowerCase()});
				return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingPeriodDataService);
			}
			if (!arg && (_.isNil(entity.VoucherNumber) || entity.VoucherNumber && entity.VoucherNumber.length <= 0)){
				entity.VoucherNumber = value.format('YYYY-MM-DD');
			}
			return platformDataValidationService.validatePeriod(entity.StartDate, value, entity, model, self, timekeepingPeriodDataService, 'StartDate');
		};

		self.asyncValidateTimekeepingGroupFk = function asyncValidateTimekeepingGroupFk(entity, value, model){
			if(entity.StartDate!==0 && entity.EndDate!==0 && value>0)
			{
				return self.overlapsDate(entity,value,entity.StartDate,entity.EndDate,model,value).then(function (data) {
					if(data.data.startDateOverlap===true){
						const result = platformDataValidationService.createErrorObject('timekeeping.period.overlaps', {object: 'StartDate'});
						return platformDataValidationService.finishValidation(result, entity, entity.StartDate, 'StartDate', self, timekeepingPeriodDataService);
					}
					if(data.data.endDateOverlap===true) {
						const result = platformDataValidationService.createErrorObject('timekeeping.period.overlaps', {object: 'EndDate'});
						return platformDataValidationService.finishValidation(result, entity, entity.EndDate, 'EndDate', self, timekeepingPeriodDataService);
					}
					return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPeriodDataService);
				});
			}
			return $q.when(true);
		};

		this.asyncValidateStartDate = function asyncValidateStartDate(entity, value, model) {
			if(entity.TimekeepingGroupFk >0 && entity.EndDate!==0 && value!==0)
			{
				// check overlap
				return self.overlapsDate(entity,entity.TimekeepingGroupFk,value,entity.EndDate,model,value).then(function (data) {
					if(data.data.startDateOverlap===true){
						const result = platformDataValidationService.createErrorObject('timekeeping.period.overlaps', {object: model.toLowerCase()});
						return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingPeriodDataService);
					}
					if(data.data.endDateOverlap===false) {
						platformDataValidationService.ensureNoRelatedError(entity, model,['TimekeepingGroupFk'], self, timekeepingPeriodDataService);
						return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPeriodDataService);
					}
					return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPeriodDataService);
				}).catch();
			}
			return $q.when(true);
		};

		this.asyncValidateEndDate = function asyncValidateEndDate(entity, value, model) {
			if(entity.TimekeepingGroupFk >0 && entity.StartDate!==0 && value!==0) {
				return self.overlapsDate(entity,entity.TimekeepingGroupFk,entity.StartDate,value,model,value).then(function (data) {
					if(data.data.endDateOverlap===true){
						const result = platformDataValidationService.createErrorObject('timekeeping.period.overlaps', {object: model.toLowerCase()});
						return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingPeriodDataService);
					}
					if(data.data.startDateOverlap===false){
						platformDataValidationService.ensureNoRelatedError(entity, model,['TimekeepingGroupFk'], self, timekeepingPeriodDataService);
						return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPeriodDataService);
					}
					return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingPeriodDataService);
				});
			}
			return $q.when(true);
		};

		self.overlapsDate = function overlapsDate(entity,groupFk,StartDate, EndDate,model,field)
		{
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, model, timekeepingPeriodDataService);
			let postData = {TimekeepingGroupFk:groupFk,StartDate:StartDate,EndDate:EndDate,Id:entity.Id};
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/period/checkDateOverlaps', postData).then(function (response) {
				return response;
			});
			return asyncMarker.myPromise;
		};
	}
})(angular);