/**
 * Created by henkel
 */
(function (angular) {
	/* globals moment */
	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).service('basicsCompanyPeriodValidationProcessor', BasicsCompanyPeriodValidationProcessor);

	BasicsCompanyPeriodValidationProcessor.$inject = ['_', '$injector', 'platformRuntimeDataService'];

	function BasicsCompanyPeriodValidationProcessor(_, $injector, platformRuntimeDataService) {
		const self = this;
		let basicsCompanyPeriodService = null;
		let basicsCompanyYearService = null;

		function assertCompanyPeriodService() {
			if(basicsCompanyPeriodService === null) {
				basicsCompanyPeriodService = $injector.get('basicsCompanyPeriodsService');
			}

			return basicsCompanyPeriodService;
		}

		function assertCompanyYearService() {
			if(basicsCompanyYearService === null) {
				basicsCompanyYearService = $injector.get('basicsCompanyYearService');
			}

			return basicsCompanyYearService;
		}

		this.adjustToPreliminaryActualInYear = function adjustToPreliminaryActualInYear(period, year, basicsCompanyPeriodsService) {
			if(year) {
				period.Year.PreliminaryActual = year.PreliminaryActual;
				if(!year.PreliminaryActual && period.PreliminaryActual !== false){
					period.PreliminaryActual = false;
					basicsCompanyPeriodsService.markItemAsModified(period);
				}
				period.ReadOnlyPreliminaryActual = !year.PreliminaryActual;
			}
			platformRuntimeDataService.readonly(period, [{field: 'PreliminaryActual', readonly: period.ReadOnlyPreliminaryActual}]);
			basicsCompanyPeriodsService.fireItemModified(period);
		};

		this.processItem = function processItem(item) {
			let selectedYear = item.Year;
			let yearService = assertCompanyYearService();
			let year = yearService.getItemById(item.CompanyYearFk);
			if(!_.isNil(year)) {
				selectedYear.PreliminaryActual = year.PreliminaryActual;
			}

			if(selectedYear) {
				selectedYear.StartDate = moment.utc(selectedYear.StartDate);
				selectedYear.EndDate = moment.utc(selectedYear.EndDate);

				self.adjustToPreliminaryActualInYear(item, selectedYear, assertCompanyPeriodService());
			}
		};
	}
})(angular);