(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';
	var module = angular.module(moduleName);

	module.factory('productionplanningDrawingStackBundleDataService', StackBundleDataService);

	StackBundleDataService.$inject = ['transportplanningBundleDataServiceContainerBuilder', 'productionplanningDrawingStackDataService'];

	function StackBundleDataService(ServiceBuilder, parentService) {

		var mainOptionsType = 'flatNodeItem';
		var serviceInfo = {
			module: module,
			serviceName: 'productionplanningDrawingStackBundleDataService'
		};
		var validationService = '';
		var httpResource = {
			endRead: 'listForStack'
		};
		var entityRole = {
			node: {
				itemName: 'Bundle',
				parentService: parentService.getService(),
				parentFilter: 'stackId'
			}
		};
		var actions = {
			delete: false
		};

		var builder = new ServiceBuilder(mainOptionsType);
		var serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setEntityRole(entityRole)
			.setActions(actions)
			.build();
			
		serviceContainer.data.usesCache = false; // for JIRA task DEV-13663
		return serviceContainer.service;
	}
})(angular);