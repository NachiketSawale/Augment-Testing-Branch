/**
 * Created by wul on 12/18/2018.
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/* jslint nomen:true */
	estimateMainModule.factory('estimateMainMovingWicboqTreeService', ['_', '$injector', 'platformDataServiceFactory', 'boqMainCommonService',
		function (_, $injector, platformDataServiceFactory, boqMainCommonService) {

			let boqServiceOption = {
				hierarchicalRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainBoqService',
					httpRead: {},
					presenter: {
						tree: {
							parentProp: 'BoqItemFk',
							childProp: 'BoqItems'
						}
					},
					entityRole: {
						root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							codeField: 'Reference',
							descField: 'BriefInfo.Description',
							itemName: 'EstBoq',
							moduleName: 'Estimate Main'
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);
			serviceContainer.data.updateOnSelectionChanging = null;
			let service = serviceContainer.service;

			service.loadData = function loadData() {
				let wicDataService = $injector.get('estimateMainWicboqToPrjboqCompareDataForWicService');
				let currentBoq = wicDataService.getSelected();
				if (!currentBoq) {
					return;
				}
				let isRoot = boqMainCommonService.isRoot(currentBoq);

				let list = wicDataService.getList();
				// if(isRoot){
				//     list = _.filter(list, function (item) {
				//         return item.BoqHeaderFk !== currentBoq.BoqHeaderFk;
				//     });
				// }

				if (!list || list.length === 0) {
					serviceContainer.data.handleReadSucceeded([], serviceContainer.data);
					return;
				}

				_.forEach(list, function (item) {
					if (!boqMainCommonService.isRoot(item) && !boqMainCommonService.isDivision(item)) {
						item.cssClass = 'row-readonly-background';
					} else if (isRoot) {
						if (!boqMainCommonService.isRoot(item) || item.Id === currentBoq.Id) {
							item.cssClass = 'row-readonly-background';
						}
					} else {
						if (item.BoqHeaderFk === currentBoq.BoqHeaderFk) {
							if (item.Id === currentBoq.Id) {
								item.cssClass = 'row-readonly-background';
							} else if (item.nodeInfo.level > currentBoq.nodeInfo.level) {
								let sameLevelParent = item;
								while (sameLevelParent && sameLevelParent.nodeInfo.level > currentBoq.nodeInfo.level) {
									sameLevelParent = _.find(list, {
										Id: sameLevelParent.BoqItemFk,
										BoqHeaderFk: sameLevelParent.BoqHeaderFk
									});
								}

								if (sameLevelParent.Id === currentBoq.Id) {
									item.cssClass = 'row-readonly-background';
								}
							}
						}
					}
				});

				let tree = _.filter(list, function (item) {
					return boqMainCommonService.isRoot(item);
				});
				serviceContainer.data.handleReadSucceeded(tree, serviceContainer.data);
			};

			service.restoreCss = function restoreCss() {
				let list = service.getList();
				_.forEach(list, function (item) {
					item.cssClass = '';
				});
			};

			return service;
		}]);
})();
