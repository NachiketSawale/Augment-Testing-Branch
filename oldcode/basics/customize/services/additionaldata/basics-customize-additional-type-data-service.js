/**
 * Created by Frank Baedeker on 28.04.2017.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeInstanceDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeAdditionalTypeDataService is the data service for all entity type descriptions
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsCustomizeModule.factory('basicsCustomizeAdditionalTypeDataService', ['platformDataServiceFactory', 'basicsCustomizeTypeDataService',

		function (platformDataServiceFactory, basicsCustomizeTypeDataService) {

			// The instance of the main service - to be filled with functionality below
			var basicsCustomizeAdditionalInstanceDataServiceOption = {
				module: basicsCustomizeModule,
				serviceName: 'basicsCustomizeInstanceDataService',
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/additionaldata', endRead: 'list' },
				modification: { multi: {} },
				entitySelection: {},
				presenter: { list: {} },
				entityRole: { leaf: { itemName: 'AdditionalTypeData', parentService: basicsCustomizeTypeDataService	} }
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCustomizeAdditionalInstanceDataServiceOption);

			return serviceContainer.service;
		}]);
})();
