/**
 * Created by shen on 12/16/2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'resource.reservation';

	/**
	 * @ngdoc service
	 * @name resourceResourceFilterBySkillLookupDataService
	 * @function
	 *
	 * @description
	 * resourceReourceFilterBySkillLookupDataService is the data service for reqsource look ups
	 */
	angular.module(moduleName).factory('resourceResourceFilterBySkillLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceResourceFilterBySkillLookupDataService', {
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
				uuid: 'f56cb22cb39941f1a194e3e2719dc408'
			});

			let filteredResourceLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'resource/master/resource/', endPointRead: 'listbyrequisitionskill'},
				filterParam: 'resource-filterbyskill',
				prepareFilter: function (item) {
					return '?projectId=' + item.ProjectFk;
				}
			};

			return platformLookupDataServiceFactory.createInstance(filteredResourceLookupDataServiceConfig).service;
		}]);
})(angular);
