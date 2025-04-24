/**
 * Created by aljami on 27.10.2020
 */

(function () {

	'use strict';

	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	configModule.factory('basicsConfigDashboardXModuleService', basicsConfigDashboardXModuleService);

	basicsConfigDashboardXModuleService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory'];

	function basicsConfigDashboardXModuleService(basicsConfigMainService, dataServiceFactory) {
		var serviceContainer;
		var service;
		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'basicsConfigDashboardXModuleService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/config/dashboard2module/',
					endRead: 'listFiltered',
					usePostForRead: false
				},
				actions: {delete: true, create: 'flat'},
				entityRole: {
					leaf: {
						itemName: 'Dashboard2Module',
						parentService: basicsConfigMainService
					}
				},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {
						// initCreationData: function initCreationData(creationData) {
						// 	var selected = basicsConfigMainService.getSelected();
						// 	creationData.mainItemID = (selected) ? selected.Id : 0;
						// }
					}
				}
			}
		};
		serviceContainer = dataServiceFactory.createNewComplete(serviceFactoryOptions);
		service = serviceContainer.service;
		return service;
	}

})(angular);