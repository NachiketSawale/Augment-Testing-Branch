/**
 * Created by Janas on 28.09.2015.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqRefItemLookupDataService
	 * @function
	 *
	 * @description
	 * boqRefItemLookupDataService is the data service used for Boq reference items.
	 */
	angular.module('boq.main').factory('boqRefItemLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'boqMainImageProcessor',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, boqMainImageProcessor) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqRefItemLookupDataService', {
				valMember: 'Id',
				dispMember: 'Reference',
				columns: [
					{
						id: 'Reference',
						field: 'Reference',
						name: 'Reference',
						formatter: 'description',
						name$tr$: 'cloud.common.entityReference'
					},
					{
						id: 'Brief',
						field: 'BriefInfo.Description',
						name: 'Brief',
						formatter: 'description',
						name$tr$: 'cloud.common.entityBrief'
					},
					{
						id: 'DesignDescriptionNo',
						field: 'DesignDescriptionNo',
						name: 'Design Description Number',
						formatter: 'description',
						name$tr$: 'boq.main.DesignDescriptionNo'
					}
				],
				uuid: 'cb54c0e1f38c4cc495f8d01e643d7d97'
			});

			var boqItemLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'refitemlookup'},
				filterParam: 'headerId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor],
				tree: {parentProp: 'BoqItemFk', childProp: 'BoqItems'}
			};

			var container = platformLookupDataServiceFactory.createInstance(boqItemLookupDataServiceConfig);

			// The following function resets the cache of all elements having the given boqHeaderFk
			container.service.resetCacheAt = function resetCacheAt(boqHeaderFk) {
				var cache = container.data.dataCache;
				var boqHeaderFkString = boqHeaderFk.toString();

				if (!cache) {
					return;
				}

				cache.each(function (item, name) {
					// Check if the given entry includes the given boqHeaderFk.
					if (name.indexOf(boqHeaderFkString) !== -1) {
						cache.remove(name); // Delete this item for the cache is not up to date anymore.
					}
				});
			};

			return container.service;
		}]);
})();
