/**
 * Created by leo on 07.11.2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingJobLookupByProjectDataService
	 * @function
	 * @description
	 *
	 * data service for timekeeping job lookup filter by project.
	 */
	angular.module('basics.lookupdata').factory('timekeepingJobLookupByProjectDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$injector',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $injector) {

			var readData = {projectFk: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingJobLookupByProjectDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'cfdec227e4d14de5885f01d34de03afd'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/job/', endPointRead: 'lookuplistbyfilter'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.projectFk = item;
					return readData;
				},
				disableDataCaching: false
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
