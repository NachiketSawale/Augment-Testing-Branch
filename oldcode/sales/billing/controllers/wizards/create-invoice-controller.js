/**
 * Created by lcn on 20/12/2024.
 */

(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';

	angular.module(moduleName).controller('salesBillingCreateInterCompanyInvoiceController', [
		'$scope', 'procurementCommonCreateInterCompanyFactoryController', 'salesBillingInterCompanyDrillDownService',
		function ($scope, factoryController, billInterCompanyDrillDownService) {

			const lookupUpdateArray = ['customer', 'supplier', 'InvHeaderChained', 'SalesBilling'];
			return factoryController.create({
				$scope: $scope,
				translateSource: 'sales.billing.wizard.createInterCompanyInvoice.',
				contextUrlSuffix: 'procurement/invoice/intercompany/',
				drillDownFactoryService: billInterCompanyDrillDownService,
				gridId: 'B50E0CA7E666428D81445680CCC937E5',
				lookupUpdateArray: lookupUpdateArray
			});
		}
	]);
})(angular);

