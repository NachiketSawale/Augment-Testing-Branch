(function (angular) {
	'use strict';

	const moduleName = 'basics.site';
	angular.module(moduleName).factory('basicsSiteImageProcessor',
		BasicsSiteImageProcessor);

	BasicsSiteImageProcessor.$inject = ['basicsLookupdataLookupDescriptorService'];

	function BasicsSiteImageProcessor(basicsLookupdataLookupDescriptorService) {
		const imageCssPrefix = 'type-icons ico-facilities-0';

		let service = {};

		// reset default icon (structure column)
		service.processItem = function processItem(item) {
			let lookupItem = basicsLookupdataLookupDescriptorService.getLookupItem('SiteType', item.SiteTypeFk);
			if (lookupItem) {
				item.image = imageCssPrefix + lookupItem.Icon;
			}
			else {
				basicsLookupdataLookupDescriptorService.loadItemByKey('SiteType', item.SiteTypeFk)
					.then(siteTypeItem => {
						if (siteTypeItem) {
							item.image = imageCssPrefix + siteTypeItem.Icon;
						}
					});
			}
		};

		// set default icon for each item in siteDtos
		service.processData = function processData(dataList) {
			angular.forEach(dataList, function (item) {
				item.image = getImage(item.SiteTypeFk);
				if (item.ChildItems && item.ChildItems.length > 0) {
					service.processData(item.ChildItems);
				}
			});

			return dataList;
		};

		function getImage(siteTypeId) {
			var siteType = basicsLookupdataLookupDescriptorService.getLookupItem('sitetype', siteTypeId);
			if (siteType) {
				return imageCssPrefix + siteType.Icon;
			}
			return '';
		}

		// init lookup data of siteType
		service.select = function (lookupItem) {
			if (!lookupItem) {
				return '';
			}
			return imageCssPrefix + lookupItem.Icon;
		};

		service.getIconType = function() {
			return 'css';
		};

		service.isCss = function () {
			return true;
		};

		return service;
	}
})(angular);