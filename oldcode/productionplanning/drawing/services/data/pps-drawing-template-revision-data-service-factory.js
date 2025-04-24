(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawing';
	var module = angular.module(moduleName);

	module.factory('ppsDrawingTmplRevisionDataServiceFactory', RevisionDataService);

	RevisionDataService.$inject = ['$injector', 'platformDataServiceFactory', 'platformRuntimeDataService'];

	function RevisionDataService($injector, platformDataServiceFactory, runtimeDataService) {

		var serviceFactory = {};
		var serviceCache = {};

		// var para = {
		// 	'serviceName': 'productionplanningDrawingProductDescriptionDataService',
		// };
		// var pdService = $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(para);
		// var serviceInfo = {
		// 	flatNodeItem: {
		// 		readonly: true,
		// 		module: module,
		// 		serviceName: 'ppsDrawingTmplRevisionDataService',
		// 		entityNameTranslationID: 'productionplanning.drawing.entityRevision',
		// 		httpCRUD: {
		// 			route: globals.webApiBaseUrl + 'productionplanning/drawing/tmplrevision/',
		// 			endRead: 'getbyproductdescription'
		// 		},
		// 		presenter: {
		// 			list: {
		// 				incorporateDataRead: function (readData, data) {
		// 					_.each(readData, function (data) {
		// 						runtimeDataService.readonly(data, true);
		// 					});
		// 					return container.data.handleReadSucceeded(readData, data);
		// 				}
		// 			}
		// 		},
		// 		entityRole: {
		// 			node: {
		// 				itemName: 'TemplateRevisions',
		// 				parentService: pdService,
		// 				parentFilter: 'productDescription'
		// 			}
		// 		},
		// 		actions: {
		// 			create: false,
		// 			delete: false
		// 		}
		// 	}
		// };

		serviceFactory.createNewComplete = function (options) {
			var parentService = null;

			if(options.parentFactory){
				parentService = $injector.get(options.parentFactory).getServiceByName(options.parentService);
			}
			else{
				parentService = $injector.get(options.parentService);
			}

			var serviceInfo = {
				flatNodeItem: {
					readonly: options.isReadonly,
					module: module,
					serviceName: options.serviceName,
					entityNameTranslationID: options.entityNameTranslationID,
					httpCRUD: {
						route: globals.webApiBaseUrl + options.httpSuffix,
						endRead: options.endRead
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								_.each(readData, function (data) {
									runtimeDataService.readonly(data, true);
								});
								return container.data.handleReadSucceeded(readData, data);
							}
						}
					},
					entityRole: {
						node: {
							itemName: options.itemName,
							parentService: parentService,
							parentFilter: options.parentFilter
						}
					},
					actions: {
						create: false,
						delete: false
					}
				}
			};


			var container = platformDataServiceFactory.createNewComplete(serviceInfo);

			return container.service;
		};

		serviceFactory.getService = function (options) {
			if (!serviceCache[options.serviceName]) {
				serviceCache[options.serviceName] = serviceFactory.createNewComplete(options);
			}
			return serviceCache[options.serviceName];
		};

		serviceFactory.getServiceByName = function (serviceName) {
			if (serviceCache[serviceName]) {
				return serviceCache[serviceName];
			}
			return null;
		};
		return serviceFactory;
		/* jshint -W003 */
		// var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		//
		// return container.service;
	}
})(angular);