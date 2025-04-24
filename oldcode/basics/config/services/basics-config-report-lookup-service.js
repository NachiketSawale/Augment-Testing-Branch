/**
 * Created by sandu on 17.02.2016.
 */
(function (angular){
	'use strict';
	var moduleName = 'basics.config';
	angular.module(moduleName).factory('basicsConfigReportLookupService',basicsConfigReportLookupService);
	basicsConfigReportLookupService.$inject = ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator'];
	function basicsConfigReportLookupService(platformLookupDataServiceFactory,basicsLookupdataConfigGenerator){
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigReportLookupService',{
			valMember: 'Id',
			dispMember: 'ReportName',
			columns: [
				{
					id: 'ReportName',
					field: 'ReportName',
					name: 'Report Name',
					formatter: 'description',
					width: 300,
					name$tr$: 'basics.config.entityReportName'
				},
				{
					id: 'FileName',
					field: 'FileName',
					name: 'File Name',
					formatter: 'description',
					width: 300,
					name$tr$: 'basics.config.entityFileName'
				}
			],
			uuid: '441f33da58f74fc2970e0519906ff8ae'
		});
		var reportLookupDataServiceConfig = {
			httpRead: { route: globals.webApiBaseUrl + 'basics/reporting/report/', endPointRead:'list'}
		};
		return platformLookupDataServiceFactory.createInstance(reportLookupDataServiceConfig).service;
	}
})(angular);