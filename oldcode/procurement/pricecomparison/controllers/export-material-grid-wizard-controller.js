(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonExportMaterialWizardGridController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for wizard 'Export Material(D94)' dialog grid.
	 */
	angular.module(moduleName).controller('procurementPriceComparisonExportMaterialWizardGridController', [
		'$scope', '$timeout', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
		'procurementPriceComparisonExportMaterialWizardGridService',
		function ($scope, $timeout, platformGridAPI, basicsCommonDialogGridControllerService, dataService) {
			var columnsDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'IsChecked',
								field: 'IsChecked',
								formatter: 'boolean',
								editor: 'boolean'
							},
							{
								id: 'statusFk',
								field: 'QuoteHeaderId',
								name: 'Status',
								sortable: true,
								name$tr$: 'cloud.common.entityState',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Quote',
									displayMember: 'StatusDescriptionInfo.Description',
									imageSelector: 'platformStatusIconService'
								}
							},
							{
								id: 'qtnCode',
								field: 'QuoteHeaderId',
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
								field: 'QuoteHeaderId',
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
								id: 'businessPartnerFk',
								field: 'QuoteHeaderId',
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
								id: 'DateQuoted',
								field: 'QuoteHeaderId',
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
								field: 'QuoteHeaderId',
								name: 'Version',
								name$tr$: 'cloud.common.entityVersion',
								sortable: true,
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-pricecomparison-quote-version-lookup',
									lookupOptions: {
										filterKey: 'procurement-pricecomparison-quote-version-lookup-filter',
										showClearButton: false
									}
								},
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
				uuid: 'AEC6A2213A6649D392258552DB9956E9',
				initCalled: false,
				grouping: false,
				parentProp: '',
				childProp: 'Children',
				cellChangeCallBack: onCellChangeCallBack
			};
			basicsCommonDialogGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);
			dataService.registerSelectionChanged(onCellChangeCallBack);
			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onCellChangeCallBack);
			});

			/**
			 * set only one base quote and it's change orders checked.
			 */
			function onCellChangeCallBack() {
				var selectedItem = dataService.getSelected();
				_.forEach(dataService.getTree(), function (base) {
					base.IsChecked = false;
					_.each(base.Children, function (child) {
						child.IsChecked = false;
					});
				});
				selectedItem.IsChecked = true;
				// refresh the grid
				platformGridAPI.grids.invalidate($scope.gridId);
			}
		}
	]);
})(angular);
