/**
 * Created by wui on 10/26/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeDetailTotalProcessor', ['prcCommonItemCalculationHelperService',
		function (prcCommonItemCalculationHelper) {
			let roundingType = prcCommonItemCalculationHelper.roundingType;
			return {
				processItem: function (item) {
					if (item.PriceUnit * item.FactorPriceUnit === 0) {
						item.Total = 0;
						item.TotalCurrency = 0;
					}
					else {
						item.Total = prcCommonItemCalculationHelper.round(roundingType.Total, ((item.Price + item.PriceExtra) * item.Quantity / item.PriceUnit * item.FactorPriceUnit));
						item.TotalCurrency = prcCommonItemCalculationHelper.round(roundingType.TotalCurrency, ((item.PriceOc + item.PriceExtraOc) * item.Quantity / item.PriceUnit * item.FactorPriceUnit));
					}
				}
			};
		}
	]);

})(angular);