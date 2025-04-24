/**
 * Created by sfi on 9/1/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName)
		.factory('basicsProcurementConfigurationModuleDataService',
			['platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService',
				function (dataServiceFactory, parentService) {
					var serviceOptions = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/procurementconfiguration/module/',
								initReadData: function (readData) {
									// readData.filter = '';
									var configurationTypeFk = parentService.getSelected().BasConfigurationTypeFk;
									readData.filter = '?configurationTypeId=' + configurationTypeFk;
								}
							},
							actions: {
								delete: false,
								create: false
							},
							entityRole: {
								leaf: {
									itemName: 'Module',
									parentService: parentService
								}
							}
						}
					};
					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					var onCompleteEntityUpdated = function onCompleteEntityUpdated() {
						serviceContainer.service.load();
					};
					parentService.completeEntityUpdated.register(onCompleteEntityUpdated);
					return serviceContainer.service;
				}]);
})(angular);