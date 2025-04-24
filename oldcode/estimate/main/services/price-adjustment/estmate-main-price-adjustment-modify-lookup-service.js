
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
	angular.module('boq.main').factory('estimateMainPriceAdjustmentModifyLookupService',
		['$q', '$injector', 'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'boqMainImageProcessor',
			function ($q, $injector, platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor) {

				var config = {
					httpRead: {route: globals.webApiBaseUrl + 'boq/project/', endPointRead: 'getboqsearchlist'},
					filterParam: 'projectId',
					prepareFilter: function prepareFilter(filter) {
						return filter;
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor],
					tree: {parentProp: 'BoqItemFk', childProp: 'BoqItems'}
				};
				let container = platformLookupDataServiceFactory.createInstance(config);
				let service = container.service;
				container.data.readData = function (filter) {
					let boqTree = $injector.get('estimateMainPriceAdjustmentDataService').getBoqTree();
					if (boqTree && angular.isArray(boqTree) && filter.boqHeaderId) {
						return $q.when({data: boqTree.filter(e => e.BoqHeaderFk === filter.boqHeaderId)});
					} else if (filter.projectId !== null) {
						return $q.when({data: boqTree});
					}
					return $q.when({data: []});
				};
				return service;
			}]);
})();
