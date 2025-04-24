/**
 * Created by wuj on 4/14/2015.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialLookUpItems',
		['platformTranslateService', 'basicsLookupdataLookupDescriptorService',
			function (platformTranslateService, lookupDescriptorService) {
				var weightTypeItems = [
					{Id: 0, Description: 'Gross', Description$tr$: 'basics.material.lookup.gross'},
					{Id: 1, Description: 'Net', Description$tr$: 'basics.material.lookup.net'},
					{Id: 2, Description: 'Packaging', Description$tr$: 'basics.material.lookup.packaging'}
				];

				var weightNumberItems = [
					{Id: 0, Description: 'kg', Description$tr$: 'basics.material.lookup.kg'},
					{Id: 1, Description: 'ton', Description$tr$: 'basics.material.lookup.ton'},
					{Id: 2, Description: 'g', Description$tr$: 'basics.material.lookup.g'}
				];

				var materialImportSetting = [
					{Id: 0, Description: 'Follow Group Setting in File', Description$tr$: 'basics.material.import.keepExistMaterialGroup'},
					{Id: 1, Description: 'Create New Group by System', Description$tr$: 'basics.material.import.newMaterialGroup'}
				];

				var materialImportFormatter = [
					{Id: 1,Description: 'Import Material',Description$tr$:'basics.material.import.importMaterial'},
					{Id: 2,Description: 'Import Price List',Description$tr$:'basics.material.import.importPriceList'}
				];

				var lookUpItems = {
					'weightType': weightTypeItems,
					'weightNumber': weightNumberItems,
					'importSetting':materialImportSetting,
					importFormatter: materialImportFormatter
				};

				// reloading translation tables
				platformTranslateService.translationChanged.register(function () {
					platformTranslateService.translateObject(weightTypeItems);
					platformTranslateService.translateObject(weightNumberItems);
					platformTranslateService.translateObject(materialImportSetting);
					platformTranslateService.translateObject(materialImportFormatter);
				});

				lookupDescriptorService.attachData(lookUpItems);

				return lookUpItems;
			}]);
})(angular);
