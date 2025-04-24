/**
 * Created by lvy on 3/13/2020.
 */
(function (angular) {
	'use strict';
	/* global globals,_ */

	/* jshint -W072 */
	var moduleName = 'constructionsystem.main';
	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('cosMainObjectTemplatePropertyDataServiceFactory', [
		'$injector',
		'platformDataServiceFactory',
		'platformDataServiceModificationTrackingExtension',
		'basicsLookupdataLookupDescriptorService',
		function (
			$injector,
			dataServiceFactory,
			platformDataServiceModificationTrackingExtension,
			basicsLookupdataLookupDescriptorService
		) {
			function getService(parentService)
			{
				var route = globals.webApiBaseUrl + 'constructionsystem/main/objecttemplateproperty/';
				var serviceContainer;
				var service;
				var serviceOptions = {
					flatLeafItem: {
						module: constructionSystemModule,
						serviceName: 'constructionSystemMainObjectTemplatePropertyDataService',
						httpCRUD: {
							route: route,
							endRead: 'list'
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									setIsUseCache(true);
									if (readData.MdlAdministrationPropertyKeys && readData.MdlAdministrationPropertyKeys.length) {
										basicsLookupdataLookupDescriptorService.addData('modelAdministrationPropertyKeys', readData.MdlAdministrationPropertyKeys);
									}
									if (service.updateDataFromTemplate) {
										service.updateDataFromTemplate = false;
									}
									else {
										return serviceContainer.data.handleReadSucceeded(readData.Main, data);
									}
								},
								initCreationData: function initCreationData(createData) {
									createData.mainItemId = parentService.getSelected().Id;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'CosInsObjectTemplateProperty',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						translation: {
							uid: 'constructionSystemMainObjectTemplatePropertyDataService',
							title: 'constructionsystem.master.2dObjectTemplatePropertyGridContainerTitle'
						},
						dataProcessor: []
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;

				function setIsUseCache(isUse) {
					if (isUse === null || isUse === true) {
						serviceContainer.data.usesCache = true;
					}
					else {
						serviceContainer.data.usesCache = false;
					}
				}

				service.updateDataFromTemplate = false;
				service.setListFromTemplate = function setListFromTemplate(data) {
					var currentList = service.getList();
					_.forEach(currentList, function(item) {
						platformDataServiceModificationTrackingExtension.markAsDeleted(service, item, serviceContainer.data);
					});
					if (data.length > 0) {
						service.updateDataFromTemplate = true;
						service.setList(data);
					}
				};
				service.removeCache = function() {
					serviceContainer.data.cache = {};
				};
				service.setIsUseCache = setIsUseCache;

				return service;
			}

			return {
				getService: getService
			};
		}
	]);
})(angular);