/**
 * Created by wuj on 11/13/2015.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('procurementPackageLookUpItems',
		['platformTranslateService', 'basicsLookupdataLookupDescriptorService',
			function (platformTranslateService, lookupDescriptorService) {
				var importStatusItems = [
					{Id: 1, Description: 'Canceled', Description$tr$: 'procurement.package.lookup.canceled'},
					{Id: 2, Description: 'Succeed', Description$tr$: 'procurement.package.lookup.succeed'},
					{Id: 3, Description: 'Failed', Description$tr$: 'procurement.package.lookup.failed'},
					{Id: 4, Description: 'Warning', Description$tr$: 'procurement.package.lookup.warning'}
				];

				var lookUpItems = {
					'importStatusItems': importStatusItems
				};

				// reloading translation tables
				platformTranslateService.translationChanged.register(function () {
					// noinspection JSCheckFunctionSignatures
					platformTranslateService.translateObject(importStatusItems);
				});

				lookupDescriptorService.attachData(lookUpItems);

				return lookUpItems;
			}]);
})(angular);