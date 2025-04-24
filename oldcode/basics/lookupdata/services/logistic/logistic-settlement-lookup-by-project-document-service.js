(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticSettlementLookupByProjectDocumentService
	 * @function
	 * @description
	 *
	 * data service for logistic job lookup filter by project.
	 */
	angular.module('basics.lookupdata').factory('logisticSettlementLookupByProjectDocumentService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

			var readData = {ProjectFk: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticSettlementLookupByProjectDocumentService', {
				valMember: 'Id',
				dispMember: 'SettlementNo',
				columns: [
					{
						id: 'SettlementNo',
						field: 'SettlementNo',
						name: 'SettlementNo',
						formatter: 'settlementNo',
						width: 100,
						name$tr$: 'cloud.common.SettlementNo'
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
				uuid: '1af1722f228446ccae205221be99c459'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/settlement/', endPointRead: 'lookuplist'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					if(item !== undefined){
						readData.ProjectFk = item;
					}

					if(!readData.ProjectFk){
						readData.ProjectFk = 0;
					}

					return readData;
				},
				disableDataCaching: true
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
