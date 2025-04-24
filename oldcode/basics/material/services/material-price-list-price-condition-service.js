/**
 * Created by chi on 6/1/2017.
 */
(function(angular){
	'use strict';
	/* global _ */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialPriceListPriceConditionDataService', basicsMaterialPriceListPriceConditionDataService);

	basicsMaterialPriceListPriceConditionDataService.$inject = ['basicsMaterialPriceConditionFactoryDataService',
		'basicsMaterialPriceListService', 'platformModuleStateService', 'basicsCommonReadOnlyProcessor'];

	function basicsMaterialPriceListPriceConditionDataService(basicsMaterialPriceConditionFactoryDataService,
		basicsMaterialPriceListService, platformModuleStateService, basicsCommonReadOnlyProcessor) {
		var service = basicsMaterialPriceConditionFactoryDataService.createService(basicsMaterialPriceListService, {
			moduleName: 'basicsMaterialPriceListService',
			route: 'basics/material/pricelistpricecondition/',
			readonly: false,
			itemName: 'MaterialPriceListCondition',
			onCalculateDone: function (priceList, priceConditionFk, total) {
				var itemService = basicsMaterialPriceListService;
				priceList.PriceExtras = total;
				itemService.calculateCost(priceList, false);

				// workaround to ensure the updated item in update data for (defect#67169)
				var modState = platformModuleStateService.state(itemService.getModule());
				var elemState = itemService.assertPath(modState.modifications);
				var found = _.find(elemState.MaterialPriceListToSave, {MainItemId: priceList.Id});
				if (found) {
					found.MaterialPriceList = priceList;
				}
			},
			getExchangeRate: function () {
				return 1; // No foreign currency in material module, just return 1.
			},
			getParentDataContainer: basicsMaterialPriceListService.getServiceContainer
		});

		var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'basicsPriceConditionStandardConfigurationService',
			readOnlyFields: []
		});
		service.updateReadOnly = function(item) {
			if (!item) {
				return;
			}
			if (basicsMaterialPriceListService.parentService().isReadonlyMaterial()) {
				readonlyProcessorService.setRowReadonlyFromLayout(item, true);
			}
		};

		service.canCreate = function () {
			return !service.getReadOnly();
		};

		service.canDelete = function () {
			var selected = service.getSelected();
			if (selected) {
				return !service.getReadOnly();
			}
			else {
				return false;
			}
		};

		service.getReadOnly = function () {
			return basicsMaterialPriceListService.parentService().isReadonlyMaterial();
		};

		return service;
	}
})(angular);