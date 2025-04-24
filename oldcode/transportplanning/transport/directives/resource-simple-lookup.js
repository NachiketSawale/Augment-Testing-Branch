/**
 * Created by anl on 10/26/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('resourceSimpleLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceSimpleLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'DescriptionInfo.Translated', name: 'DescriptionInfo', name$tr$: 'cloud.common.entityDescription'},
					{	id: 'typefk', field: 'TypeFk', name: 'TypeFk', name$tr$: 'basics.customize.resourcetype',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceTypeLookupDataService'}).grid.formatterOptions
					},
					{
						id: 'kindfk', field: 'KindFk', name: 'KindFk', name$tr$: 'basics.customize.resourcekind',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcekind').grid.formatterOptions
					},
					{
						id: 'groupfk', field: 'GroupFk', name: 'GroupFk', name$tr$: 'basics.customize.resourcegroup',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcegroup').grid.formatterOptions
					},{
						id: 'costcodefk', field: 'CostCodeFk', name: 'CostCodeFk', name$tr$: 'resource.master.CostCodeFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CostCode',
							displayMember: 'DescriptionInfo.Translated',
							width: 140,
							version: 3,
						}
					}
				],
				uuid: '37322cceafbd4788a695b552de23fbf4'
			});

			var resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/master/resource/',
					endPointRead: 'lookuplistbycontext'
				}
			};

			var serviceContainer = platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);