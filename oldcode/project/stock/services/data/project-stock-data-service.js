/**
 * Created by baf on 2017/08/22
 */
(function () {
	/* global globals */
	'use strict';
	var projectStockModule = angular.module('project.stock');

	/**
	 * @ngdoc service
	 * @name projectStockDataService
	 * @function
	 *
	 * @description
	 * projectStockDataService is a data service for managing stocks of a project.
	 */
	projectStockModule.factory('projectStockDataService', ['projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupFilterService',

		function (projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsLookupdataLookupFilterService) {

			var schedulingScheduleEditServiceOption = {
				flatNodeItem: {
					module: projectStockModule,
					serviceName: 'projectStockDataService',
					entityNameTranslationID: 'project.stock.entityStock',
					httpCreate: {route: globals.webApiBaseUrl + 'project/stock/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'project/stock/', usePostForRead: true, endRead: 'instances',
						initReadData: function (readData) {
							var sel = projectMainService.getSelected();
							readData.PKey1 = sel.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ProjectStockDto',
						moduleSubModule: 'Project.Stock'
					})],
					entityRole: {node: {itemName: 'ProjectStocks', parentService: projectMainService}},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedItem = projectMainService.getSelected();
								creationData.Id = selectedItem.Id;
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingScheduleEditServiceOption);

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'live-filter',
					serverSide: false,
					fn: function (entity) {
						return entity.isLive || entity.IsLive;
					}
				}]);

			return serviceContainer.service;
		}
	]);
})();