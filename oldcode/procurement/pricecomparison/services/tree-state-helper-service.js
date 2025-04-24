/**
 * Created by boom on 2024/01/24.
 */

(function (angular) {

	'use strict';

	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('treeStateHelperService', ['_',
		'platformGridAPI',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonCommonHelperService',
		'mainViewService',
		function (_,
			platformGridAPI,
			commonService,
			commonHelperService,
			mainViewService) {

			let service = {};

			let itemNodeListCache = {};
			let boqNodeListCache = {};

			service.getNodesCache = function (compareType, gridId) {
				let cache = [];
				let config = mainViewService.getViewConfig(gridId);
				let nodeListCache = compareType === commonService.constant.compareType.prcItem ? itemNodeListCache : boqNodeListCache;
				if (config && config.BasModuletabviewFk && !_.isEmpty(nodeListCache)) {
					let rfqHeaderId = commonService.getBaseRfqInfo().baseRfqId;
					if (rfqHeaderId) {
						let cacheKey = rfqHeaderId + '_' + config.BasModuletabviewFk;
						cache = nodeListCache[cacheKey];
					}
				}
				return cache;
			};

			service.setNodesCache = function (tree, compareType, gridId) {
				let childProperty = compareType === commonService.constant.compareType.prcItem ? 'Children' : 'BoqItemChildren';
				let config = mainViewService.getViewConfig(gridId);
				let nodeListCache = compareType === commonService.constant.compareType.prcItem ? itemNodeListCache : boqNodeListCache;
				if (config && config.BasModuletabviewFk) {
					let rfqHeaderId = commonService.getBaseRfqInfo().baseRfqId;
					if (rfqHeaderId) {
						let cacheKey = rfqHeaderId + '_' + config.BasModuletabviewFk;
						if (!nodeListCache[cacheKey]) {
							nodeListCache[cacheKey] = {};
						}
						let treeList = commonHelperService.flatTree(tree, childProperty);
						_.forEach(treeList, treeItem => {
							if (treeItem.nodeInfo) {
								nodeListCache[cacheKey][treeItem.Id] = treeItem.nodeInfo;
							}
						});
					}
				}
			};

			service.processNodeList = function (tree, compareType, gridId) {
				let nodeListCache = service.getNodesCache(compareType, gridId);
				if (!_.isEmpty(nodeListCache)) {
					let childProperty = compareType === commonService.constant.compareType.prcItem ? 'Children' : 'BoqItemChildren';
					let config = mainViewService.getViewConfig(gridId);
					if (config && config.BasModuletabviewFk) {
						let rfqHeaderId = commonService.getBaseRfqInfo().baseRfqId;
						if (rfqHeaderId) {
							let treeList = commonHelperService.flatTree(tree, childProperty);
							_.forEach(treeList, treeItem => {
								if (treeItem.nodeInfo && Object.hasOwn(nodeListCache, treeItem.Id)) {
									treeItem.nodeInfo.collapsed = nodeListCache[treeItem.Id].collapsed;
									nodeListCache[treeItem.Id] = treeItem.nodeInfo;
								}
							});
						}
					}
				} else {
					platformGridAPI.grids.setTreeGridLevel(gridId, 'expand');
				}
			};

			service.cleanNodesCache = function (compareType){
				if (compareType === commonService.constant.compareType.prcItem){
					itemNodeListCache = {};
				} else if (compareType === commonService.constant.compareType.boqItem){
					boqNodeListCache = {};
				} else {
					itemNodeListCache = {};
					boqNodeListCache = {};
				}
			};

			return service;
		}]);

})(angular);