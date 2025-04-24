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
	configModule.factory('basicsConfigAuditContainerService', basicsConfigAuditContainerService);

	basicsConfigAuditContainerService.$inject = ['$http', 'basicsConfigMainService', 'platformDataServiceFactory', 'basicsConfigAuditContainerLookupService','mainViewService' , '$log'];

	function basicsConfigAuditContainerService($http, basicsConfigMainService, platformDataServiceFactory, basicsConfigAuditContainerLookupService, mainViewService, $log){
		var serviceFactoryOptions = {
			flatNodeItem: {
				module: configModule,
				serviceName: 'basicsConfigAuditContainerService',
				// httpCRUD: {route: globals.webApiBaseUrl + 'basics/audittrail/container/'},
				actions: {delete: false, create: false},
				httpRead: {
					useLocalResource: true,
					resourceFunction: function (p1, p2, onReadSucceeded) {

						var moduleEntity = basicsConfigMainService.getSelected() || {};
						basicsConfigAuditContainerLookupService.getModuleContainers(moduleEntity.InternalName).then(function(containers) {
							// $http.get(globals.webApiBaseUrl + 'basics/audittrail/container/list?mainItemId=' + moduleEntity.Id).then(function(response) {
							var data = {};
							data.uuids = containers;
							data.moduleName =  mainViewService.getCurrentModuleName();
							$http.post(globals.webApiBaseUrl + 'basics/config/audittrail/list4module', data).then(function(response) {
								onReadSucceeded(response.data, serviceContainer.data);
							});
						});
					}
				},
				entityRole: {
					node: {
						itemName: 'AudContainer',
						parentService: basicsConfigMainService
					}
				}
			}
		};


		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);


		serviceContainer.service.checkAuditTrailAvailability = function(moduleName){
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/audittrail/audittrailisactive',
				params: {moduleName: moduleName}
			}).then(function (response) {
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		return serviceContainer.service;
	}
})(angular);