(function () {
	/* global globals */
	'use strict';
	var basicsUnitModule = angular.module('basics.unit');
	/**
	 * @ngdoc service
	 * @name basicsUnitSynonymService
	 * @function
	 *
	 * @description
	 * basicsUnitSynonymService is the data service for all unit related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsUnitModule.factory('basicsUnitSynonymService', ['basicsUnitMainService', 'platformDataServiceFactory',

		function (basicsUnitMainService, platformDataServiceFactory) {

			var basicsUnitSynonymServiceOption = {
				flatLeafItem: {
					module: basicsUnitModule,
					serviceName: 'basicsUnitSynonymService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/unit/synonym/' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/unit/synonym/' },
					actions: { delete: true, create: 'flat' },
					entityRole: {
						leaf: { itemName: 'Synonym', parentService: basicsUnitMainService  }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsUnitSynonymServiceOption);

			return serviceContainer.service;
		}]);
})(angular);
