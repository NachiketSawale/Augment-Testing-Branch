/**
 * created by miu 08/20/2024
 *
 */
(function (angular) {
	'use strict';
	angular.module('procurement.pricecomparison').controller('procurementPricecomparisonEvaluationPrcItemListController', [
		'_',
		'$scope',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'procurementContextService',
		'procurementPriceComparisonItemEvaluationItemListService',
		'procurementPriceComparisonItemEvaluationService',
		'procurementPriceComparisonCommonService',
		function(
			_,
			$scope,
			platformGridAPI,
			basicsCommonDialogGridControllerService,
			moduleContext,
			dataService,
			itemEvaluationService,
			commonService) {

			$scope.gridId = '11f29762f8ab4e8ab39ab6cb3dadddf1';
			$scope.grid = {
				state: $scope.gridId
			};
			$scope.data = {
				state: $scope.gridId
			};

			let columnsDef = {
				getStandardConfigForListView: function() {
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
								name: 'Quote Code',
								name$tr$: 'procurement.common.quoteCode',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Quote',
									displayMember: 'Code'
								},
								readonly: true,
								hidden: false,
								width: 85
							}, {
								id: 'qtnDescription',
								field: 'QuoteHeaderId',
								name: 'Description',
								name$tr$: 'procurement.common.quoteDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Quote',
									displayMember: 'Description'
								},
								readonly: true,
								hidden: false,
								width: 120
							}, {
								id: 'ItemNo',
								field: 'Itemno',
								name: 'Item No.',
								name$tr$: 'procurement.common.prcItemItemNo',
								readonly: true,
								hidden: false,
								width: 120
							},{
								id: 'ItemDescription',
								field: 'Description1',
								name: 'Item Description',
								name$tr$: 'procurement.common.prcItemDescription',
								readonly: true,
								hidden: false,
								width: 120
							}, {
								id: 'Price',
								field: 'Price',
								name: 'Price',
								name$tr$: 'cloud.common.entityPrice',
								readonly: true,
								hidden: false,
								formatter: commonService.formatter.moneyFormatter
							}, {
								id: 'Quantity',
								field: 'Quantity',
								name: 'Quantity',
								name$tr$: 'basics.common.Quantity',
								formatter: 'quantity',
								readonly: true,
								hidden: false,
								width: 100
							}, {
								id: 'UoM',
								field: 'BasUomFk',
								name: 'UoM',
								name$tr$: 'cloud.common.entityUoM',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'UoM',
									displayMember: 'Unit'
								},
								readonly: true,
								hidden: false,
								width: 100
							}, {
								id: 'Specification',
								field: 'Specification',
								name: 'Specification',
								name$tr$: 'cloud.common.EntitySpec',
								readonly: true,
								hidden: false,
								width: 150,
								domain: 'description',
								editor: 'description'
							}
						]
					};
				}
			};

			function onChange(item, isChecked) {
				let selectedItems = itemEvaluationService.selectedPrcItems();
				let prcItem = _.find(selectedItems, { Id: item.Id });
				if (!prcItem) {
					if (isChecked === true) {
						selectedItems.push(item);
					}
				} else {
					if (isChecked === false) {
						_.remove(selectedItems, function(selectedItem) {
							return selectedItem.Id === item.Id;
						});
					}
				}
				itemEvaluationService.selectedPrcItems(selectedItems);
			}

			let gridConfig = {
				uuid: $scope.gridId,
				lazyInit: true,
				enableConfigSave: false,
				options: {
					skipPermissionCheck: true,
					collapsed: false,
					indicator: true
				}
			};
			basicsCommonDialogGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);

			function onInitialized(){
				dataService.load();
			}

			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
			});
		}]);
})(angular);