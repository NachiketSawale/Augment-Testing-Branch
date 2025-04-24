(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainRuleCodeLookupService',
		['platformLookupDataServiceFactory', '$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService', 'cloudCommonGridService',
			function (platformLookupDataServiceFactory, $http, $q, $injector, basicsLookupdataLookupDescriptorService, cloudCommonGridService) {
				var service = {};
				var lookupData = {};

				service.getList = function () {
					var cacheData = basicsLookupdataLookupDescriptorService.getData('estRuleCodeItems');
					if (!lookupData.estRuleCodeItemsAsyncPromise || lookupData.estRuleCodeItemsAsyncPromise === null) {
						if (cacheData && _.size(cacheData) > 0) {
							var cacheObject = {};
							cacheObject.data = cacheData;
							lookupData.estRuleCodeItemsAsyncPromise = $q.when(cacheObject);

							return lookupData.estRuleCodeItemsAsyncPromise.then(function (response) {
								lookupData.estRuleCodeItemsAsyncPromise = null;
								return response.data;
							});

						} else {
							lookupData.estRuleCodeItemsAsyncPromise = service.getEstRuleCodeItems();
							return lookupData.estRuleCodeItemsAsyncPromise.then(function (response) {
								lookupData.estRuleCodeItemsAsyncPromise = null;
								var output = [];
								cloudCommonGridService.flatten(response.data, output, 'EstRules');
								basicsLookupdataLookupDescriptorService.updateData('estRuleCodeItems', output);
								return output;
							});
						}
					}

				};

				service.getEstRuleCodeItems = function getEstRuleCodeItems() {
					return $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/treeWithoutFilter');
				};
				return service;
			}]);
})(angular);
