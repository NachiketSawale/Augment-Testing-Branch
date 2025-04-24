(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainActivityValidationService
	 * @description provides validation methods for a activity.
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainActivityValidationService',
		['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'basicsLookupdataLookupDescriptorService',
			function ($translate, platformRuntimeDataService, platformDataValidationService, basicsLookupdataLookupDescriptorService) {
				return function (dataService) {
					let service = {};
					service.validateActivityTypeFk = validateActivityTypeFk;
					service.validateActivityDate = validateActivityDate;
					service.validateFromDate = validateFromDate;
					service.validateCompanyResponsibleFk = validateCompanyResponsibleFk;
					return service;

					// ////////////////////
					function requiredValidator(value, model) {
						let result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}

						return result;
					}

					// noinspection JSUnusedLocalSymbols
					function validateActivityTypeFk(entity, value, model) {
						return requiredValidator(value, model);
					}

					// validate ActivityDate
					function validateActivityDate(entity, value, model) {

						let result = {apply: true, valid: true};

						// The already existing "Activity Date" would in this case indicate the end date ("To Date").
						// it should be greater then 'FromDate'.Otherwise, it is wrong.
						let fromDate = entity.FromDate;
						if (!!value && !!fromDate && value < fromDate) {

							let fieldName1 = $translate.instant('businesspartner.main.bpActivityDate');
							let fieldName2 = $translate.instant('cloud.common.fromDate');
							result.valid = false;
							result.error = $translate.instant('cloud.common.endDateError', {field1: fieldName1, field2: fieldName2});
						}

						// platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						if (result.valid) {

							validateFieldsHelper(entity, fromDate, 'FromDate', result);
						}
						return result;
					}

					// validate FromDate
					function validateFromDate(entity, value, model) {

						let result = {apply: true, valid: true};

						// This date is meant to indicate the starting date for activities that extend over a certain time period.
						// it should be less then 'ActivityDate'. Otherwise, it is wrong.
						let activityDate = entity.ActivityDate;
						if (!!value && !!activityDate && activityDate < value) {

							let fieldName1 = $translate.instant('cloud.common.fromDate');
							let fieldName2 = $translate.instant('businesspartner.main.bpActivityDate');
							result.valid = false;
							result.error = $translate.instant('cloud.common.startDateError', {field1: fieldName1, field2: fieldName2});
						}

						// platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

						if (result.valid) {

							validateFieldsHelper(entity, activityDate, 'ActivityDate', result);
						}
						return result;
					}

					// can be used to validate another field when validate one.
					function validateFieldsHelper(entity, value, model, result) {

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					}

					function validateCompanyResponsibleFk(entity, value, model) {
						if (model && value !== entity[model]) {
							basicsLookupdataLookupDescriptorService.loadItemByKey('company', value).then(function (item) {
								entity.ClerkFk = item.ClerkFk;
								dataService.gridRefresh();
							});
						}
						return true;
					}
				};
			}]);

})(angular);