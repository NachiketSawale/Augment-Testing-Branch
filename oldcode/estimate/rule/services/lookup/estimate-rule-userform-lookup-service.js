/**
 * Created by wul on 3/1/2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleUserformLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateRuleUserformLookupService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'User Form',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityUserForm',
					}
				],
				uuid: '880e5970dd164454939495d9fa75658B'
			});

			let config = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/userform/', endPointRead: 'list' },
				filterParam: 'rubricId'
			};

			let container = platformLookupDataServiceFactory.createInstance(config);

			return container.service;
		}]);
})(angular);
