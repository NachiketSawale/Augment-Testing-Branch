(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).service('transportplanningBundleGoodsSynchronizeFactory', BundleGoodsSynchronizeService);

	BundleGoodsSynchronizeService.$inject = [
		'_', '$injector',
		'basicsLookupdataLookupDescriptorService',
		'platformContainerControllerService'];

	function BundleGoodsSynchronizeService(
		_, $injector,
		basicsLookupdataLookupDescriptorService,
		platformContainerControllerService) {

		var serviceCache = {};

		function createService(module) {
			// load lookup data of 'SiteNew', in case we need them for checking SiteFk of bundle (HP-ALM #115526)
			if (_.isNil(basicsLookupdataLookupDescriptorService.getData('SiteNew'))) {
				basicsLookupdataLookupDescriptorService.loadData('SiteNew');
			}

			function isSameSiteOrOffspringSite(siteId, siteId2) {
				if ((_.isNil(siteId) && !_.isNil(siteId2))
					|| (!_.isNil(siteId) && _.isNil(siteId2))) {
					return false;
				}
				if (siteId === siteId2 || (_.isNil(siteId) && _.isNil(siteId2))) {
					return true;
				}
				var sites = basicsLookupdataLookupDescriptorService.getData('SiteNew');
				return checkAncestor(siteId, siteId2, sites);
			}

			function checkAncestor(offspringSiteId, ancestorSiteId, sites) {
				if (offspringSiteId === ancestorSiteId) {
					return true;
				}
				else {
					var site = _.find(sites, { Id: offspringSiteId });
					if (_.isNil(site) || _.isNil(site.SiteFk)) {
						return false;
					}
					return checkAncestor(site.SiteFk, ancestorSiteId, sites);
				}
			}

			var service = {};
			service.bundleService = {};
			service.goodService = {};
			service.unAssignBundleService = {};
			service.syncLocked = false;

			function initService(module) {
				var containerInfoService = platformContainerControllerService.getModuleInformationService(module);
				var containerInfo = {};
				switch (module) {
					case 'transportplanning.requisition':
						service.bundleService = $injector.get('transportplanningRequisitionBundleDataService');
						service.unAssignBundleService = $injector.get('transportplanningRequisitionUnassignedBundleDataService');
						containerInfo = containerInfoService.getContainerInfoByGuid('df5tg7b1928342c4a65cee89c4869tyg');
						break;
					case 'productionplanning.activity':
						service.bundleService = $injector.get('productionplanningActivityTrsRequisitionBundleDataService');
						service.unAssignBundleService = $injector.get('productionplanningActivityUnassignedBundleDataService');
						containerInfo = containerInfoService.getContainerInfoByGuid('ff8a5a1e201242ab8c837cf1a50e9932');
						break;
					case 'productionplanning.mounting':
						service.bundleService = $injector.get('productionplanningMountingTrsRequisitionBundleDataService');
						service.unAssignBundleService = $injector.get('productionplanningMountingUnassignedBundleDataService');
						containerInfo = containerInfoService.getContainerInfoByGuid('007aa530d9f64420b13aa02b9e6f0dcc');
						break;
				}
				service.goodService = containerInfo.dataServiceName;
			}

			initService(module);

			service.synDeletedGood = function synDeletedBundleGood(entities) {
				if (!service.syncLocked) {
					service.syncLocked = true;
					var bundleList = service.bundleService.getList();
					var removeBundleList = _.filter(bundleList, function (bundle) {
						return _.find(entities, {TrsProductBundleFk: bundle.Id});
					});
					if (removeBundleList.length > 0) {
						service.bundleService.deleteReferences(removeBundleList, 'TrsRequisitionFk');
						var latestFilter = service.unAssignBundleService.latestFilter;
						var unAssignBundleList = service.unAssignBundleService.getList();
						if (
							(latestFilter.siteId === null || (removeBundleList[0].SiteFk === latestFilter.siteId))
							&&
							(latestFilter.jobId === null || (removeBundleList[0].LgmJobFk === latestFilter.jobId))
						) {
							unAssignBundleList = unAssignBundleList.concat(removeBundleList);
							service.unAssignBundleService.updateList(unAssignBundleList);
						}
					} else if (_.isFunction(service.bundleService.changeTrsRequisitionAssignment)) {
						//if not synchronized => directly change dateshift data instead
						let mappedBundleEntities = _.map(entities, (good) => {
							return {
								TrsReq_EventFk: good.TrsBundleEventFk,
								TrsReq_DateshiftMode: good.TrsBundleDateshiftMode
							};
						});
						if (!_.isEmpty(mappedBundleEntities)) {
							service.bundleService.changeTrsRequisitionAssignment(mappedBundleEntities, false);
						}
					}
				}
				service.syncLocked = false;
			};

			service.synDeletedBundle = function synDeletedBundle(entities) {
				if (!service.syncLocked) {
					service.syncLocked = true;
					var trsGoods = service.goodService.getList();
					var bundleGoods = _.filter(trsGoods, function (good) {
						return good.TrsGoodsTypeFk === 3;
					});
					var removeGood = _.find(bundleGoods, {TrsProductBundleFk: entities[0].Id});

					if (removeGood) {
						service.goodService.deleteItem(removeGood);
					}
					var latestFilter = service.unAssignBundleService.latestFilter;
					var unAssignBundleList = service.unAssignBundleService.getList();
					if ((isSameSiteOrOffspringSite(entities[0].SiteFk,latestFilter.siteId) &&
						entities[0].LgmJobFk === latestFilter.jobId) ||
						(latestFilter.siteId === null && latestFilter.jobId === null)) {
						unAssignBundleList = unAssignBundleList.concat(entities);
						service.unAssignBundleService.updateList(unAssignBundleList);
					}
				}
				service.syncLocked = false;
			};

			service.synAddedBundle = function (newBundles) {
				var goodList = service.goodService.getList();
				var finds = _.filter(newBundles, function (bundle) {
					return !_.find(goodList, {TrsGoodsTypeFk: 3, Good: bundle.Id});
				});
				function postProcessAssignedBundle(createdGoods) {
					_.forEach(createdGoods, (createdGood) => {
						let matchingBundle = _.find(newBundles, { Id: createdGood.Good});
						if (!_.isNil(matchingBundle)) {
							createdGood.TrsProductBundleFk = matchingBundle.Id;
							createdGood.TrsBundleEventFk = matchingBundle.TrsReq_EventFk;
							createdGood.TrsBundleDateshiftMode = matchingBundle.TrsReq_DateshiftMode;
						}
					});
				}
				service.goodService.createItems(finds,3, postProcessAssignedBundle);
			};
			return service;
		}

		function getService(module) {
			if (_.isNil(serviceCache[module])) {
				serviceCache[module] = createService(module);
			}
			return serviceCache[module];
		}

		return {
			getService: getService
		};
	}
})(angular);
