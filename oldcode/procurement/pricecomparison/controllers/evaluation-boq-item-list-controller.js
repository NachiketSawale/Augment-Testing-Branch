/**
 * created by miu 08/20/2024
 *
 */
(function (angular) {
	'use strict';
	angular.module('procurement.pricecomparison').controller('procurementPricecomparisonEvaluationBoqItemListController', [
		'_',
		'$scope',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'procurementContextService',
		'procurementPriceComparisonItemEvaluationBoqListService',
		'procurementPriceComparisonItemEvaluationService',
		function(
			_,
			$scope,
			platformGridAPI,
			basicsCommonDialogGridControllerService,
			moduleContext,
			dataService,
			itemEvaluationService) {

			$scope.gridId = '11f29762f8ab4e8ab39ab6cb3dadddf2';
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
								width: 100
							}, {
								id: 'BoqLineTypeFk',
								field: 'BoqLineTypeFk',
								name: 'BoQ Line Type',
								name$tr$: 'cloud.common.boqLineType',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BoQLineType',
									displayMember: 'Description'
								},
								readonly: true,
								hidden: false,
								width: 100
							}, {
								id: 'Reference',
								field: 'Reference',
								name: 'Reference No.',
								name$tr$: 'cloud.common.referenceNo',
								formatter: 'description',
								readonly: true,
								hidden: false,
								width: 110
							}, {
								id: 'Brief',
								field: 'BriefInfo.Translated',
								name: 'Outline Specification',
								name$tr$: 'cloud.common.entityBriefInfo',
								formatter: 'description',
								readonly: true,
								hidden: false,
								width: 120
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
								id: 'Quantity',
								field: 'Quantity',
								name: 'Quantity',
								name$tr$: 'basics.common.Quantity',
								formatter: 'quantity',
								readonly: true,
								hidden: false,
								width: 100
							}
						]
					};
				}
			};

			function onChange(item, isChecked) {
				let selectedItems = itemEvaluationService.selectedBoqItems();
				let boqItem = _.find(selectedItems, { Id: item.Id });
				if (!boqItem) {
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
				itemEvaluationService.selectedBoqItems(selectedItems);
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