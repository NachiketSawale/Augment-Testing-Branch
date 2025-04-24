/**
 * Created by sandu on 02.12.2015.
 */
(function(angular){
	'use strict';
	var moduleName = 'usermanagement.group';

	angular.module(moduleName).factory('usermanagementGroupUserLookupService',usermanagementGroupUserLookupService);
	usermanagementGroupUserLookupService.$inject = ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator'];
	function usermanagementGroupUserLookupService(platformLookupDataServiceFactory,basicsLookupdataConfigGenerator){
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('usermanagementGroupUserLookupService',{
			valMember: 'Id',
			dispMember: 'Name',
			columns: [
				{
					id: 'Name',
					field: 'Name',
					name: 'User Name',
					formatter: 'description',
					width: 300,
					name$tr$: 'usermanagement.group.entityUserName'
				},
				{
					id: 'LogonName',
					field: 'LogonName',
					name: 'Logon Name',
					formatter: 'description',
					width: 300,
					name$tr$: 'usermanagement.group.entityUserLogonName'
				}
			]
		});

		var userLookupDataServiceConfig = {
			httpRead: { route: globals.webApiBaseUrl + 'usermanagement/main/user/', endPointRead:'list'}
		};
		return platformLookupDataServiceFactory.createInstance(userLookupDataServiceConfig).service;
	}
})(angular);