(angular => {
	'use strict';
	/* global globals */
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsCommonStockProductDataService', StockProductDataService);
	StockProductDataService.$inject = ['$http', '$injector', 'PlatformMessenger', 'platformDialogService', 'cloudCommonGridService'];

	function StockProductDataService($http, $injector, PlatformMessenger, platformDialogService,cloudCommonGridService) {
		const cache = {
			ppsItem: null,
			stockInfo: [],
			ppsHeaders: [],
			masterProductTemplate: null,
			ppsProductTemplates: [],
			ppsProducts: [],
			init(stockInfo, ppsHeaders, ppsProdDescs, ppsItem, masterProductTemplate) {
				this.stockInfo = stockInfo;
				this.ppsHeaders = ppsHeaders;
				this.ppsProductTemplates = ppsProdDescs;
				this.ppsItem = ppsItem;
				this.masterProductTemplate = masterProductTemplate;
			},
			clear() {
				this.stockInfo.length = 0;
				this.ppsHeaders.length = 0;
				this.ppsProductTemplates.length = 0;
				this.ppsProducts.length = 0;
				this.masterProductTemplate = null;
			},
			getProductTemplates(ppsHeaderId) {
				const pdIds = this.stockInfo.filter(i => i.PpsHeaderId === ppsHeaderId).map(i => i.PpsProductTemplateId);
				return this.ppsProductTemplates.filter(i => i.MdcProductDescriptionFk === this.masterProductTemplate && pdIds.includes(i.Id));
			},
			getProductIds(ppsHeaderId, ppsProductTemplateId) {
				const productIds = this.stockInfo
					.filter(i => i.PpsHeaderId === ppsHeaderId && i.PpsProductTemplateId === ppsProductTemplateId)
					.map(i => i.PpsProductId);
				return productIds;
			},
			setProducts(products) {
				cache.ppsProducts = products;
			}
		};

		const dataItem = {
			PpsHeaderId: null,
			PpsProductTemplateId: null,
			AvailableQuantity: 0,
			QuantityToTake: 0,
			setAvailableQuantity() {
				if (!this.PpsHeaderId || !this.PpsProductTemplateId) {
					this.AvailableQuantity = 0;
				} else {
					this.AvailableQuantity = cache.getProductIds(this.PpsHeaderId, this.PpsProductTemplateId).length;
				}
			},
			isQuantityValid() {
				return 0 < this.QuantityToTake && this.QuantityToTake <= this.AvailableQuantity;
			},
			reset() {
				this.PpsHeaderId = this.PpsProductTemplateId = null;
				this.AvailableQuantity = this.QuantityToTake = 0;
			},
		};

		const onDataLoaded = new PlatformMessenger();

		this.registerDataLoaded = fn => {
			onDataLoaded.register(fn);
		};

		this.unregisterDataLoaded = fn => {
			onDataLoaded.unregister(fn);
		};

		function fireOnDataLoaded() {
			onDataLoaded.fire();
		}

		this.loadData = function (ppsItem, masterProductTemplate) {
			cache.clear();
			dataItem.reset();

			const queryStr = `?mdcMaterialId=${ppsItem.MdcMaterialFk}&ppsProductTemplateId=${ppsItem.ProductDescriptionFk}&siteId=${ppsItem.SiteFk}`;
			$http.get(globals.webApiBaseUrl + 'productionplanning/common/product/getstockproduct' + queryStr).then(res => {
				if (res.data) {
					cache.init(res.data.StockProductInfo, res.data.PpsHeaders, res.data.PpsProductTemplates, ppsItem, masterProductTemplate);
					fireOnDataLoaded();
				}
			});
		};

		this.loadProducts = function loadProducts(ppsHeaderId, ppsProductTemplateId) {
			const productIds = cache.getProductIds(ppsHeaderId, ppsProductTemplateId);
			return $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/getproductsbyids', productIds).then(res => {
				cache.setProducts(res.data);
				return res.data;
			});
		};

		this.getAllPpsHeadersAsync = function () {
			return Promise.resolve(cache.ppsHeaders);
		};

		this.getAllPpsProductTemplateByPpsHeaderIdAsync = function (ppsHeaderId) {
			return Promise.resolve(cache.getProductTemplates(ppsHeaderId));
		};

		this.setAvailableQuantity = () => dataItem.setAvailableQuantity();

		this.showTakeFromStockDialog = function () {
			const dialogOptions = {
				width: '800px',
				headerText: '*Take From Stock',
				headerText$tr$: 'productionplanning.common.product.takeFromStock',
				bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.common/partials/pps-common-from-grid-template.html',
				resizeable: true,
				showCancelButton: true,
				buttons: [{
					id: 'ok',
					disabled(info) {
						return !info.modalOptions.dataItem.isQuantityValid();
					}
				}],
				dataItem: dataItem,
			};

			platformDialogService.showDialog(dialogOptions).then(res => {
				if (res.ok) {
					const param = {
						PpsItemId: cache.ppsItem.Id,
						QuantityToTake: dataItem.QuantityToTake,
						ProductIds: cache.ppsProducts.map(i => i.Id),
					};

					return $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/takefromstock', param).then(res => {
						$injector.get('productionplanningCommonProductItemDataService').load();
						this.refreshRelatedQuantityOfPU();
						if($injector.get('transportplanningTransportUtilService').hasShowContainerInFront('productionplanning.item.transportable')){
							$injector.get('ppsItemTransportableDataService').load();
						}
						return res.data;
					});
				}
			});
		};

		this.refreshRelatedQuantityOfPU = function (){
			let itemDataService = $injector.get('productionplanningItemDataService');
			let selectedPU = itemDataService.getSelected();
			if(selectedPU){
				let request = {PKeys: [selectedPU.Id]}
				return $http.post(globals.webApiBaseUrl + 'productionplanning/item/customfiltered', request).then(function (response) {
					if(response.data){
						let subItemService = $injector.get('productionplanningItemSubItemDataService');
						var oldItem = itemDataService.getItemById(selectedPU.Id);
						let oldItemInSub = subItemService.getItemById(selectedPU.Id);
						let flatItems = [];
						cloudCommonGridService.flatten(response.data.dtos, flatItems, 'ChildItems');
						var newItem = _.find(flatItems, {Id: selectedPU.Id});
						oldItem.AssignedQuantity =  newItem.AssignedQuantity;
						oldItem.OpenQuantity = newItem.OpenQuantity;
						if (oldItemInSub) {
							oldItemInSub.AssignedQuantity =  newItem.AssignedQuantity;
							oldItemInSub.OpenQuantity = newItem.OpenQuantity;
						}
						itemDataService.gridRefresh();
						subItemService.gridRefresh();
					}
				});
			}
		};
	}
})(angular);