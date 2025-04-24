/**
 * Created by reimer on 15.01.2018.
 */
(function(){
	'use strict';
	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	configModule.factory('basicsConfigAuditColumnService', basicsConfigAuditColumnService);

	basicsConfigAuditColumnService.$inject = ['$http', 'basicsConfigAuditContainerService', 'platformDataServiceFactory', 'basicsConfigAuditContainerLookupService'];

	function basicsConfigAuditColumnService($http, parentService, platformDataServiceFactory, basicsConfigAuditContainerLookupService){
		var serviceFactoryOptions = {
			flatNodeItem: {
				module: configModule,
				serviceName: 'basicsConfigAuditColumnService',
				actions: {delete: false, create: false},
				httpRead: {route: globals.webApiBaseUrl + 'basics/config/audittrail/', endRead: 'listcontainercols'},
				entityRole: {
					leaf: {
						itemName: 'AudColumn',
						parentService: parentService
					}
				}
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		return serviceContainer.service;
	}
})(angular);