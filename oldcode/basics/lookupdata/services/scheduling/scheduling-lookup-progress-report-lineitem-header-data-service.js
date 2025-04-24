/**
 * Created by balkanci on 17.06.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('schedulingProgressReportLineHeaderItemLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingProgressReportLineHeaderItemLookupService', {
				dispMember: 'Code',
				valMember: 'Id',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.descriptionInfo'
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter:'Code',
						name$tr$: 'cloud.common.entityCode'
					}
				],
				uuid: '7ab567d042104e7292fd5453175d26a8'
			});

			var schedulingProgressReportLineHeaderItemConfig = {
				dataAlreadyLoaded:true,
				disableDataCaching: true,
				lookupType:'schedulingProgressReportLineHeaderItemLookupService'
			};

			return platformLookupDataServiceFactory.createInstance(schedulingProgressReportLineHeaderItemConfig).service;
		}]);
})(angular);

