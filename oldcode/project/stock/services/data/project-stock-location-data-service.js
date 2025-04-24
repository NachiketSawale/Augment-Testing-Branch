/**
 * Created by baf on 2017/08/22
 */
(function () {
	/* global globals */
	'use strict';
	var projectStockModule = angular.module('project.stock');

	/**
	 * @ngdoc service
	 * @name projectStockLocationDataService
	 * @function
	 *
	 * @description
	 * projectStockDataService is a data service for managing stocks of a project.
	 */
	projectStockModule.factory('projectStockLocationDataService', ['_', 'projectStockDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'ServiceDataProcessArraysExtension',

		function (_, projectStockDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, ServiceDataProcessArraysExtension) {

			var schedulingScheduleEditServiceOption = {
				hierarchicalLeafItem: {
					module: projectStockModule,
					serviceName: 'projectStockLocationDataService',
					entityNameTranslationID: 'project.stock.entityStockLocation',
					httpCreate: {route: globals.webApiBaseUrl + 'project/stock/location/'},
					httpRead: {route: globals.webApiBaseUrl + 'project/stock/location/', usePostForRead: true, endRead: 'instances',
						initReadData: function(readData) {
							var sel = projectStockDataService.getSelected();
							readData.PKey1 = sel.Id;
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['SubLocations']),
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ProjectStockDto',
							moduleSubModule: 'Project.Stock'
						})],
					entityRole: {leaf: {itemName: 'StockLocations', parentService: projectStockDataService}},
					presenter: {
						tree: { parentProp: 'StockLocationFk',  childProp: 'SubLocations',
							initCreationData: function initCreationData(creationData) {
								var parentId = creationData.parentId;
								creationData.Id = creationData.MainItemId;
								delete creationData.MainItemId;
								delete creationData.parentId;
								if(!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
									creationData.PKey1 = parentId;
								}
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingScheduleEditServiceOption);

			return serviceContainer.service;
		}
	]);
})();