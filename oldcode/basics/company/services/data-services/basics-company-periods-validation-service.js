/**
 * Created by henkel on 11.11.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyPeriodsValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyPeriodsValidationService', BasicsCompanyPeriodsValidationService);

	BasicsCompanyPeriodsValidationService.$inject = ['_', 'moment', 'basicsCompanyPeriodsService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function BasicsCompanyPeriodsValidationService(_, moment, basicsCompanyPeriodsService, platformDataValidationService) {

		var self = this;

		this.validateStartDate = function validateStartDate(entity, value, model) {
			// check year
			const yearStartDay = moment(entity.Year.StartDate);
			const yearEndDay = moment(entity.Year.EndDate);

			if (yearStartDay.isAfter(value, 'day') || yearEndDay.isBefore(value, 'day')) {
				const result = platformDataValidationService.createErrorObject('basics.company.errorStartDateYear', {object: model.toLowerCase()});
				return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsCompanyPeriodsService);
			}

			// check overlap
			const listPeriods = basicsCompanyPeriodsService.getList();
			let isOverlap = false;
			_.forEach(listPeriods, function (item) {
				if (item.Id !== entity.Id && item.StartDate.isSameOrBefore(value, 'day') && item.EndDate.isSameOrAfter(value, 'day')) {
					isOverlap = true;
				}
			});

			if (isOverlap === true) {
				const result = platformDataValidationService.createErrorObject('basics.company.overlapPeriod', {object: model.toLowerCase()});
				return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsCompanyPeriodsService);
			}

			return platformDataValidationService.validatePeriod(value, entity.EndDate, entity, model, self, basicsCompanyPeriodsService, 'EndDate');
		};

		this.validateEndDate = function validateEndDate(entity, value, model) {
			// check year
			const yearStartDay = moment(entity.Year.StartDate);
			const yearEndDay = moment(entity.Year.EndDate);

			if (yearStartDay.isAfter(value, 'day') || yearEndDay.isBefore(value, 'day')) {
				const result = platformDataValidationService.createErrorObject('basics.company.errorEndDateYear', {object: model.toLowerCase()});
				return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsCompanyPeriodsService);
			}

			// check overlap
			const listPeriods = basicsCompanyPeriodsService.getList();
			var isOverlap = false;
			_.forEach(listPeriods, function (item) {
				if (item.Id !== entity.Id && item.StartDate.isSameOrBefore(value, 'day') && item.EndDate.isSameOrAfter(value, 'day')) {
					isOverlap = true;
				}
			});

			if (isOverlap === true) {
				const result = platformDataValidationService.createErrorObject('basics.company.overlapPeriod', {object: model.toLowerCase()});
				return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsCompanyPeriodsService);
			}

			return platformDataValidationService.validatePeriod(entity.StartDate, value, entity, model, self, basicsCompanyPeriodsService, 'StartDate');
		};

		this.validateTradingPeriod = function validateTradingPeriod(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsCompanyPeriodsService.getList(), self, basicsCompanyPeriodsService);
		};

		this.validatePreliminaryActual = function validatePreliminaryActual(entity, value) {
			if(value) {
				_.forEach(basicsCompanyPeriodsService.getList(), function(item) {
					if(item.PreliminaryActual) {
						item.PreliminaryActual = false;
						basicsCompanyPeriodsService.markItemAsModified(item);
					}
				});
			}

			return { apply: true, valid: true };
		};
	}
})(angular);