/**
 * Created by Benny on 26.08.2016.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqLeafItemLookupDataService
	 * @function
	 *
	 * @description
	 * boqLeafItemLookupDataService is the data service for Boq item related functionality.
	 */
	angular.module('boq.main').factory('boqLeafItemLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'boqMainImageProcessor',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor) {

			var boqLeafItemLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'itemtree'},
				filterParam: 'headerId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor],
				tree: {parentProp: 'BoqItemFk', childProp: 'BoqItems'}
			};

			return platformLookupDataServiceFactory.createInstance(boqLeafItemLookupDataServiceConfig).service;
		}]);
})();
