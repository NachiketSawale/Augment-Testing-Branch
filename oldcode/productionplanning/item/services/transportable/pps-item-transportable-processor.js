(function() {
	'use strict';
	/* global moment _ */

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemTransportableProcessor', ppsItemTransportableProcessor);
	ppsItemTransportableProcessor.$inject = ['productionplanningCommonProductStatusLookupService',
		'productionplanningUpStreamStatusLookupService', 'upstreamGoodsTypes', '$translate', '$injector'];

	function ppsItemTransportableProcessor(productionplanningCommonProductStatusLookupService,
		productionplanningUpStreamStatusLookupService, upstreamGoodsTypes, $translate, $injector) {

		const service = {};

		const productStatusList = productionplanningCommonProductStatusLookupService.getList();
		const upstreamItemStatusList = productionplanningUpStreamStatusLookupService.getList();

		service.processItem = function processItem(item) {
			setImage(item);
			setDateFields(item);
		};

		service.select = function (item) {
			setImage(item);
			if(item.UpstreamItemId){
				item.image = service.getImageOfUpstreamItem({PpsUpstreamGoodsTypeFk: $injector.get('upstreamGoodsTypes').Material});
			}
			return item.image;
		};

		service.selectTooltip = function (item) {
			if (item.ProductId) {
				return $translate.instant('productionplanning.common.product.entity');
			} else if (item.BundleId) {
				return $translate.instant('transportplanning.bundle.entityBundle');
			} else if (item.UpstreamItemId) {
				return $translate.instant('productionplanning.item.upstreamItem.entity');
			}
			return '';
		};

		service.isCss = function () {
			return true;
		};

		function setImage(item) {
			if (item.ProductId) {
				item.image = 'control-icons ico-product';
				item.ProductStatusBackgroundColor = getBackgroundColor(productStatusList, item.StatusId);
			} else if (item.BundleId) {
				item.image = 'control-icons ico-product-bundles';
			} else if (item.UpstreamItemId) {
				item.image = service.getImageOfUpstreamItem(item);
				item.UpstreamItemBackgroundColor = getBackgroundColor(upstreamItemStatusList, item.StatusId);
			}
		}

		function getBackgroundColor(statusList, statusId) {
			const status = _.find(statusList, { Id: statusId });
			return status.BackgroundColor;
		}

		service.getImageOfUpstreamItem = function (item) {
			switch (item.PpsUpstreamGoodsTypeFk) {
				case upstreamGoodsTypes.Material:
					return 'control-icons ico-material-supplier';
				case upstreamGoodsTypes.Resource:
					return 'control-icons ico-resource-groups';
				case upstreamGoodsTypes.Plant:
					return 'control-icons ico-equipment';
				case upstreamGoodsTypes.Product:
					return 'control-icons ico-product';
			}
		};

		function setDateFields(item) {
			item.TrsRequisitionDate = moment.utc(item.TrsRequisitionDate);
			if (item.RoutesInfo) {
				item.RoutesInfo.PlannedDelivery = moment.utc(item.RoutesInfo.PlannedDelivery);
			}
		}

		return service;
	}
})();
