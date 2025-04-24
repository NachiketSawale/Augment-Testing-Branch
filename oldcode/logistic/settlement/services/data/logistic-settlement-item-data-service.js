/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementItemDataService
	 * @description pprovides methods to access, create and update logistic settlement item entities
	 */
	myModule.service('logisticSettlementItemDataService', LogisticSettlementItemDataService);

	LogisticSettlementItemDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'logisticSettlementDataService', 'logisticSettlementItemReadOnlyProcessorService', 'logisticSettlementConstantValues'];

	function LogisticSettlementItemDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                           logisticSettlementDataService, logisticSettlementItemReadOnlyProcessorService, logisticSettlementConstantValues) {
		var self = this;

		function canCallBackFunc(){
			var result = true;
			var selected = logisticSettlementDataService.getSelected();
			if(selected && (logisticSettlementDataService.isReadOnly(selected) || logisticSettlementDataService.isRevision(selected))){
				result = false;
			}
			return result;
		}

		var logisticSettlementItemServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticSettlementItemDataService',
				entityNameTranslationID: 'logistic.settlement.settlementItemEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/settlement/item/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticSettlementDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canCallBackFunc, canCreateCallBackFunc: canCallBackFunc},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticSettlementDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'SettlementItems', parentService: logisticSettlementDataService}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'SettlementItemDto',
					moduleSubModule: 'Logistic.Settlement'
				}),logisticSettlementItemReadOnlyProcessorService]
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSettlementItemServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.articleChanged = new Platform.Messenger();
		serviceContainer.service.registerArticleChanged = function (callBackFn) {
			serviceContainer.data.articleChanged.register(callBackFn);
		};
		serviceContainer.service.unregisterArticleChanged = function (callBackFn) {
			serviceContainer.data.articleChanged.unregister(callBackFn);
		};
		serviceContainer.service.articleChanged = function articleChanged(e, entity) {
			serviceContainer.data.articleChanged.fire(e, entity);
		};

		serviceContainer.service.takeOverItem = function takeOverItem(entity){
			var data = serviceContainer.data;
			var dataEntity = data.getItemById(entity.Id, data);

			data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
			data.markItemAsModified(dataEntity, data);
		};


		serviceContainer.service.setPriceTotal = function setPriceTotal(entity, priceTotal) {
			if(entity.PriceTotal !== priceTotal) {
				entity.PriceTotal = priceTotal;
				logisticSettlementDataService.calculatePriceTotal(serviceContainer.service.getList());
			}
		};

		serviceContainer.service.setPriceTotalOc = function setPriceTotalOc (entity, priceTotalOc) {
			if(entity.PriceTotalOc !== priceTotalOc) {
				entity.PriceTotalOc = priceTotalOc;
				serviceContainer.service.setPriceTotal(entity, priceTotalOc / logisticSettlementDataService.getExchangeRate());
			}
		};

		serviceContainer.service.recalculatePricePortions = function recalculatePricePortions(exchangeRate){
			var data = serviceContainer.data;
			if(exchangeRate !== 0) {
				_.forEach(serviceContainer.data.itemList, function (item) {

					var sum = 0;
					if (item.SettlementItemTypeFk === logisticSettlementConstantValues.types.item.materialStock ||
							item.SettlementItemTypeFk === logisticSettlementConstantValues.types.item.materialNonStock)
					{
						sum =  item.PriceOrigCur / exchangeRate;
					} else {
						item.PricePortion1 = item.PriceOrigCur1 / exchangeRate;
						sum += item.PricePortion1;
						item.PricePortion2 = item.PriceOrigCur2 / exchangeRate;
						sum += item.PricePortion2;
						item.PricePortion3 = item.PriceOrigCur3 / exchangeRate;
						sum += item.PricePortion3;
						item.PricePortion4 = item.PriceOrigCur4 / exchangeRate;
						sum += item.PricePortion4;
						item.PricePortion5 = item.PriceOrigCur5 / exchangeRate;
						sum += item.PricePortion5;
						item.PricePortion6 = item.PriceOrigCur6 / exchangeRate;
						sum += item.PricePortion6;
					}
					item.PriceTotal = sum;
					item.PriceTotalQty = item.PriceTotal * item.Quantity;
					item.Price = item.PriceOrigCur / exchangeRate;
					data.markItemAsModified(item, data);
				});
			}
		};


	}
})(angular);
