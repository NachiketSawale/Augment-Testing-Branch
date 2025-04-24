/**
 * Created by clv on 5/29/2018.
 */
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,Map */
	var moduleName = 'procurement.pes';
	angular.module(moduleName).factory('procurementPesItemPriceConditionDataService', procurementPesItemPriceConditionDataService);
	procurementPesItemPriceConditionDataService.$inject = [
		'$http',
		'$injector',
		'basicsMaterialPriceConditionFactoryDataService',
		'procurementContextService',
		'platformModuleStateService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPesHeaderService',
		'platformRuntimeDataService',
		'$q',
		'PlatformMessenger'];
	function procurementPesItemPriceConditionDataService(
		$http,
		$injector,
		priceConditionFactoryDataService,
		moduleContext,
		platformModuleStateService,
		basicsLookupdataLookupDescriptorService,
		pesHeaderService,
		platformRuntimeDataService,
		$q,
		PlatformMessenger
	){
		var parentService = $injector.get('procurementPesItemService');
		var service = priceConditionFactoryDataService.createService(parentService, {
			moduleName: moduleName,
			headerService: moduleContext.getMainService(),
			route: 'procurement/pes/item/pricecondition/',
			endCreate: 'createnew',
			readonly: function () {
				return moduleContext.isReadOnly;
			},
			onCalculateDone: function (item, priceConditionFk, total, totalOc) {
				item.PriceExtra = total;
				item.PriceExtraOc = totalOc;
				// item is PesItem .
				// it almost execute here when validate pes price*, priceConditionFk, prcItemFk, and so on.
				// Task#92787.
				if (!item.calculateTotalLater) {
					var notRecalTotalAndGross = false;
					var isResetPriceExtra = true;
					parentService.calculateTotalAndVatAndGross(item, notRecalTotalAndGross, isResetPriceExtra);
					parentService.markItemAsModified(item);
					// workaround to ensure the updated item in update data for (defect#67169)
					var modState = platformModuleStateService.state(parentService.getModule());
					var elemState = parentService.assertPath(modState.modifications);
					/** @namespace elemState.PrcItemToSave */
					_.find(elemState.ItemToSave, {MainItemId: item.Id}).Item = item;
				}
			},
			itemName: 'PesItemPriceCondition',
			getExchangeRate: function () {
				var leadingService = moduleContext.getLeadingService();
				if (leadingService && leadingService.getSelected) {
					return leadingService.getSelected().ExchangeRate;
				}
				return 1;
			}
		});

		service.priceConditionMap = createMapCache(service.priceConditionMap);
		function createMapCache(map) {
			if(map) {
				return map;
			}
			else {
				return new Map();
			}
		}

		function readBasItemTypeFk(parentItem) {
			return $q.when($http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/getbyid?id=' + parentItem.PrcItemFk));
		}

		service.readBasItemTypeFk = readBasItemTypeFk;
		service.canEdit = false;

		service.canDataReadonly = ()=>{
			let parentItem  = parentService.getSelected();
			if (parentItem && parentItem.PrcItemFk) {
				readBasItemTypeFk(parentItem).then((item)=>{
					if(!_.isNil(item.data)){
						let prctItem = item.data;
						if (prctItem.BasItemTypeFk === 7) {
							let itemList = service.getList();
							_.forEach(itemList,(item)=>{
								service.readonlyFieldsByItemType(item,7);
							});
							setTimeout(()=>{
								readonlyElement(true);
								service.canEdit = false;
							},200);
						}else {
							service.canEdit = true;
							service.canCreate();
							let itemList = service.getList();
							_.forEach(itemList,(item)=>{
								service.readonlyFieldsByItemType(item,1);
							});
							setTimeout(() => {
								readonlyElement(false);
							}, 200);
						}
					}else{
						let itemList = service.getList();
						_.forEach(itemList,(item)=>{
							service.readonlyFieldsByItemType(item,1);
						});
						setTimeout(()=>{
							readonlyElement(false);
							service.canEdit = false;
						},200);
						service.canEdit = true;
						return true;
					}
				});
			}
		};

		function readonlyElement(isReadonly) {
			$('#fb2e7177d6c041d384f8b3009351840d').find('.column-id_isactivated').find('input[type=checkbox]').attr('disabled',isReadonly);
			$('#fb2e7177d6c041d384f8b3009351840d').find('.column-id_prcpriceconditiontypefk').find('input').attr('disabled',isReadonly);
			$('#fb2e7177d6c041d384f8b3009351840d').find('.column-id_prcpriceconditiontypefk').find('button').attr('disabled',isReadonly);
			if(isReadonly){
				$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('input').attr('disabled','disabled');
				$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('button').attr('disabled','disabled');
			}else{
				$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('input').removeAttr('disabled');
				$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('button').removeAttr('disabled');
			}
		}

		service.readonlyFieldsByItemType=(entity,itemTypeFk)=>{
			let columns = Object.keys(entity);
			_.forEach(columns, (item) => {
				if(itemTypeFk=== 7){
					platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
				}else{
					platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
				}
			});
		};

		function clearCache() {
			service.priceConditionMap.clear();
		}
		service.getPriceConditionCache = function () {
			return service.priceConditionMap;
		};
		service.setPriceConditionCache = function (parentId, items) {
			return service.priceConditionMap.set(parentId, items);
		};

		service.loadSubItemList = function () {
			var selectedPesItem = parentService.getSelected();
			service.setLastLoadedParentItem(selectedPesItem);
			if(selectedPesItem) {
				if (service.priceConditionMap.has(selectedPesItem.Id)) {
					var readData = service.priceConditionMap.get(selectedPesItem.Id);
					service.data.itemList.length = 0;
					_.forEach(readData, function (item) {
						service.data.itemList.push(item);
					});
					service.data.listLoaded.fire();
					// service.setList(service.priceConditionMap.get(selectedPesItem.Id));
				}
				else {
					var url = globals.webApiBaseUrl + 'procurement/pes/item/pricecondition/list';
					$http.get(url + '?mainItemId=' + selectedPesItem.Id).then(function (result) {
						if (service.priceConditionMap.has(selectedPesItem.Id) && (!result.data.Main || !result.data.Main.length)) {
							return true;
						}
						else {
							service.data.doClearModifications(null, service.data);
							service.data.selectedItem = null;
							service.data.itemList.length = 0;
							_.forEach(result.data.Main, function (item) {
								service.data.itemList.push(item);
							});
							service.data.listLoaded.fire();
							service.priceConditionMap.set(selectedPesItem.Id, result.data.Main);
							basicsLookupdataLookupDescriptorService.attachData(result.data);
						}
					});
				}
			}
			if(parentService){
				let parentSelected = parentService.getSelected();
				if(parentSelected && parentSelected.PrcItemFk){
					$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/getbyid?id=' + parentSelected.PrcItemFk).then(function (response) {
						let prctItem = response.data;
						if (prctItem.BasItemTypeFk === 7) {
							service.canEdit = false;
							let itemList = service.getList();
							_.forEach(itemList,(item)=>{
								service.readonlyFieldsByItemType(item,prctItem.BasItemTypeFk);
							});
							$('#fb2e7177d6c041d384f8b3009351840d').find('.column-id_isactivated').find('input[type=checkbox]').attr('disabled',true);
						}else{
							service.canEdit = true;
							$('#fb2e7177d6c041d384f8b3009351840d').find('.column-id_isactivated').find('input[type=checkbox]').attr('disabled',false);
						}
					});
				}else{
					//service.canEdit = true;
					$('#fb2e7177d6c041d384f8b3009351840d').find('.column-id_isactivated').find('input[type=checkbox]').attr('disabled',false);
				}
			}
			service.gridRefresh();
		};

		if(parentService.getSelected()){
			service.canDataReadonly();
		}

		if(!service.priceConditionRegisteredFlag) {
			pesHeaderService.registerRefreshRequested(clearCache);
			pesHeaderService.registerSelectionChanged(clearCache);
			/* registerDeleted */
			var onEntityDeleted = function onEntityDeleted(e, deletedItems) {
				var firstItem = deletedItems[0];
				var optionCaches = service.priceConditionMap.get(firstItem.PesItemFk);
				if (optionCaches) {
					deletedItems.forEach(function (deletedItem) {
						_.remove(optionCaches, {'Id': deletedItem.Id});
					});
				}
			};
			service.registerEntityDeleted(onEntityDeleted);
			/* registerCreated */
			var onEntityCreated = function onEntityCreated(e, item) {
				var optionCaches = service.priceConditionMap.get(item.PesItemFk);
				if(!optionCaches) {
					optionCaches = [];
					service.priceConditionMap.set(item.PesItemFk, optionCaches);
				}
				var hasExist = _.find(optionCaches, {Id: item.Id});
				if (!hasExist) {
					optionCaches.push(item);
				}
			};
			service.registerEntityCreated(onEntityCreated);
			service.priceConditionRegisteredFlag = true;
		}

		service.mergeInUpdateData = function mergeInUpdateData(updateData) {
			if (updateData.PesItemPriceConditionToSave) {
				_.forEach(updateData.PesItemPriceConditionToSave, function (updateItem) {
					var priceConditions = service.priceConditionMap.get(updateItem.PesItemFk);
					var cacheItem = _.find(priceConditions, {Id : updateItem.Id});
					if (cacheItem) {
						angular.extend(cacheItem, updateItem);
					}
				});
				service.gridRefresh();
			}
		};

		var canCreate = service.canCreate;
		service.canCreate = function(){
			var parentService = service.parentService();
			if(parentService){
				if(angular.isFunction(parentService.canCreate) && !parentService.canCreate()){
					return false;
				}
				if(_.isBoolean(parentService.canCreate) && !parentService.canCreate){
					return false;
				}
			}
			return canCreate() && service.canEdit;
		};

		var canDelete = service.canDelete;
		service.canDelete = function(){
			var parentService = service.parentService();
			if(parentService){
				if(angular.isFunction(parentService.canDelete) && !parentService.canDelete()){
					return false;
				}
				if(_.isBoolean(parentService.canDelete) && !parentService.canDelete){
					return false;
				}
			}
			return canDelete() && service.canEdit;
		};
		service.updateToolsEvent = new PlatformMessenger();

		const headerService = parentService?.parentService();
		if (headerService?.onUpdateSucceeded) {
			headerService.onUpdateSucceeded.register(onHeaderServiceUpdated);

			function onHeaderServiceUpdated() {
				const parentPesItem = parentService.getSelected();
				if (parentPesItem) {
					service.priceConditionMap.clear();
					service.loadSubItemList();
				}
			}
		}
		return service;
	}

})(angular);