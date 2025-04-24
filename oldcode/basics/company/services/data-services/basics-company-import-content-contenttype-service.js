/**
 * Created by ysl on 12/12/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	angular.module(moduleName).factory('basicsCompanyImportContentContentTypeService',
		['$translate', 'platformTranslateService', 'basicsLookupdataLookupDescriptorService',
			function ($translate, platformTranslateService, lookupDescriptorService) {
				var contentTypeItems = [
					{Id: 0, Description: 'Unkown', Description$tr$: 'basics.company.importContent.contentType.unknown'},
					{Id: 1, Description: 'Module', Description$tr$: 'basics.company.importContent.contentType.module'},
					{
						Id: 2,
						Description: 'Material Catalog',
						Description$tr$: 'basics.company.importContent.contentType.materialCatalog'
					},
					{
						Id: 3,
						Description: 'Price Versions',
						Description$tr$: 'basics.company.importContent.contentType.materialPriceVersions'
					}
				];

				angular.forEach(contentTypeItems, function (item) {
					var translation = $translate.instant(item.Description$tr$);
					if (translation !== item.Description$tr$) {
						item.Description = translation;
					}
				});

				var lookUpItems = {
					'contentTypeItems': contentTypeItems
				};
				lookupDescriptorService.attachData(lookUpItems);

				var service = {
					'contentTypeItems': contentTypeItems
				};

				service.getContentTypeId = function (runtimeCode, level) {
					if (level === 0) {
						return 1;
					}

					if (runtimeCode === 'basics.material') {
						if (level === 1) {
							return 2;
						} else if (level === 2) {
							return 3;
						} else {
							return 0;
						}
					} else {
						return 0;
					}
				};

				service.keepGettingSelectedSelections = function (contentTypeId) {
					if (contentTypeId === 2) {
						return true;
					} else {
						return false;
					}
				};

				return service;
			}]);
})(angular);
