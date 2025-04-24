/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName='controlling.revrecognition';

	/**
     * @ngdoc service
     * @name modulSubModuleMainEntityNameDataService
     * @function
     * @requires platformDataServiceFactory
     *
     * @description
     * The root data service of the modul.submodule module.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('controllingRevenueRecognitionE2cItemService', ['globals','_','$http','$injector','PlatformMessenger','platformGridAPI','platformDataServiceFactory','controllingRevenueRecognitionImageProcessor','controllingRevenueRecognitionItemE2cReadonlyProcessor','ServiceDataProcessDatesExtension','controllingRevenueRecognitionHeaderDataService',
		function (globals,_,$http,$injector,PlatformMessenger,platformGridAPI,platformDataServiceFactory,prrItemE2cImageProcessor,prrItemE2cReadonlyProcessor,ServiceDataProcessDatesExtension,mainDataService) {

			var serviceOptions = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'controllingRevenueRecognitionE2cItemService',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/RevenueRecognition/itemE2c/',
						endRead: 'tree'
					},
					dataProcessor: [prrItemE2cImageProcessor,prrItemE2cReadonlyProcessor],
					presenter: {
						tree: {parentProp: 'ParentId', childProp: 'PrrItemE2cChildren'}
					},
					entitySelection: {},
					entityRole: {
						node: {
							itemName: 'PrrItemE2c',
							parentService: mainDataService
						}
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = container.service;
			service.prrItemAmountChanged = new PlatformMessenger();



			service.refreshItem=function(){
				var headerEntity=mainDataService.getSelected();
				if(headerEntity) {
					var prrHeaderId = headerEntity.Id;
					$http.get(globals.webApiBaseUrl + 'controlling/RevenueRecognition/itemE2c/refresh?mainItemId=' + prrHeaderId).then(function (/* response */) {
						service.load();
					});
				}
			};

			service.getParentPrrItem=function(prrItem){
				if(prrItem.ParentId) {
					return _.find(container.data.itemList, {Id: prrItem.ParentId});
				}
				else {
					return null;
				}
			};

			service.calcParentChain=function(item){
				var parentItem = service.getParentPrrItem(item);
				if(parentItem){
					parentItem.TotalCost= _.sumBy(parentItem.PrrItemE2cChildren, function (item) {
						return item.TotalCost;
					});
					service.calculateItem(parentItem);
					service.markItemAsModified(parentItem);
					if(parentItem.ParentId>0){
						service.calcParentChain(parentItem);
					}
				}
				service.gridRefresh();
			};

			service.calculateItem=function(entity){
				if(entity.TotalCost>0) {
					entity.ActualCostPercent = entity.ActualCost / entity.TotalCost * 100;
				}
				entity.CalculatedRevenue=(entity.ActualCost / entity.TotalCost)*entity.ContractedValue;
				entity.RevenueAccrual = entity.CalculatedRevenue - entity.ActualRevenue;
				if(entity.ContractedValue>0) {
					entity.RevenueAccrualPercent = entity.RevenueAccrual / entity.ContractedValue * 100;
				}
				entity.RevenueToComplete=entity.TotalCost-entity.ActualCost;
				entity.CalculatedRevenuePercent=entity.ActualCostPercent;
			};

		
			return service;
		}]);
})();
