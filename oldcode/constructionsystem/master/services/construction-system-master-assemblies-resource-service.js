
(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */


	var constructionSystemMasterModule = angular.module('constructionsystem.master');
	/**
     * @ngdoc service
     * @name constructionSystemMasterAssembliesResourceService
     * @function
     *
     * @description
     * basicsIndexDetailService is the data service for all index detail related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	constructionSystemMasterModule.factory('constructionSystemMasterAssembliesResourceService', [
		'constructionSystemMasterAssemblyService', 'platformDataServiceFactory', 'moment',
		function (constructionSystemMasterAssemblyService, platformDataServiceFactory, moment) {

			var constructionSystemMasterServiceOption = {
				flatLeafItem: {
					module: constructionSystemMasterModule,
					serviceName: 'constructionSystemMasterAssembliesResourceService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/indexdetail/'
					},
					actions: { delete: true, create: 'flat' },
					entityRole: {
						leaf: { itemName: 'AssemblyResource', parentService: constructionSystemMasterAssemblyService  }
					},
					presenter: {
						list: {

							handleCreateSucceeded: function (item) {
								item.Date = moment.utc(item.Date);
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(constructionSystemMasterServiceOption);
			var service = serviceContainer.service;
			// var data = serviceContainer.data;

			// data.newEntityValidator = basicsIndexDetailValidationProcessService;

			return service;
		}]);
})(angular);
