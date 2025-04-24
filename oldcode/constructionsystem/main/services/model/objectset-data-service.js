(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectSetService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionSystem main objectset list/detail controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainObjectSetService', [
		'$q', 'platformDataServiceFactory', 'constructionSystemMainInstanceService', 'platformDataServiceProcessDatesBySchemeExtension',
		function ($q, platformDataServiceFactory, constructionSystemMainInstanceService, platformDataServiceProcessDatesBySchemeExtension) {

			var serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainObjectSetService',
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/objectset/',
						endRead: 'list',
						usePostForRead: false,
						initReadData: function initReadData(readData) {
							readData.filter = '?mainItemId=' + constructionSystemMainInstanceService.getCurrentSelectedProjectId();
						}
					},
					dataProcessor: [
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ObjectSetDto',
							moduleSubModule: 'Model.Main'
						})
					],
					entityRole: {
						root: {
							itemName: 'ObjectSet',
							rootForModule: moduleName,
							lastObjectModuleName: moduleName
						}
					},
					presenter: {list: {}},
					actions: {delete: false, create: false},
					transaction:{
						uid: 'constructionSystemMainObjectSetService',
						title: 'model.main.entityContainer',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: {
							typeName: 'ObjectSetDto',
							moduleSubModule: 'Model.Main'
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			// no update for root item serivce
			container.data.doUpdate = null;

			// disable display information of the selected root item to the header bar.
			container.service.setShowHeaderAfterSelectionChanged(null);
			container.service.selectedItems = [];

			return container.service;
		}
	]);
})(angular);
