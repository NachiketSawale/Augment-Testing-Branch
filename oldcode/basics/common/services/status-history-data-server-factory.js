/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'basics.common';
	let module = angular.module(moduleName);
	module.factory('basicsCommonStatusHistoryDataServiceFactory',
		['_',
			'$injector',
			'$http',
			'platformDataServiceFactory',
			function (
				_,
				$injector,
				$http,
				platformDataServiceFactory) {
				var serviceFactroy = {};
				var serviceCache = {};
				serviceFactroy.createNewComplete = function createNewComplete(mainService, statusName) {
					var serviceContainer = null;
					var basicsUnitServiceOption = {
						flatRootItem: {
							module: module,
							serviceName: 'statusHistoryDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'basics/common/status/',
								usePostForRead: false,
								endRead: 'listhistory',
								initReadData: function initReadData(readData) {
									readData.filter = '?statusName=' + statusName + '&objectId=' + mainService.getSelected().Id;
								}
							}, entityRole: {
								leaf: {itemName: 'StatusHistory', parentService: mainService}

							},
							actions: {
								delete: false,
								create: false
							},
							presenter: {
								list: {
									incorporateDataRead: function (result, data) {
										return serviceContainer.data.handleReadSucceeded(result, data);
									}
								}
							},
							sidebarSearch: {
								options: {
									moduleName: module,
									enhancedSearchEnabled: false,
									pattern: '',
									pageSize: 100,
									useCurrentClient: null,
									includeNonActiveItems: false,
									showOptions: false,
									showProjectContext: null,
									pinningOptions: null,
									withExecutionHints: false
								}
							}
						}
					};
					serviceContainer = platformDataServiceFactory.createNewComplete(basicsUnitServiceOption);
					var service = serviceContainer.service;
					service.containerData = serviceContainer.data;
					var data = serviceContainer.data;

					service.preloadData = function () {
						service.load();
						data.UnitsAreLoaded = true;
					};
					return service;
				};
				serviceFactroy.getService = function getService(mainService, statusName) {
					serviceCache[statusName] = serviceFactroy.createNewComplete(mainService, statusName);
					return serviceCache[statusName];
				};

				return serviceFactroy;
			}]);
})(angular);
