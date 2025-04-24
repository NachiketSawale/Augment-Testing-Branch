/**
 * Created by leo on 17.08.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceRourceLookupDataService
	 * @function
	 *
	 * @description
	 * resourceRourceLookupDataService is the data service for reqsource look ups
	 */
	angular.module('resource.reservation').factory('resourceResourceLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceResourceLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'DescriptionInfo',	formatter: 'translation',
						name: 'DescriptionInfo', name$tr$: 'cloud.common.entityDescription'},
					{
						id: 'kindfk', field: 'KindFk', name: 'KindFk', name$tr$: 'resource.master.KindFk',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcekind').grid.formatterOptions
					},
					{
						id: 'groupfk', field: 'GroupFk', name: 'GroupFk', name$tr$: 'resource.master.GroupFk',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcegroup').grid.formatterOptions
					}
				],
				uuid: '631d9bf0fea64074a3315730a89790b1'
			});

			var resourceLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'resource/master/resource/', endPointRead: 'lookuplistbycontext'}
			};

			return platformLookupDataServiceFactory.createInstance(resourceLookupDataServiceConfig).service;
		}]);
})(angular);
