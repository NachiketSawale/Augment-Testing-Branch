/**
 * Created by lcn on 1/18/2018.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.txinterface';
	var txinterfaceModule = angular.module(moduleName);
	txinterfaceModule.factory('procurementTxinterfaceService', ['platformDataServiceFactory',

		function (platformDataServiceFactory) {
			var factoryOptions = {
				flatRootItem: {
					module: txinterfaceModule,
					serviceName: 'procurementTxinterfaceService',
					entityRole: {
						root: {itemName: 'Txinterface', moduleName: 'cloud.desktop.moduleDisplayNameTxActivityStream'}
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

			return serviceContainer.service;

		}]);
})(angular);
