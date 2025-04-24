(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialPriceConditionDataServiceNew', ['basicsMaterialPriceConditionFactoryDataService', 'basicsMaterialRecordService',
		'platformModuleStateService', 'basicsCommonReadOnlyProcessor', '$injector','platformObjectHelper',
		function (priceConditionDataService, basicsMaterialRecordService, platformModuleStateService, basicsCommonReadOnlyProcessor,$injector,platformObjectHelper) {
		var service =  priceConditionDataService.createService(basicsMaterialRecordService, {
			moduleName: 'basicsMaterialRecordService',
			route: 'basics/material/pricecondition/',
			readonly: false,
			itemName:'MaterialPriceCondition',
			onCalculateDone: function (material, priceConditionFk, total,totalOc, vatPercent,field) {
				var itemService = basicsMaterialRecordService;
				material.PriceExtra = total;
				// material.PrcPriceConditionFk = material.PrcPriceconditionFk = priceConditionFk;
				itemService.recalculateCost(material,null,field);

				// workaround to ensure the updated item in update data for (defect#67169)
				var modState = platformModuleStateService.state(itemService.getModule());
				var elemState = itemService.assertPath(modState.modifications);
				elemState.Material = material;
			},
			getExchangeRate: function () {
				return 1; // No foreign currency in material module, just return 1.
			},
			getParentDataContainer: basicsMaterialRecordService.getServiceContainer
		}
		);

		var currtBoqMainService = null;
		var currtBoqContainerScope = null;
		service.setCurrtBoqMainSerivce = function (boqMainService){
			currtBoqMainService = boqMainService;
		};
		service.setSCurrtBoqContainerScope = function(scope){
				currtBoqContainerScope = scope;
		};

		service.boqPriceConditionItemChanged = function (priceConditionFk) {
			if (currtBoqMainService) {
				let boqMainPriceConditionCommonService = $injector.get('boqMainPriceConditionCommonService');
				let priceConditionDataService = boqMainPriceConditionCommonService.getPriceConditionServiceByModule(currtBoqMainService.getModuleName());
				if (priceConditionDataService) {
					let boqItem = currtBoqMainService.getCurrentSelectEntity();
					boqItem.PrcPriceConditionFk = priceConditionFk;
					boqItem.PrcPriceconditionFk = priceConditionFk;
					currtBoqMainService.isLoading = priceConditionDataService.isLoading = currtBoqContainerScope.isLoading = true;
					currtBoqMainService.markItemAsModified(boqItem);
					return currtBoqMainService.priceConditionSelectionChanged.fire(priceConditionFk, boqItem).then(() => {
						return currtBoqMainService.getHeaderService().update().then(() => {
							return priceConditionDataService.load();
						});
					}).then(function () {
						currtBoqMainService.isLoading = priceConditionDataService.isLoading = currtBoqContainerScope.isLoading = false;
					});
				}
			}
		};

		var currtItemMainSerivce = null;
		var currtItemContainerScope = null;
		service.setCurrtItemMainSerivce = function (itemMainService){
			if (!itemMainService) {
				if (currtItemMainSerivce && Object.prototype.hasOwnProperty.call(currtItemMainSerivce, 'setItemLoading')) {
					delete currtItemMainSerivce.setItemLoading;
				}
			}
			currtItemMainSerivce = itemMainService;
			if (currtItemMainSerivce) {
				currtItemMainSerivce.setItemLoading = function setItemLoading(isLoading) {
					if (currtItemContainerScope) {
						currtItemContainerScope.isLoading = isLoading;
					}
				};
			}
		};
		service.setSCurrtItemContainerScope = function(scope){
			currtItemContainerScope = scope;
		};

		service.itemPriceConditionItemChanged = function (priceConditionFk) {
			if (currtItemMainSerivce) {
				var item = currtItemMainSerivce.getSelected();
				item.PrcPriceConditionFk = priceConditionFk;
				item.PrcPriceconditionFk = priceConditionFk;
				currtItemMainSerivce.reloadPriceCondition(item, priceConditionFk);
			}
		};
		
		var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'basicsPriceConditionStandardConfigurationService',
			readOnlyFields: []
		});
		service.updateReadOnly = function(item) {
			if (!item) {
				return;
			}
			if (basicsMaterialRecordService.isReadonlyMaterial()) {
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
			return basicsMaterialRecordService.isReadonlyMaterial();
		};

		return service;
	}]);
})(angular);