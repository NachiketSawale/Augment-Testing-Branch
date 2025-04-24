/**
 * Created by zwz on 4/28/2020.
 */
(function () {
	'use strict';
	/*global globals, angular*/
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsCommonLogDataServiceFactory', srv);
	srv.$inject = ['_', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'ppsCommonLoggingHelper'];
	function srv(_, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, ppsCommonLoggingHelper) {
		var serviceFactory = {};
		var serviceCache = {};

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'PpsLogReportVDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});

		serviceFactory.createNewComplete = function (options) {
			var service;
			var parentService = options.parentServiceName ? $injector.get(options.parentServiceName) : undefined;
			var translationService = options.translationServiceName ? $injector.get(options.translationServiceName) : undefined;
			var serviceInfo = {
				flatRootItem: {
					module: angModule,
					serviceName: options.serviceName,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/common/logreport/',
						endRead: options.endRead,
						usePostForRead: _.isNil(options.usePostForRead) ? false : options.usePostForRead
					},
					entityRole: {
						leaf: {
							itemName: options.itemName,
							parentService: parentService,
							parentFilter: options.parentFilter
						}
					},
					dataProcessor: [dateProcessor],
					actions: {},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var result = data.handleReadSucceeded(readData, data);
								ppsCommonLoggingHelper.translateLogColumnName(service.getList(), translationService, service);
								return result;

							}
						}
					},
					entitySelection: { supportsMultiSelection: true }
				}
			};

			service = platformDataServiceFactory.createNewComplete(serviceInfo).service;
			return service;
		};

		serviceFactory.getOrCreateService = function (options) {
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


	}
})();