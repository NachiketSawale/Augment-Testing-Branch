(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsBankMainService
	 * @function
	 *
	 * @description
	 * basicsBankMainService is the data service for all Bank related functionality.
	 */
	var moduleName= 'basics.bank';
	var bankModule = angular.module(moduleName);
	bankModule.factory('basicsBankMainService', ['platformDataServiceFactory',

		function (platformDataServiceFactory) {
			var factoryOptions = {
				flatRootItem: {
					module: bankModule,
					serviceName: 'basicsBankMainService',
					entityNameTranslationID: 'basics.bank.entityBank',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/bank/', endRead: 'listfiltered', usePostForRead: true
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						root: {itemName: 'Bank', moduleName: 'cloud.desktop.moduleDisplayNameBank'}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			return  serviceContainer.service;

		}]);
})(angular);
