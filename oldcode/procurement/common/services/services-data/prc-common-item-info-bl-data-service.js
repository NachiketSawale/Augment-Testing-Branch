(function(angular){

	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonItemInfoBlDataService', packageItemInfoBlDataService);

	packageItemInfoBlDataService.$inject= ['_', '$q', '$http', 'globals', 'procurementContextService', 'platformDataServiceFactory',
		'procurementCommonDataServiceFactory'];

	function packageItemInfoBlDataService(_, $q, $http, globals, procurementContextService, platformDataServiceFactory, dataServiceFactory) {

		return dataServiceFactory.createService(constructorFn, 'procurementCommonItemInfoBlDataService');

		function constructorFn(parentDataService){

			var factoryOptions = {
				flatLeafItem: {
					module: 'procurement.common',
					serviceName: 'procurementCommonItemInfoBlDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/common/prciteminfobl/',
						endRead: 'list',
						initReadData: function initReadData(readData) {
							var selected = parentDataService.getSelected();
							if (selected) {
								readData.filter = '?mainId=' + selected.Id;
							}
							else {
								readData.filter = '?mainId=' + -1;
							}
						}
					},
					actions: {delete: false, create: false},
					entityRole: {
						leaf: {itemName: 'PrcItemInfoBLDto', parentService: parentDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			var service = serviceContainer.service;
			service.getItemInfoBlSpecification = getItemInfoBlSpecification;

			function getItemInfoBlSpecification() {

				var selectedEntity = service.getSelected();
				if (selectedEntity && selectedEntity.BasClobsFk > 0) {

					return $http.get(globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + selectedEntity.BasClobsFk).then(function (res) {
						return res.data;
					});
				}

				var currentSpecificationPlain = {
					Content: null,
					Id: 0,
					Version: 0
				};

				return $q.when(currentSpecificationPlain);
			}

			return service;
		}
	}

})(angular);