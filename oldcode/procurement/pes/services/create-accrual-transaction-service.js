/**
 * Created by lcn on 02/10/2025.
 */
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesCreateAccrualTransactionService', [
		'procurementCommonCreateAccrualTransactionService',
		function (transactionService) {
			return new transactionService('procurement/pes/accrual/transaction');
		}
	]);

})(angular, globals);
