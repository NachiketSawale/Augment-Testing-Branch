/**
 * @author: chd
 * @date: 5/26/2021 3:51 PM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).factory('mtwoAIConfigurationParameterAliasLookUpItems',
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
