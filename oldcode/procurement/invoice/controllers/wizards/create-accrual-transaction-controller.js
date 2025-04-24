/**
 * Created by lcn on 02/10/2025.
 */

(function (angular) {
	'use strict';

	const moduleName = 'procurement.invoice';

	angular.module(moduleName).controller('procurementInvoiceCreateAccrualTransactionController', [
		'$scope', 'procurementCommonCreateAccrualTransactionFactoryController', 'procurementInvoiceCreateAccrualTransactionService',
		function ($scope, factoryController, procurementInvoiceCreateAccrualTransactionService) {

			function canOkFunc() {
				const { entity } = $scope;
				return entity && !!entity.VoucherNo;
			}

			return factoryController.create({
				$scope,
				translateSource: 'procurement.invoice.wizard.createAccrualTransaction.',
				createAccrualTransactionService: procurementInvoiceCreateAccrualTransactionService,
				canOkFunc,
			});
		}
	]);
})(angular);


