/**
 * Created by lcn on 02/24/2022.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonSalesTaxValidationService', ['platformDataValidationService', '$translate',
		'platformRuntimeDataService',
		// eslint-disable-next-line no-unused-vars
		function (platformDataValidationService, $translate, platformRuntimeDataService) {
			// eslint-disable-next-line no-unused-vars
			return function (dataService) {
				return {};
			};
		}]);
})(angular);