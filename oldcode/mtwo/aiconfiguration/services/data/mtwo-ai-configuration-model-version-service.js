/**
 * @author: chd
 * @date: 3/24/2021 10:06 AM
 * @description:
 */
(function (angular) {
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).factory('mtwoAIConfigurationModelVersionService', MtwoAIConfigurationModelVersionService);

	MtwoAIConfigurationModelVersionService.$inject = ['globals', 'platformDataServiceFactory', 'mtwoAIConfigurationModelListDataService', 'PlatformMessenger'];

	function MtwoAIConfigurationModelVersionService(globals, platformDataServiceFactory, parentService, PlatformMessenger) {
		let service = {};
		let serviceOptions = {
			flatNodeItem: {
				module: angular.module(moduleName),
				serviceName: 'mtwoAIConfigurationModelVersionService',
				entityRole: {node: {itemName: 'ModelVersion', parentService: parentService}},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/aiconfiguration/modelversion/'
				},
				actions: {create: false, group: false, delete: true, canDeleteCallBackFunc: canDelete},
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		service = serviceContainer.service;
		service.onRowChange = new PlatformMessenger();
		return service;

		function canDelete() {
			let selected = service.getSelected();
			return !selected.IsLive;
		}
	}
})(angular);
