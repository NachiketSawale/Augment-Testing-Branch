(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for prcItem
	 */
	angular.module('procurement.common').factory('procurementCommonDataValidationService',
		['platformDataValidationService',
			function (/* platformValidationUtil */) {
				return function () {
					// var dataService = dataServiceFactory.getService();
					return {};
				};
			}
		]);
})(angular);
