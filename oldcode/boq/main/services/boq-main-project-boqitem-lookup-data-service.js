/**
 * Created by xia on 4/11/2018.
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
	angular.module('boq.main').factory('boqMainProjectBoqItemLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'boqMainImageProcessor',
		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor) {

			var boqItemLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/project/', endPointRead: 'getboqsearchlist'},
				filterParam: 'projectId',
				prepareFilter: function prepareFilter(filter) {
					if (filter.boqHeaderId) {
						// filter ==> bid item!
						return '?projectId=' + filter.projectId + '&filterValue=' + '&boqHeaderId=' + filter.boqHeaderId;
					}
					return '?projectId=' + filter.projectId + '&filterValue=';
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor],
				tree: {parentProp: 'BoqItemFk', childProp: 'BoqItems'}
			};

			return platformLookupDataServiceFactory.createInstance(boqItemLookupDataServiceConfig).service;
		}]);
})();
