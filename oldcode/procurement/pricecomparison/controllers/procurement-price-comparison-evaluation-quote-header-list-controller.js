/**
 * created by miu 07/26/2022
 *
 */
(function (angular) {
	'use strict';
	angular.module('procurement.pricecomparison').controller('procurementPricecomparisonEvaluationQuoteHeaderListController', [
		'_', '$scope', 'platformGridAPI', 'basicsCommonDialogGridControllerService', 'procurementContextService',
		'procurementPriceComparisonItemEvaluationService',
		function (_, $scope, platformGridAPI, basicsCommonDialogGridControllerService, moduleContext,
			dataService) {

			$scope.gridId = '11f29762f8ab4e8ab39ab6cb3da231df';
			$scope.grid = {
				state: $scope.gridId
			};
			$scope.data = {
				state: $scope.gridId
			};

			let columnsDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'isChecked',
								field: 'IsChecked',
								formatter: 'boolean',
								editor: 'boolean',
								name: 'Select',
								name$tr$: 'basics.common.checkbox.select',
								width: 80,
								validator: onChange,
							}, {
								id: 'qtnCode',
								field: 'QuoteHeaderId',
								name: 'Reference Code',
								name$tr$: 'cloud.common.entityReferenceCode',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Quote',
									displayMember: 'Code'
								},
								searchable: true
							}, {
								id: 'qtnDescription',
								field: 'QuoteHeaderId',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Quote',
									displayMember: 'Description'
								},
								searchable: true
							}, /* {
								id: 'businessPartnerFk',
								field: 'BusinessPartnerId',
								name: 'Business Partner',
								name$tr$: 'cloud.common.entityBusinessPartner',
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: false,
										displayMember: 'BusinessPartnerName1'
									},
									directive: 'procurement-price-comparison-item-bp-quote-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Quote',
									displayMember: 'BusinessPartnerName1'
								},
								searchable: true
							}, */
							{
								id: 'businessPartnerFk',
								field: 'BusinessPartnerId',
								name: 'Business Partner',
								name$tr$: 'cloud.common.businessPartner',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BusinessPartner',
									displayMember: 'BusinessPartnerName1'
								}
							}, {
								id: 'qtnVersion',
								field: 'QuoteHeaderId',
								name: 'Version',
								name$tr$: 'cloud.common.entityVersion',
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: false,
										displayMember: 'QuoteVersion'
									},
									directive: 'procurement-price-comparison-item-bp-quote-lookup'
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

			let selectedItems = dataService.quoteHeaders();

			function onChange(item, isChecked) {
				let quoteHeader = _.find(selectedItems, {Id: item.Id});
				if (!quoteHeader) {
					if (isChecked === true) {
						selectedItems.push(item);
					}
				} else {
					if (isChecked === false) {
						_.remove(selectedItems, function (selectedItem) {
							return selectedItem.Id === item.Id;
						});
					}
				}
				dataService.quoteHeaders(selectedItems);
			}

			let gridConfig = {
				uuid: $scope.gridId,
				lazyInit: true,
				options: {
					skipPermissionCheck: true,
					collapsed: false,
					indicator: true
				}
			};
			basicsCommonDialogGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);

		}]);
})(angular);