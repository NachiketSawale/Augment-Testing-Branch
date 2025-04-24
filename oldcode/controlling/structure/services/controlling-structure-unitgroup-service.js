/**
 * Created by janas on 12.12.2014.
 */


(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureUnitgroupService
	 * @function
	 *
	 * @description
	 * controllingStructureUnitgroupService is the data service for all structure related functionality.
	 */
	controllingStructureModule.factory('controllingStructureUnitgroupService', ['globals', 'platformDataServiceFactory', 'controllingStructureMainService',
		function (globals, platformDataServiceFactory, controllingStructureMainService) {

			// controlling structure group service
			var serviceContainer = platformDataServiceFactory.createNewComplete({
				flatLeafItem: {
					module: controllingStructureModule,
					serviceName: 'controllingStructureUnitgroupService',
					httpCreate: {route: globals.webApiBaseUrl + 'controlling/structure/unitgroup/'},
					httpRead: {route: globals.webApiBaseUrl + 'controlling/structure/unitgroup/'},
					presenter: {list: {}},
					entityRole: {
						leaf: {itemName: 'ControllingUnitGroups', parentService: controllingStructureMainService}
					}
				}
			});

			return serviceContainer.service;
		}]);
})();
