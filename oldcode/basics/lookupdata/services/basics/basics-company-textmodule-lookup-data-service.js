(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTextModuleLookupDataService
	 * @function
	 *
	 * @description
	 * LookupDataService is the data service providing data for textmodule lookups
	 */

	angular.module('basics.lookupdata').factory('basicsCompanyTextModuleLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCompanyTextModuleLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Description',
				columns: [

					{
						id: 'Description',
						field: 'DescriptionInfo.Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'LanguageFk',
						field: 'LanguageFk',
						name: 'Language',
						formatter: 'lookup',
						width: 100,
						name$tr$: 'basics.company.entityLanguageFk',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.lookup.language',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					}
					// {
					// 	id: 'TextModuleContext',
					// 	field: 'TextModuleContextFk',
					// 	name: 'Text Module Context',
					// 	formatter: 'lookup',
					// 	width: 100,
					// 	name$tr$: 'basics.company.entityTextModuleContextFk',
					// 	formatterOptions: {
					// 		lookupSimpleLookup: true,
					// 		lookupModuleQualifier: 'basics.company.textmodulecontext',
					// 		displayMember: 'Description',
					// 		valueMember: 'Id'
					// 	}
					// }
				],
				uuid: '49a67bb1571b41d7a424cd17bf19a8f0'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/textmodules/', endPointRead:'list' , usePostForRead: false }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
