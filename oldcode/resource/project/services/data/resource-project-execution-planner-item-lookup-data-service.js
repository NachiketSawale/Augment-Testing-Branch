/**
 * Created by shen on 31.01.2025
 */


(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceProjectExecPlannerItemLookupDataService
	 * @function
	 *
	 * @description
	 * resourceProjectExecPlannerItemLookupDataService is the data service for execution planner item
	 */
	angular.module('resource.project').factory('resourceProjectExecPlannerItemLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			let readData = {PKey1: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceProjectExecPlannerItemLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'RecordNo',
						field: 'RecordNo',
						name: 'RecordNo',
						formatter: 'integer',
						width: 100,
						name$tr$: 'logistic.action.entityRecordNo'
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
				uuid: '00340ef8dfe411ef9cd20242ac120002'
			});

			let resProjectExecPlannerItemLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/project/execplanneritems/',
					endPointRead: 'listbyparent',
					usePostForRead: true
				},
				filterParam: readData
			};

			return platformLookupDataServiceFactory.createInstance(resProjectExecPlannerItemLookupDataServiceConfig).service;
		}]);
})(angular);
