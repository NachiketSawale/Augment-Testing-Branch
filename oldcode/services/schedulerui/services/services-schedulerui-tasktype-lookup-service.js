/**
 * Created by aljami on 24.05.2022.
 */
(function (angular){
	'use strict';
	var moduleName = 'services.schedulerui';
	angular.module(moduleName).factory('servicesSchedulerUITaskTypeLookupService', servicesSchedulerUITaskTypeLookupService);
	servicesSchedulerUITaskTypeLookupService.$inject = ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator'];
	function servicesSchedulerUITaskTypeLookupService (platformLookupDataServiceFactory,basicsLookupdataConfigGenerator){
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('servicesSchedulerUITaskTypeLookupService',{
			valMember: 'Id',
			dispMember: 'Description',
			columns: [
				{
					id: 'Id',
					field: 'Description',
					name: 'Description',
					formatter: 'description',
					width: 300,
					name$tr$: 'services.schedulerui.taskTypeName'
				}
			]
		});
		var taskTypeLookupDataServiceConfig = {
			httpRead: { route: globals.webApiBaseUrl + 'services/schedulerui/job/', endPointRead:'tasktypes'}
		};
		return platformLookupDataServiceFactory.createInstance(taskTypeLookupDataServiceConfig).service;
	}
})(angular);