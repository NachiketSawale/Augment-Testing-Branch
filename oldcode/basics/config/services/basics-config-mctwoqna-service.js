/**
 * Created by sandu on 14.01.2019.
 */
(function () {

	'use strict';

	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsConfigMcTwoQnAService
     * @function
     *
     * @description
     * data service for all McTwoQnA related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	configModule.factory('basicsConfigMcTwoQnAService', basicsConfigMcTwoQnAService);

	basicsConfigMcTwoQnAService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory','platformModalService', '$http'];

	function basicsConfigMcTwoQnAService(basicsConfigMainService, platformDataServiceFactory, platformModalService, $http) {

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'basicsConfigMcTwoQnAService',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/mctwoqna/'},
				actions: {delete: true, create: 'flat'},
				entityRole: {leaf: {itemName: 'McTwoQnA', parentService: basicsConfigMainService}},
				translation: {
					uid: 'basicsConfigMcTwoQnAService',
					title: 'basics.config.McTwoQnA',
					columns: [{header: 'basics.config.entityQuestion', field: 'Question'},
						{header: 'basics.config.entityAnswer', field: 'Answer'}],
					dtoScheme: { typeName: 'McTwoQnADto', moduleSubModule: 'Basics.Config' }
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = basicsConfigMainService.getSelected().Id;
						}
					}
				}

			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		return serviceContainer.service;
	}
})(angular);
