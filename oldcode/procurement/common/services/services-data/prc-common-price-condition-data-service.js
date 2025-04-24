(function (angular) {
	'use strict';
	/* globals _ */

	angular.module('procurement.common').factory('procurementCommonPriceConditionService', [
		'basicsMaterialPriceConditionFactoryDataService',
		'procurementContextService',
		'platformModuleStateService',
		'procurementCommonServiceCache',
		'prcCommonItemCalculationHelperService',
		'PlatformMessenger',
		'platformRuntimeDataService',
		function (
			priceConditionDataService,
			moduleContext,
			platformModuleStateService,
			procurementCommonServiceCache,
			prcCommonItemCalculationHelper,
			PlatformMessenger,
			platformRuntimeDataService
		) {

			function constructor() {
				let roundingType = prcCommonItemCalculationHelper.roundingType;
				var parentService = moduleContext.getItemDataService();
				var service = priceConditionDataService.createService(parentService, {
					moduleName: moduleContext.getMainService().name,
					headerService: moduleContext.getMainService(),
					route: 'procurement/common/pricecondition/',
					readonly: function () {
						return moduleContext.isReadOnly;
					},
					onCalculateDone: function (prcItem, priceConditionFk, total, totalOc) {
						var itemService = parentService;
						prcItem.PriceExtra = prcCommonItemCalculationHelper.round(roundingType.PriceExtra, total);
						prcItem.PriceExtraOc = prcCommonItemCalculationHelper.round(roundingType.PriceExtraOc, totalOc);
						// prcItem.PrcPriceConditionFk = priceConditionFk;

						if (!prcItem.calculateTotalLater) {
							var isResetGross = true;
							var isResetPriceExtra = true;
							itemService.calculateTotal(prcItem, isResetGross, isResetPriceExtra);
							itemService.markItemAsModified(prcItem);
							// workaround to ensure the updated item in update data for (defect#67169)
							var modState = platformModuleStateService.state(itemService.getModule());
							var elemState = itemService.assertPath(modState.modifications);
							/** @namespace elemState.PrcItemToSave */
							_.find(elemState.PrcItemToSave, {MainItemId: prcItem.Id}).PrcItem = prcItem;
						}
					},
					getExchangeRate: function () {
						var leadingService = moduleContext.getMainService();
						return leadingService.getSelected().ExchangeRate;
					},
					getParentDataContainer: moduleContext.getItemDataContainer,
					readonlyAll: function () {
						var readonly = false;
						var leadingService = moduleContext.getLeadingService();
						if (leadingService && angular.isFunction(leadingService.isReadonlyWholeModule)){
							readonly = leadingService.isReadonlyWholeModule();
						}
						return readonly;
					}
				});
				var setReadonlyor;
				service.getReadOnly = function () {
					return !setReadonlyor();
				};

				setReadonlyor = function () {
					var enable = false;
					enable = !parentService.getReadOnly();

					if (enable) {
						var leadingService = moduleContext.getLeadingService();
						if (leadingService && angular.isFunction(leadingService.isReadonlyWholeModule)){
							enable = !leadingService.isReadonlyWholeModule();
						}
					}
					return enable;
				};

				var canCreate = service.canCreate;
				service.canCreate = function () {
					let selectedItem = parentService.getSelected();
					if(selectedItem) {
						let itemTypeFk = selectedItem.BasItemTypeFk;
						if (itemTypeFk === 7) {
							return false;
						}
					}
					return canCreate() && setReadonlyor();
				};
				var canDelete = service.canDelete;
				service.canDelete = function () {
					let selectedItem = parentService.getSelected();
					if(selectedItem) {
						let itemTypeFk = selectedItem.BasItemTypeFk;
						if (itemTypeFk === 7) {
							return false;
						}
					}
					return canDelete() && setReadonlyor();
				};

				service.isItemTypeReadonly = ()=>{

				};

				service.readonlyFieldsByItemType=(entity,itemTypeFk)=>{
					var enable = false;
					enable = service.getParentService().getReadOnly();
					let columns = Object.keys(entity);
					_.forEach(columns, (item) => {
						if(itemTypeFk=== 7 || enable){
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
						}else{
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
						}
					});
				};

				service.updateToolsEvent = new PlatformMessenger();

				return service;

			}

			return procurementCommonServiceCache.registerService(constructor, 'procurementCommonPriceConditionService');
		}]);
})(angular);