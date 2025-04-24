/**
 * Created by chi on 5/17/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).directive('procurementPriceComparisonSeperatePrcItemContract', [
		function () {
			var controller = ['$scope', '$translate', '$timeout',
				'basicsCommonDialogGridControllerService', 'procurementPriceComparisonSeperatePrcItemContractService',
				function ($scope, $translate, $timeout,
					basicsCommonDialogGridControllerService, dataService) {// scope: inherit from parent

					$scope.rfqHeaderInfo = dataService.getRfqHeaderInfo();
					$scope.htmlTranslate = {
						project: $translate.instant('procurement.pricecomparison.htmlTranslate.project'),
						rfq: $translate.instant('procurement.pricecomparison.htmlTranslate.rfq')
					};

					var gridConfig = {
						initCalled: false,
						columns: [],
						grouping: false,
						uuid: '5e7c84c72de74b1db623c986150c3866'
					};

					var layout = {
						getStandardConfigForListView: function getStandardConfigForListView() {
							return {
								columns: [
									{
										id: 'businessPartnerName1',
										field: 'businessPartnerName1',
										name$tr$: 'procurement.pricecomparison.businessPartnerName1',
										width: 250,
										sortable: true,
										formatter: 'description',
										searchable: true
									},
									{
										id: 'quantity',
										field: 'quantity',
										name: 'Item Quantity',
										name$tr$: 'procurement.pricecomparison.itemQuantity',
										width: 250,
										sortable: true,
										formatter: 'quantity',
										searchable: true
									},
									{
										id: 'total',
										field: 'total',
										name: 'Net Amount',
										name$tr$: 'procurement.pricecomparison.netAmount',
										width: 250,
										sortable: true,
										formatter: 'money',
										searchable: true
									}
								]
							};
						}
					};

					basicsCommonDialogGridControllerService.initListController($scope, layout, dataService, null, gridConfig);

					$timeout(function () {
						dataService.load();
					});
				}
			];

			return {
				restrict: 'A',
				scope: {}, // use parent scope, this directive is mostly used as a configured item into a form view
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/create-seperate-prcitem-contract-directive.html',
				controller: controller
			};
		}
	]);
})(angular);