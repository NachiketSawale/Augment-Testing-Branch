(function (angular) {
	'use strict';
	angular.module('estimate.main').factory('estimateMainPlantAssemblyFastInputDataService', [
		'_',
		'$q',
		'$http',
		'$injector',
		'estimateMainCommonService',
		'estimateMainPlantAssemblyDialogService',
		function (_, $q, $http, $injector, estimateMainCommonService, estimateMainPlantAssemblyDialogService) {
			let cache = new Map();
			const service = {};

			service.getSearchList = function (value, options, item, column) {
				if (!value) {
					return $q.when([]);
				}
				const usageContext = getUsageContext(column);
				const cacheItem = searchPlantAssemblyFromCache(value);
				if (cacheItem) {
					setSelectedItem(usageContext, cacheItem);
					return $q.when([cacheItem]);
				}
				return estimateMainPlantAssemblyDialogService.getSearchList(value, 'Code', item, false, false, getLookupOptions(column),1,true).then(function (response) {
					const retValues = response;

					if (retValues && retValues.length > 0) {
						cache.set(retValues[0].Id, retValues[0]);
						estimateMainCommonService.setSelectedLookupItems(retValues);
						return $q.when(retValues);
					}

					return $q.when([]);
				});
			};

			function getLookupOptions(column) {
				return _.get(column, 'editorOptions.lookupOptions', {});
			}

			function getUsageContext(column) {
				return _.get(column, 'editorOptions.lookupOptions.usageContext', '');
			}

			function searchPlantAssemblyFromCache(code) {
				const items = [...cache.values()];

				return _.find(items, (item) => {
					return item.Code && item.Code.toLowerCase() === code.toLowerCase();
				});
			}

			function setSelectedItem(usageContext, selectedItem,entity) {
				if(selectedItem){
					entity.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
					const usageContextService = usageContext ? $injector.get(usageContext) : null;
					if(usageContextService && angular.isFunction(usageContextService.setSelectedAssemblyLookupItem)){
						usageContextService.setSelectedAssemblyLookupItem(selectedItem);
					}else{
						estimateMainCommonService.setSelectedLookupItem(selectedItem);
					}
				}
			}

			return service;
		},
	]);
})(angular);
