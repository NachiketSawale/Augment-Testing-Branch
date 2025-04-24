/**
 * Created by wui on 6/5/2019.
 */

(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterChgOptionDataService',
		['platformDataServiceFactory', 'constructionSystemMasterHeaderService',
			/* jshint -W072 */
			function (platformDataServiceFactory, constructionSystemMasterHeaderService) {
				var serviceContainer;
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMasterChgOptionDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/master/chgoption/',
							endRead: 'list'
						},
						entityRole: {
							leaf: {
								itemName: 'CosChgOption',
								parentService: constructionSystemMasterHeaderService
							}
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								var list = serviceContainer.service.getList();
								return list.length === 0;
							}
						}
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				return serviceContainer.service;

			}]);

})(angular);