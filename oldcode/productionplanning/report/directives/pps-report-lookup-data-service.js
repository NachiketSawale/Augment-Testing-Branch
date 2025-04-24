/**
 * Created by anl on 5/21/2018.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';
	angular.module(moduleName).factory('productionplanningReportReportLookup',
		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

			function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('productionplanningReportReportLookup', {
					valMember: 'Id',
					displayMember: 'Code',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.code'
						},
						{
							id: 'Description',
							field: 'Description',
							name: 'Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'ReportStatus',
							field: 'RepStatusFk',
							name: 'RepStatusFk',
							formatter: 'lookup',
							formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mountingreportstatus', null, {
								showIcon: true
							}).grid.formatterOptions,
							name$tr$: 'cloud.common.entityState'
						}
					],
					uuid: 'e2f977a0f4f7475e8b5104be39854948'
				});

				var reportLookupDataServiceConfig = {
					httpRead: {
						route: globals.webApiBaseUrl + 'productionplanning/report/report/',
						endPointRead: 'getList'
					}
				};

				return platformLookupDataServiceFactory.createInstance(reportLookupDataServiceConfig).service;
			}]);
})(angular);
