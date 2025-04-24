/**
 * Created by ysl on 12/12/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	angular.module(moduleName).factory('basicsCompanyImportContentOperationtypeService',
		['$translate', 'platformTranslateService', 'basicsLookupdataLookupDescriptorService',
			function ($translate, platformTranslateService, lookupDescriptorService) {
				var importStatusItems = [
					{Id: 1, Description: 'New', Description$tr$: 'basics.company.importContent.operationTypeNew'},
					{Id: 2, Description: 'Overwrite', Description$tr$: 'basics.company.importContent.operationTypeOverride'},
				];

				angular.forEach(importStatusItems, function (item) {
					var translation = $translate.instant(item.Description$tr$);
					if (translation !== item.Description$tr$) {
						item.Description = translation;
					}
				});

				var lookUpItems = {
					'importStatusItems': importStatusItems
				};

				lookupDescriptorService.attachData(lookUpItems);

				return lookUpItems;
			}]);
})(angular);
