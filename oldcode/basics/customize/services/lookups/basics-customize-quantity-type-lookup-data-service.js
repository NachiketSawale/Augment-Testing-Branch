/**
 * Created by Joshi on 14.03.2017.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.customize';

	/* global _, globals */

	/**
	 * @ngdoc service
	 * @name basicsCustomizeQuantityTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeQuantityTypeLookupDataService is the data service for all basic Quantity Type related functionality.
	 */
	angular.module(moduleName).factory('basicsCustomizeQuantityTypeLookupDataService', ['$http','$q', 'platformLookupDataServiceFactory',

		function ($http,$q, platformLookupDataServiceFactory) {

			let quantityTypeLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/customize/quantitytype/', endPointRead: 'list'}
			};

			let container = platformLookupDataServiceFactory.createInstance(quantityTypeLookupDataServiceConfig);
			let service = container.service;
			let lookupData = {
				customizeQuantityTypes: []
			};

			service.getLookupData = function getLookupData(options){
				return service.getList(options).then(function(data) {
					let filteredList = _.filter(data, function(item){
						return item.Isusercontrolled;
					});

					return filteredList;
				});
			};

			service.getList = function getList(options){
				return $http.post(globals.webApiBaseUrl + 'basics/customize/quantitytype/list').then(function(response) {
					return container.data.handleSuccessfulLoad(response.data, container.data, options.lookupType);
				});
			};

			service.getListForEstimate = function getListForEstimate(options){
				if (lookupData.customizeQuantityTypes.length > 0) {
					return $q.when(lookupData.customizeQuantityTypes);
				} else {
					return service.getList(options).then(function (response) {
						lookupData.customizeQuantityTypes = response.data;
						return lookupData.customizeQuantityTypes;
					});
				}
			};

			service.setList = function setList(customizeQuantityTypes) {
				lookupData.customizeQuantityTypes = customizeQuantityTypes;
			};

			return service;
		}]);
})(angular);
