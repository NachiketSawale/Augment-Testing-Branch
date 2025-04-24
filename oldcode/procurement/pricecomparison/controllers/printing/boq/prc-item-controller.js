(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(moduleName).controller('procurementPricecomparisonPrcItemController',
		['$scope', 'procurementPriceComparisonPrintSettingService', 'procurementPriceComparisonPrintConstants', 'platformGridAPI',
			'procurementtPricecomparisonPrcBoqItemTypeService', 'procurementtPricecomparisonPrcBoqItemType2Service', 'basicsCommonReadOnlyProcessor',
			function ($scope, printSettingService, printConstants, platformGridAPI,
				procurementtPricecomparisonPrcBoqItemTypeService, procurementtPricecomparisonPrcBoqItemType2Service, commonReadOnlyProcessor) {

				$scope.gridId2 = 'F47D1AA927604D7EAABE5CBCC0DEDFC9';
				$scope.gridId3 = '4759D4BC86CC454FABA90BB287CD9D58';

				var readOnlyProcessor = commonReadOnlyProcessor.createReadOnlyProcessor({
					readOnlyFields: ['DescriptionInfo.Description']
				});

				readOnlyProcessor.getCellEditable = function getCellEditable(item, model) {
					if (item && model) {
						return false;
					}
				};

				function getGridData(gridId) {
					var grid = platformGridAPI.grids.element('id', gridId);
					if (grid && grid.dataView && grid.dataView.getRows) {
						return grid.dataView.getRows();
					}
					return null;
				}

				function onCollectSetting() {
					var checkedItems = _.filter(getGridData($scope.gridId2), {IsChecked: true});
					var checkedBoqItemTypes = [];
					for (var k = 0; k < checkedItems.length; k++) {
						checkedBoqItemTypes.push(checkedItems[k].Id);
					}
					var checkedItems2 = _.filter(getGridData($scope.gridId3), {IsChecked: true});
					var checkedBoqItemTypes2 = [];
					for (var j = 0; j < checkedItems2.length; j++) {
						checkedBoqItemTypes2.push(checkedItems2[j].Id);
					}

					var config = {
						'item': {
							// "isPrintAdditionalSummary": $scope.printAdditionalSummary,
							'checkedItemTypes': checkedBoqItemTypes,
							'checkedItemTypes2': checkedBoqItemTypes2
						}
					};

					printSettingService.setCurrentGenericSetting(config);
				}

				printSettingService.onCollectSetting.register(onCollectSetting);

				$scope.$on('$destroy', function () {
					printSettingService.onCollectSetting.unregister(onCollectSetting);
				});

			}
		]);

})(angular);