/**
 * Created by benny on 19.08.2016.
 */
(function () {
	'use strict';
	/* global globals */

	var modulename = 'boq.wic';
	angular.module(modulename).factory('estimateAssembliesWicGroupLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',
		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var estimateAssembliesWicGroupLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/wic/group/', endPointRead: 'tree'},
				dataProcessor: [new ServiceDataProcessArraysExtension(['WicGroups'])],
				tree: {parentProp: 'WicGroupFk', childProp: 'WicGroups'}
			};

			return platformLookupDataServiceFactory.createInstance(estimateAssembliesWicGroupLookupDataServiceConfig).service;
		}]);
})();