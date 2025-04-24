/**
 * Created by Frank Baedeker on 25.08.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.main';
	var mainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelMainObject3DDataService
	 * @function
	 *
	 * @description
	 * modelMainObject3DDataService is the data service for the geometry
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	mainModule.service('modelMainObject3DDataService', ModelMainObject3DDataService);

	ModelMainObject3DDataService.$inject = ['modelMainObjectDataService', 'platformDataServiceFactory'];

	function ModelMainObject3DDataService(modelMainObjectDataService, platformDataServiceFactory) {
		var self = this;

		var modelObject3DServiceOption = {
			flatLeafItem: {
				module: mainModule,
				serviceName: 'modelMainObject3DDataService',
				entityNameTranslationID: 'model.main.entityObject3D',
				httpCreate: {route: globals.webApiBaseUrl + 'model/main/object3d/'},
				httpRead: {route: globals.webApiBaseUrl + 'model/main/object3d/'},
				entityRole: {
					leaf: {
						itemName: 'Model3DObjects',
						parentService: modelMainObjectDataService,
						parentFilter: 'mainItemID'
					}
				}
			}
		};

		platformDataServiceFactory.createService(modelObject3DServiceOption, self);
	}
})(angular);
