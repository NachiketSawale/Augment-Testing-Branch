/**
 * Created by xia on 5/8/2019.
 */
(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var module = angular.module('constructionsystem.master');
	/**
     * @ngdoc service
     * @name constructionSystemMasterAssemblyResourceDataService
     * @function
     *
     * @description
     * basicsIndexDetailService is the data service for all index detail related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	module.factory('constructionSystemMasterAssemblyResourceDataService', [
		'constructionSystemMasterAssemblyService', 'platformDataServiceFactory', 'moment','constructionSystemMasterHeaderService',
		function (constructionSystemMasterAssemblyService, platformDataServiceFactory, moment,constructionSystemMasterHeaderService) {

			var constructionSystemMasterAssemblyResourceServiceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'constructionSystemMasterAssemblyResourceDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'constructionsystem/master/assembly/'
					},
					actions: { delete: true, create: 'flat' },
					entityRole: {
						leaf: { itemName: 'CosAssembly',
							parentService: constructionSystemMasterHeaderService  }
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead,
							handleCreateSucceeded: function (item) {
								item.Date = moment.utc(item.Date);
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(constructionSystemMasterAssemblyResourceServiceOption);
			var service = serviceContainer.service;
			// var data = serviceContainer.data;

			// data.newEntityValidator = basicsIndexDetailValidationProcessService;
			function incorporateDataRead(result, data) {
				serviceContainer.data.handleReadSucceeded(result.dtos, data);
			}
			return service;
		}]);
})(angular);
