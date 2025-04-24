(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('productionplanningCommonProductParamSortingProcessorExtension', Extension);

	Extension.$inject = ['platformRuntimeDataService','$injector'];

	function Extension(platformRuntimeDataService,$injector) {

		this.create = function (options) {
			var service = {};
			service.processItem = function processItem(item) {
				if (item.Version === 0) {
					var dataServFactory = $injector.get('productionplanningCommonProductParamDataServiceFactory');
					var dataServ = dataServFactory.getServiceByName(options.dataServiceName);
					var list = dataServ.getList();
					if (list.length > 0) {
						item.Sorting = _.max(_.map(list, 'Sorting')) + 1;
					} else {
						item.Sorting = 1;
					}
				}
			};
			return service;
		};

	}

})(angular);

