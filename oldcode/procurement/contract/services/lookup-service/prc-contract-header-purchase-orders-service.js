/**
 * Created by wwa on 11/8/2016.
 */
(function (angular) {
	'use strict';
	/* global globals, _ */
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).constant('purchaseOrderType',{
		purchaseOrder: 1,
		callOff: 2,
		changeOrder: 3,
		frameworkContract: 4,
		frameworkContractCallOff: 5
	});

	angular.module(moduleName).factory('contractHeaderPurchaseOrdersDataService', ['$q', '$http', 'platformTranslateService', 'purchaseOrderType', 'PlatformMessenger', 'procurementContextService', 'basicsLookupdataLookupDescriptorService',
		function ($q, $http, platformTranslateService, purchaseOrderType, PlatformMessenger, procurementContextService, basicsLookupdataLookupDescriptorService) {

			var items = [
				{
					Id: purchaseOrderType.purchaseOrder,
					Description: 'Purchase Order',
					Description$tr$: 'procurement.contract.purchaseOrders.purchaseOrder'
				},
				{
					Id: purchaseOrderType.callOff,
					Description: 'Call Off',
					Description$tr$: 'procurement.contract.purchaseOrders.callOff'
				},
				{
					Id: purchaseOrderType.changeOrder,
					Description: 'Change Order',
					Description$tr$: 'procurement.contract.purchaseOrders.changeOrder'
				},
				{
					Id: purchaseOrderType.frameworkContract,
					Description: 'Framework Contract',
					Description$tr$: 'procurement.contract.purchaseOrders.frameworkContract'
				},
				{
					Id: purchaseOrderType.frameworkContractCallOff,
					Description: 'Framework Contract Call Off',
					Description$tr$: 'procurement.contract.purchaseOrders.frameworkContractCallOff'
				}
			];
			// reloading translation tables
			platformTranslateService.translationChanged.register(function () {
				platformTranslateService.translateObject(items);
			});

			var purchaseUpdatedMessage = new PlatformMessenger();

			/*
			*
			*If "Is Framework" is true  => "Framework Contract"
			*If "Is Framework" is false and ("Framework Wic Group" is not null or "Framework Material Catalog" is not null)  => "Framework Contract Call Off"
			*If "Basis Contract" and "Change Request" is null                  => "Purchase Order"
			*If "Basis Contract" is not null and "Change Request'" is null     => "Call Off"
			*If "basis Contract" is not null and "Change Request" is not null  => "Change Order"
			*If "basis Contract" is null and "Change Request" is not null      => "Change Order"
			 * */
			function updatePurchaseOrders(entity) {
				if (entity.IsFramework) {
					entity.PurchaseOrders = purchaseOrderType.frameworkContract;
				}
				else if (!entity.IsFramework && (entity.BoqWicCatFk || entity.MaterialCatalogFk)) {
					entity.PurchaseOrders = purchaseOrderType.frameworkContractCallOff;
				}
				else if (!entity.ContractHeaderFk){
					entity.PurchaseOrders = purchaseOrderType.purchaseOrder;
				}
				else if (entity.ContractHeaderFk && !entity.ProjectChangeFk) {
					entity.PurchaseOrders = purchaseOrderType.callOff;
					updatePrcItems(entity);
				}
				else{
					entity.PurchaseOrders = purchaseOrderType.changeOrder;
				}
				purchaseUpdatedMessage.fire(purchaseUpdatedMessage, {contract: entity});
			}

			function isChangeOrder(entity) {
				return entity.PurchaseOrders === purchaseOrderType.changeOrder;
			}

			function isCallOff(entity) {
				return entity.PurchaseOrders === purchaseOrderType.callOff;
			}

			function isFramework(entity) {
				return entity.PurchaseOrders === purchaseOrderType.frameworkContract || entity.IsFramework;
			}

			function isFrameworkByWicNMdcCatalog(entity) {
				return (!entity.ConHeaderFk && (entity.BoqWicCatFk || entity.MaterialCatalogFk));
			}

			function isFrameworkContractCallOffByWic(entity) {
				return (!entity.ConHeaderFk && (entity.BoqWicCatFk));
			}

			function isFrameworkContractCallOffByMdc(entity) {
				return (!entity.ConHeaderFk && (entity.MaterialCatalogFk));
			}

			function updatePrcItems(contract) {
				var prcItemService = procurementContextService.getItemDataService();
				var promises = [];
				promises.push($http.get(globals.webApiBaseUrl + 'procurement/contract/header/getmaterialids?conHeaderId=' + contract.ContractHeaderFk));
				let contractLookups = basicsLookupdataLookupDescriptorService.getData('conheaderview');
				var basicsContract;
				if (contractLookups) {
					basicsContract = _.find(contractLookups, {Id: contract.ContractHeaderFk});
				}
				promises.push($http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/listbyheaders', {
					params: {headerIds: (basicsContract ? [basicsContract.PrcHeaderId] : [-1])}
				}));
				$q.all(promises).then(function (res) {
					var toDeleteList = prcItemService.getList().filter(function (item) {
						if (item.MdcMaterialFk) {
							return !res[0].data.some(function (mid) {
								return mid === item.MdcMaterialFk;
							});
						}
						else if (!item.MdcMaterialFk && item.Description1) {
							var basicsNoMaterialItems = _.filter(res[1].data, function (i) {
								return !i.MdcMaterialFk;
							});
							var relatedItem = _.find(basicsNoMaterialItems, {Description1: item.Description1});
							return !relatedItem;
						}
						return true;
					});
					prcItemService.setSelectedEntities(toDeleteList);
					prcItemService.deleteEntities(toDeleteList);
				});
			}

			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(items);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var item = _.find(items, {Id: value});
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				},
				updatePurchaseOrders: updatePurchaseOrders,
				purchaseUpdatedMessage: purchaseUpdatedMessage,
				isChangeOrder: isChangeOrder,
				isCallOff: isCallOff,
				isFramework: isFramework,
				isFrameworkByWicNMdcCatalog: isFrameworkByWicNMdcCatalog,
				isFrameworkContractCallOffByWic: isFrameworkContractCallOffByWic,
				isFrameworkContractCallOffByMdc: isFrameworkContractCallOffByMdc
			};
		}
	]);

})(angular);