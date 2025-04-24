/**
 * Created by sandu on 28.06.2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.user';
	var uMUserModule = angular.module(moduleName);

	angular.module(moduleName).factory('usermanagementUserLogService', usermanagementUserLogService);
	usermanagementUserLogService.$inject = ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'usermanagementUserLogModifyProcessor'];

	function usermanagementUserLogService(platformDataServiceFactory, ServiceDataProcessArraysExtension, usermanagementUserLogModifyProcessor) {

		var serviceFactoryOptions = {
			flatRootItem: {
				module: uMUserModule,
				serviceName: 'usermanagementUserLogService',
				entityNameTranslationID: 'usermanagement.main.userLog',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'usermanagement/main/log/',
					endRead: 'list'
				},
				entityRole: {
					root: {}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Job']), usermanagementUserLogModifyProcessor],
				actions: {delete: true, create: false},
				entitySelection: {},
				presenter: {
					list: {
						incorporateDataRead: function (itemList, data) {
							var obj = {};
							_.forEach(itemList, function (item) {
								obj.actionList = [];
								item.Log = obj;
							});
							return serviceContainer.data.handleReadSucceeded(itemList, data);
						}
					}
				}
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
		serviceContainer.service.load();
		return serviceContainer.service;
	}
})(angular);
