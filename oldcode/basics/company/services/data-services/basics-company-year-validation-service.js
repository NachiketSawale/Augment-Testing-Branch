/**
 * Created by henkel on 11.11.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyYearValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyYearValidationService', BasicsCompanyYearValidationService);

	BasicsCompanyYearValidationService.$inject = ['_', '$q', 'basicsCompanyYearService', 'platformDataValidationService',
		'basicsCompanyPeriodsPreliminaryActualService'];

	function BasicsCompanyYearValidationService(_, $q, basicsCompanyYearService, platformDataValidationService,
		basicsCompanyPeriodsPreliminaryActualService ) {
		var self = this;

		this.validateTradingYear = function validateTradingYear(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsCompanyYearService.getList(), self, basicsCompanyYearService);
		};

		this.validateStartDate = function validateStartDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.EndDate, entity, model, self, basicsCompanyYearService, 'EndDate');
		};

		this.validateEndDate = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.StartDate, value, entity, model, self, basicsCompanyYearService, 'StartDate');
		};

		this.validatePreliminaryActual = function validatePreliminaryActual(entity, value) {
			entity.PreliminaryActual = value;
			if(value) {
				_.forEach(basicsCompanyYearService.getList(), function(item) {
					if(item.PreliminaryActual && item.Id !== entity.Id) {
						basicsCompanyPeriodsPreliminaryActualService.setCompanyYearNotPreliminaryActual(item, basicsCompanyYearService);
					}
				});
				basicsCompanyPeriodsPreliminaryActualService.handleCompanyYearIsSetPreliminaryActual(entity);
			} else {
				basicsCompanyPeriodsPreliminaryActualService.handleCompanyYearIsSetNotPreliminaryActual(entity);
			}

			return { apply: true, valid: true };
		};
	}
})(angular);