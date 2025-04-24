(function (angular) {
	'use strict';
	/* global globals */
	/* jshint -W072 */
	var moduleName = 'constructionsystem.common';

	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemCommonModelPropertyDataService',
		['platformDataServiceFactory',
			function (platformDataServiceFactory) {
				var  serviceCache = {};

				function createNewComplete(parentService, moduleId) {

					// eslint-disable-next-line no-unused-vars
					var serviceContainer, data, service = {};

					var serviceOptions = {
						flatLeafItem: {
							module: constructionSystemModule,
							serviceName: 'constructionSystemCommonModelPropertyDataService',
							entityNameTranslationID: 'model.main.entityProperty',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'model/main/property/',
								endRead: 'listbyobject',
								usePostForRead: true,
								initReadData: initReadData
							},
							presenter: {
								list: {
									incorporateDataRead: function (itemList, data) {
										angular.forEach(itemList, function (item) {
											item.idString = item.ModelFk.toString()/* + '-' + item.ObjectFk.toString() */ + '-' + item.PropertyKeyFk.toString() + '-' + item.Id.toString();
										});
										return serviceContainer.data.handleReadSucceeded(itemList, data);
									}
								}
							},
							entityRole: {
								leaf: {
									itemName: 'Properties',
									parentService: parentService
								}
							},
							actions: {
								'delete': false,
								'create': false
							}
						}
					};

					function initReadData(readData) {
						var obj = parentService.getSelected();
						if (obj && obj.Id && obj.ModelFk) {
							readData.ModelId = obj.ModelFk;
							readData.ObjectId = moduleId === 'constructionsystem.main.instance2objectProperty' ? obj.ObjectFk : obj.Id;
						} else {
							readData.ModelId = -1;
							readData.ObjectId = -1;
						}
					}

					function create() {
						// parentService.registerSelectionChanged(loadProperties);
						serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
						data = serviceContainer.data;
						service = serviceContainer.service;
					}

					/* function loadProperties() {
						return data.doReadData(data);
					} */

					create();

					serviceContainer.data.usesCache = false;

					if (parentService.propertyReload !== null && parentService.propertyReload !== undefined) {
						parentService.propertyReload.register(function () {
							service.load();
						});
					}

					return service;
				}

				// get service or create service by module name
				function getService(moduleId, parentService) {
					if (!serviceCache[moduleId]) {
						serviceCache[moduleId] = createNewComplete(parentService, moduleId);
					}
					return serviceCache[moduleId];
				}

				return {
					getService: getService
				};
			}]);

})(angular);