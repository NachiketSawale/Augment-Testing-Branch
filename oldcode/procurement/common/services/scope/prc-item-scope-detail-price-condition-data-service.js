/**
 * Created by wui on 10/17/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeDetailPriceConditionDataService', prcItemScopeDetailPriceConditionDataService);

	prcItemScopeDetailPriceConditionDataService.$inject = ['basicsMaterialPriceConditionFactoryDataService', 'procurementCommonServiceCache', 'procurementContextService','PlatformMessenger','platformRuntimeDataService'];

	function prcItemScopeDetailPriceConditionDataService(basicsMaterialPriceConditionFactoryDataService, procurementCommonServiceCache, procurementContextService,PlatformMessenger,platformRuntimeDataService) {

		function constructor(parentService) {
			var service = basicsMaterialPriceConditionFactoryDataService.createService(parentService, {
				moduleName: procurementContextService.getMainService().name + 'prcItemScopeDetailPriceConditionDataService',
				route: 'procurement/common/item/scope/detail/pricecondition/',
				readonly: false,
				itemName: 'PrcItemScopeDetailPc',
				headerService: procurementContextService.getLeadingService(),
				onCalculateDone: function (scopeDetail, priceConditionFk, total, totalOc) {
					if(parentService.validationService){
						var validationService = parentService.validationService();
						validationService.updatePriceExtraAndOc(scopeDetail, total, totalOc);
						parentService.markItemAsModified(scopeDetail);
					}

				},
				getExchangeRate: function () {
					var leadingService = procurementContextService.getMainService();
					return leadingService.getSelected().ExchangeRate;
				},
				getParentDataContainer: parentService.getServiceContainer
			});
			var setReadonlyor;
			var canItemTypeEdit;
			service.getReadOnly = function () {
				return !setReadonlyor();
			};

			setReadonlyor = function () {
				var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
				if (getModuleStatusFn) {
					var status = getModuleStatusFn();
					if (status) {
						return !(status.IsReadOnly || status.IsReadonly);
					}

				}
				return false;
			};

			canItemTypeEdit = function () {
				var parentItem;
				if(parentService.getItemName()==='PrcItemScopeDetail'){
					parentItem = parentService.parentService().parentService().getSelected();
				}else {
					parentItem = parentService.getSelected();
				}
				if (parentItem) {
					let itemTypeFk = parentItem.BasItemTypeFk;
					if (itemTypeFk === 7) {
						return false;
					} else {
						return true;
					}
				}
				return false;
			};
			var canCreate = service.canCreate;
			service.canCreate = function () {
				return canCreate() && setReadonlyor() && canItemTypeEdit();
			};
			var canDelete = service.canDelete;
			service.canDelete = function () {
				return canDelete() && setReadonlyor() && canItemTypeEdit();
			};
			service.readonlyFieldsByItemType=(entity,itemTypeFk,g)=>{
				let columns = Object.keys(entity);
				_.forEach(columns, (item) => {
					if(itemTypeFk=== 7){
						platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);}else{
						platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
					}
				});
			};
			service.updateToolsEvent = new PlatformMessenger();
			return service;
		}

		return procurementCommonServiceCache.registerService(constructor, 'prcItemScopeDetailPriceConditionDataService');
	}
})(angular);
