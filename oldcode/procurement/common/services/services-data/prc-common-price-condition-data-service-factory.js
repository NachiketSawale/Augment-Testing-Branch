/**
 * Created by wui on 5/11/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonPriceConditionServiceFactory', [
		'procurementCommonPriceConditionService',
		function (procurementCommonPriceConditionService) {
			return function () {
				return procurementCommonPriceConditionService.getService();
			};
		}
	]);

})(angular);