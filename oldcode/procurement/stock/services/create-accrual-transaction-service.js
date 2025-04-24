/**
 * Created by lcn on 02/10/2025.
 */
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.stock';

	angular.module(moduleName).factory('procurementStockCreateAccrualTransactionService', [
		'procurementCommonCreateAccrualTransactionService',
		function (transactionService) {
			return new transactionService('procurement/stock/accrual/transaction');
		}
	]);

})(angular, globals);
