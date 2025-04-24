/**
 * Created by baf on 2017/08/22
 */
(function () {
	/* global globals */
	'use strict';
	var projectStockModule = angular.module('project.stock');

	/**
	 * @ngdoc service
	 * @name projectStockMaterialDataService
	 * @function
	 *
	 * @description
	 * projectStockDataService is a data service for managing stocks of a project.
	 */
	projectStockModule.factory('projectStockMaterialDataService', ['projectStockDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (projectStockDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var schedulingScheduleEditServiceOption = {
				flatLeafItem: {
					module: projectStockModule,
					serviceName: 'projectStockMaterialDataService',
					entityNameTranslationID: 'project.stock.entityStockMaterial',
					httpCreate: {route: globals.webApiBaseUrl + 'project/stock/material/'},
					httpRead: {route: globals.webApiBaseUrl + 'project/stock/material/', usePostForRead: true, endRead: 'instances',
						initReadData: function(readData) {
							var sel = projectStockDataService.getSelected();
							readData.PKey1 = sel.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ProjectStockDto',
						moduleSubModule: 'Project.Stock'
					})],
					entityRole: {leaf: {itemName: 'StockMaterials', parentService: projectStockDataService}},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedItem = projectStockDataService.getSelected();
								creationData.Id = selectedItem.Id;
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