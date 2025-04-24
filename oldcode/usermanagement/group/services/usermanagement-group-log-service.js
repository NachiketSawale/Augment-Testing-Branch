/**
 * Created by sandu on 27.06.2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.group';
	var uMGroupModule = angular.module(moduleName);

	angular.module(moduleName).factory('usermanagementGroupLogService', usermanagementGroupLogService);
	usermanagementGroupLogService.$inject = ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'usermanagementGroupLogModifyProcessor'];
	function usermanagementGroupLogService(platformDataServiceFactory, ServiceDataProcessArraysExtension, usermanagementGroupLogModifyProcessor) {

		var serviceFactoryOptions = {
			flatRootItem: {
				module: uMGroupModule,
				serviceName: 'usermanagementGroupLogService',
				entityNameTranslationID: 'usermanagement.main.groupLog',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'usermanagement/main/log/',
					endRead: 'list'
				},
				entityRole: {
					root: {}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Job']), usermanagementGroupLogModifyProcessor],
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