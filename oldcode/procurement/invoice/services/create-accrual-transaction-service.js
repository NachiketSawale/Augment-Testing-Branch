/**
 * Created by lcn on 02/10/2025.
 */
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.invoice';

	angular.module(moduleName).factory('procurementInvoiceCreateAccrualTransactionService', [
		'procurementCommonCreateAccrualTransactionService',
		function (transactionService) {
			return new transactionService('procurement/invoice/accrual/transaction');
		}
	]);

})(angular, globals);
