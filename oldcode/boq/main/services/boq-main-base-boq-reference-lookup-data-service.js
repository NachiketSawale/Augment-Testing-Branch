/**
 * Created by bh on 30.11.2015.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqMainBaseBoqReferenceLookupDataService
	 * @function
	 *
	 * @description
	 * boqMainBaseBoqReferenceLookupDataService is the data service used for looking up the available reference numbers of the corresponding base boq,
	 * filtered by the parent of the currently selected item, i.e. only those base boq reference numbers are displayed that belong to the sibling base boq items
	 * of the selected item and are not already in use in the version boq.
	 */
	angular.module('boq.main').factory('boqMainBaseBoqReferenceLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'boqMainImageProcessor',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, boqMainImageProcessor) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainBaseBoqReferenceLookupDataService', {
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
					}
				],
				uuid: '06d388b28b674ec2b7b2187db703500d'
			});

			var boqItemLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'baseboqLookup'},
				filterParam: 'baseBoqHeaderId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor]
			};

			return platformLookupDataServiceFactory.createInstance(boqItemLookupDataServiceConfig).service;
		}]);
})();
