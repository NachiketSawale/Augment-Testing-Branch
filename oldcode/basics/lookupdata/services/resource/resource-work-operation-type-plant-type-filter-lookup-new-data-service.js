/**
 * Created by shen on 9/4/2022
 */
(function (angular) {
	'use strict';
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name resourceWorkOperationTypePlantTypeFilterNewLookupDataService
	 * @function
	 *
	 * @description
	 * resourceWorkOperationTypePlantTypeFilterLookupDataService is the data service for all WorkOperationTypes filtered by plant types
	 */
	angular.module('basics.lookupdata').factory('resourceWorkOperationTypePlantTypeFilterNewLookupDataService', ['_', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'logisticDispatchingRecordDataService',

		function (_, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, logisticDispatchingRecordDataService) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceWorkOperationTypePlantTypeFilterNewLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'description',
						width: 180,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'cd866ee87ec14ba2bad444511cbc69a7'
			});

			var workOperationTypePlantFilterLookupDataServiceConfig = {
				httpRead: {
					usePostForRead: true,
					route: globals.webApiBaseUrl + 'resource/wot/workoperationtype/',
					endPointRead: 'listbyplantwithcommonwot'
				},
				filterParam: 'filters',
				prepareFilter: function() {
					let selectedDispRecords = logisticDispatchingRecordDataService.getSelectedEntities();
					let dispRecordIds = _.map(selectedDispRecords, 'Id');
					return dispRecordIds;
					/*
					const params = [];
					if (dispRecordIds.length > 0) {
						params.push('dispatchRecordIds=' + dispRecordIds.join(','));
					}
					if (params.length > 0) {
						return '?' + params.join('&');
					} else {
						return '';
					}
					 */
				}
			};

			return platformLookupDataServiceFactory.createInstance(workOperationTypePlantFilterLookupDataServiceConfig).service;
		}]);
})(angular);
