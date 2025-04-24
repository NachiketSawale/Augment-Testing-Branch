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
	angular.module(moduleName).service('basicsCompanyPeriodsPreliminaryActualService', BasicsCompanyPeriodsPreliminaryActualService);

	BasicsCompanyPeriodsPreliminaryActualService.$inject = ['_', 'basicsCompanyPeriodsService', 'basicsCompanyPeriodValidationProcessor'];

	function BasicsCompanyPeriodsPreliminaryActualService(_, basicsCompanyPeriodsService, basicsCompanyPeriodValidationProcessor) {
		var self = this;

		this.setCompanyYearNotPreliminaryActual = function setCompanyYearNotPreliminaryActual(companyYear, basicsCompanyYearService) {
			companyYear.PreliminaryActual = false;
			basicsCompanyYearService.markItemAsModified(companyYear);
			self.handleCompanyYearIsSetNotPreliminaryActual(companyYear);
		};

		this.handleCompanyYearIsSetNotPreliminaryActual = function handleCompanyYearIsSetPreliminaryActual(companyYear) {
			let periodCache = basicsCompanyPeriodsService.getPeriodsForYear(companyYear);

			if(periodCache.loaded) {
				_.forEach(periodCache.periods, function(item) {
					if(item.PreliminaryActual) {
						item.PreliminaryActual = false;
						basicsCompanyPeriodsService.markItemAsModified(item);
					}

					basicsCompanyPeriodValidationProcessor.adjustToPreliminaryActualInYear(item, companyYear, basicsCompanyPeriodsService);
				});
			}

			return true;// periodCache.loaded; in case work on server does not fit, we have to work with a differentiated return.
		};

		this.handleCompanyYearIsSetPreliminaryActual = function handleCompanyYearIsSetPreliminaryActual(companyYear) {
			var periodCache = basicsCompanyPeriodsService.getPeriodsForYear(companyYear);

			if(periodCache.loaded) {
				_.forEach(periodCache.periods, function(item) {
					if(item.PreliminaryActual) {
						item.PreliminaryActual = false;
						basicsCompanyPeriodsService.markItemAsModified(item);
					}

					basicsCompanyPeriodValidationProcessor.adjustToPreliminaryActualInYear(item, companyYear, basicsCompanyPeriodsService);
				});
			}

			return periodCache.loaded;
		};
	}
})(angular);