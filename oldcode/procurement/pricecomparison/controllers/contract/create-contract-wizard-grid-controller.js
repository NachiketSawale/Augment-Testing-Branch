(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonCreateContractWizardGridController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for wizard 'create contract' dialog grid.
	 */
	angular.module(moduleName).controller('procurementPriceComparisonCreateContractWizardGridController', [
		'$scope', '$timeout', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
		'procurementPriceComparisonCreateContractWizardGridService',
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
									displayMember: 'StatusDescriptionInfo.Translated',
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
				uuid: '87DB302347E948F28B0BDB42B002C7C5',
				initCalled: false,
				grouping: false,
				parentProp: '',
				childProp: 'Children',
				cellChangeCallBack: onCellChangeCallBack
			};

			basicsCommonDialogGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);

			// default type (when quote has many requisitions, create seperate contract for each requisition)
			$scope.createContractType = 'createContracts';
			dataService.contractTypeData($scope.createContractType);
			$scope.$watch('createContractType', function (newValue, oldValue) {
				if (!angular.equals(newValue, oldValue)) {
					// store the contract type data into data service
					dataService.contractTypeData(newValue);
				}
			});

			dataService.registerSelectionChanged(onCurrentItemChanged);
			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onCurrentItemChanged);
			});

			/**
			 * set only one base quote and it's change orders checked.
			 */
			function onCellChangeCallBack() {
				var baseItem = dataService.getSelected();
				if (baseItem.CompareColumnFk) {
					return; // do nothing if child selected
				}

				_.each(dataService.getTree(), function (base) {
					base.IsChecked = false;
					_.each(base.Children, function (child) {
						child.IsChecked = false;
					});
				});

				baseItem.IsChecked = true;
				_.each(baseItem.Children, function (child) {
					child.IsChecked = true;
				});

				// refresh the grid
				platformGridAPI.grids.invalidate($scope.gridId);
			}

			function onCurrentItemChanged() {
				onCellChangeCallBack();
				$scope.qtnRequisitionCount = dataService.getQuoteRequisitionCount();
			}
		}
	]);
})(angular);
