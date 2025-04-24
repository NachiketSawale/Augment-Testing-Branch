(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticJobLookupByProjectDocumentService
	 * @function
	 * @description
	 *
	 * data service for logistic job lookup filter by project.
	 */
	angular.module('basics.lookupdata').factory('logisticJobLookupByProjectDocumentService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

			var readData = {projectFk: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticJobLookupByProjectDocumentService', {
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
				uuid: '0df065ae301742f6977707834777e560'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/job/', endPointRead: 'lookuplistbyfilter'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.projectFk = item;
					return readData;
				},
				disableDataCaching: true
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
