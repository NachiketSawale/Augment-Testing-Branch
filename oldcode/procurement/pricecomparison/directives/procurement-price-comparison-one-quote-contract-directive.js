(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(moduleName).directive('procurementPriceComparisonOneQuoteContract', [
		function () {
			var controller = ['$scope', '$timeout', 'basicsCommonDialogGridControllerService', 'procurementPriceComparisonOneQuoteContractService',
				function ($scope, $timeout, basicsCommonDialogGridControllerService, dataService) {// scope: inherit from parent

					var layout = {
						getStandardConfigForListView: function () {
							return {
								columns: [
									{
										id: 'businessPartnerFk',
										field: 'Id',
										name: 'Business Partner',
										name$tr$: 'cloud.common.entityBusinessPartner',
										width: 120,
										sortable: true,
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'Quote',
											displayMember: 'BusinessPartnerName1'
										},
										searchable: true
									},
									{
										id: 'qtnCode',
										field: 'Id',
										name: 'Reference Code',
										name$tr$: 'cloud.common.entityReferenceCode',
										sortable: true,
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'Quote',
											displayMember: 'Code'
										},
										width: 85,
										searchable: true
									},
									{
										id: 'qtnDescription',
										field: 'Id',
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription',
										sortable: true,
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'Quote',
											displayMember: 'Description'
										},
										searchable: true
									},
									{
										id: 'subTotal',
										field: 'subTotal',
										name: 'Subtotal',
										name$tr$: 'procurement.pricecomparison.compareSubtotal',
										width: 120,
										sortable: true,
										formatter: 'money',
										searchable: true
									},
									{
										id: 'grandTotal',
										field: 'grandTotal',
										name: 'Grand Total',
										name$tr$: 'procurement.pricecomparison.compareGrandTotal',
										width: 120,
										sortable: true,
										formatter: 'money',
										searchable: true
									},
									{
										id: 'statusFk',
										field: 'Id',
										name: 'Status',
										sortable: true,
										name$tr$: 'cloud.common.entityState',
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'Quote',
											displayMember: 'StatusDescriptionInfo.Translated',
											imageSelector: 'platformStatusIconService'
										}
									},
									{
										id: 'DateQuoted',
										field: 'Id',
										name: 'Date Submit',
										name$tr$: 'procurement.pricecomparison.compareSubmitDate',
										width: 120,
										sortable: true,
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'Quote',
											// displayMember: 'DateQuoted',
											displayMember: 'DateQuotedFormatted'
										},
										searchable: true
									},
									{
										id: 'qtnVersion',
										field: 'Id',
										name: 'Version',
										name$tr$: 'cloud.common.entityVersion',
										sortable: true,
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'Quote',
											displayMember: 'QuoteVersion'
										},
										searchable: true
									}
								]
							};
						}
					};

					var gridConfig = {
						initCalled: false,
						columns: [],
						grouping: false,
						parentProp: '',
						childProp: 'Children',
						uuid: 'fe88dbe0bfe63ab79eda81171277038e'
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
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/create-one-quote-contract-directive.html',
				controller: controller
			};
		}
	]);
})(angular);
