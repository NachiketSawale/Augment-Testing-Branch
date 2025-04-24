/**
 * Created by wui on 6/5/2019.
 */

(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainChgOptionDataService',
		['platformDataServiceFactory', 'constructionSystemMainInstanceService',
			/* jshint -W072 */
			function (platformDataServiceFactory, constructionSystemMainInstanceService) {
				var serviceContainer;
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMainChgOptionDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/main/chgoption/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function (readData) {
								var obj = constructionSystemMainInstanceService.getSelected();
								if (obj && obj.Id && obj.InstanceHeaderFk) {
									readData.CosInsHeaderId = obj.InstanceHeaderFk;
									readData.InstanceId = obj.Id;
								} else {
									readData.CosInsHeaderId = -1;
									readData.InstanceId = -1;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'CosChgOption',
								parentService: constructionSystemMainInstanceService
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectedItem = constructionSystemMainInstanceService.getSelected();
									if (selectedItem && selectedItem.Id > 0) {
										creationData.Id = selectedItem.Id;
										creationData.PKey1 = selectedItem.InstanceHeaderFk;
									}
								}
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