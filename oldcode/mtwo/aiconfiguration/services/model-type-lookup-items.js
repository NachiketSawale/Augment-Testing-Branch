/**
 * @author: chd
 * @date: 3/24/2021 5:02 PM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).factory('mtwoAIConfigurationModelTypeLookUpItems',
		['platformTranslateService', 'basicsLookupdataLookupDescriptorService',
			function (platformTranslateService, lookupDescriptorService) {
				let modelTypeItems = [
					{Id: 0, Description: 'RIB', Description$tr$: 'mtwo.aiconfiguration.rib'},
					{Id: 1, Description: 'Predict Sense', Description$tr$: 'mtwo.aiconfiguration.predictSense'}
				];

				let lookUpItems = {
					'modelType': modelTypeItems,
				};

				// reloading translation tables
				platformTranslateService.translationChanged.register(function () {
					platformTranslateService.translateObject(modelTypeItems);
				});

				lookupDescriptorService.attachData(lookUpItems);

				return lookUpItems;
			}]);
})(angular);
