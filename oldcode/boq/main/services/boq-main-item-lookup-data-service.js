/**
 * Created by Joshi on 26.02.2015.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqItemLookupDataService
	 * @function
	 *
	 * @description
	 * boqItemLookupDataService is the data service for Boq item related functionality.
	 */
	angular.module('boq.main').factory('boqItemLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'boqMainImageProcessor',
		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor) {

			var boqItemLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'tree'},
				filterParam: 'headerId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor],
				tree: {parentProp: 'BoqItemFk', childProp: 'BoqItems'}
			};

			return platformLookupDataServiceFactory.createInstance(boqItemLookupDataServiceConfig).service;
		}]);
})();
