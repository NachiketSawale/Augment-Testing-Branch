/**
 * Created by aljami on 30.06.2020.
 */
(function () {

	'use strict';

	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsConfigModuleViewsService
	 * @function
	 *
	 * @description
	 * data service for container views related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	configModule.factory('basicsConfigModuleViewsService', basicsConfigModuleViewsService);

	basicsConfigModuleViewsService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory'];

	function basicsConfigModuleViewsService(basicsConfigMainService, platformDataServiceFactory) {

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'basicsConfigModuleViewsService',
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/moduleViews/',
					endRead: 'listViews',
					usePostForRead: false
				},
				actions: {delete: false, create: false},
				entityRole: {leaf: {itemName: 'ModuleViews', parentService: basicsConfigMainService}},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = basicsConfigMainService.getSelected().Id;
						}
					}
				}

			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);


		return serviceContainer.service;
	}
})(angular);
