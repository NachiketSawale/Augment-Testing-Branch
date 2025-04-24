/**
 * Created by xia on 7/24/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainCostGroupFactory', ['platformGridAPI', 'platformDataServiceFactory', 'basicsCostGroupDataServiceFactory', function (platformGridAPI, platformDataServiceFactory, basicsCostGroupDataServiceFactory) {

		var factoryService = {};

		factoryService.createService = function (parentService) {

			var createOptions = {
				dataLookupType: 'BoqItem2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.BoqHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return basicsCostGroupDataServiceFactory.createService('BoQ', parentService, createOptions);
			/*
							var serviceFactoryOptions = {
								 flatLeafItem: {
									  module: moduleName,
									  httpRead: {
											route: globals.webApiBaseUrl + 'boq/main/boqcostgroup/',
											endRead: 'list',
											usePostForRead: true,
											initReadData: function(readData) {
												 var parentItemSelected = parentService.getSelected();
												 if(parentItemSelected) {
													  readData.BoqItemId = parentItemSelected.Id;
													  readData.BoqHeaderId = parentItemSelected.BoqHeaderFk;
												 }
											}
									  },
									  httpCreate:
									  {
											route: globals.webApiBaseUrl + 'boq/main/boqcostgroup/',
											endCreate: 'create'
									  },
									  entityRole: {
											leaf:
											{
												 itemName: 'CostGroup',
												 parentService: parentService
											}
									  },
									  presenter: {
											list: {
												 incorporateDataRead: function (itemList, data) {
													  return serviceContainer.data.handleReadSucceeded(itemList, data);
												 }
											}
									  },
									  useItemFilter: true
								 }
							};

							var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

							var data = serviceContainer.data;
							var service = serviceContainer.service;

							serviceContainer.data.doesRequireLoadAlways = true;

							var cellChangeHandler = function(service, parentItem, col){
								 var costGroupCatId = col.costGroupCatId;

								 /!* delete *!/
								 var boqItem2CostGroup = _.find(service.getList(), { BoqItemFk : parentItem.Id, CostGroupCatFk : costGroupCatId});

								 if(boqItem2CostGroup){
									  if(parentItem[col.field]){
											/!* update *!/
											boqItem2CostGroup.CostGroupFk = parentItem[col.field];
											service.markItemAsModified(boqItem2CostGroup);
									  }else{
											/!* delete *!/
											service.deleteItem(boqItem2CostGroup);
									  }
								 }else{
									  /!* add *!/
									  if(parentItem[col.field]){
											service.createItem().then(function(newItem){
												 newItem.BoqItemFk = parentItem.Id;
												 newItem.BoqHeaderFk = parentItem.BoqHeaderFk;
												 newItem.CostGroupFk = parentItem[col.field];
												 newItem.CostGroupCatFk = costGroupCatId;
											});
									  }
								 }
							};

							function onCellChange(e, args) {
								 var col = args.grid.getColumns()[args.cell];
								 if (col.field.indexOf('costGroup_') > -1) {
									  cellChangeHandler && cellChangeHandler(service, args.item, col);
								 }
							}

							service.registerCellChangedEvent = function(gridId){
								 platformGridAPI.events.register(gridId, 'onCellChange', onCellChange);
							};

							service.unregisterCellChangedEvent = function(gridId){
								 platformGridAPI.events.unregister(data.gridId, 'onCellChange', onCellChange);
							};

							return service; */
		};

		return factoryService;
	}]);
})(angular);
