/**
 * Created by lav on 8/27/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.site';
	angular.module(moduleName).factory('basicsSiteSelectableProcessor',
		BasicsSiteSelectableProcessor);

	BasicsSiteSelectableProcessor.$inject = ['basicsLookupdataLookupDescriptorService', 'cloudCommonGridService','$injector'];

	function BasicsSiteSelectableProcessor(basicsLookupdataLookupDescriptorService,cloudCommonGridService,$injector) {

		var service = {};

		service.intialize = function () {
			return basicsLookupdataLookupDescriptorService.loadData('SiteType');
		};
		service.intialize();

		service.processItem = function processItem(item, filterPropertyName) {
			if (filterPropertyName === 'IsStockyard') {
				var siteType = basicsLookupdataLookupDescriptorService.getLookupItem('SiteType', item.SiteTypeFk);
				item[filterPropertyName] = (siteType && siteType.IsStockyard === true);
			} else if (filterPropertyName === 'IsFactory') {
				var siteType = basicsLookupdataLookupDescriptorService.getLookupItem('SiteType', item.SiteTypeFk);
				item[filterPropertyName] = (siteType && siteType.IsFactory === true);
			}
			else if(filterPropertyName === 'FromPPSItemDailyProduction') {
				var dailyService = $injector.get('productionplanningItemUpdateProductionSubsetService');
				var seleted = dailyService.getSelected();
				if(seleted){
					var siteType3 = basicsLookupdataLookupDescriptorService.getLookupItem('SiteType', item.SiteTypeFk);
					if(siteType3.Id === 8) {
						var flatData = [];
						flatData = cloudCommonGridService.flatten([item], flatData, 'ChildItems');
						item[filterPropertyName] = !_.find(flatData, {Id: seleted.SiteFk});
					}
				}
			}
			item.Selectable = item.IsLive && item[filterPropertyName] ? '√' : null;

			// If a site is just a dependance of child site(s) for PPSEventSeqConfig, it's not allowed to be selected. We can only select child sites.(for HP-ALM #124025 by zwz 2021/11/10)
			if(item.IsDependanceOfChildSitesForEventSeqConfig === true){
				item.Selectable = null;
			}
		};

		service.processData = function processData(dataList, filterPropertyName) {
			angular.forEach(dataList, function (item) {
				service.processItem(item, filterPropertyName);
				if (item.ChildItems && item.ChildItems.length > 0) {
					service.processData(item.ChildItems, filterPropertyName);
				}
			});

			return dataList;
		};

		return service;
	}
})(angular);
