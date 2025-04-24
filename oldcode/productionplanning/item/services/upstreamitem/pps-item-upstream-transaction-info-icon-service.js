(angular => {
	'use strict';
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsUpstreamItemTransactionInfoIconService', ppsUpstreamItemTransactionInfoIconService);

	ppsUpstreamItemTransactionInfoIconService.$inject = ['upstreamTypes', 'upstreamGoodsTypes'];

	function ppsUpstreamItemTransactionInfoIconService(upstreamTypes, upstreamGoodsTypes) {
		const service = {};

		const okIcon = {
			id: 'ok',
			res: 'tlb-icons ico-task-ok',
		};

		const infoIcon = {
			id: 'warning',
			res: 'tlb-icons ico-info2',
		};

		service.select = item => {
			if (!isSuppliedForMaterial(item)) {
				return;
			}

			if (item.TransactionInfo && item.TransactionInfo.length > 0) {
				return infoIcon.res;
			} else if (item.PrcStockTransactionFk > 0) {
				return okIcon.res;
			}
		};

		service.selectTooltip = item => {
			if (!isSuppliedForMaterial(item)) {
				return;
			}

			return item.TransactionInfo || '';
		};

		service.getIcons = () => [okIcon, infoIcon];
		service.isCss = () => true;

		function isSuppliedForMaterial(upstreamItem) {
			if (!upstreamItem) {
				return false;
			}

			return upstreamItem.PpsUpstreamTypeFk === upstreamTypes.FromStock &&
				upstreamItem.PpsUpstreamGoodsTypeFk === upstreamGoodsTypes.Material &&
				upstreamItem.Version > 0;
		}

		return service;
	}
})(angular);