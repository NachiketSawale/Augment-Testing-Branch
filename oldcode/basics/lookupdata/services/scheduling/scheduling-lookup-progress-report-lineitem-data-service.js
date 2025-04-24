/**
 * Created by balkanci on 16.06.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('schedulingProgressReportLineItemLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingProgressReportLineItemLookupService', {
				dispMember: 'Code',
				valMember: 'Id',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter:'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.descriptionInfo'
					}
				],
				uuid: '119c742d82834cb1b26420afe1e30204'
			});

			var schedulingProgressReportLineItemLookupServiceConfig = {
				dataAlreadyLoaded:true,
				disableDataCaching: true,
				lookupType:'schedulingProgressReportLineItemLookupService'
			};

			return platformLookupDataServiceFactory.createInstance(schedulingProgressReportLineItemLookupServiceConfig).service;
		}]);
})(angular);

